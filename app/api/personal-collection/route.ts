import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// GET all personal collection items for authenticated user (with pagination)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const fetchAll = searchParams.get('all') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Get user's regional preferences
    const countryCode = session.user?.preferredCountryCode || 'US';
    const region = session.user?.preferredRegion || 'north_america';

    // Get all items first to calculate total
    const allItems = await database.getAllPersonalItems(session.user.id, countryCode, region);
    const totalItemsCount = allItems.length;
    const totalPages = Math.ceil(totalItemsCount / limit);

    // Calculate aggregate stats from all items
    const totalValue = allItems.reduce((sum, item) => sum + ((item.pricing?.suggestedPrice || 0) * item.quantity), 0);
    const totalQuantity = allItems.reduce((sum, item) => sum + item.quantity, 0);
    const avgValue = allItems.length > 0 ? (allItems.reduce((sum, item) => sum + (item.pricing?.suggestedPrice || 0), 0) / allItems.length) : 0;

    // Return all items if requested, otherwise slice for current page
    const items = fetchAll ? allItems : allItems.slice(offset, offset + limit);

    // Start background pricing fetch for items with no cache (don't await - progressive loading)
    const itemsNeedingPricing = items.filter(item => !item.pricing || item.pricing.suggestedPrice === 0);
    if (itemsNeedingPricing.length > 0) {
      // Fetch pricing in background - prices will appear progressively as they're cached
      Promise.all(
        itemsNeedingPricing.map(item =>
          bricklinkAPI.calculatePricingData(item.minifigure_no, item.condition, countryCode, region)
            .catch(err => {
              console.error(`Pricing fetch error for ${item.minifigure_no}:`, err);
              return null; // Continue even if one fails
            })
        )
      ).catch(err => console.error('Background pricing fetch error:', err));
    }

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: totalItemsCount,
        totalPages
      },
      stats: {
        totalValue,
        totalQuantity,
        avgValue
      }
    });
  } catch (error: any) {
    console.error('Error fetching personal collection:', error);

    // Check if it's a database connection limit error
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('max_connections_per_hour')) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

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
      const updatedItem = await database.updatePersonalItem(existingItem.id, {
        quantity: existingItem.quantity + quantity
      });
      return NextResponse.json({ success: true, data: updatedItem, quantityAdded: quantity }, { status: 200 });
    }

    // Get user's regional preferences
    const countryCode = session.user?.preferredCountryCode || 'US';
    const region = session.user?.preferredRegion || 'north_america';

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
