import { NextResponse } from 'next/server';
import { prisma, prismaPublic } from '@/lib/prisma';
import { bricklinkAPI } from '@/lib/bricklink';

export async function GET(request: Request) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow Vercel Cron requests (they send the CRON_SECRET) or requests from Vercel infrastructure
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting smart price refresh...');

    // Get all unique minifigs from users' collections
    const uniqueMinifigs = await prisma.collectionItem.findMany({
      select: {
        minifigure_no: true,
        condition: true,
      },
      distinct: ['minifigure_no', 'condition'],
    });

    console.log(`Found ${uniqueMinifigs.length} unique minifigs to check`);

    // Check each minifig's cache and determine if it needs refresh
    const refreshCandidates: Array<{
      minifigure_no: string;
      condition: string;
      priority: number;
      value: number;
      cacheAge: number;
    }> = [];

    const now = new Date();

    for (const item of uniqueMinifigs) {
      // Check cache for default region (US/north_america)
      const cache = await prismaPublic.priceCache.findUnique({
        where: {
          minifigure_no_condition_country_code_region: {
            minifigure_no: item.minifigure_no,
            condition: item.condition,
            country_code: 'US',
            region: 'north_america',
          },
        },
      });

      if (!cache) {
        // No cache exists - high priority
        refreshCandidates.push({
          minifigure_no: item.minifigure_no,
          condition: item.condition,
          priority: 1,
          value: 0,
          cacheAge: Infinity,
        });
        continue;
      }

      const cacheAgeMs = now.getTime() - cache.cached_at.getTime();
      const cacheAgeHours = cacheAgeMs / (1000 * 60 * 60);
      const value = cache.suggested_price;

      // BrickLink API Terms: Product information cannot be more than 6 hours old
      // All pricing must be refreshed every 6 hours to comply
      const MAX_CACHE_HOURS = 6;

      // Determine priority tier for refresh ordering (but all use 6-hour TTL)
      let tier: number;

      if (value >= 50) {
        // Tier 1: High value (>= $50) - refresh first
        tier = 1;
      } else if (value >= 10) {
        // Tier 2: Medium value ($10-$49) - refresh second
        tier = 2;
      } else {
        // Tier 3: Low value (< $10) - refresh last
        tier = 3;
      }

      // Check if cache has expired (6 hours for ALL items per BrickLink terms)
      if (cacheAgeHours >= MAX_CACHE_HOURS) {
        refreshCandidates.push({
          minifigure_no: item.minifigure_no,
          condition: item.condition,
          priority: tier,
          value: value,
          cacheAge: cacheAgeHours,
        });
      }
    }

    // Sort by priority (tier 1 first), then by value (highest first)
    refreshCandidates.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority; // Lower tier number = higher priority
      }
      return b.value - a.value; // Higher value first
    });

    console.log(`Found ${refreshCandidates.length} expired caches to refresh`);

    // Limit to 500 refreshes per day (safety buffer)
    const MAX_REFRESHES = 500;
    const toRefresh = refreshCandidates.slice(0, MAX_REFRESHES);

    console.log(`Refreshing top ${toRefresh.length} items...`);

    let refreshed = 0;
    let errors = 0;

    // Refresh prices with delays (3 seconds between calls - API requirement)
    for (let i = 0; i < toRefresh.length; i++) {
      const item = toRefresh[i];

      try {
        console.log(
          `[${i + 1}/${toRefresh.length}] Refreshing ${item.minifigure_no} (${item.condition}) - ` +
          `Tier ${item.priority}, Value: $${item.value.toFixed(2)}, Age: ${item.cacheAge.toFixed(1)} hours`
        );

        // This will fetch fresh data and update the cache for US region
        await bricklinkAPI.calculatePricingData(
          item.minifigure_no,
          item.condition as 'new' | 'used',
          'US',
          'north_america'
        );

        refreshed++;

        // BricklinkAPI class already enforces 3-second delays between requests
        // No need to add additional delays here

      } catch (error) {
        console.error(`Error refreshing ${item.minifigure_no}:`, error);
        errors++;
      }
    }

    const skipped = refreshCandidates.length - toRefresh.length;

    console.log(`Refresh complete: ${refreshed} refreshed, ${errors} errors, ${skipped} skipped (over limit)`);

    return NextResponse.json({
      success: true,
      message: 'Smart price refresh complete',
      stats: {
        totalMinifigs: uniqueMinifigs.length,
        expiredCaches: refreshCandidates.length,
        refreshed,
        errors,
        skipped,
        tierBreakdown: {
          tier1: refreshCandidates.filter(c => c.priority === 1).length,
          tier2: refreshCandidates.filter(c => c.priority === 2).length,
          tier3: refreshCandidates.filter(c => c.priority === 3).length,
        },
      },
    });
  } catch (error) {
    console.error('Smart price refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Smart price refresh failed' },
      { status: 500 }
    );
  }
}
