import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// POST - Refresh pricing for a single collection item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get the item from the database
    const item = await database.getItemById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Verify the item belongs to the authenticated user
    if (item.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get user's regional preferences
    const countryCode = session.user?.preferredCountryCode || 'US';
    const cacheRegion = ''; // Standardized region format

    console.log(`Refreshing pricing for ${item.minifigure_no} (${item.condition}) in ${countryCode}`);

    // Fetch fresh pricing
    const pricing = await bricklinkAPI.calculatePricingData(
      item.minifigure_no,
      item.condition,
      countryCode,
      cacheRegion
    );

    console.log(`Got pricing for ${item.minifigure_no}: $${pricing.suggestedPrice}`);

    // Return the item with updated pricing (don't update DB, pricing is cached separately)
    // Omit userId to match CollectionItem type expected by frontend
    const { userId, ...itemWithoutUserId } = item;
    return NextResponse.json({
      success: true,
      data: {
        ...itemWithoutUserId,
        pricing
      }
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
