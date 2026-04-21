import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';
import { getBoxByNumber } from '@/lib/boxes-data';
import { auth } from '@/auth';

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
    const countryCode = searchParams.get('countryCode') || 'US';
    const region = searchParams.get('region') || 'north_america';

    const items = await database.getAllSetInventoryItems(
      session.user.id,
      countryCode,
      region
    );

    return NextResponse.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching set inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch set inventory' },
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
    const { box_no, quantity, condition, countryCode = 'US', region = 'north_america' } = body;

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

    // Fetch pricing from BrickLink
    const pricing = await bricklinkAPI.calculateSetPricing(
      box_no,
      condition,
      countryCode,
      region
    );

    // Add to inventory
    const item = await database.addSetInventoryItem({
      userId: session.user.id,
      box_no: setData.box_no,
      set_name: setData.name,
      category_name: setData.category_name,
      quantity,
      condition,
      image_url: setData.image_url,
      pricing
    });

    return NextResponse.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error adding set to inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add set to inventory' },
      { status: 500 }
    );
  }
}
