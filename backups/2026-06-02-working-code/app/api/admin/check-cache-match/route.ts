import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get first 5 items from user's collection
    const userItems = await prisma.collectionItem.findMany({
      where: { userId: session.user.id },
      take: 5
    });

    const results = [];

    for (const item of userItems) {
      // Check if priceCache entry exists
      const cacheEntry = await prisma.priceCache.findFirst({
        where: {
          item_no: item.minifigure_no,
          item_type: 'MINIFIG',
          condition: item.condition,
          country_code: 'US',
          region: ''
        }
      });

      // Check all possible variations
      const allCacheForItem = await prisma.priceCache.findMany({
        where: {
          item_no: item.minifigure_no,
          item_type: 'MINIFIG'
        }
      });

      results.push({
        item_no: item.minifigure_no,
        condition: item.condition,
        expected_key: `${item.minifigure_no}-${item.condition}-US-`,
        cache_found_exact: !!cacheEntry,
        cache_entry_details: cacheEntry ? {
          cached_at: cacheEntry.cached_at,
          country_code: cacheEntry.country_code,
          region: cacheEntry.region,
          condition: cacheEntry.condition
        } : null,
        all_cache_variations: allCacheForItem.map((c: any) => ({
          condition: c.condition,
          country_code: c.country_code,
          region: c.region,
          key: `${c.item_no}-${c.condition}-${c.country_code}-${c.region}`
        }))
      });
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      user_id: session.user.id,
      results
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
