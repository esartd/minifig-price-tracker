import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bricklinkAPI } from '@/lib/bricklink';

/**
 * Cron job to pre-warm price cache for high-value items in collections
 *
 * Schedule: Every 6 hours (matches BrickLink cache requirement)
 * Purpose: Pre-cache high-value items for instant page loads
 *
 * STRATEGY:
 * - Focuses on top 300 highest-value items per run
 * - Other items refresh opportunistically when users view them
 * - Eliminates timeout issues by keeping runs short (~15 minutes)
 *
 * HOW IT WORKS:
 * 1. Find all unique (item_no, condition, currency) from all users' collections
 * 2. Check which need refresh (cache expired or missing)
 * 3. Sort by value (highest first)
 * 4. Fetch top 300 items from BrickLink API
 * 5. Save to priceCache (automatic via bricklinkAPI)
 *
 * RATE LIMITS:
 * - BrickLink: 5,000 calls/day
 * - Budget per 6-hour run: 300 calls
 * - 3-second delay between calls (safety + compliance)
 * - Total time: ~15 minutes per run
 */

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify cron secret (security)
    // Vercel crons don't send Authorization header - they're trusted by default
    // Only check secret if Authorization header is present (manual triggers)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting collection price refresh cron job...');

    // 1. Get all unique minifig items from all collections (4 tables)
    const [collectionItems, inventoryItems, setCollectionItems, setInventoryMinifigs] = await Promise.all([
      // Personal collection (minifigs)
      prisma.personalCollectionItem.findMany({
        select: {
          minifigure_no: true,
          condition: true,
          userId: true,
        }
      }),
      // Inventory (minifigs for sale)
      prisma.collectionItem.findMany({
        select: {
          minifigure_no: true,
          condition: true,
          userId: true,
        }
      }),
      // Set collection
      prisma.setPersonalCollectionItem.findMany({
        select: {
          box_no: true,
          condition: true,
          userId: true,
        }
      }),
      // Set inventory
      prisma.setInventoryItem.findMany({
        select: {
          box_no: true,
          condition: true,
          userId: true,
        }
      }),
    ]);

    // Get unique user IDs and their preferences
    const allUserIds = new Set<string>();
    [...collectionItems, ...inventoryItems, ...setCollectionItems, ...setInventoryMinifigs].forEach((item: any) => {
      allUserIds.add(item.userId);
    });

    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(allUserIds) }
      },
      select: {
        id: true,
        preferredCountryCode: true,
      }
    });

    const userCountryMap = new Map(users.map((u: any) => [u.id, u.preferredCountryCode || 'US']));

    // 2. Build unique list of items to refresh
    interface ItemToRefresh {
      itemNo: string;
      itemType: 'MINIFIG' | 'SET';
      condition: 'new' | 'used';
      countryCode: string;
    }

    const uniqueItems = new Map<string, ItemToRefresh>();

    // Add minifigs from personal collection
    collectionItems.forEach((item: any) => {
      const countryCode = (userCountryMap.get(item.userId) || 'US') as string;
      const key = `${item.minifigure_no}-MINIFIG-${item.condition}-${countryCode}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, {
          itemNo: item.minifigure_no,
          itemType: 'MINIFIG',
          condition: item.condition as 'new' | 'used',
          countryCode: countryCode,
        });
      }
    });

    // Add minifigs from inventory
    inventoryItems.forEach((item: any) => {
      const countryCode = (userCountryMap.get(item.userId) || 'US') as string;
      const key = `${item.minifigure_no}-MINIFIG-${item.condition}-${countryCode}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, {
          itemNo: item.minifigure_no,
          itemType: 'MINIFIG',
          condition: item.condition as 'new' | 'used',
          countryCode: countryCode,
        });
      }
    });

    // Add sets from collection
    setCollectionItems.forEach((item: any) => {
      const countryCode = (userCountryMap.get(item.userId) || 'US') as string;
      const key = `${item.box_no}-SET-${item.condition}-${countryCode}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, {
          itemNo: item.box_no,
          itemType: 'SET',
          condition: item.condition as 'new' | 'used',
          countryCode: countryCode,
        });
      }
    });

    // Add sets from inventory
    setInventoryMinifigs.forEach((item: any) => {
      const countryCode = (userCountryMap.get(item.userId) || 'US') as string;
      const key = `${item.box_no}-SET-${item.condition}-${countryCode}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, {
          itemNo: item.box_no,
          itemType: 'SET',
          condition: item.condition as 'new' | 'used',
          countryCode: countryCode,
        });
      }
    });

    const itemsToRefresh = Array.from(uniqueItems.values());

    console.log(`📊 Found ${itemsToRefresh.length} unique items across all collections`);

    // 3. Check which items need refresh (cache expired or missing)
    const now = new Date();
    const cacheChecks = await Promise.all(
      itemsToRefresh.map(async item => {
        const cached = await prisma.priceCache.findUnique({
          where: {
            item_no_item_type_condition_country_code_region: {
              item_no: item.itemNo,
              item_type: item.itemType,
              condition: item.condition,
              country_code: item.countryCode,
              region: '', // Standardized empty string
            }
          }
        });

        const needsRefresh = !cached || cached.expires_at <= now;
        return { item, needsRefresh };
      })
    );

    const itemsNeedingRefresh = cacheChecks
      .filter(check => check.needsRefresh)
      .map(check => check.item);

    console.log(`🔄 ${itemsNeedingRefresh.length} items need refresh (expired or missing)`);

    if (itemsNeedingRefresh.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All prices are fresh, no refresh needed',
        stats: {
          totalItems: itemsToRefresh.length,
          refreshed: 0,
          duration: Date.now() - startTime,
        }
      });
    }

    // 4. Safety check: Don't exceed rate limits
    // Since users' collections will refresh opportunistically when they view them,
    // we only need to pre-warm the most important items here.
    // Prioritize high-value items to maximize cache hit rate.
    const itemsWithValue = await Promise.all(
      itemsNeedingRefresh.map(async item => {
        const cached = await prisma.priceCache.findUnique({
          where: {
            item_no_item_type_condition_country_code_region: {
              item_no: item.itemNo,
              item_type: item.itemType,
              condition: item.condition,
              country_code: item.countryCode,
              region: '',
            }
          }
        });
        return {
          ...item,
          value: cached?.suggested_price || 0
        };
      })
    );

    // Sort by value descending (high-value items first)
    itemsWithValue.sort((a, b) => b.value - a.value);

    const MAX_CALLS_PER_RUN = 300; // Reduced: focus on top items only
    const itemsToProcess = itemsWithValue.slice(0, MAX_CALLS_PER_RUN);

    if (itemsNeedingRefresh.length > MAX_CALLS_PER_RUN) {
      console.log(`⚠️  Limiting to ${MAX_CALLS_PER_RUN} high-value items (${itemsNeedingRefresh.length - MAX_CALLS_PER_RUN} will refresh when viewed)`);
    }

    // 5. Fetch prices with rate limiting
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];

      try {
        console.log(`[${i + 1}/${itemsToProcess.length}] Fetching ${item.itemNo} (${item.condition})...`);

        // Use existing API method - automatically caches
        await bricklinkAPI.calculatePricingData(
          item.itemNo,
          item.condition,
          item.countryCode,
          '' // cacheRegion
        );

        successCount++;

        // Progress log every 50 items
        if ((i + 1) % 50 === 0) {
          console.log(`✅ Progress: ${i + 1}/${itemsToProcess.length} (${successCount} success, ${errorCount} errors)`);
        }

      } catch (error: any) {
        errorCount++;
        const errorMsg = `${item.itemNo}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`❌ Error: ${errorMsg}`);
      }

      // Rate limiting: 3-second delay between calls (BrickLink compliance)
      if (i < itemsToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    const duration = Date.now() - startTime;
    const durationMinutes = Math.round(duration / 60000);

    console.log(`✅ Cron job complete in ${durationMinutes} minutes`);
    console.log(`   Success: ${successCount} | Errors: ${errorCount}`);

    return NextResponse.json({
      success: true,
      message: 'Price refresh complete',
      stats: {
        totalItems: itemsToRefresh.length,
        needingRefresh: itemsNeedingRefresh.length,
        processed: itemsToProcess.length,
        successCount,
        errorCount,
        duration,
        durationMinutes,
      },
      errors: errors.slice(0, 10), // First 10 errors only
    });

  } catch (error: any) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to refresh prices',
        message: error.message,
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}
