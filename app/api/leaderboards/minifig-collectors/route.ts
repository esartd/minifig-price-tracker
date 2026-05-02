import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason, getCurrentSeasonDateRange } from '@/lib/donations';
import { generateDefaultDisplayName } from '@/lib/leaderboards';

/**
 * GET /api/leaderboards/minifig-collectors
 * Returns top 5 minifig collectors for current quarter
 * Counts unique minifigs ADDED this quarter (CollectionItem.date_added)
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
            minifigure_no: true,
          },
        },
      },
    });

    // Calculate unique minifig count for each user
    const collectorsWithCounts = users.map((user) => {
      // Count unique minifigure_no (same fig in different conditions counts as 1)
      const uniqueMinifigs = new Set(user.CollectionItem.map(item => item.minifigure_no));

      // Use custom display name, or generate default from user's name
      const displayName = user.leaderboardDisplayName || generateDefaultDisplayName(user.name);

      return {
        displayName,
        count: uniqueMinifigs.size,
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
