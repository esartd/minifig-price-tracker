import { NextRequest, NextResponse } from 'next/server';
import { renderIndex } from '@/lib/sitemap-data';

export const dynamic = 'force-dynamic';

/**
 * Sitemap index.
 *
 * This replaces app/sitemap.ts. Next's sitemap convention can shard via
 * generateSitemaps, but it has no way to emit the index that ties the shards
 * together, and search engines need the index to find them. Hand-rolling both
 * halves keeps them consistent.
 *
 * Served per-origin: each language subdomain returns an index pointing at its
 * own shards, which is what robots.ts already advertises.
 */
export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const xml = await renderIndex(origin);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // The old sitemap sent max-age=0, must-revalidate, so every crawler
        // hit regenerated the whole thing. It changes at most daily.
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        Vary: 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('[sitemap] index failed:', error);
    return new NextResponse('Sitemap unavailable', { status: 500 });
  }
}
