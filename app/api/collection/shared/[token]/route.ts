import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const url = new URL(request.url);
    const type = (url.searchParams.get('type') || 'inventory') as CollectionType;

    // Find user by checking all share tokens
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { shareTokenInventory: token },
          { shareTokenCollection: token },
          { shareTokenSetsInventory: token },
          { shareTokenSetsCollection: token }
        ]
      },
      select: {
        id: true,
        name: true,
        preferredCurrency: true,
        shareTokenInventory: true,
        shareEnabledInventory: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
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
        },
        SetInventoryItem: {
          select: {
            id: true,
            box_no: true,
            set_name: true,
            category_name: true,
            quantity: true,
            condition: true,
            image_url: true,
            pricing_six_month_avg: true,
            pricing_current_avg: true,
            pricing_current_lowest: true,
            pricing_suggested_price: true,
          },
          orderBy: { set_name: 'asc' }
        },
        SetPersonalCollectionItem: {
          select: {
            id: true,
            box_no: true,
            set_name: true,
            category_name: true,
            quantity: true,
            condition: true,
            image_url: true,
            pricing_six_month_avg: true,
            pricing_current_avg: true,
            pricing_current_lowest: true,
            pricing_suggested_price: true,
          },
          orderBy: { set_name: 'asc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid share link' },
        { status: 404 }
      );
    }

    // Check which token matched and if sharing is enabled
    let shareEnabled = false;
    let items: any[] = [];

    if (user.shareTokenInventory === token) {
      shareEnabled = user.shareEnabledInventory;
      items = user.CollectionItem;
    } else if (user.shareTokenCollection === token) {
      shareEnabled = user.shareEnabledCollection;
      items = user.PersonalCollectionItem;
    } else if (user.shareTokenSetsInventory === token) {
      shareEnabled = user.shareEnabledSetsInventory;
      items = user.SetInventoryItem;
    } else if (user.shareTokenSetsCollection === token) {
      shareEnabled = user.shareEnabledSetsCollection;
      items = user.SetPersonalCollectionItem;
    }

    if (!shareEnabled) {
      return NextResponse.json(
        { success: false, error: 'Sharing is disabled for this collection' },
        { status: 403 }
      );
    }

    // Format items with pricing
    const formatItems = (items: any[]) =>
      items.map((item: any) => ({
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
        items: formatItems(items),
        type,
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
