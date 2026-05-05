import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendUnsubscribeConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 404 }
      );
    }

    // Check if already unsubscribed
    if (subscriber.unsubscribedAt) {
      return NextResponse.json({
        success: true,
        message: 'Already unsubscribed',
      });
    }

    // Mark as unsubscribed (soft delete - keep data for compliance)
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        unsubscribedAt: new Date(),
        // Turn off all notifications
        notifyProductUpdates: false,
        notifyDeals: false,
        notifyPriceAlerts: false,
        notifyDigest: false,
      },
    });

    // Send confirmation email
    await sendUnsubscribeConfirmationEmail(subscriber.email);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    console.error('[NEWSLETTER] Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
