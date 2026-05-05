import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterCampaign } from '@/lib/newsletter-sender';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for sending campaigns

export async function POST(request: NextRequest) {
  try {
    const { secret, campaignId, sendNow } = await request.json();

    // Verify admin secret
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get campaign details
    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Get recipients based on target group
    const recipients = await getRecipients(campaign.targetGroup);

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recipients found for this target group' },
        { status: 400 }
      );
    }

    // Update campaign status
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sending',
        recipientCount: recipients.length,
        sentAt: sendNow ? new Date() : campaign.sentAt
      }
    });

    // Send emails (batch processing)
    if (sendNow) {
      // Queue for immediate sending
      await sendNewsletterCampaign(campaign, recipients);
    } else {
      // Schedule for later (would need additional queue system)
      return NextResponse.json({
        success: false,
        error: 'Scheduled sending not yet implemented'
      }, { status: 501 });
    }

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${recipients.length} recipients`,
      recipientCount: recipients.length
    });

  } catch (error: any) {
    console.error('[ADMIN] Send campaign error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper: Get recipients based on target group
async function getRecipients(targetGroup: string) {
  const baseQuery = {
    confirmed: true,
    unsubscribedAt: null
  };

  switch (targetGroup) {
    case 'all':
      return await prisma.newsletterSubscriber.findMany({
        where: baseQuery
      });

    case 'product_updates':
      return await prisma.newsletterSubscriber.findMany({
        where: { ...baseQuery, notifyProductUpdates: true }
      });

    case 'deals':
      return await prisma.newsletterSubscriber.findMany({
        where: { ...baseQuery, notifyDeals: true }
      });

    case 'price_alerts':
      return await prisma.newsletterSubscriber.findMany({
        where: {
          ...baseQuery,
          notifyPriceAlerts: true,
          userId: { not: null } // Must have linked account
        }
      });

    case 'digest':
      return await prisma.newsletterSubscriber.findMany({
        where: { ...baseQuery, notifyDigest: true }
      });

    default:
      throw new Error('Invalid target group');
  }
}
