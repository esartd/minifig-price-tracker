import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * Sets the avatar shown for the signed-in user.
 *
 * Accepts either a LEGO avatar id ("ninja-purple"), the literal string
 * "initials", or the sentinel "google" meaning "show my Google photo".
 *
 * "google" is a sentinel rather than the URL itself so that a caller can never
 * put an arbitrary URL into `image`. This endpoint used to write whatever
 * string it was given straight into the column, which meant any signed-in user
 * could point their avatar at any image anywhere -- their own profile page,
 * the leaderboards and the community page all render it. The URL now comes
 * from the server's own record of the Google photo, never from the request.
 */

const AVATAR_IDS = new Set([
  'astronaut-female', 'astronaut-male', 'chef', 'cool-guy', 'cowboy', 'cowgirl',
  'nerd-female', 'nerd-male', 'ninja-black', 'ninja-purple', 'pirate', 'punk',
  'robot', 'vampire', 'wizard-female', 'wizard-male',
]);

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { avatar } = await request.json();

    if (!avatar || typeof avatar !== 'string') {
      return NextResponse.json({ error: 'Avatar is required' }, { status: 400 });
    }

    let image: string | null;

    if (avatar === 'google') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { googleImage: true },
      });

      if (!user?.googleImage) {
        // No linked Google account, or linked before googleImage existed and
        // not signed in since. Signing in with Google again repopulates it.
        return NextResponse.json(
          { error: 'No Google photo on this account' },
          { status: 400 }
        );
      }

      image = user.googleImage;
    } else if (avatar === 'initials') {
      image = null;
    } else if (AVATAR_IDS.has(avatar)) {
      image = avatar;
    } else {
      return NextResponse.json({ error: 'Unknown avatar' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { image },
    });

    return NextResponse.json({
      success: true,
      // The resolved value, so the client can update the session without
      // having to know how "google" expands.
      avatar: image,
      message: 'Avatar updated successfully',
    });
  } catch (error) {
    console.error('❌ Avatar update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating avatar' },
      { status: 500 }
    );
  }
}
