/**
 * Pricing Orchestrator
 *
 * Single entry point for all pricing. Computes a unified "FigTracker Market Price"
 * by blending BrickLink data (95%) and eBay listings (5%).
 *
 * Formula:
 *   BL_component  = (bl_sold_avg + bl_stock_avg + bl_lowest) / 3
 *   eBay_component = (ebay_avg + ebay_lowest) / 2
 *   suggested      = BL_component * 0.95 + eBay_component * 0.05
 *   current_avg    = bl_stock_avg * 0.95 + ebay_avg * 0.05
 *   lowest         = bl_lowest * 0.95 + ebay_lowest * 0.05
 *
 * When eBay has < 3 listings, BrickLink carries 100%.
 *
 * Cache TTL:
 *   Logged-in users  → 24 hours (fresher data)
 *   Logged-out users → 7 days (week-long cache, drastically reduces BL API calls)
 *
 * Result is stored with price_source='figtracker' — never labeled as BrickLink.
 */

import { PricingData } from '@/types';
import { bricklinkAPI } from './bricklink';
import { getEbayListingPrices } from './ebay-pricing';
import { prisma } from './prisma';
import type { BrickLinkCallLog } from './bricklink-call-logger';

const LOGGED_IN_TTL_HOURS = 24;
const LOGGED_OUT_TTL_HOURS = 7 * 24; // 7 days
const RESERVE_FOR_USERS = 200;

interface BlendInput {
  blSoldAvg: number;
  blStockAvg: number;
  blLowest: number;
  ebayAvg: number | null;
  ebayLowest: number | null;
}

function blendPrices(input: BlendInput): Pick<PricingData, 'currentAverage' | 'currentLowest' | 'suggestedPrice'> {
  const { blSoldAvg, blStockAvg, blLowest, ebayAvg, ebayLowest } = input;

  const hasEbay = ebayAvg !== null && ebayLowest !== null && ebayAvg > 0 && ebayLowest > 0;

  // Only average the BL values that actually exist (> 0).
  // Dividing by 3 when some values are 0 would drag the price way down for rare items.
  const blValues = [blSoldAvg, blStockAvg, blLowest].filter(v => v > 0);
  const blComponent = blValues.length > 0
    ? blValues.reduce((sum, v) => sum + v, 0) / blValues.length
    : 0;

  const ebayComponent = hasEbay ? ((ebayAvg! + ebayLowest!) / 2) : 0;
  const ebayWeight = hasEbay ? 0.05 : 0;
  const blWeight = 1 - ebayWeight;

  const suggested = parseFloat((blComponent * blWeight + ebayComponent * ebayWeight).toFixed(2));

  // For currentAverage: use blStockAvg if it exists, otherwise fall back to blComponent
  const blAvgForDisplay = blStockAvg > 0 ? blStockAvg : blComponent;
  const currentAverage = parseFloat((blAvgForDisplay * blWeight + (hasEbay ? ebayAvg! * ebayWeight : 0)).toFixed(2));

  // For currentLowest: use blLowest if it exists, otherwise fall back to blComponent
  const blLowestForDisplay = blLowest > 0 ? blLowest : blComponent;
  const currentLowest = parseFloat((blLowestForDisplay * blWeight + (hasEbay ? ebayLowest! * ebayWeight : 0)).toFixed(2));

  return { suggestedPrice: suggested, currentAverage, currentLowest };
}

class PricingOrchestrator {
  /**
   * Get unified market price for a minifig.
   *
   * @param cacheTtlHours - How old a cache entry can be before we re-fetch.
   *   Pass LOGGED_IN_TTL_HOURS (24) for logged-in users, LOGGED_OUT_TTL_HOURS (168) for anonymous.
   */
  async getMinifigPrice(
    itemNo: string,
    condition: 'new' | 'used',
    countryCode: string = 'US',
    region: string = 'north_america',
    userId?: string,
    callSource?: BrickLinkCallLog['source'],
    useBrickLinkBudgetReserve = false,
    itemName?: string,
    cacheTtlHours: number = LOGGED_IN_TTL_HOURS,
  ): Promise<PricingData | null> {
    const cached = await this.getFreshCache(itemNo, 'MINIFIG', condition, cacheTtlHours);
    if (cached) return cached;

    return this.computeAndCache(
      itemNo, 'MINIFIG', condition, countryCode, region,
      userId, callSource, useBrickLinkBudgetReserve, cacheTtlHours
    );
  }

  /**
   * Get unified market price for a set.
   */
  async getSetPrice(
    boxNo: string,
    condition: 'new' | 'used',
    countryCode: string = 'US',
    region: string = 'north_america',
    userId?: string,
    useBrickLinkBudgetReserve = false,
    itemName?: string,
    cacheTtlHours: number = LOGGED_IN_TTL_HOURS,
  ): Promise<PricingData | null> {
    const cached = await this.getFreshCache(boxNo, 'SET', condition, cacheTtlHours);
    if (cached) return cached;

    return this.computeAndCache(
      boxNo, 'SET', condition, countryCode, region,
      userId, undefined, useBrickLinkBudgetReserve, cacheTtlHours
    );
  }

  /**
   * Fetch BrickLink + eBay data, compute blended price, write to PriceCache.
   * If BrickLink budget is exhausted, tries to use last stale cache entry.
   */
  private async computeAndCache(
    itemNo: string,
    itemType: 'MINIFIG' | 'SET',
    condition: 'new' | 'used',
    countryCode: string,
    region: string,
    userId?: string,
    callSource?: BrickLinkCallLog['source'],
    useBrickLinkBudgetReserve = false,
    cacheTtlHours: number = LOGGED_IN_TTL_HOURS,
  ): Promise<PricingData | null> {
    const budget = await bricklinkAPI.getRemainingBudget();
    const threshold = useBrickLinkBudgetReserve ? RESERVE_FOR_USERS : 0;

    let blRaw: { sixMonthAverage: number; currentAverage: number; currentLowest: number } | null = null;
    let blLimitHit = false;

    if (budget.remaining > threshold) {
      try {
        const result = itemType === 'MINIFIG'
          ? await bricklinkAPI.calculatePricingData(itemNo, condition, countryCode, region, userId, callSource)
          : await bricklinkAPI.calculateSetPricing(itemNo, condition, countryCode, region, userId);

        if (result && result.suggestedPrice > 0) {
          blRaw = {
            sixMonthAverage: result.sixMonthAverage,
            currentAverage: result.currentAverage,
            currentLowest: result.currentLowest,
          };
        } else if (result) {
          // BrickLink returned data but all zeros — item genuinely has no listings
          blRaw = { sixMonthAverage: 0, currentAverage: 0, currentLowest: 0 };
        }
      } catch (err: any) {
        const isRateLimit = err?.message?.includes('daily limit') || err?.message?.includes('5,000');
        if (isRateLimit) blLimitHit = true;
        else console.error(`[Orchestrator] BrickLink error for ${itemNo}:`, err?.message);
        console.log(`[Orchestrator] BrickLink unavailable for ${itemNo}`);
      }
    } else {
      blLimitHit = true;
      console.log(`[Orchestrator] BrickLink budget low (${budget.remaining} remaining) — skipping fresh fetch for ${itemNo}`);
    }

    // If BrickLink unavailable, try stale cache first, then fall back to eBay-only
    if (!blRaw) {
      const stale = await this.getAnyCachedEntry(itemNo, itemType, condition);
      if (stale) {
        console.log(`[Orchestrator] Using stale cache for ${itemNo} (BL unavailable)`);
        return stale;
      }

      // No stale cache — try eBay alone (eBay component carries 100% weight)
      console.log(`[Orchestrator] No BL data or cache for ${itemNo} — trying eBay-only`);
      let ebayOnly = null;
      let ebayLimitHit = false;
      try {
        ebayOnly = await getEbayListingPrices(itemNo, itemType, condition);
      } catch (err: any) {
        if (err?.message?.includes('daily limit')) ebayLimitHit = true;
        console.log(`[Orchestrator] eBay unavailable for ${itemNo}: ${err?.message}`);
      }

      if (ebayOnly) {
        const suggested = parseFloat(((ebayOnly.avg + ebayOnly.lowest) / 2).toFixed(2));
        const now = new Date();
        const expiresAt = new Date(now.getTime() + cacheTtlHours * 60 * 60 * 1000);
        const result: PricingData = {
          sixMonthAverage: 0,
          currentAverage: ebayOnly.avg,
          currentLowest: ebayOnly.lowest,
          suggestedPrice: suggested,
          currencyCode: 'USD',
          cached_at: now.toISOString(),
          price_source: 'figtracker',
          confidence: 0.7,
        };
        try {
          await prisma.priceCache.upsert({
            where: {
              item_no_item_type_condition_country_code_region: {
                item_no: itemNo, item_type: itemType, condition, country_code: 'US', region: '',
              },
            },
            update: {
              six_month_avg: 0, current_avg: ebayOnly.avg, current_lowest: ebayOnly.lowest,
              suggested_price: suggested, cached_at: now, expires_at: expiresAt,
              currency_code: 'USD', price_source: 'figtracker', confidence: 0.7,
            },
            create: {
              item_no: itemNo, item_type: itemType, condition, country_code: 'US', region: '',
              currency_code: 'USD', six_month_avg: 0, current_avg: ebayOnly.avg,
              current_lowest: ebayOnly.lowest, suggested_price: suggested,
              expires_at: expiresAt, price_source: 'figtracker', confidence: 0.7,
            },
          });
        } catch (err: any) {
          if (err.code !== 'P2002') console.error(`[Orchestrator] Cache write error for ${itemNo}:`, err);
        }
        console.log(`[Orchestrator] ${itemNo} (eBay-only fallback): suggested=$${suggested}`);
        return result;
      }

      // Both sources exhausted or unavailable — tell the frontend why
      const bothLimited = blLimitHit && ebayLimitHit;
      console.log(`[Orchestrator] No data available for ${itemNo} (bothLimited=${bothLimited})`);
      return {
        sixMonthAverage: 0,
        currentAverage: 0,
        currentLowest: 0,
        suggestedPrice: 0,
        currencyCode: 'USD',
        unavailable_reason: bothLimited ? 'daily_limit' : 'no_listings',
      };
    }

    // Fetch eBay data (optional — null is fine, BL carries 100% in that case)
    const ebay = await getEbayListingPrices(itemNo, itemType, condition);

    const blended = blendPrices({
      blSoldAvg: blRaw.sixMonthAverage,
      blStockAvg: blRaw.currentAverage,
      blLowest: blRaw.currentLowest,
      ebayAvg: ebay?.avg ?? null,
      ebayLowest: ebay?.lowest ?? null,
    });

    const confidence = ebay ? 1.0 : 0.9;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + cacheTtlHours * 60 * 60 * 1000);

    try {
      await prisma.priceCache.upsert({
        where: {
          item_no_item_type_condition_country_code_region: {
            item_no: itemNo,
            item_type: itemType,
            condition,
            country_code: 'US',
            region: '',
          },
        },
        update: {
          six_month_avg: blRaw.sixMonthAverage,
          current_avg: blended.currentAverage,
          current_lowest: blended.currentLowest,
          suggested_price: blended.suggestedPrice,
          cached_at: now,
          expires_at: expiresAt,
          currency_code: 'USD',
          price_source: 'figtracker',
          confidence,
        },
        create: {
          item_no: itemNo,
          item_type: itemType,
          condition,
          country_code: 'US',
          region: '',
          currency_code: 'USD',
          six_month_avg: blRaw.sixMonthAverage,
          current_avg: blended.currentAverage,
          current_lowest: blended.currentLowest,
          suggested_price: blended.suggestedPrice,
          expires_at: expiresAt,
          price_source: 'figtracker',
          confidence,
        },
      });
    } catch (err: any) {
      if (err.code !== 'P2002') {
        console.error(`[Orchestrator] Cache write error for ${itemNo}:`, err);
      }
    }

    console.log(`[Orchestrator] ${itemNo} (${condition}): suggested=$${blended.suggestedPrice} (BL+eBay blend, confidence=${confidence})`);

    return {
      sixMonthAverage: blRaw.sixMonthAverage,
      currentAverage: blended.currentAverage,
      currentLowest: blended.currentLowest,
      suggestedPrice: blended.suggestedPrice,
      currencyCode: 'USD',
      cached_at: now.toISOString(),
      price_source: 'figtracker',
      confidence,
    };
  }

  /**
   * Refresh the BrickLink anchor in PriceHistory if it's older than 7 days.
   * Fire-and-forget — never awaited, never blocks the response to the user.
   * Respects budget: skips if BrickLink is nearly exhausted.
   */
  refreshAnchorIfStale(itemNo: string, itemType: 'MINIFIG' | 'SET', condition: 'new' | 'used'): void {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    (async () => {
      try {
        let lastRecorded: Date | null = null;
        if (itemType === 'MINIFIG') {
          const record = await prisma.priceHistory.findFirst({
            where: { minifigure_no: itemNo, condition },
            orderBy: { recorded_at: 'desc' },
            select: { recorded_at: true },
          });
          lastRecorded = record?.recorded_at ?? null;
        }

        const isStale = !lastRecorded || (Date.now() - lastRecorded.getTime() > SEVEN_DAYS_MS);
        if (!isStale) return;

        const budget = await bricklinkAPI.getRemainingBudget();
        if (budget.remaining < 10) {
          console.log(`[Orchestrator] Skipping anchor refresh for ${itemNo} — budget too low`);
          return;
        }

        console.log(`[Orchestrator] Refreshing stale BrickLink anchor for ${itemNo} in background`);
        if (itemType === 'MINIFIG') {
          await bricklinkAPI.calculatePricingData(itemNo, condition, 'US', '', undefined, 'background-job');
        } else {
          await bricklinkAPI.calculateSetPricing(itemNo, condition, 'US', '');
        }
        console.log(`[Orchestrator] Anchor refreshed for ${itemNo}`);
      } catch (err: any) {
        console.log(`[Orchestrator] Anchor refresh failed for ${itemNo}: ${err?.message}`);
      }
    })();
  }

  /**
   * Return a cache entry if it was written within cacheTtlHours.
   * Uses cached_at (write time) rather than expires_at so TTL is independent
   * of the BrickLink-imposed expires_at written by bricklink.ts.
   */
  private async getFreshCache(
    itemNo: string,
    itemType: 'MINIFIG' | 'SET',
    condition: string,
    cacheTtlHours: number,
  ): Promise<PricingData | null> {
    const cached = await prisma.priceCache.findUnique({
      where: {
        item_no_item_type_condition_country_code_region: {
          item_no: itemNo,
          item_type: itemType,
          condition,
          country_code: 'US',
          region: '',
        },
      },
    });

    if (!cached) return null;

    const ageMs = Date.now() - cached.cached_at.getTime();
    const ttlMs = cacheTtlHours * 60 * 60 * 1000;
    if (ageMs > ttlMs) return null;

    console.log(`[Orchestrator] Cache HIT for ${itemNo} (age ${(ageMs / 3600000).toFixed(1)}h / ttl ${cacheTtlHours}h): $${cached.suggested_price}`);

    return {
      sixMonthAverage: cached.six_month_avg,
      currentAverage: cached.current_avg,
      currentLowest: cached.current_lowest,
      suggestedPrice: cached.suggested_price,
      currencyCode: cached.currency_code,
      cached_at: cached.cached_at.toISOString(),
      price_source: (cached.price_source ?? 'figtracker') as PricingData['price_source'],
      confidence: cached.confidence ?? 1.0,
    };
  }

  /**
   * Return any cache entry regardless of age — used as last resort when
   * BrickLink budget is exhausted and there is no fresh data.
   */
  private async getAnyCachedEntry(
    itemNo: string,
    itemType: 'MINIFIG' | 'SET',
    condition: string,
  ): Promise<PricingData | null> {
    const cached = await prisma.priceCache.findUnique({
      where: {
        item_no_item_type_condition_country_code_region: {
          item_no: itemNo,
          item_type: itemType,
          condition,
          country_code: 'US',
          region: '',
        },
      },
    });

    if (!cached || cached.suggested_price === 0) return null;

    return {
      sixMonthAverage: cached.six_month_avg,
      currentAverage: cached.current_avg,
      currentLowest: cached.current_lowest,
      suggestedPrice: cached.suggested_price,
      currencyCode: cached.currency_code,
      cached_at: cached.cached_at.toISOString(),
      price_source: (cached.price_source ?? 'figtracker') as PricingData['price_source'],
      confidence: cached.confidence ?? 0.8,
    };
  }
}

export const pricingOrchestrator = new PricingOrchestrator();
export { LOGGED_IN_TTL_HOURS, LOGGED_OUT_TTL_HOURS };
