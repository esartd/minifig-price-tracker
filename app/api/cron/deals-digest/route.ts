import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, EMAIL_FROM } from '@/lib/email/resend-client';
import { DealsDigestEmail, type DigestDeal } from '@/lib/email/templates/deals-digest';
import { originFor } from '@/lib/site-domain';

/**
 * Daily Walmart deals digest for Premium subscribers who opted in.
 *
 *   0 14 * * *  curl -H "User-Agent: FigTracker-Cron/1.0" \
 *               -H "Authorization: Bearer $CRON_SECRET" \
 *               http://localhost:3000/api/cron/deals-digest
 *
 * 14:00 UTC is 8am Mountain -- morning for the US audience, and safely AFTER
 * the 09:00 UTC walmart-deals sync that produces the data this reads. Running
 * it before that would mail yesterday's numbers.
 *
 * localhost and the FigTracker-Cron/1.0 user-agent are both required: the
 * middleware blocks bare `curl` as a bot, which silently killed the
 * walmart-deals cron once already.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const PREMIUM_STATUSES = ['active', 'trialing'];

// Enough to be worth an email without becoming a catalogue. Anything longer
// belongs on /deals, which the email links to.
const MAX_ROWS_PER_SECTION = 12;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscribers = await prisma.user.findMany({
      where: {
        dealsDigest: true,
        subscriptionStatus: { in: PREMIUM_STATUSES },
      },
      select: { id: true, name: true, email: true, unsubscribeToken: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, subscribers: 0, sent: 0, skipped: 'no subscribers' });
    }

    /**
     * What changed since yesterday.
     *
     * Both queries apply the same bar as /deals -- Walmart flagging a real sale
     * AND our own price agreeing it is below market -- because a digest that
     * recommends something the website would not is a contradiction the reader
     * will notice.
     */
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dealFilter = {
      inStock: true,
      listPrice: { not: null },
      discountPercent: { gte: 20 },
      pctBelowOurPrice: { gt: 0 },
    };
    const select = {
      boxNo: true, title: true, currentPrice: true, listPrice: true,
      discountPercent: true, pctBelowOurPrice: true, previousPrice: true,
      productUrl: true, imageUrl: true,
    };

    const [newRows, cheaperRows] = await Promise.all([
      prisma.walmartDeal.findMany({
        where: { ...dealFilter, firstSeenAt: { gte: since } },
        orderBy: { pctBelowOurPrice: 'desc' },
        take: MAX_ROWS_PER_SECTION,
        select,
      }),
      prisma.walmartDeal.findMany({
        where: {
          ...dealFilter,
          firstSeenAt: { lt: since },
          previousPrice: { not: null },
          lastUpdated: { gte: since },
        },
        orderBy: { pctBelowOurPrice: 'desc' },
        take: MAX_ROWS_PER_SECTION * 3,
        select,
      }),
    ]);

    // Prisma cannot compare two columns in a where clause, so the "actually
    // cheaper than it was" test happens here.
    const cheaper = cheaperRows
      .filter((r) => r.previousPrice != null && r.currentPrice < r.previousPrice)
      .slice(0, MAX_ROWS_PER_SECTION);

    // Nothing new is a normal outcome, not a failure. Send nothing rather than
    // an empty email -- that is what trains people to unsubscribe.
    if (newRows.length === 0 && cheaper.length === 0) {
      return NextResponse.json({
        success: true, subscribers: subscribers.length, sent: 0, skipped: 'nothing new today',
      });
    }

    const toDigestDeal = (r: (typeof newRows)[number]): DigestDeal => ({
      boxNo: r.boxNo,
      // The listing title, not our catalogue name: it is what the reader sees
      // when they land on Walmart, so they should match.
      name: r.title.slice(0, 90),
      currentPrice: r.currentPrice,
      listPrice: r.listPrice,
      discountPercent: r.discountPercent,
      pctBelowOurPrice: r.pctBelowOurPrice,
      previousPrice: r.previousPrice,
      buyUrl: r.productUrl,
      imageUrl: r.imageUrl,
    });

    const newDeals = newRows.map(toDigestDeal);
    const cheaperDeals = cheaper.map(toDigestDeal);
    const origin = originFor('en');
    const total = newDeals.length + cheaperDeals.length;

    let sent = 0;
    let failed = 0;

    for (const user of subscribers) {
      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: user.email,
          subject:
            total === 1
              ? '1 new LEGO deal today'
              : `${total} new LEGO deals today`,
          react: DealsDigestEmail({
            userName: user.name || 'Collector',
            newDeals,
            cheaperDeals,
            dealsUrl: `${origin}/deals`,
            // One-click and no sign-in: someone reading email is not logged in,
            // and making them sign in to leave earns spam complaints instead of
            // unsubscribes. Same reasoning as the newsletter token.
            unsubscribeUrl: user.unsubscribeToken
              ? `${origin}/unsubscribe?token=${user.unsubscribeToken}&type=deals`
              : `${origin}/account`,
          }),
        });
        sent++;
      } catch (error) {
        // One bad address must not stop the rest of the run.
        console.error(`[deals-digest] send failed for ${user.id}:`, error);
        failed++;
      }
    }

    console.log(
      `[deals-digest] ${sent} sent, ${failed} failed | ${newDeals.length} new, ${cheaperDeals.length} cheaper`
    );

    return NextResponse.json({
      success: true,
      subscribers: subscribers.length,
      sent,
      failed,
      newDeals: newDeals.length,
      cheaperDeals: cheaperDeals.length,
    });
  } catch (error) {
    console.error('[deals-digest] Fatal:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Digest failed' },
      { status: 500 }
    );
  }
}
