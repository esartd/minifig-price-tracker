import { NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// POST - Refresh pricing for all collection items (one at a time with delays)
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
        data: [],
      });
    }

    // Safety limit: Prevent excessive API usage
    const MAX_BULK_REFRESH = 200;
    if (items.length > MAX_BULK_REFRESH) {
      return NextResponse.json({
        success: false,
        error: `Cannot refresh more than ${MAX_BULK_REFRESH} items at once. Please refresh individual items or contact support.`,
      }, { status: 400 });
    }

    console.log(`Starting refresh for ${items.length} items (one at a time)...`);

    const updatedItems = [];
    const errors = [];

    // Process items ONE AT A TIME with delays to avoid rate limiting
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      try {
        console.log(`[${i + 1}/${items.length}] Refreshing ${item.minifigure_no} (${item.condition})...`);

        // Add delay BEFORE each request (except first) to look more human-like
        // 8-12 second delay between requests to avoid detection
        if (i > 0) {
          const delay = 8000 + Math.random() * 4000; // Random 8-12 seconds
          console.log(`Waiting ${Math.round(delay / 1000)}s before next request...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Fetch fresh pricing from Bricklink API (cached 6 hours)
        const pricing = await bricklinkAPI.calculatePricingData(
          item.minifigure_no,
          item.condition
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

        // Keep original item in the list if refresh fails
        updatedItems.push(item);
      }
    }

    console.log(`Refresh complete: ${updatedItems.length - errors.length}/${items.length} successful`);

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed pricing for ${updatedItems.length - errors.length} of ${items.length} items`,
      data: updatedItems,
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
