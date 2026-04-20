import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// GET all personal collection items for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's regional preferences
    const countryCode = session.user?.preferredCountryCode || 'US';
    const region = session.user?.preferredRegion || 'north_america';

    // Get items with regional pricing from cache
    let items = await database.getAllPersonalItems(session.user.id, countryCode, region);

    // Fetch pricing for items with no cache (WAIT for fresh data)
    const itemsNeedingPricing = items.filter(item => !item.pricing || item.pricing.suggestedPrice === 0);
    if (itemsNeedingPricing.length > 0) {
      console.log(`Fetching fresh pricing for ${itemsNeedingPricing.length} items...`);

      // Fetch pricing for all items needing it (calculatePricingData caches results)
      await Promise.all(
        itemsNeedingPricing.map(item =>
          bricklinkAPI.calculatePricingData(item.minifigure_no, item.condition, countryCode, region)
            .catch(err => {
              console.error(`Error fetching pricing for ${item.minifigure_no}:`, err);
              return null; // Continue with other items even if one fails
            })
        )
      );

      // Re-fetch items to get the newly cached pricing
      items = await database.getAllPersonalItems(session.user.id, countryCode, region);
      console.log(`Fresh pricing loaded for user's personal collection`);
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching personal collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch personal collection' },
      { status: 500 }
    );
  }
}

// POST a new item to the personal collection
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
    const {
      minifigure_no,
      minifigure_name,
      quantity,
      image_url,
      condition,
      notes,
      acquisition_date,
      acquisition_notes,
      display_location
    } = body;
    const itemCondition = (condition === 'used' ? 'used' : 'new') as 'new' | 'used';

    // Validate required fields
    if (!minifigure_no || !minifigure_name || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item already exists for this user with this condition
    const existingItem = await database.getPersonalItemByMinifigNumber(
      session.user.id,
      minifigure_no,
      itemCondition
    );
    if (existingItem) {
      return NextResponse.json(
        { success: false, error: `Item already exists in personal collection as ${itemCondition}` },
        { status: 409 }
      );
    }

    // Get user's regional preferences
    const countryCode = session.user.preferredCountryCode || 'US';
    const region = session.user.preferredRegion || 'north_america';

    // Get pricing data for the specified condition
    const pricing = await bricklinkAPI.calculatePricingData(minifigure_no, itemCondition, countryCode, region);

    // Add item to database
    const newItem = await database.addPersonalItem({
      userId: session.user.id,
      minifigure_no,
      minifigure_name,
      quantity,
      condition: itemCondition,
      image_url,
      pricing,
      notes,
      acquisition_date,
      acquisition_notes,
      display_location
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding item to personal collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to personal collection' },
      { status: 500 }
    );
  }
}
