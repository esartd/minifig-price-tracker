import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';

// POST - Refresh pricing for a single collection item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the item from the database
    const item = await database.getItemById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    console.log(`Refreshing pricing for ${item.minifigure_no} (${item.condition})...`);

    // Fetch fresh pricing from Bricklink (uses Puppeteer scraper)
    const pricing = await bricklinkAPI.calculatePricingData(
      item.minifigure_no,
      item.condition
    );

    // Update the item with new pricing and timestamp
    const updatedItem = await database.updateItem(id, {
      pricing,
      last_updated: new Date().toISOString(),
    });

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Failed to update item' },
        { status: 500 }
      );
    }

    console.log(`✓ Updated ${item.minifigure_no}: $${pricing.suggestedPrice}`);

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed pricing for ${item.minifigure_name}`,
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error refreshing item pricing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh item pricing',
      },
      { status: 500 }
    );
  }
}
