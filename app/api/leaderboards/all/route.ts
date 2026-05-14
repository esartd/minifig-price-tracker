import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason, getCurrentSeasonDateRange, formatSeasonDateRange } from '@/lib/donations';
import { generateDefaultDisplayName } from '@/lib/leaderboards';

/**
 * GET /api/leaderboards/all?period=quarterly|alltime
 * Returns ALL leaderboards in a single query to reduce database connections
 * - Top 5 minifig collectors
 * - Top 5 set collectors
 * - Top 5 donors
 *
 * This endpoint combines 3 separate queries into 1 to prevent connection exhaustion
 */

// Cache results for 5 minutes to reduce database load
let cachedData: any = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'quarterly';

    // Check cache
    const now = Date.now();
    const cacheKey = `leaderboards-${period}`;
    if (cachedData && cachedData.key === cacheKey && (now - cacheTime) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cachedData.data,
        cached: true,
      });
    }

    const season = getCurrentSeason();
    const { start, end } = getCurrentSeasonDateRange();

    // Build date filter based on period
    const dateFilter = period === 'alltime' ? {} : {
      date_added: {
        gte: start,
        lte: end,
      },
    };

    // BATCH ALL QUERIES - Use single connection
    const [minifigUsers, setUsers, donations] = await Promise.all([
      // Minifig collectors
      prisma.user.findMany({
        where: { showOnMinifigLeaderboard: true },
        select: {
          id: true,
          name: true,
          leaderboardDisplayName: true,
          CollectionItem: {
            where: dateFilter,
            select: { quantity: true },
          },
          PersonalCollectionItem: {
            where: dateFilter,
            select: { quantity: true },
          },
        },
      }),

      // Set collectors
      prisma.user.findMany({
        where: { showOnSetLeaderboard: true },
        select: {
          id: true,
          name: true,
          leaderboardDisplayName: true,
          SetInventoryItem: {
            where: dateFilter,
            select: { quantity: true },
          },
          SetPersonalCollectionItem: {
            where: dateFilter,
            select: { quantity: true },
          },
        },
      }),

      // Top donors - query donations by email (not userId)
      prisma.donation.findMany({
        where: period === 'quarterly' ? {
          createdAt: { gte: start, lte: end },
          status: 'completed',
          showOnLeaderboard: true,
        } : {
          status: 'completed',
          showOnLeaderboard: true,
        },
        orderBy: { amount: 'desc' },
        take: 100, // Get more for grouping
        select: {
          donorEmail: true,
          displayName: true,
          donorName: true,
          amount: true,
        },
      }),
    ]);

    // Process minifig collectors
    const minifigCollectors = minifigUsers
      .map((user) => {
        const inventoryTotal = user.CollectionItem.reduce((sum, item) => sum + item.quantity, 0);
        const personalTotal = user.PersonalCollectionItem.reduce((sum, item) => sum + item.quantity, 0);
        return {
          displayName: user.leaderboardDisplayName || generateDefaultDisplayName(user.name),
          count: inventoryTotal + personalTotal,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((collector, index) => ({ ...collector, rank: index + 1 }));

    // Process set collectors
    const setCollectors = setUsers
      .map((user) => {
        const inventoryTotal = user.SetInventoryItem.reduce((sum, item) => sum + item.quantity, 0);
        const personalTotal = user.SetPersonalCollectionItem.reduce((sum, item) => sum + item.quantity, 0);
        return {
          displayName: user.leaderboardDisplayName || generateDefaultDisplayName(user.name),
          count: inventoryTotal + personalTotal,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((collector, index) => ({ ...collector, rank: index + 1 }));

    // Process top donors - group by email and sum amounts
    const donorMap = new Map<string, { displayName: string; totalAmount: number }>();

    donations.forEach((donation) => {
      const email = donation.donorEmail;
      const displayName = donation.displayName || donation.donorName || 'Anonymous Donor';

      if (donorMap.has(email)) {
        const existing = donorMap.get(email)!;
        existing.totalAmount += donation.amount;
      } else {
        donorMap.set(email, {
          displayName,
          totalAmount: donation.amount,
        });
      }
    });

    // Sort by total amount and take top 5
    const topDonors = Array.from(donorMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map((donor, index) => ({
        ...donor,
        rank: index + 1,
      }));

    const result = {
      season,
      dateRange: period === 'quarterly' ? formatSeasonDateRange() : 'All-Time',
      period,
      minifigCollectors,
      setCollectors,
      topDonors,
    };

    // Update cache
    cachedData = { key: cacheKey, data: result };
    cacheTime = now;

    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error('[All Leaderboards API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboards' },
      { status: 500 }
    );
  }
}
