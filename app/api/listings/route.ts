import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      collectionItemId,
      title,
      description,
      platform,
      condition_detail,
      accessories,
      known_flaws,
      quantity_to_list,
      list_price
    } = body;

    // Validate required fields
    if (!collectionItemId || !title || !description || !platform || !condition_detail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify item ownership
    const item = await prisma.collectionItem.findFirst({
      where: {
        id: collectionItemId,
        userId: user.id
      }
    });

    if (!item) {
      return NextResponse.json({ error: 'Collection item not found' }, { status: 404 });
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        collectionItemId,
        title,
        description,
        platform,
        condition_detail,
        accessories,
        known_flaws,
        quantity_to_list: quantity_to_list || 1,
        list_price: list_price || item.pricing_suggested_price,
        status: 'draft'
      }
    });

    return NextResponse.json({
      success: true,
      listing
    });

  } catch (error) {
    console.error('Save listing error:', error);
    return NextResponse.json(
      { error: 'Failed to save listing' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all listings for user
    const listings = await prisma.listing.findMany({
      where: { userId: user.id },
      include: {
        collectionItem: true
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      listings
    });

  } catch (error) {
    console.error('Fetch listings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
