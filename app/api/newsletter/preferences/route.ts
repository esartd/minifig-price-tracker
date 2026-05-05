import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET preferences by unsubscribe token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

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

    return NextResponse.json({
      success: true,
      data: {
        email: subscriber.email,
        confirmed: subscriber.confirmed,
        notifyProductUpdates: subscriber.notifyProductUpdates,
        notifyDeals: subscriber.notifyDeals,
        notifyPriceAlerts: subscriber.notifyPriceAlerts,
        notifyDigest: subscriber.notifyDigest,
        unsubscribedAt: subscriber.unsubscribedAt,
      }
    });
  } catch (error) {
    console.error('[NEWSLETTER] Get preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST update preferences
export async function POST(request: NextRequest) {
  try {
    const { token, notifyProductUpdates, notifyDeals, notifyPriceAlerts, notifyDigest } = await request.json();

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

    // Update preferences
    const updated = await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        notifyProductUpdates: notifyProductUpdates ?? subscriber.notifyProductUpdates,
        notifyDeals: notifyDeals ?? subscriber.notifyDeals,
        notifyPriceAlerts: notifyPriceAlerts ?? subscriber.notifyPriceAlerts,
        notifyDigest: notifyDigest ?? subscriber.notifyDigest,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        email: updated.email,
        notifyProductUpdates: updated.notifyProductUpdates,
        notifyDeals: updated.notifyDeals,
        notifyPriceAlerts: updated.notifyPriceAlerts,
        notifyDigest: updated.notifyDigest,
      }
    });
  } catch (error) {
    console.error('[NEWSLETTER] Update preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
