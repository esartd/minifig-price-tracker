import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Event tracking for the admin funnel. Fire-and-forget.
 *
 * ## This endpoint recorded exactly one row in its first three weeks
 *
 * Found 15 September 2026: `MonetizationEvent` held a single row, `id=""`,
 * from 29 August. The admin funnels rendered zeros and read as "nobody
 * converts" when the truth was "nothing is recorded". Three separate faults,
 * stacked, each of which alone was enough:
 *
 *  1. **Callers and API disagreed on the field names.** PricingCard and
 *     header-client post `{ event, properties }`; this route read
 *     `{ eventType, metadata }`, so eventType was undefined and every one of
 *     those calls was rejected 400 "Missing eventType". Both shapes are now
 *     accepted -- renaming every call site is a bigger change than meeting
 *     them where they are, and the old shape will keep arriving from any
 *     cached bundle for a while yet.
 *
 *  2. **The whitelist did not contain the names the funnel queries.**
 *     minifig-detail-client sent the correct shape with `inline_link_clicked`,
 *     which was not in VALID_EVENT_TYPES, so it was rejected too. The list
 *     below now covers what the callers send AND what admin/stats reads.
 *
 *  3. **The insert bypassed Prisma's id default.** It used
 *     `$executeRawUnsafe` with no id column, and `@default(cuid())` is applied
 *     by Prisma, not MySQL. The first insert wrote an empty-string primary
 *     key; every insert after it failed on duplicate key. Now a normal
 *     `create()`, which generates the id.
 *
 * `export_collection` is the one row that exists because it alone cleared all
 * three: right shape, on the whitelist, and first through the door.
 *
 * Failures are still non-blocking -- tracking must never break the page -- but
 * the response now says `tracked: false` instead of claiming success, so the
 * next breakage is visible from the client rather than only in server logs.
 */

/**
 * One vocabulary, shared by the callers and by app/admin/stats.
 *
 * Adding a name here is not enough on its own: the admin funnel has to query
 * it too, or the event is recorded and never seen.
 */
const VALID_EVENT_TYPES = [
  // Funnel: what the admin dashboard reads.
  'pricing_viewed',
  'affiliate_clicked',
  'inline_link_clicked',
  'nav_support_clicked',
  'support_page_viewed',
  'donated',
  // Product events.
  'affiliate_click',
  'purchase_intent',
  'subscription_view',
  'donation_view',
  'pricing_refresh',
  'export_collection',
  'search_query',
  'collection_add',
  'collection_remove',
  'wishlist_add',
  'wishlist_remove',
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

/**
 * Names that predate the shared vocabulary above, mapped to their replacement.
 *
 * PricingCard and header-client send these today. Mapping rather than
 * rejecting means their events start counting immediately, without waiting for
 * every client bundle in the wild to be replaced.
 */
const LEGACY_EVENT_NAMES: Record<string, EventType> = {
  pricing_card_support_click: 'support_page_viewed',
  nav_support_click: 'nav_support_clicked',
  support_click: 'support_page_viewed',
  affiliate_click_tracked: 'affiliate_clicked',
};

interface TrackEventRequest {
  eventType?: string;
  metadata?: Record<string, unknown>;
  /** Older call sites use these two names for the same thing. */
  event?: string;
  properties?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackEventRequest = await request.json();

    // Accept either shape; see fault 1 above.
    const rawType = body.eventType ?? body.event;
    const metadata = body.metadata ?? body.properties ?? {};

    if (!rawType) {
      return NextResponse.json(
        { success: false, error: 'Missing eventType' },
        { status: 400 }
      );
    }

    const eventType = (LEGACY_EVENT_NAMES[rawType] ?? rawType) as EventType;

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: `Invalid eventType: ${rawType}` },
        { status: 400 }
      );
    }

    // Anonymous events count too -- most of the funnel happens before signup,
    // and dropping them would make the top of it invisible.
    const session = await auth();
    const userId = session?.user?.id || null;

    try {
      await prisma.monetizationEvent.create({
        data: {
          eventType,
          userId,
          metadata: JSON.stringify(metadata),
        },
      });

      return NextResponse.json({ success: true, tracked: true });
    } catch (dbError: unknown) {
      // Non-blocking, but honest: `tracked: false` is what made the previous
      // three weeks of silent failure possible to spot at all.
      console.error('[Track Event] Database error (non-blocking):', {
        eventType,
        userId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      });

      return NextResponse.json({
        success: true,
        tracked: false,
        note: 'Event accepted but not persisted',
      });
    }
  } catch (error: unknown) {
    console.error(
      '[Track Event] Error (non-blocking):',
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json({
      success: true,
      tracked: false,
      note: 'Event tracking failed gracefully',
    });
  }
}

/** Recent events for the signed-in user, for debugging. */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.monetizationEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { eventType: true, userId: true, metadata: true, createdAt: true },
    });

    return NextResponse.json({ success: true, events });
  } catch (error: unknown) {
    console.error(
      '[Track Event] GET error:',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
