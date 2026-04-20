import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find user by share token
    const user = await prisma.user.findUnique({
      where: { shareToken: token },
      select: {
        id: true,
        name: true,
        shareEnabled: true,
        preferredCurrency: true,
        CollectionItem: {
          select: {
            id: true,
            minifigure_no: true,
            minifigure_name: true,
            quantity: true,
            condition: true,
            image_url: true,
            pricing_six_month_avg: true,
            pricing_current_avg: true,
            pricing_current_lowest: true,
            pricing_suggested_price: true,
          },
          orderBy: { minifigure_name: 'asc' }
        },
        PersonalCollectionItem: {
          select: {
            id: true,
            minifigure_no: true,
            minifigure_name: true,
            quantity: true,
            condition: true,
            image_url: true,
            pricing_six_month_avg: true,
            pricing_current_avg: true,
            pricing_current_lowest: true,
            pricing_suggested_price: true,
          },
          orderBy: { minifigure_name: 'asc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid share link' },
        { status: 404 }
      );
    }

    if (!user.shareEnabled) {
      return NextResponse.json(
        { success: false, error: 'Sharing is disabled for this collection' },
        { status: 403 }
      );
    }

    // Format items with pricing
    const formatItems = (items: any[]) =>
      items.map(item => ({
        ...item,
        pricing: item.pricing_suggested_price
          ? {
              sixMonthAverage: item.pricing_six_month_avg,
              currentAverage: item.pricing_current_avg,
              currentLowest: item.pricing_current_lowest,
              suggestedPrice: item.pricing_suggested_price,
            }
          : null
      }));

    return NextResponse.json({
      success: true,
      data: {
        userName: user.name || 'Anonymous Collector',
        collectionItems: formatItems(user.PersonalCollectionItem),
        inventoryItems: formatItems(user.CollectionItem),
        currency: user.preferredCurrency || 'USD',
        showDecimals: false
      }
    });
  } catch (error) {
    console.error('Error loading shared collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load collection' },
      { status: 500 }
    );
  }
}
