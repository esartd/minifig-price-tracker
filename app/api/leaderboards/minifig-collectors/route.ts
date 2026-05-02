import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason } from '@/lib/donations';

/**
 * GET /api/leaderboards/minifig-collectors
 * Returns top 5 minifig collectors for current quarter
 * Counts total unique minifigs in collection (CollectionItem)
 */
export async function GET() {
  try {
    const season = getCurrentSeason();

    // Get all users who opted-in to minifig leaderboard
    const users = await prisma.user.findMany({
      where: {
        showOnMinifigLeaderboard: true,
      },
      select: {
        id: true,
        leaderboardDisplayName: true,
        CollectionItem: {
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

      return {
        displayName: user.leaderboardDisplayName || 'Anonymous Collector',
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
