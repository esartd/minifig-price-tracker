import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { bricklinkAPI } from '@/lib/bricklink';

// GET all collection items
export async function GET() {
  try {
    const items = await database.getAllItems();
    return NextResponse.json({ success: true, data: items });
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
    const body = await request.json();
    const { minifigure_no, minifigure_name, quantity, condition, image_url } = body;

    // Validate required fields
    if (!minifigure_no || !minifigure_name || !quantity || !condition) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item already exists with the same condition
    const existingItem = await database.getItemByMinifigNumberAndCondition(
      minifigure_no,
      condition
    );
    if (existingItem) {
      return NextResponse.json(
        { success: false, error: `Item already exists in collection as ${condition}` },
        { status: 409 }
      );
    }

    // Get pricing data
    const pricing = await bricklinkAPI.calculatePricingData(minifigure_no, condition);

    // Add item to database
    const newItem = await database.addItem({
      minifigure_no,
      minifigure_name,
      quantity,
      condition,
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
