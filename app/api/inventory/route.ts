import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// GET all collection items for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await database.getAllItems(session.user.id);

    // Merge fresh pricing from PriceCache for each item
    const itemsWithFreshPricing = await Promise.all(
      items.map(async (item) => {
        const freshPricing = await bricklinkAPI.calculatePricingData(item.minifigure_no, item.condition);
        return {
          ...item,
          pricing: freshPricing
        };
      })
    );

    return NextResponse.json({ success: true, data: itemsWithFreshPricing });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}

// POST a new item to the collection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { minifigure_no, minifigure_name, quantity, image_url, condition } = body;
    const itemCondition = (condition === 'used' ? 'used' : 'new') as 'new' | 'used';

    // Validate required fields
    if (!minifigure_no || !minifigure_name || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item already exists for this user with this condition
    const existingItem = await database.getItemByMinifigNumberAndCondition(
      session.user.id,
      minifigure_no,
      itemCondition
    );
    if (existingItem) {
      return NextResponse.json(
        { success: false, error: `Item already exists in collection as ${itemCondition}` },
        { status: 409 }
      );
    }

    // Get pricing data for the specified condition
    const pricing = await bricklinkAPI.calculatePricingData(minifigure_no, itemCondition);

    // Add item to database
    const newItem = await database.addItem({
      userId: session.user.id,
      minifigure_no,
      minifigure_name,
      quantity,
      condition: itemCondition,
      image_url,
      pricing,
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding item to collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to collection' },
      { status: 500 }
    );
  }
}
