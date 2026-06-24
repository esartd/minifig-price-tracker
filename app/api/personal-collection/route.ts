import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS } from '@/lib/pricing-orchestrator';
import { auth } from '@/auth';
import { prismaPublic } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Use empty string for region in cache operations (standardized format)
    const cacheRegion = '';

    // Get all items first to calculate total
    const allItems = await database.getAllPersonalItems(session.user.id, countryCode, cacheRegion);
    const totalItemsCount = allItems.length;
    const totalPages = Math.ceil(totalItemsCount / limit);

    // Calculate aggregate stats from all items
    const totalValue = allItems.reduce((sum, item) => sum + ((item.pricing?.suggestedPrice || 0) * item.quantity), 0);
    const totalQuantity = allItems.reduce((sum, item) => sum + item.quantity, 0);
    const avgValue = allItems.length > 0 ? (allItems.reduce((sum, item) => sum + (item.pricing?.suggestedPrice || 0), 0) / allItems.length) : 0;

    // Return all items if requested, otherwise slice for current page
    const items = fetchAll ? allItems : allItems.slice(offset, offset + limit);

    // Enrich with year_released from MinifigCatalog for sorting
    const minifigNos = items.map(item => item.minifigure_no);
    const catalogData = await prismaPublic.minifigCatalog.findMany({
      where: { minifigure_no: { in: minifigNos } },
      select: { minifigure_no: true, year_released: true }
    });
    const yearMap = new Map(catalogData.map(c => [c.minifigure_no, c.year_released]));
    const itemsWithYear = items.map(item => ({
      ...item,
      year_released: yearMap.get(item.minifigure_no) || null
    }));

    return NextResponse.json({
      success: true,
      data: itemsWithYear,
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

    // Use empty string for region in cache operations (standardized format)
    const cacheRegion = '';

    // Add item to database immediately without waiting for pricing
    const newItem = await database.addPersonalItem({
      userId: session.user.id,
      minifigure_no,
      minifigure_name,
      quantity,
      condition: itemCondition,
      image_url,
      pricing: undefined, // No pricing yet - will be fetched in background
      notes,
      acquisition_date,
      acquisition_notes,
      display_location
    });

    // Warm the cache for this new item (respects rate limits and budget)
    pricingOrchestrator.getMinifigPrice(minifigure_no, itemCondition, countryCode, cacheRegion, session.user.id, 'api-endpoint', false, undefined, LOGGED_IN_TTL_HOURS)
      .catch(err => console.error(`Background pricing fetch error for ${minifigure_no}:`, err));

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding item to personal collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to personal collection' },
      { status: 500 }
    );
  }
}
