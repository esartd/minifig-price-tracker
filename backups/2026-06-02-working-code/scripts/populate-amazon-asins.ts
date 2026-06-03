/**
 * Populate Amazon ASIN mappings for LEGO sets
 *
 * This script searches Amazon PA-API for LEGO sets and stores ASIN mappings
 * in the AmazonDeal table so that pricing can be displayed on the site.
 *
 * Strategy:
 * - Prioritize recent sets (last 2 years) that are more likely to be available
 * - Exclude promotional/polybag sets (unlikely to be on Amazon)
 * - Rate limit: 1 search per second (Amazon PA-API allows 1 req/sec for searches)
 * - Skip sets that already have ASIN mappings
 * - Store successful matches with initial pricing data
 *
 * Usage:
 *   npm run populate-asins              # Process 50 sets (default)
 *   npm run populate-asins -- --limit 100    # Process 100 sets
 *   npm run populate-asins -- --all          # Process all recent sets
 */

import { prisma } from '@/lib/prisma';
import { getRecentBoxes } from '@/lib/boxes-data';
import { searchAmazonForSet } from '@/lib/amazon-search';
import { fetchAmazonPrice } from '@/lib/amazon-pricing';
import { LegoBox } from '@/types';

const RATE_LIMIT_MS = 1100; // 1.1 seconds between API calls (safely under 1 req/sec)
const DEFAULT_LIMIT = 50;

interface Stats {
  processed: number;
  found: number;
  notFound: number;
  errors: number;
  skipped: number;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search Amazon for a LEGO set and store the result
 */
async function processSet(box: LegoBox, stats: Stats): Promise<void> {
  try {
    console.log(`\n[${stats.processed + 1}] Processing: ${box.box_no} - ${box.name}`);

    // Check if we already have this ASIN mapping
    const existing = await prisma.amazonDeal.findUnique({
      where: { boxNo: box.box_no }
    });

    if (existing) {
      console.log(`  ✓ Already exists (ASIN: ${existing.asin})`);
      stats.skipped++;
      return;
    }

    // Search Amazon for the set (returns ASIN string or null)
    console.log(`  🔍 Searching Amazon...`);
    const asin = await searchAmazonForSet(box.box_no, box.name);

    if (!asin) {
      console.log(`  ✗ Not found on Amazon`);
      stats.notFound++;
      return;
    }

    console.log(`  ✓ Found ASIN: ${asin}`);

    // Fetch pricing data for the ASIN
    console.log(`  💰 Fetching price data...`);
    await sleep(RATE_LIMIT_MS); // Rate limit between search and price fetch
    const priceData = await fetchAmazonPrice(asin);

    if (!priceData || !priceData.currentPrice) {
      console.log(`  ⚠ No pricing data available, storing ASIN only`);
      // Store the ASIN mapping even without pricing (we'll fetch it later)
      await prisma.amazonDeal.create({
        data: {
          boxNo: box.box_no,
          asin: asin,
          title: box.name,
          currentPrice: 0,
          listPrice: 0,
          discountPercent: 0,
          isPrime: false,
          isAvailable: false,
          currency: 'USD',
          productUrl: `https://www.amazon.com/dp/${asin}`,
          imageUrl: null,
          lastUpdated: new Date()
        }
      });
      stats.found++;
      return;
    }

    // Store complete data
    await prisma.amazonDeal.create({
      data: {
        boxNo: box.box_no,
        asin: priceData.asin,
        title: priceData.title || box.name,
        currentPrice: priceData.currentPrice,
        listPrice: priceData.listPrice || priceData.currentPrice,
        discountPercent: priceData.discountPercent || 0,
        isPrime: priceData.isPrime,
        isAvailable: priceData.isAvailable,
        currency: priceData.currency,
        productUrl: priceData.productUrl,
        imageUrl: priceData.imageUrl,
        lastUpdated: new Date()
      }
    });

    console.log(`  ✓ Saved: $${priceData.currentPrice} ${priceData.isPrime ? '(Prime)' : ''} ${priceData.discountPercent ? `(-${priceData.discountPercent}%)` : ''}`);
    stats.found++;

  } catch (error: any) {
    console.error(`  ❌ Error: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const allFlag = args.includes('--all');
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = allFlag ? undefined : (limitArg ? parseInt(limitArg.split('=')[1]) : DEFAULT_LIMIT);

  console.log('🚀 Amazon ASIN Population Script');
  console.log('================================\n');

  // Get recent LEGO sets (prioritize sets from last 2 years)
  console.log('📦 Loading LEGO sets catalog...');
  const boxes = getRecentBoxes({
    yearMin: new Date().getFullYear() - 2, // Last 2 years
    excludeAdvents: true,
    excludePromotional: true
  });

  console.log(`✓ Found ${boxes.length} recent sets (last 2 years, excluding promotional)`);

  const setsToProcess = limit ? boxes.slice(0, limit) : boxes;
  console.log(`📋 Will process: ${setsToProcess.length} sets\n`);

  const stats: Stats = {
    processed: 0,
    found: 0,
    notFound: 0,
    errors: 0,
    skipped: 0
  };

  const startTime = Date.now();

  // Process each set with rate limiting
  for (const box of setsToProcess) {
    await processSet(box, stats);
    stats.processed++;

    // Rate limit between sets
    if (stats.processed < setsToProcess.length) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  // Print summary
  console.log('\n\n================================');
  console.log('✅ COMPLETED');
  console.log('================================');
  console.log(`Processed:  ${stats.processed} sets`);
  console.log(`Found:      ${stats.found} ASINs`);
  console.log(`Not Found:  ${stats.notFound} sets`);
  console.log(`Skipped:    ${stats.skipped} (already exist)`);
  console.log(`Errors:     ${stats.errors}`);
  console.log(`Duration:   ${duration}s (${Math.round(stats.processed / duration * 60)} sets/min)`);
  console.log('\n💡 Tip: Run again to continue populating more sets');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
