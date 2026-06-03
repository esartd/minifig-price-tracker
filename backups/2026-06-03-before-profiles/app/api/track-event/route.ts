import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Event Tracking API - Fire-and-forget pattern
 *
 * Tracks monetization events for analytics without breaking UX.
 * Accepts: { eventType, metadata }
 * Returns: Success response immediately (failure doesn't block client)
 *
 * Event Types:
 * - "affiliate_click" - User clicked affiliate link
 * - "purchase_intent" - User initiated checkout flow
 * - "subscription_view" - User viewed subscription page
 * - "donation_view" - User viewed donation page
 * - "pricing_refresh" - User manually refreshed pricing
 * - "export_collection" - User exported collection data
 */

// Define allowed event types for validation
const VALID_EVENT_TYPES = [
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

type EventType = typeof VALID_EVENT_TYPES[number];

interface TrackEventRequest {
  eventType: EventType;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackEventRequest = await request.json();
    const { eventType, metadata = {} } = body;

    // Validate event type
    if (!eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing eventType' },
        { status: 400 }
      );
    }

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: `Invalid eventType: ${eventType}` },
        { status: 400 }
      );
    }

    // Get user session (optional - track even for anonymous users)
    const session = await auth();
    const userId = session?.user?.id || null;

    // Store event in database
    // NOTE: This assumes MonetizationEvent table exists in schema
    // If table doesn't exist yet, this will fail gracefully
    try {
      await prisma.$executeRawUnsafe(`
        INSERT INTO MonetizationEvent (
          eventType,
          userId,
          metadata,
          createdAt
        ) VALUES (?, ?, ?, NOW())
      `, eventType, userId, JSON.stringify(metadata));

      // Return success immediately
      return NextResponse.json({
        success: true,
        tracked: true
      });

    } catch (dbError: any) {
      // Fire-and-forget: don't break UX if tracking fails
      console.error('[Track Event] Database error (non-blocking):', {
        eventType,
        userId,
        error: dbError.message
      });

      // Return success to client even if DB write failed
      // This prevents tracking failures from breaking user experience
      return NextResponse.json({
        success: true,
        tracked: false,
        note: 'Event logged but not persisted'
      });
    }

  } catch (error: any) {
    // Fire-and-forget: log error but return success
    console.error('[Track Event] Error (non-blocking):', error.message);

    // Return 200 to prevent client-side errors
    return NextResponse.json({
      success: true,
      tracked: false,
      note: 'Event tracking failed gracefully'
    });
  }
}

// GET endpoint for testing/debugging (optional)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return recent events for debugging
    const events = await prisma.$queryRawUnsafe(`
      SELECT eventType, userId, metadata, createdAt
      FROM MonetizationEvent
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 50
    `, session.user.id);

    return NextResponse.json({
      success: true,
      events
    });

  } catch (error: any) {
    console.error('[Track Event GET] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
