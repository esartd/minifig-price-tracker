import { NextRequest, NextResponse } from 'next/server';
import { searchMinifigs } from '@/lib/catalog-static';
import { searchBoxes } from '@/lib/boxes-data';

export const dynamic = 'force-dynamic';

/**
 * In-process cache of finished search results.
 *
 * The catalog itself is already held in memory, but the scoring pass wasn't
 * cached — every keystroke re-scored and re-sorted all ~40,000 minifigs and
 * sets from scratch. Measured against production that was roughly 250ms of the
 * ~410ms a search took, with the rest being network round-trip to the VPS.
 *
 * Popular queries repeat constantly (every visitor typing "star wars" runs the
 * identical scan), so caching the finished payload takes that 250ms to
 * essentially zero for anything asked twice.
 *
 * Cloudflare would be the better place for this, but it doesn't cache /api/
 * routes by default — the Cache-Control header below is currently ignored
 * (responses come back `cf-cache-status: DYNAMIC`). Until a cache rule exists
 * for this path, doing it in-process is what's available to us.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Total memory the cache may hold, tracked in bytes rather than entry count.
 *
 * Don't replace this with "skip anything over N KB" — payload size says
 * nothing about how often a query is asked. "batman" is 76 KB and extremely
 * popular; "hoth rebel trooper" is 12 KB and rare. A total budget with
 * least-recently-used eviction keeps the big popular queries cached while
 * still bounding memory on a small VPS.
 */
const MAX_CACHE_BYTES = 8 * 1024 * 1024;

/** No single entry may dominate the budget. */
const MAX_ENTRY_BYTES = 512 * 1024;

interface CacheEntry {
  body: string;
  bytes: number;
  expiresAt: number;
}

const resultCache = new Map<string, CacheEntry>();
let cacheBytes = 0;

function evict(key: string): void {
  const entry = resultCache.get(key);
  if (!entry) return;
  cacheBytes -= entry.bytes;
  resultCache.delete(key);
}

function cacheGet(key: string): string | null {
  const hit = resultCache.get(key);
  if (!hit) return null;

  if (Date.now() > hit.expiresAt) {
    evict(key);
    return null;
  }

  // Re-insert so the most recently used entry is last — Map preserves
  // insertion order, which makes the eviction below a simple LRU.
  resultCache.delete(key);
  resultCache.set(key, hit);
  return hit.body;
}

function cacheSet(key: string, body: string): void {
  const bytes = Buffer.byteLength(body, 'utf8');
  if (bytes > MAX_ENTRY_BYTES) return;

  // Replacing an existing key must not double-count its bytes.
  evict(key);

  resultCache.set(key, { body, bytes, expiresAt: Date.now() + CACHE_TTL_MS });
  cacheBytes += bytes;

  while (cacheBytes > MAX_CACHE_BYTES) {
    const oldest = resultCache.keys().next().value;
    if (oldest === undefined) break;
    evict(oldest);
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json(
        {
          success: true,
          data: {
            minifigs: [],
            sets: [],
          },
        },
        { headers: { Vary: 'Accept-Encoding' } }
      );
    }

    // Cap the results. This used to ask for 10,000 of each ("effectively
    // unlimited"), which meant typing a single character returned 11,888 items
    // and a 4.2 MB response taking over a second — to render a handful on
    // screen. Capping is safe because both searches score and sort before
    // slicing: an exact ID match scores 1000 and short-circuits, so the item
    // you're looking for is at the top, never truncated off the end.
    const requested = Number(searchParams.get('limit'));
    const limit =
      Number.isFinite(requested) && requested > 0 ? Math.min(requested, 500) : 100;

    // Case- and whitespace-insensitive, since "Star Wars" and "star wars"
    // score identically anyway.
    const cacheKey = `${query.trim().toLowerCase()}::${limit}`;

    const headers = {
      'Cache-Control': 'public, max-age=60, s-maxage=60',
      /**
       * Next adds `Vary: rsc, next-router-state-tree, ...` to every response,
       * which are React Server Component negotiation headers. This route is a
       * plain JSON API — nothing here varies on them.
       *
       * It has to be overridden because Cloudflare refuses to cache any
       * response whose Vary header lists anything other than Accept-Encoding.
       * With Next's default the edge returned `cf-cache-status: DYNAMIC` even
       * though a cache rule matched the path, so the edge cache never
       * engaged. Setting it explicitly is what makes that rule effective.
       */
      Vary: 'Accept-Encoding',
    };

    const cached = cacheGet(cacheKey);
    if (cached) {
      return new NextResponse(cached, {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json', 'X-Search-Cache': 'HIT' },
      });
    }

    const [minifigs, sets] = await Promise.all([
      searchMinifigs(query, limit),
      Promise.resolve(searchBoxes(query, limit)),
    ]);

    const body = JSON.stringify({
      success: true,
      data: {
        minifigs,
        sets
      }
    });

    cacheSet(cacheKey, body);

    return new NextResponse(body, {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json', 'X-Search-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error in unified search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
