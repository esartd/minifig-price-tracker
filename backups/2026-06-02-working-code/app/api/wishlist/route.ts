import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET all wishlist items for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { date_added: 'desc' }
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST a new item to the wishlist
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
    const { minifigure_no, minifigure_name, image_url } = body;

    if (!minifigure_no || !minifigure_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_minifigure_no: {
          userId: session.user.id,
          minifigure_no
        }
      }
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item already in wishlist' },
        { status: 409 }
      );
    }

    const newItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        minifigure_no,
        minifigure_name,
        image_url
      }
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
