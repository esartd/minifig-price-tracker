import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

/**
 * Visitor Tracking API - Fire-and-forget pattern
 *
 * Tracks geographic visitor behavior without breaking UX.
 * Called from middleware or client-side analytics.
 *
 * Event Types:
 * - page_view: User viewed a page
 * - pricing_view: User viewed pricing data
 * - affiliate_click: User clicked affiliate link
 * - search: User performed a search
 * - collection_action: User added/removed from collection
 */

const VALID_EVENT_TYPES = [
  'page_view',
  'pricing_view',
  'affiliate_click',
  'search',
  'collection_action',
] as const;

type EventType = typeof VALID_EVENT_TYPES[number];

interface TrackVisitorRequest {
  country: string;
  ip: string;
  userAgent: string;
  path: string;
  referer?: string | null;
  eventType: EventType;
  metadata?: Record<string, any>;
  userId?: string | null;
}

/**
 * Hash IP address for privacy compliance
 * We track patterns, not individuals
 */
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.NEXTAUTH_SECRET).digest('hex').substring(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackVisitorRequest = await request.json();
    const { country, ip, userAgent, path, referer, eventType, metadata, userId } = body;

    // Validate required fields
    if (!eventType || !country || !ip || !path) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: `Invalid eventType: ${eventType}` },
        { status: 400 }
      );
    }

    // Hash IP for privacy
    const hashedIP = hashIP(ip);

    // Store event in database (fire-and-forget pattern)
    try {
      await prisma.visitorEvent.create({
        data: {
          country,
          ip: hashedIP,
          userAgent: userAgent || 'unknown',
          path,
          referer: referer || null,
          eventType,
          metadata: metadata ? JSON.stringify(metadata) : null,
          userId: userId || null,
        },
      });

      return NextResponse.json({
        success: true,
        tracked: true,
      });

    } catch (dbError: any) {
      // Fire-and-forget: don't break UX if tracking fails
      console.error('[Track Visitor] Database error (non-blocking):', {
        country,
        path,
        eventType,
        error: dbError.message,
      });

      // Return success to client even if DB write failed
      return NextResponse.json({
        success: true,
        tracked: false,
        note: 'Event logged but not persisted',
      });
    }

  } catch (error: any) {
    // Fire-and-forget: log error but return success
    console.error('[Track Visitor] Error (non-blocking):', error.message);

    return NextResponse.json({
      success: true,
      tracked: false,
      note: 'Event tracking failed gracefully',
    });
  }
}

/**
 * GET endpoint - Get visitor events for debugging (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const days = parseInt(searchParams.get('days') || '7');

    if (!country) {
      return NextResponse.json(
        { error: 'Missing country parameter' },
        { status: 400 }
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await prisma.visitorEvent.findMany({
      where: {
        country,
        createdAt: {
          gte: since,
        },
      },
      select: {
        id: true,
        country: true,
        ip: true, // Hashed
        path: true,
        referer: true,
        eventType: true,
        metadata: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    return NextResponse.json({
      success: true,
      country,
      days,
      events,
    });

  } catch (error: any) {
    console.error('[Track Visitor GET] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch visitor events' },
      { status: 500 }
    );
  }
}
