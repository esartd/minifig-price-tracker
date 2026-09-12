import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoxByNumber } from '@/lib/boxes-data';

// Feature flag check
const ENABLED = process.env.ENABLE_LEGO_SALE === 'true';

/**
 * GET /api/lego-sale/deals
 *
 * Fetch Walmart deals with filtering and sorting.
 *
 * Was Amazon. Amazon retired PA-API 5.0 on 15 May 2026 and its successor needs
 * 10 qualifying sales per 30 days, so AmazonDeal has been frozen at five rows
 * since May and cannot be refreshed. Walmart comes through the Impact
 * affiliate catalog, which this account already has.
 *
 * Query parameters:
 * - tier: '20', '30', '40' (minimum discount percent)
 * - theme: Filter by theme name
 * - minPrice, maxPrice: Price range filter
 * - sortBy: 'discount' (default), 'price', 'name'
 * - limit: Results per page (default 50)
 */
export async function GET(request: NextRequest) {
  // Feature flag check
  if (!ENABLED) {
    return NextResponse.json({ error: 'LEGO Sale feature not enabled' }, { status: 403 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const tier = parseInt(searchParams.get('tier') || '20');
    const theme = searchParams.get('theme');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const sortBy = searchParams.get('sortBy') || 'discount';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {
      discountPercent: { gte: tier },
      currentPrice: {
        gte: minPrice,
        lte: maxPrice,
      },
      inStock: true,
    };

    // Fetch deals from database
    let deals = await prisma.walmartDeal.findMany({
      where,
      take: limit * 3, // Fetch more for theme filtering
      orderBy: {
        discountPercent: 'desc', // Always sort by discount first
      },
    });

    // Enrich with set data and apply theme filter
    const enrichedDeals = deals
      .map((deal) => {
        const setData = getBoxByNumber(deal.boxNo);
        if (!setData) return null;

        // Extract parent theme (before "/" if exists)
        const parentTheme = setData.category_name.split(' / ')[0].trim();

        return {
          boxNo: deal.boxNo,
          walmartItemId: deal.walmartItemId,
          name: setData.name,
          theme: parentTheme,
          fullTheme: setData.category_name,
          currentPrice: deal.currentPrice,
          // Null when Walmart is not discounting. The client must treat that
          // as "no badge" rather than rendering a 0% saving.
          listPrice: deal.listPrice,
          discountPercent: deal.discountPercent,

          imageUrl: setData.image_url,
          // The Impact tracked URL verbatim -- it already carries partner id
          // 2875567, and rebuilding it by hand loses attribution.
          buyUrl: deal.productUrl,
          yearReleased: setData.year_released,
          weight: setData.weight,
          lastUpdated: deal.lastUpdated,
        };
      })
      .filter((d) => d !== null);

    // Apply theme filter
    let filteredDeals = enrichedDeals;
    if (theme) {
      filteredDeals = enrichedDeals.filter(
        (d) => d!.theme.toLowerCase().includes(theme.toLowerCase()) ||
                d!.fullTheme.toLowerCase().includes(theme.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === 'price') {
      filteredDeals.sort((a, b) => a!.currentPrice - b!.currentPrice);
    } else if (sortBy === 'name') {
      filteredDeals.sort((a, b) => a!.name.localeCompare(b!.name));
    }
    // Default: already sorted by discount %

    // Limit results
    const limitedDeals = filteredDeals.slice(0, limit);

    return NextResponse.json({
      success: true,
      deals: limitedDeals,
      metadata: {
        total: limitedDeals.length,
        tier: tier.toString(),
        theme: theme || 'all',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Deals API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
