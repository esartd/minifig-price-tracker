import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Verify admin secret
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get comprehensive statistics
    const [
      totalSubscribers,
      confirmedSubscribers,
      unconfirmedSubscribers,
      unsubscribedSubscribers,
      productUpdatesSubs,
      dealsSubs,
      priceAlertsSubs,
      digestSubs,
      recentCampaigns
    ] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({
        where: { confirmed: true, unsubscribedAt: null }
      }),
      prisma.newsletterSubscriber.count({
        where: { confirmed: false, unsubscribedAt: null }
      }),
      prisma.newsletterSubscriber.count({
        where: { unsubscribedAt: { not: null } }
      }),
      prisma.newsletterSubscriber.count({
        where: { confirmed: true, notifyProductUpdates: true, unsubscribedAt: null }
      }),
      prisma.newsletterSubscriber.count({
        where: { confirmed: true, notifyDeals: true, unsubscribedAt: null }
      }),
      prisma.newsletterSubscriber.count({
        where: { confirmed: true, notifyPriceAlerts: true, unsubscribedAt: null }
      }),
      prisma.newsletterSubscriber.count({
        where: { confirmed: true, notifyDigest: true, unsubscribedAt: null }
      }),
      prisma.newsletterCampaign.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          subject: true,
          type: true,
          targetGroup: true,
          status: true,
          sentAt: true,
          recipientCount: true,
          sentCount: true,
          bouncedCount: true,
          createdAt: true,
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        subscribers: {
          total: totalSubscribers,
          confirmed: confirmedSubscribers,
          unconfirmed: unconfirmedSubscribers,
          unsubscribed: unsubscribedSubscribers,
          byGroup: {
            productUpdates: productUpdatesSubs,
            deals: dealsSubs,
            priceAlerts: priceAlertsSubs,
            digest: digestSubs
          }
        },
        campaigns: {
          recent: recentCampaigns,
          totalSent: recentCampaigns.reduce((sum, c) => sum + c.sentCount, 0)
        }
      }
    });
  } catch (error) {
    console.error('[ADMIN] Newsletter stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
