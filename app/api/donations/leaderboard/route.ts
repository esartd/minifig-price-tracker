import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason, formatSeasonDateRange } from '@/lib/donations';

/**
 * GET /api/donations/leaderboard?period=quarterly|alltime
 * Returns top 5 donors
 * Public endpoint - no authentication required
 *
 * Query params:
 * - period: 'quarterly' (default) or 'alltime'
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'quarterly';

    const season = getCurrentSeason();

    // Build season filter based on period
    const seasonFilter = period === 'alltime' ? {} : { season };

    // Get all donations that opted-in to leaderboard
    const donations = await prisma.donation.findMany({
      where: {
        ...seasonFilter,
        showOnLeaderboard: true,
        status: 'completed',
      },
      select: {
        displayName: true,
        amount: true,
      },
    });

    // Aggregate donations by display name
    const donorTotals = new Map<string, number>();

    donations.forEach((donation) => {
      if (!donation.displayName) return; // Skip if no display name

      const current = donorTotals.get(donation.displayName) || 0;
      donorTotals.set(donation.displayName, current + donation.amount);
    });

    // Convert to array and sort by total amount descending
    const topDonors = Array.from(donorTotals.entries())
      .map(([displayName, totalAmount], index) => ({
        displayName,
        totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
        rank: index + 1,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5); // Top 5 only

    // Re-assign ranks after sorting
    topDonors.forEach((donor, index) => {
      donor.rank = index + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        season,
        dateRange: period === 'quarterly' ? formatSeasonDateRange() : 'All-Time',
        period,
        topDonors,
      },
    });
  } catch (error) {
    console.error('[Leaderboard API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
