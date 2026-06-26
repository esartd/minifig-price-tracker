import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS } from '@/lib/pricing-orchestrator';
import { getBoxByNumber } from '@/lib/boxes-data';
import { auth } from '@/auth';
import { prismaPublic } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const fetchAll = searchParams.get('all') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const countryCode = searchParams.get('countryCode') || 'US';
    const region = searchParams.get('region') || 'north_america';

    const allItems = await database.getAllSetPersonalCollectionItems(
      session.user.id,
      countryCode,
      region
    );

    const totalItemsCount = allItems.length;
    const totalPages = Math.ceil(totalItemsCount / limit);

    // Calculate aggregate stats from all items
    const totalValue = allItems.reduce((sum, item) => sum + ((item.pricing?.suggestedPrice || 0) * item.quantity), 0);
    const totalQuantity = allItems.reduce((sum, item) => sum + item.quantity, 0);
    const avgValue = allItems.length > 0 ? (allItems.reduce((sum, item) => sum + (item.pricing?.suggestedPrice || 0), 0) / allItems.length) : 0;

    // Return all items if requested, otherwise slice for current page
    const items = fetchAll ? allItems : allItems.slice(offset, offset + limit);

    // Enrich with year_released from SetsCatalog for sorting
    const boxNos = items.map(item => item.box_no);
    const catalogData = await prismaPublic.setsCatalog.findMany({
      where: { box_no: { in: boxNos } },
      select: { box_no: true, year_released: true }
    });
    const yearMap = new Map(catalogData.map(c => [c.box_no, c.year_released]));
    const itemsWithYear = items.map(item => ({
      ...item,
      year_released: yearMap.get(item.box_no) || null
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
  } catch (error) {
    console.error('Error fetching set personal collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch set personal collection' },
      { status: 500 }
    );
  }
}

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
    const { box_no, quantity, condition, countryCode = 'US', region = 'north_america', notes, acquisition_date, acquisition_notes, display_location } = body;

    if (!box_no || !quantity || !condition) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get set details from catalog
    const setData = getBoxByNumber(box_no);

    if (!setData) {
      return NextResponse.json(
        { success: false, error: 'Set not found in catalog' },
        { status: 404 }
      );
    }

    // Add to personal collection immediately without waiting for pricing
    const item = await database.addSetPersonalCollectionItem({
      userId: session.user.id,
      box_no: setData.box_no,
      set_name: setData.name,
      category_name: setData.category_name,
      quantity,
      condition,
      image_url: setData.image_url,
      pricing: undefined, // No pricing yet - will be fetched in background
      notes,
      acquisition_date,
      acquisition_notes,
      display_location
    });

    // Warm the cache for this new item via orchestrator (respects rate limits and budget)
    pricingOrchestrator.getSetPrice(box_no, condition, countryCode, region, session.user.id, false, undefined, LOGGED_IN_TTL_HOURS)
      .catch(err => console.error(`Background pricing fetch error for ${box_no}:`, err));

    return NextResponse.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error adding set to personal collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add set to personal collection' },
      { status: 500 }
    );
  }
}
