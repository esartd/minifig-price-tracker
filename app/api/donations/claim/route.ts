import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateDisplayName } from '@/lib/donations';

/**
 * POST /api/donations/claim
 * Allows donors to claim their donation and set leaderboard preferences
 * No authentication required - uses PayPal email + transaction ID for verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paypalEmail, transactionId, displayName, showOnLeaderboard } = body;

    // Validate required fields
    if (!paypalEmail || !transactionId) {
      return NextResponse.json(
        { success: false, error: 'PayPal email and transaction ID are required' },
        { status: 400 }
      );
    }

    // If opting-in to leaderboard, display name is required
    if (showOnLeaderboard && !displayName) {
      return NextResponse.json(
        { success: false, error: 'Display name is required to appear on leaderboard' },
        { status: 400 }
      );
    }

    // Validate display name if provided
    if (displayName) {
      const validation = validateDisplayName(displayName);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }

    // Find donation by email and transaction ID
    const donation = await prisma.donation.findFirst({
      where: {
        donorEmail: paypalEmail.toLowerCase().trim(),
        paypalTxnId: transactionId.trim(),
      },
    });

    if (!donation) {
      return NextResponse.json(
        {
          success: false,
          error: 'No donation found matching that email and transaction ID',
        },
        { status: 404 }
      );
    }

    // Check if already claimed
    if (donation.displayName && donation.showOnLeaderboard) {
      return NextResponse.json(
        {
          success: false,
          error: 'This donation has already been claimed and added to the leaderboard',
        },
        { status: 409 }
      );
    }

    // Update donation with display preferences
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        displayName: displayName?.trim() || null,
        showOnLeaderboard: showOnLeaderboard || false,
      },
    });

    return NextResponse.json({
      success: true,
      message: showOnLeaderboard
        ? "Thank you! You're now on the leaderboard."
        : 'Your donation has been claimed successfully.',
    });
  } catch (error) {
    console.error('[Claim API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim donation' },
      { status: 500 }
    );
  }
}
