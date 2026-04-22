import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { auth } from '@/auth';

// POST move set from personal collection to inventory
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
    const body = await request.json();
    const { quantity } = body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Verify the item belongs to the authenticated user
    const item = await database.getSetPersonalCollectionItemById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Validate quantity doesn't exceed available
    if (quantity > item.quantity) {
      return NextResponse.json(
        { success: false, error: 'Cannot move more than available quantity' },
        { status: 400 }
      );
    }

    // Move to inventory
    const result = await database.moveSetToInventory(id, quantity);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error moving set to inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to move set to inventory' },
      { status: 500 }
    );
  }
}
