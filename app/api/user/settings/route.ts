import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateDisplayName } from '@/lib/donations';
import { generateUsernameSuggestion, validateUsername } from '@/lib/username';

// Derives a unique, URL-safe slug from a display name so users get a public
// profile link without typing a separate username. Only called when the user
// doesn't already have one — once set, a username is never regenerated, so
// existing profile links never break.
async function generateUniqueUsername(seed: string): Promise<string> {
  let base = generateUsernameSuggestion(seed);
  if (!base || !validateUsername(base).valid) {
    base = 'collector';
  }

  for (let suffix = 0; suffix <= 50; suffix++) {
    const candidate = suffix === 0 ? base : `${base.slice(0, 30 - `-${suffix}`.length)}-${suffix}`;
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }

  return `collector-${randomUUID().slice(0, 8)}`;
}

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
        profilePublic: true,
        username: true,
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
    const { showOnMinifigLeaderboard, showOnSetLeaderboard, leaderboardDisplayName, profilePublic } = body;

    // Validate display name if provided and user is opting-in to any leaderboard
    if ((showOnMinifigLeaderboard || showOnSetLeaderboard) && leaderboardDisplayName) {
      const validation = validateDisplayName(leaderboardDisplayName);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }
    }

    const trimmedDisplayName = leaderboardDisplayName?.trim() || null;

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    });

    // Auto-generate a profile URL slug from the display name the first time
    // one is set. Never overwrite an existing username so profile links stay stable.
    const username = existingUser?.username
      ?? (trimmedDisplayName ? await generateUniqueUsername(trimmedDisplayName) : null);

    // Update user settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        showOnMinifigLeaderboard: showOnMinifigLeaderboard || false,
        showOnSetLeaderboard: showOnSetLeaderboard || false,
        leaderboardDisplayName: trimmedDisplayName,
        ...(typeof profilePublic === 'boolean' ? { profilePublic } : {}),
        ...(username && username !== existingUser?.username ? { username } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      username,
    });
  } catch (error) {
    console.error('[Settings API] POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
