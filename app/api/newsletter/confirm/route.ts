import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Confirmation token required' },
        { status: 400 }
      );
    }

    // Find subscriber by confirmation token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired confirmation token' },
        { status: 404 }
      );
    }

    // Check if already confirmed
    if (subscriber.confirmed) {
      return NextResponse.json({
        success: true,
        message: 'Email already confirmed',
        subscriber: {
          email: subscriber.email,
          notifyProductUpdates: subscriber.notifyProductUpdates,
          notifyDeals: subscriber.notifyDeals,
          notifyPriceAlerts: subscriber.notifyPriceAlerts,
          notifyDigest: subscriber.notifyDigest,
        }
      });
    }

    // Confirm subscription
    const updated = await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        confirmationToken: null, // Clear token after use
      },
    });

    // Send welcome email
    await sendNewsletterWelcomeEmail(updated.email);

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed successfully!',
      subscriber: {
        email: updated.email,
        notifyProductUpdates: updated.notifyProductUpdates,
        notifyDeals: updated.notifyDeals,
        notifyPriceAlerts: updated.notifyPriceAlerts,
        notifyDigest: updated.notifyDigest,
      }
    });
  } catch (error) {
    console.error('[NEWSLETTER] Confirm error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
