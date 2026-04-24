import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';

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

    // Get the item
    const item = await database.getSetPersonalCollectionItemById(itemId);
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Get user's currency preferences
    const countryCode = session.user.preferredCountryCode || 'US';
    // Region is now standardized to empty string (we fetch all sellers and use currency conversion)
    const region = '';

    // Fetch fresh pricing
    const pricing = await bricklinkAPI.calculateSetPricing(
      item.box_no,
      item.condition,
      countryCode,
      region
    );

    // Update the item with new pricing
    const updated = await database.updateSetPersonalCollectionItem(itemId, { pricing });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error refreshing set collection pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh pricing' },
      { status: 500 }
    );
  }
}
