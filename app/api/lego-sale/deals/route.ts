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
 * - maxTier: optional upper bound, EXCLUSIVE. Without it a request for tier=20
 *   returns the highest-discount rows, which are all 30%+ -- so the page's
 *   "20-29%" band came back empty while 297 sets sat at 20% or better. The
 *   client asks for bands now (50+, 40-49, 30-39, 20-29) instead of asking for
 *   a floor four times and trying to subtract the overlaps afterwards.
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
    const maxTierRaw = searchParams.get('maxTier');
    const maxTier = maxTierRaw ? parseInt(maxTierRaw) : null;
    const theme = searchParams.get('theme');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const sortBy = searchParams.get('sortBy') || 'discount';
    const limit = parseInt(searchParams.get('limit') || '50');

    /**
     * Tiers are measured against OUR suggested price, not Walmart's claimed
     * discount.
     *
     * Walmart's `discountPercent` comes from OriginalPrice, a number the seller
     * types in. On a retired set they list at several times its value, mark it
     * "60% off", and it is still a bad buy -- of 281 rows on the old tiers, 71%
     * were priced ABOVE our own suggested price and 42% were more than 30%
     * above. The page was mostly recommending overpriced stock.
     *
     * It hid the real bargains too, because those often carry no Walmart
     * discount at all: 75013-1 at $49.95 against our $196.11 is 75% below what
     * the set is worth, and Walmart called it 0% off.
     *
     * `pctBelowOurPrice` is null where we have no price of our own. Such rows
     * are excluded rather than assumed good -- an unknown is not a deal.
     */
    const where: any = {
      pctBelowOurPrice: maxTier ? { gte: tier, lt: maxTier } : { gte: tier },
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
        pctBelowOurPrice: 'desc', // Biggest real saving first
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
          // What the page actually ranks and badges on.
          pctBelowOurPrice: deal.pctBelowOurPrice,
          ourPrice: deal.ourPrice,

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
    if (sortBy === 'discount') {
      // "Highest discount" now means furthest below our price.
      filteredDeals.sort((a, b) => (b!.pctBelowOurPrice ?? 0) - (a!.pctBelowOurPrice ?? 0));
    } else if (sortBy === 'price') {
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
