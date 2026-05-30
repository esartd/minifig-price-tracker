/**
 * On-demand Amazon Deals Refresh
 *
 * Alternative to cron-based refresh. This can be triggered:
 * 1. When admin visits /lego-sale page (if data is stale)
 * 2. Manually via API endpoint
 * 3. Background task that runs incrementally
 *
 * Approach: Process small batches (10-20 sets) on each page load
 * if data is older than 6 hours. Spreads API load across user visits.
 */

import { prisma } from '@/lib/prisma';
import { getRecentBoxes } from '@/lib/boxes-data';
import { searchAmazonForSet } from '@/lib/amazon-search';
import { fetchAmazonPrice } from '@/lib/amazon-pricing';

const STALE_THRESHOLD_HOURS = 6;
const BATCH_SIZE = 10; // Process 10 sets per trigger

/**
 * Check if deals data is stale (older than 6 hours)
 */
export async function isDealsDataStale(): Promise<boolean> {
  const latestDeal = await prisma.amazonDeal.findFirst({
    orderBy: { lastUpdated: 'desc' },
    select: { lastUpdated: true },
  });

  if (!latestDeal) return true; // No deals exist, definitely stale

  const hoursSinceUpdate =
    (Date.now() - latestDeal.lastUpdated.getTime()) / (1000 * 60 * 60);

  return hoursSinceUpdate > STALE_THRESHOLD_HOURS;
}

/**
 * Refresh a small batch of Amazon deals
 * Returns immediately after processing BATCH_SIZE sets
 *
 * Can be called repeatedly to process all sets incrementally
 */
export async function refreshDealsBatch(): Promise<{
  processed: number;
  dealsFound: number;
  dealsRemoved: number;
  errors: number;
  hasMore: boolean;
}> {
  const recentSets = getRecentBoxes({ yearMin: new Date().getFullYear() - 3 });

  // Get sets that haven't been checked recently (or never checked)
  const existingDeals = await prisma.amazonDeal.findMany({
    select: { boxNo: true, lastUpdated: true },
  });

  const dealMap = new Map(existingDeals.map((d) => [d.boxNo, d.lastUpdated]));

  // Find sets that need checking (no deal OR deal older than 6 hours)
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const setsToCheck = recentSets.filter((set) => {
    const lastUpdated = dealMap.get(set.box_no);
    return !lastUpdated || lastUpdated < sixHoursAgo;
  });

  // Process only BATCH_SIZE sets
  const batch = setsToCheck.slice(0, BATCH_SIZE);
  const hasMore = setsToCheck.length > BATCH_SIZE;

  let processed = 0;
  let dealsFound = 0;
  let dealsRemoved = 0;
  let errors = 0;

  for (const set of batch) {
    try {
      const asin = await searchAmazonForSet(set.box_no, set.name);

      if (!asin) {
        processed++;
        continue;
      }

      const pricing = await fetchAmazonPrice(asin);

      if (!pricing) {
        processed++;
        continue;
      }

      // Check if deal qualifies (20%+ discount)
      if (pricing.discountPercent && pricing.discountPercent >= 20) {
        await prisma.amazonDeal.upsert({
          where: { boxNo: set.box_no },
          update: {
            asin: pricing.asin,
            title: pricing.title || set.name,
            currentPrice: pricing.currentPrice || 0,
            listPrice: pricing.listPrice || 0,
            discountPercent: pricing.discountPercent,
            isPrime: pricing.isPrime,
            isAvailable: pricing.isAvailable,
            currency: pricing.currency,
            productUrl: pricing.productUrl,
            imageUrl: pricing.imageUrl,
            lastUpdated: new Date(),
          },
          create: {
            boxNo: set.box_no,
            asin: pricing.asin,
            title: pricing.title || set.name,
            currentPrice: pricing.currentPrice || 0,
            listPrice: pricing.listPrice || 0,
            discountPercent: pricing.discountPercent,
            isPrime: pricing.isPrime,
            isAvailable: pricing.isAvailable,
            currency: pricing.currency,
            productUrl: pricing.productUrl,
            imageUrl: pricing.imageUrl,
          },
        });

        dealsFound++;
      } else {
        const deleted = await prisma.amazonDeal.deleteMany({
          where: { boxNo: set.box_no },
        });

        if (deleted.count > 0) {
          dealsRemoved++;
        }
      }

      processed++;

      // Rate limit: 1 request/second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error(`[Amazon Deals] Error processing ${set.box_no}:`, error.message);
      errors++;
    }
  }

  return {
    processed,
    dealsFound,
    dealsRemoved,
    errors,
    hasMore,
  };
}

/**
 * Trigger refresh if data is stale
 * Non-blocking - runs in background
 */
export async function triggerRefreshIfStale(): Promise<void> {
  const isStale = await isDealsDataStale();

  if (!isStale) {
    console.log('[Amazon Deals] Data is fresh, skipping refresh');
    return;
  }

  console.log('[Amazon Deals] Data is stale, triggering background refresh');

  // Trigger background refresh (don't await)
  refreshDealsBatch()
    .then((result) => {
      console.log('[Amazon Deals] Background refresh completed:', result);
    })
    .catch((error) => {
      console.error('[Amazon Deals] Background refresh failed:', error);
    });
}
