import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET all set wishlist items for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await prisma.setWishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { date_added: 'desc' }
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching set wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch set wishlist' },
      { status: 500 }
    );
  }
}

// POST a new set to the wishlist
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
    const { box_no, set_name, image_url } = body;

    if (!box_no || !set_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if set already exists in wishlist
    const existingItem = await prisma.setWishlistItem.findUnique({
      where: {
        userId_box_no: {
          userId: session.user.id,
          box_no
        }
      }
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Set already in wishlist' },
        { status: 409 }
      );
    }

    const newItem = await prisma.setWishlistItem.create({
      data: {
        userId: session.user.id,
        box_no,
        set_name,
        image_url
      }
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding set to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add set to wishlist' },
      { status: 500 }
    );
  }
}
