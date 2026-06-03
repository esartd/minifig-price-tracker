import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateDisplayName } from '@/lib/donations';

/**
 * GET /api/user/settings
 * Returns current user settings
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        showOnMinifigLeaderboard: true,
        showOnSetLeaderboard: true,
        leaderboardDisplayName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('[Settings API] GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

/**
 * POST /api/user/settings
 * Updates user settings
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { showOnMinifigLeaderboard, showOnSetLeaderboard, leaderboardDisplayName } = body;

    // Validate display name if provided and user is opting-in to any leaderboard
    if ((showOnMinifigLeaderboard || showOnSetLeaderboard) && leaderboardDisplayName) {
      const validation = validateDisplayName(leaderboardDisplayName);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }
    }

    // Update user settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        showOnMinifigLeaderboard: showOnMinifigLeaderboard || false,
        showOnSetLeaderboard: showOnSetLeaderboard || false,
        leaderboardDisplayName: leaderboardDisplayName?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('[Settings API] POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
