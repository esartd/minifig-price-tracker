import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

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

    const { id: itemId } = await params;

    // Get the item from database
    const item = await database.getPersonalItemById(itemId);

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
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
    return NextResponse.json({
      success: true,
      data: {
        ...item,
        pricing
      }
    });
  } catch (error: any) {
    console.error('Error refreshing pricing:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to refresh pricing' },
      { status: 500 }
    );
  }
}
