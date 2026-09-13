import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoxByNumber } from '@/lib/boxes-data';
import { generateAmazonLegoSetLink } from '@/lib/affiliate-links';
import { getCurrencyByCountryCode } from '@/lib/currency-config';
import { convertPrice } from '@/lib/currency-converter';
import { getLiveExchangeRates } from '@/lib/live-exchange-rates';
import { getVisitorCountry, countryHasWalmart } from '@/lib/visitor-country';

/**
 * What the home page shows at the foot, chosen by where the visitor is.
 *
 * The Walmart feed is the US affiliate catalogue and nothing else -- 3,833
 * rows, every one USD and every one pointing at walmart.com. Canada and Mexico
 * are separate Walmart businesses with separate programmes; the UK and Japan
 * operations were sold. So there is no non-US Walmart to send anyone to.
 *
 * Outside the US the same sets are shown against Amazon, whose Associates
 * OneLink redirects each visitor to their own storefront and swaps the tag.
 * Amazon carries no price -- PA-API retired in May 2026 -- so those cards lead
 * with OUR suggested price instead. A card with a real number on it is the
 * whole reason this section replaced the old bare "Shop on Amazon" buttons.
 *
 * COUNTRY, not language. A German speaker in Ohio can buy from Walmart; an
 * English speaker in Manchester cannot. Locale says nothing about which.
 *
 * Decided on the server on purpose. The country cannot be resolved in the
 * browser or stored in a cookie: cache-handler.js keeps rendered routes in
 * MySQL, so a response carrying one visitor's country can be served to the
 * next. This route is dynamic and therefore never cached.
 */

export const dynamic = 'force-dynamic';

const COUNT = 4;

export async function GET() {
  try {
    // Shared with /premium and /account so all three agree about this visitor.
    const country = await getVisitorCountry();
    const isUS = countryHasWalmart(country);

    /**
     * Our suggested price is computed and stored in USD. Quoting "$196" to a
     * British visitor is quoting a number they cannot act on, so outside the US
     * it is converted into the currency of wherever they are.
     *
     * Rates are fetched once here rather than per card, and getLiveExchangeRates
     * caches them for 24h; convertPrice falls back to a static table if the
     * provider is down, which is better than showing nothing.
     *
     * A country with no currency we support keeps USD -- an honest dollar
     * figure beats a wrong local one.
     */
    let currency = 'USD';
    let rates: Record<string, number> | undefined;
    if (!isUS) {
      const local = getCurrencyByCountryCode(country);
      if (local) {
        currency = local.code;
        try {
          rates = (await getLiveExchangeRates()).rates;
        } catch {
          // convertPrice falls back to its own static table.
        }
      }
    }
    const toLocal = (usd: number | null) =>
      usd == null ? null : currency === 'USD' ? usd : convertPrice(usd, currency, rates);

    /**
     * The same sets either way: rows that clear the /deals bar -- Walmart
     * flagging a real sale AND our own price agreeing it is below market.
     * They are the best-value sets we know of, which is worth showing whoever
     * is looking; only where to buy them changes.
     */
    const rows = await prisma.walmartDeal.findMany({
      where: {
        inStock: true,
        listPrice: { not: null },
        discountPercent: { gte: 20 },
        pctBelowOurPrice: { gt: 0 },
      },
      orderBy: { discountPercent: 'desc' },
      take: COUNT,
      select: {
        boxNo: true, walmartItemId: true, currentPrice: true, listPrice: true,
        discountPercent: true, pctBelowOurPrice: true, ourPrice: true,
        productUrl: true,
      },
    });

    const items = rows
      .map((r) => {
        const set = getBoxByNumber(r.boxNo);
        if (!set) return null;

        const common = {
          boxNo: r.boxNo,
          walmartItemId: r.walmartItemId,
          name: set.name,
          theme: (set.category_name || '').split(' / ')[0].trim(),
          imageUrl: set.image_url,
          ourPrice: toLocal(r.ourPrice),
          currency,
        };

        if (isUS) {
          return {
            ...common,
            currentPrice: r.currentPrice,
            listPrice: r.listPrice,
            discountPercent: r.discountPercent,
            pctBelowOurPrice: r.pctBelowOurPrice,
            // The Impact tracked URL verbatim -- it carries partner id 2875567
            // and rebuilding it by hand loses attribution.
            buyUrl: r.productUrl,
            retailer: 'walmart' as const,
          };
        }

        return {
          ...common,
          // No Walmart price outside the US: quoting one would be quoting a
          // shop the reader cannot buy from, in a currency they do not use.
          currentPrice: toLocal(r.ourPrice) ?? 0,
          listPrice: null,
          discountPercent: 0,
          pctBelowOurPrice: null,
          buyUrl: generateAmazonLegoSetLink(r.boxNo, set.name),
          retailer: 'amazon' as const,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      mode: isUS ? 'walmart' : 'amazon',
      country: country || 'unknown',
      currency,
      items,
    });
  } catch (error) {
    console.error('[home-deals] failed:', error);
    // The home page renders fine without this section. An empty list hides it.
    return NextResponse.json({ success: true, mode: 'walmart', items: [] });
  }
}
