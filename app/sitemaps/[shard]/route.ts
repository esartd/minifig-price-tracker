import { NextRequest, NextResponse } from 'next/server';
import { renderShard } from '@/lib/sitemap-data';

export const dynamic = 'force-dynamic';

/**
 * One shard of the sitemap, served at /sitemaps/<n>.xml.
 *
 * Listed by /sitemap.xml. Each holds 2,500 paths expanded across ten locales
 * — 25,000 URLs, comfortably inside Google's 50,000-URL and 50 MB limits.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ shard: string }> }) {
  try {
    const { shard } = await context.params;

    // The route captures "0.xml"; the extension is for crawlers' benefit.
    const index = Number(shard.replace(/\.xml$/, ''));
    if (!Number.isInteger(index) || index < 0) {
      return new NextResponse('Not found', { status: 404 });
    }

    const xml = await renderShard(index);
    if (xml === null) {
      // Past the last shard. A 404 keeps a stale index from advertising
      // sitemaps that would otherwise return an empty but valid urlset.
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        Vary: 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('[sitemap] shard failed:', error);
    return new NextResponse('Sitemap unavailable', { status: 500 });
  }
}
