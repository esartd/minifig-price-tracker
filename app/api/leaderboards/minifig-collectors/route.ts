import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason, getCurrentSeasonDateRange, formatSeasonDateRange } from '@/lib/donations';
import { generateDefaultDisplayName } from '@/lib/leaderboards';

/**
 * GET /api/leaderboards/minifig-collectors
 * Returns top 5 minifig collectors for current quarter
 * Counts TOTAL quantity of minifigs ADDED this quarter from BOTH collections:
 * - CollectionItem (For Sale / Inventory)
 * - PersonalCollectionItem (To Keep / Personal Collection)
 */
export async function GET() {
  try {
    const season = getCurrentSeason();
    const { start, end } = getCurrentSeasonDateRange();

    // Get all users who opted-in to minifig leaderboard
    const users = await prisma.user.findMany({
      where: {
        showOnMinifigLeaderboard: true,
      },
      select: {
        id: true,
        name: true,
        leaderboardDisplayName: true,
        CollectionItem: {
          where: {
            date_added: {
              gte: start,
              lte: end,
            },
          },
          select: {
            quantity: true,
          },
        },
        PersonalCollectionItem: {
          where: {
            date_added: {
              gte: start,
              lte: end,
            },
          },
          select: {
            quantity: true,
          },
        },
      },
    });

    // Calculate total quantity for each user (both collections combined)
    const collectorsWithCounts = users.map((user) => {
      // Sum quantities from both collections
      const inventoryTotal = user.CollectionItem.reduce((sum, item) => sum + item.quantity, 0);
      const personalTotal = user.PersonalCollectionItem.reduce((sum, item) => sum + item.quantity, 0);
      const totalQuantity = inventoryTotal + personalTotal;

      // Use custom display name, or generate default from user's name
      const displayName = user.leaderboardDisplayName || generateDefaultDisplayName(user.name);

      return {
        displayName,
        count: totalQuantity,
        userId: user.id,
      };
    });

    // Sort by count descending and take top 5
    const topCollectors = collectorsWithCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((collector, index) => ({
        displayName: collector.displayName,
        count: collector.count,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      data: {
        season,
        dateRange: formatSeasonDateRange(),
        topCollectors,
      },
    });
  } catch (error) {
    console.error('[Minifig Collectors API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch minifig collectors leaderboard' },
      { status: 500 }
    );
  }
}
