import { NextRequest, NextResponse } from 'next/server';
import { getAllMinifigs, searchMinifigs } from '@/lib/catalog-static';
import { loadAllBoxes, searchBoxes } from '@/lib/boxes-data';
import { prisma } from '@/lib/prisma';
import { buildWhatnotMinifigUrl, buildWhatnotSetUrl } from '@/lib/whatnot-affiliate-links';

export const dynamic = 'force-dynamic';

/**
 * Cards for the /marketplace grid.
 *
 * Everything here comes from our own catalog. Whatnot has no affiliate
 * product feed and its Seller API only covers your own store, so the listings
 * themselves are not ours to show — instead each card carries a deep link
 * into Whatnot's search for that item, tracked to our partner ID.
 */

const DEFAULT_LIMIT = 48;
const MAX_LIMIT = 96;

/** How many popular items we rank. Beyond this, results fall back to catalog order. */
const POPULARITY_POOL = 500;

const RESULT_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Popularity is a groupBy across every collection row, which is far too
 * expensive to run per request against Hostinger — CLAUDE.md records that its
 * connection limits produce 500s under load. One hour is plenty fresh for
 * "what do people collect"; it barely moves day to day.
 */
const POPULARITY_TTL_MS = 60 * 60 * 1000;

export type MarketplaceItemType = 'minifig' | 'set';
export type MarketplaceSort = 'popular' | 'newest' | 'name';

export interface MarketplaceCard {
  itemNo: string;
  name: string;
  categoryName: string;
  yearReleased: string | null;
  imageUrl: string | null;
  itemType: MarketplaceItemType;
  ownerCount: number;
  whatnotUrl: string;
  /** Our blended estimate, or null when we have nothing cached for it. */
  priceUsd: number | null;
}

// ---------------------------------------------------------------------------
// Popularity
// ---------------------------------------------------------------------------

interface PopularityCache {
  ranks: Map<string, number>;
  expiresAt: number;
}

const popularityCache: Record<MarketplaceItemType, PopularityCache | null> = {
  minifig: null,
  set: null,
};

/**
 * How many users own each item, keyed by item number.
 *
 * Mirrors the signal already behind app/api/trending/*, which treats
 * collection membership as a stand-in for popularity because there is no view
 * tracking. Returns an empty map on failure — a grid in catalog order is a far
 * better outcome than a 500.
 */
async function getOwnerCounts(type: MarketplaceItemType): Promise<Map<string, number>> {
  const cached = popularityCache[type];
  if (cached && Date.now() < cached.expiresAt) return cached.ranks;

  const ranks = new Map<string, number>();

  try {
    if (type === 'minifig') {
      const rows = await prisma.personalCollectionItem.groupBy({
        by: ['minifigure_no'],
        _count: { minifigure_no: true },
        orderBy: { _count: { minifigure_no: 'desc' } },
        take: POPULARITY_POOL,
      });
      // MySQL returns BigInt for counts; JSON.stringify throws on those.
      for (const row of rows) ranks.set(row.minifigure_no, Number(row._count.minifigure_no));
    } else {
      const rows = await prisma.setPersonalCollectionItem.groupBy({
        by: ['box_no'],
        _count: { box_no: true },
        orderBy: { _count: { box_no: 'desc' } },
        take: POPULARITY_POOL,
      });
      for (const row of rows) ranks.set(row.box_no, Number(row._count.box_no));
    }
  } catch (error) {
    console.error('[marketplace] popularity lookup failed, falling back to catalog order:', error);
    return ranks;
  }

  popularityCache[type] = { ranks, expiresAt: Date.now() + POPULARITY_TTL_MS };
  return ranks;
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

const MINIFIG_IMAGE = (itemNo: string) => `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`;

function yearValue(year: string | null | undefined): number {
  const parsed = Number(year);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function collectMinifigs(query: string): Promise<MarketplaceCard[]> {
  const items = query ? await searchMinifigs(query, MAX_LIMIT * 8) : await getAllMinifigs();

  return items.map((item) => ({
    itemNo: item.minifigure_no,
    name: item.name,
    categoryName: item.category_name,
    yearReleased: item.year_released,
    imageUrl: item.image_url || MINIFIG_IMAGE(item.minifigure_no),
    itemType: 'minifig' as const,
    ownerCount: 0,
    priceUsd: null,
    whatnotUrl: buildWhatnotMinifigUrl(item.minifigure_no, item.name),
  }));
}

function collectSets(query: string): MarketplaceCard[] {
  const items = query ? searchBoxes(query, MAX_LIMIT * 8) : loadAllBoxes();

  return items.map((item) => ({
    itemNo: item.box_no,
    name: item.name,
    categoryName: item.category_name,
    yearReleased: item.year_released,
    imageUrl: item.image_url || item.thumbnail_url || null,
    itemType: 'set' as const,
    ownerCount: 0,
    priceUsd: null,
    whatnotUrl: buildWhatnotSetUrl(item.box_no, item.name),
  }));
}

function sortCards(
  cards: MarketplaceCard[],
  sort: MarketplaceSort,
  isSearch: boolean
): MarketplaceCard[] {
  // A search has already been scored for relevance by searchMinifigs /
  // searchBoxes. Re-sorting would throw that away and bury the exact match.
  if (isSearch && sort === 'popular') return cards;

  const sorted = [...cards];

  if (sort === 'newest') {
    sorted.sort((a, b) => yearValue(b.yearReleased) - yearValue(a.yearReleased));
  } else if (sort === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    sorted.sort((a, b) => {
      if (b.ownerCount !== a.ownerCount) return b.ownerCount - a.ownerCount;
      return yearValue(b.yearReleased) - yearValue(a.yearReleased);
    });
  }

  return sorted;
}

/**
 * Attach prices to one page of cards, reading only what is already cached.
 *
 * This deliberately does NOT go through pricingOrchestrator. The orchestrator
 * will fetch from BrickLink on a miss, and a grid asks for 48 items at once —
 * CLAUDE.md records an incident where one uncached call per page view burned
 * the 5,000/day budget by 5am. A grid could do it far faster.
 *
 * Coverage is high enough that this is not much of a compromise: the cache
 * holds a `figtracker` blended price for essentially the whole catalog. Items
 * without one simply show no price rather than blocking the card.
 */
async function attachPrices(cards: MarketplaceCard[], type: MarketplaceItemType): Promise<void> {
  if (cards.length === 0) return;

  try {
    const rows = await prisma.priceCache.findMany({
      where: {
        item_no: { in: cards.map((card) => card.itemNo) },
        item_type: type === 'minifig' ? 'MINIFIG' : 'SET',
        condition: 'new',
        price_source: 'figtracker',
      },
      select: { item_no: true, suggested_price: true },
    });

    const prices = new Map(rows.map((row) => [row.item_no, row.suggested_price]));
    for (const card of cards) {
      const price = prices.get(card.itemNo);
      if (typeof price === 'number' && price > 0) card.priceUsd = price;
    }
  } catch (error) {
    // A grid without prices is still a useful grid.
    console.error('[marketplace] price lookup failed, rendering without prices:', error);
  }
}

// ---------------------------------------------------------------------------
// Response cache
// ---------------------------------------------------------------------------

interface CacheEntry {
  body: string;
  expiresAt: number;
}

const resultCache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 120;

function cacheGet(key: string): string | null {
  const hit = resultCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    resultCache.delete(key);
    return null;
  }
  resultCache.delete(key);
  resultCache.set(key, hit);
  return hit.body;
}

function cacheSet(key: string, body: string): void {
  resultCache.set(key, { body, expiresAt: Date.now() + RESULT_CACHE_TTL_MS });
  while (resultCache.size > MAX_CACHE_ENTRIES) {
    const oldest = resultCache.keys().next().value;
    if (oldest === undefined) break;
    resultCache.delete(oldest);
  }
}

// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const type: MarketplaceItemType = params.get('type') === 'set' ? 'set' : 'minifig';
    const query = (params.get('q') || '').trim();

    const rawSort = params.get('sort');
    const sort: MarketplaceSort =
      rawSort === 'newest' || rawSort === 'name' ? rawSort : 'popular';

    const rawLimit = Number(params.get('limit'));
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

    const rawOffset = Number(params.get('offset'));
    const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? Math.floor(rawOffset) : 0;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      /**
       * Next stamps `Vary: rsc, next-router-state-tree, …` on every response,
       * and Cloudflare refuses to cache anything whose Vary lists more than
       * Accept-Encoding — the edge answers DYNAMIC even with a cache rule
       * matching the path. See app/api/search-all/route.ts for the full story.
       */
      Vary: 'Accept-Encoding',
    };

    const cacheKey = `${type}::${query.toLowerCase()}::${sort}::${limit}::${offset}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      return new NextResponse(cached, {
        status: 200,
        headers: { ...headers, 'X-Marketplace-Cache': 'HIT' },
      });
    }

    const cards = type === 'minifig' ? await collectMinifigs(query) : collectSets(query);

    // Only worth a database round trip when popularity actually orders the grid.
    if (sort === 'popular' && !query) {
      const ownerCounts = await getOwnerCounts(type);
      if (ownerCounts.size > 0) {
        for (const card of cards) card.ownerCount = ownerCounts.get(card.itemNo) || 0;
      }
    }

    const sorted = sortCards(cards, sort, Boolean(query));
    const page = sorted.slice(offset, offset + limit);

    // After slicing, so this is ~48 rows rather than 19,000.
    await attachPrices(page, type);

    const body = JSON.stringify({
      success: true,
      data: {
        items: page,
        total: sorted.length,
        offset,
        limit,
        hasMore: offset + page.length < sorted.length,
      },
    });

    cacheSet(cacheKey, body);

    return new NextResponse(body, {
      status: 200,
      headers: { ...headers, 'X-Marketplace-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('[marketplace] request failed:', error);
    return NextResponse.json({ success: false, error: 'Marketplace unavailable' }, { status: 500 });
  }
}
