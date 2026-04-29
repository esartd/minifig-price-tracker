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
        sharePricingInventory: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        sharePricingCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        sharePricingSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
        sharePricingSetsCollection: true,
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

    // Check which token matched and if it corresponds to the requested type
    let shareEnabled = false;
    let sharePricing = false;
    let items: any[] = [];
    let matchedType: CollectionType | null = null;

    if (user.shareTokenInventory === token) {
      matchedType = 'inventory';
      shareEnabled = user.shareEnabledInventory;
      sharePricing = user.sharePricingInventory;
      items = user.CollectionItem;
    } else if (user.shareTokenCollection === token) {
      matchedType = 'collection';
      shareEnabled = user.shareEnabledCollection;
      sharePricing = user.sharePricingCollection;
      items = user.PersonalCollectionItem;
    } else if (user.shareTokenSetsInventory === token) {
      matchedType = 'sets-inventory';
      shareEnabled = user.shareEnabledSetsInventory;
      sharePricing = user.sharePricingSetsInventory;
      items = user.SetInventoryItem;
    } else if (user.shareTokenSetsCollection === token) {
      matchedType = 'sets-collection';
      shareEnabled = user.shareEnabledSetsCollection;
      sharePricing = user.sharePricingSetsCollection;
      items = user.SetPersonalCollectionItem;
    }

    // Verify the token matches the requested type
    if (matchedType !== type) {
      return NextResponse.json(
        { success: false, error: 'Invalid share link for this collection type' },
        { status: 403 }
      );
    }

    if (!shareEnabled) {
      return NextResponse.json(
        { success: false, error: 'Sharing is disabled for this collection' },
        { status: 403 }
      );
    }

    // Calculate total value BEFORE formatting (using raw database values)
    const totalValue = items.reduce((sum: number, item: any) => {
      const price = item.pricing_suggested_price || 0;
      return sum + (price * item.quantity);
    }, 0);

    // Format items with pricing (only if pricing is enabled)
    const formatItems = (items: any[]) =>
      items.map((item: any) => ({
        ...item,
        pricing: sharePricing && item.pricing_suggested_price
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
        showDecimals: false,
        showPricing: sharePricing,
        totalValue: sharePricing ? totalValue : 0
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
