import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Generate a unique share token
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate a random token
    const shareToken = randomBytes(16).toString('hex');

    // Update user with share token and enable sharing
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        shareToken,
        shareEnabled: true
      }
    });

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken}`
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}

// Toggle sharing on/off
export async function PATCH() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { shareEnabled: true, shareToken: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Toggle sharing
    const newShareEnabled = !user.shareEnabled;

    // If enabling and no token exists, generate one
    let shareToken = user.shareToken;
    if (newShareEnabled && !shareToken) {
      shareToken = randomBytes(16).toString('hex');
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        shareEnabled: newShareEnabled,
        ...(shareToken && { shareToken })
      }
    });

    return NextResponse.json({
      success: true,
      shareEnabled: newShareEnabled,
      shareToken,
      shareUrl: shareToken ? `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken}` : null
    });
  } catch (error) {
    console.error('Error toggling share:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle sharing' },
      { status: 500 }
    );
  }
}

// Get current share status
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { shareEnabled: true, shareToken: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      shareEnabled: user.shareEnabled,
      shareToken: user.shareToken,
      shareUrl: user.shareToken ? `${process.env.NEXT_PUBLIC_BASE_URL}/share/${user.shareToken}` : null
    });
  } catch (error) {
    console.error('Error getting share status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get share status' },
      { status: 500 }
    );
  }
}
