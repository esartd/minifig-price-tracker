import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { database } from '@/lib/database';

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

    // Get user's currency for fresh pricing
    const countryCode = user.preferredCurrency === 'USD' ? 'US' : user.preferredCurrency === 'EUR' ? 'DE' : 'US';
    const cacheRegion = '';

    if (user.shareTokenInventory === token) {
      matchedType = 'inventory';
      shareEnabled = user.shareEnabledInventory;
      sharePricing = user.sharePricingInventory;
      // Use database helper to get fresh pricing from priceCache
      items = await database.getAllItems(user.id, countryCode, cacheRegion);
    } else if (user.shareTokenCollection === token) {
      matchedType = 'collection';
      shareEnabled = user.shareEnabledCollection;
      sharePricing = user.sharePricingCollection;
      // Use database helper to get fresh pricing from priceCache
      items = await database.getAllPersonalItems(user.id, countryCode, cacheRegion);
    } else if (user.shareTokenSetsInventory === token) {
      matchedType = 'sets-inventory';
      shareEnabled = user.shareEnabledSetsInventory;
      sharePricing = user.sharePricingSetsInventory;
      items = await database.getAllSetInventoryItems(user.id, countryCode, cacheRegion);
    } else if (user.shareTokenSetsCollection === token) {
      matchedType = 'sets-collection';
      shareEnabled = user.shareEnabledSetsCollection;
      sharePricing = user.sharePricingSetsCollection;
      items = await database.getAllSetPersonalCollectionItems(user.id, countryCode, cacheRegion);
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

    // Calculate total value using transformed pricing structure
    const totalValue = items.reduce((sum: number, item: any) => {
      const price = item.pricing?.suggestedPrice || 0;
      return sum + (price * item.quantity);
    }, 0);

    console.log(`[Share API] Collection type: ${type}`);
    console.log(`[Share API] Total items: ${items.length}`);
    console.log(`[Share API] Total value: $${totalValue}`);
    console.log(`[Share API] Sample item:`, items[0] ? {
      name: items[0].minifigure_name || items[0].set_name,
      quantity: items[0].quantity,
      price: items[0].pricing?.suggestedPrice
    } : 'no items');

    // Format items with pricing (only if pricing is enabled)
    const formatItems = (items: any[]) =>
      items.map((item: any) => ({
        ...item,
        pricing: sharePricing && item.pricing?.suggestedPrice
          ? item.pricing
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
