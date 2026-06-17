/**
 * Pricing Orchestrator
 *
 * Single entry point for all pricing requests. Handles fallback automatically:
 *   1. Fresh PriceCache hit (any source, < 6 hours) → return immediately
 *   2. BrickLink API (primary, if budget available)
 *   3. eBay Browse API (fallback when BrickLink is exhausted)
 *   4. No data → return null
 *
 * All callers (refresh-pricing routes, cron, detail pages) should use this
 * instead of calling bricklinkAPI directly.
 */

import { PricingData } from '@/types';
import { bricklinkAPI } from './bricklink';
import { fetchEbayPricing } from './ebay-pricing';
import { prisma } from './prisma';
import type { BrickLinkCallLog } from './bricklink-call-logger';

// Reserve this many BrickLink calls for on-demand user traffic.
// The cron job switches to eBay when remaining calls drop below this threshold.
const RESERVE_FOR_USERS = 200;

class PricingOrchestrator {
  /**
   * Get pricing for a minifig. Falls back to eBay when BrickLink budget is low.
   */
  async getMinifigPrice(
    itemNo: string,
    condition: 'new' | 'used',
    countryCode: string = 'US',
    region: string = 'north_america',
    userId?: string,
    callSource?: BrickLinkCallLog['source'],
    useBrickLinkBudgetReserve = false,
  ): Promise<PricingData | null> {
    // 1. Fresh cache hit — return immediately regardless of source
    const cached = await this.getFreshCache(itemNo, 'MINIFIG', condition);
    if (cached) return cached;

    // 2. Try BrickLink if budget allows
    const budget = await bricklinkAPI.getRemainingBudget();
    const threshold = useBrickLinkBudgetReserve ? RESERVE_FOR_USERS : 0;

    if (budget.remaining > threshold) {
      try {
        const result = await bricklinkAPI.calculatePricingData(
          itemNo, condition, countryCode, region, userId, callSource
        );
        if (result) {
          return { ...result, price_source: 'bricklink', confidence: 1.0 };
        }
      } catch (err: any) {
        const isRateLimit = err?.message?.includes('daily limit') || err?.message?.includes('5,000');
        if (!isRateLimit) {
          // Unexpected error — don't silently fall through without logging
          console.error(`[Orchestrator] BrickLink error for ${itemNo}:`, err?.message);
        }
        console.log(`[Orchestrator] BrickLink unavailable for ${itemNo} — trying eBay`);
      }
    } else {
      console.log(`[Orchestrator] BrickLink budget low (${budget.remaining} remaining) — using eBay for ${itemNo}`);
    }

    // 3. Try eBay as fallback
    const ebayResult = await fetchEbayPricing(itemNo, 'MINIFIG', condition);
    if (ebayResult) return ebayResult;

    // 4. No data available
    console.log(`[Orchestrator] No pricing data available for ${itemNo}`);
    return null;
  }

  /**
   * Get pricing for a set. Falls back to eBay when BrickLink budget is low.
   */
  async getSetPrice(
    boxNo: string,
    condition: 'new' | 'used',
    countryCode: string = 'US',
    region: string = 'north_america',
    userId?: string,
    useBrickLinkBudgetReserve = false,
  ): Promise<PricingData | null> {
    // 1. Fresh cache hit
    const cached = await this.getFreshCache(boxNo, 'SET', condition);
    if (cached) return cached;

    // 2. Try BrickLink if budget allows
    const budget = await bricklinkAPI.getRemainingBudget();
    const threshold = useBrickLinkBudgetReserve ? RESERVE_FOR_USERS : 0;

    if (budget.remaining > threshold) {
      try {
        const result = await bricklinkAPI.calculateSetPricing(
          boxNo, condition, countryCode, region, userId
        );
        if (result) {
          return { ...result, price_source: 'bricklink', confidence: 1.0 };
        }
      } catch (err: any) {
        const isRateLimit = err?.message?.includes('daily limit') || err?.message?.includes('5,000');
        if (!isRateLimit) {
          console.error(`[Orchestrator] BrickLink error for set ${boxNo}:`, err?.message);
        }
        console.log(`[Orchestrator] BrickLink unavailable for set ${boxNo} — trying eBay`);
      }
    } else {
      console.log(`[Orchestrator] BrickLink budget low (${budget.remaining} remaining) — using eBay for set ${boxNo}`);
    }

    // 3. Try eBay as fallback
    const ebayResult = await fetchEbayPricing(boxNo, 'SET', condition);
    if (ebayResult) return ebayResult;

    // 4. No data available
    console.log(`[Orchestrator] No pricing data available for set ${boxNo}`);
    return null;
  }

  /**
   * Query PriceCache for a non-expired entry (any source).
   * Returns null if no valid cache exists.
   */
  private async getFreshCache(
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

    if (!cached || cached.expires_at <= new Date()) return null;

    const source = (cached.price_source ?? 'bricklink') as 'bricklink' | 'ebay';
    const confidence = cached.confidence ?? 1.0;

    console.log(`[Orchestrator] Cache HIT for ${itemNo} (${source}): $${cached.suggested_price}`);

    return {
      sixMonthAverage: cached.six_month_avg,
      currentAverage: cached.current_avg,
      currentLowest: cached.current_lowest,
      suggestedPrice: cached.suggested_price,
      currencyCode: cached.currency_code,
      cached_at: cached.cached_at.toISOString(),
      price_source: source,
      confidence,
    };
  }
}

export const pricingOrchestrator = new PricingOrchestrator();
