import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all alerts for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const alerts = await prisma.priceAlert.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { active: 'desc' },
        { created_at: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST - Create new price alert
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
    const { item_no, item_type, item_name, condition, target_price, currency_code } = body;

    // Validate required fields
    if (!item_no || !item_type || !item_name || !condition || !target_price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate item_type
    if (item_type !== 'MINIFIG' && item_type !== 'SET') {
      return NextResponse.json(
        { success: false, error: 'Invalid item_type. Must be MINIFIG or SET' },
        { status: 400 }
      );
    }

    // Validate condition
    if (condition !== 'new' && condition !== 'used') {
      return NextResponse.json(
        { success: false, error: 'Invalid condition. Must be new or used' },
        { status: 400 }
      );
    }

    // Validate target_price
    if (typeof target_price !== 'number' || target_price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid target_price. Must be a positive number' },
        { status: 400 }
      );
    }

    // Create or update alert
    const alert = await prisma.priceAlert.upsert({
      where: {
        userId_item_no_item_type_condition: {
          userId: session.user.id,
          item_no,
          item_type,
          condition,
        },
      },
      update: {
        target_price,
        currency_code: currency_code || 'USD',
        active: true,
        triggered_at: null, // Reset triggered status if updating
      },
      create: {
        userId: session.user.id,
        item_no,
        item_type,
        item_name,
        condition,
        target_price,
        currency_code: currency_code || 'USD',
      },
    });

    return NextResponse.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

// DELETE - Delete alert by ID
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // Verify alert belongs to user before deleting
    const alert = await prisma.priceAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    if (alert.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.priceAlert.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}

// PATCH - Toggle alert active status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, active } = body;

    if (!id || typeof active !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Alert ID and active status are required' },
        { status: 400 }
      );
    }

    // Verify alert belongs to user
    const alert = await prisma.priceAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    if (alert.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update alert
    const updatedAlert = await prisma.priceAlert.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json({
      success: true,
      data: updatedAlert,
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
