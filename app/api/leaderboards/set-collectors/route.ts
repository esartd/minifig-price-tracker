import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason } from '@/lib/donations';

/**
 * GET /api/leaderboards/set-collectors
 * Returns top 5 set collectors for current quarter
 * Counts total unique sets in collection (SetPersonalCollectionItem)
 */
export async function GET() {
  try {
    const season = getCurrentSeason();

    // Get all users who opted-in to set leaderboard
    const users = await prisma.user.findMany({
      where: {
        showOnSetLeaderboard: true,
      },
      select: {
        id: true,
        leaderboardDisplayName: true,
        SetPersonalCollectionItem: {
          select: {
            box_no: true,
          },
        },
      },
    });

    // Calculate unique set count for each user
    const collectorsWithCounts = users.map((user) => {
      // Count unique box_no (same set in different conditions counts as 1)
      const uniqueSets = new Set(user.SetPersonalCollectionItem.map(item => item.box_no));

      return {
        displayName: user.leaderboardDisplayName || 'Anonymous Collector',
        count: uniqueSets.size,
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
    console.error('[Set Collectors API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch set collectors leaderboard' },
      { status: 500 }
    );
  }
}
