import { NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';
import { prisma, prismaPublic } from '@/lib/prisma';

// POST - Smart refresh: only refreshes items with expired cache (7 day TTL)
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all items from the database for this user
    const items = await database.getAllItems(session.user.id);

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No items to refresh',
        refreshed: 0,
        skipped: 0,
        total: 0,
      });
    }

    console.log(`Checking ${items.length} items for stale cache...`);

    // Get user's preferred region and country code with safe fallbacks
    const region = session.user?.preferredRegion || 'north_america';
    const countryCode = session.user?.preferredCountryCode || 'US';

    // Check which items need refreshing (cache expired)
    const now = new Date();
    const itemsToRefresh = [];
    const itemsAlreadyFresh = [];

    for (const item of items) {
      // Check if price cache exists and is still valid for user's region
      const cache = await prisma.priceCache.findUnique({
        where: {
          item_no_item_type_condition_country_code_region: {
            item_no: item.minifigure_no,
            item_type: 'MINIFIG',
            condition: item.condition,
            country_code: countryCode,
            region: region
          }
        }
      });

      if (cache && cache.expires_at > now) {
        // Cache is still fresh (less than 7 days old)
        itemsAlreadyFresh.push(item);
        console.log(`✓ ${item.minifigure_no} cache still fresh (expires in ${Math.round((cache.expires_at.getTime() - now.getTime()) / (1000 * 60 * 60))}h)`);
      } else {
        // Cache expired or doesn't exist
        itemsToRefresh.push(item);
        console.log(`⟳ ${item.minifigure_no} cache expired, will refresh`);
      }
    }

    // If all items are fresh, return early
    if (itemsToRefresh.length === 0) {
      console.log(`All ${items.length} items already up to date!`);

      return NextResponse.json({
        success: true,
        message: `All prices are up to date (refreshed within last 7 days)`,
        refreshed: 0,
        skipped: items.length,
        total: items.length,
      });
    }

    // Safety limit: Prevent excessive API usage
    const MAX_BULK_REFRESH = 200;
    if (itemsToRefresh.length > MAX_BULK_REFRESH) {
      return NextResponse.json({
        success: false,
        error: `Cannot refresh more than ${MAX_BULK_REFRESH} items at once.`,
      }, { status: 400 });
    }

    console.log(`Refreshing ${itemsToRefresh.length} items with expired cache...`);

    const updatedItems = [];
    const errors = [];

    // Process items ONE AT A TIME with delays to avoid rate limiting
    for (let i = 0; i < itemsToRefresh.length; i++) {
      const item = itemsToRefresh[i];

      try {
        console.log(`[${i + 1}/${itemsToRefresh.length}] Refreshing ${item.minifigure_no} (${item.condition})...`);

        // Add delay BEFORE each request (except first)
        // 8-12 second delay between requests for API compliance
        if (i > 0) {
          const delay = 8000 + Math.random() * 4000;
          console.log(`Waiting ${Math.round(delay / 1000)}s before next request...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Fetch fresh pricing from Bricklink API with user's region (this updates cache with 24hr expiration)
        const pricing = await bricklinkAPI.calculatePricingData(
          item.minifigure_no,
          item.condition,
          countryCode,
          region
        );

        // Update the item with new pricing and timestamp
        const updatedItem = await database.updateItem(item.id, {
          pricing,
          last_updated: new Date().toISOString(),
        });

        if (updatedItem) {
          updatedItems.push(updatedItem);
          console.log(`✓ Updated ${item.minifigure_no}: $${pricing.suggestedPrice}`);
        }
      } catch (error) {
        console.error(`✗ Error refreshing ${item.minifigure_no}:`, error);
        errors.push({
          itemNo: item.minifigure_no,
          name: item.minifigure_name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`Refresh complete: ${updatedItems.length} refreshed, ${itemsAlreadyFresh.length} already fresh`);

    return NextResponse.json({
      success: true,
      message: `Refreshed ${updatedItems.length} of ${items.length} items (${itemsAlreadyFresh.length} already up to date)`,
      refreshed: updatedItems.length,
      skipped: itemsAlreadyFresh.length,
      total: items.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error refreshing collection pricing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh collection pricing',
      },
      { status: 500 }
    );
  }
}
