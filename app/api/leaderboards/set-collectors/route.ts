import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSeason, getCurrentSeasonDateRange } from '@/lib/donations';
import { generateDefaultDisplayName } from '@/lib/leaderboards';

/**
 * GET /api/leaderboards/set-collectors
 * Returns top 5 set collectors for current quarter
 * Counts unique sets ADDED this quarter (SetPersonalCollectionItem.date_added)
 */
export async function GET() {
  try {
    const season = getCurrentSeason();
    const { start, end } = getCurrentSeasonDateRange();

    // Get all users who opted-in to set leaderboard
    const users = await prisma.user.findMany({
      where: {
        showOnSetLeaderboard: true,
      },
      select: {
        id: true,
        name: true,
        leaderboardDisplayName: true,
        SetPersonalCollectionItem: {
          where: {
            date_added: {
              gte: start,
              lte: end,
            },
          },
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

      // Use custom display name, or generate default from user's name
      const displayName = user.leaderboardDisplayName || generateDefaultDisplayName(user.name);

      return {
        displayName,
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
