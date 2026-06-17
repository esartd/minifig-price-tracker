/**
 * eBay Browse API pricing client
 *
 * Used as fallback when BrickLink's 5,000 daily API calls are exhausted.
 * eBay is the #2 LEGO secondary market — strong price correlation with BrickLink.
 *
 * Auth: OAuth2 Client Credentials flow (Application Access Token, no user login needed)
 * API: eBay Browse API v1 — public listings search, no personal data involved
 */

import { PricingData } from '@/types';
import { prisma } from './prisma';

const EBAY_API_BASE = 'https://api.ebay.com';
const TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const BROWSE_SCOPE = 'https://api.ebay.com/oauth/api_scope/buy.marketplace.search';

// eBay category IDs for LEGO items
const CATEGORY_MINIFIG = '246';     // LEGO Minifigures
const CATEGORY_SET = '19006';       // LEGO Complete Sets & Packs

// eBay condition IDs
const CONDITION_USED = '3000';
const CONDITION_NEW = '1000';

// Minimum 3 seconds between eBay calls to be a good API citizen
const MIN_DELAY_MS = 3000;
let lastRequestTime = 0;

// In-memory token cache (token lasts 2 hours)
let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Get a valid OAuth2 Application Access Token, refreshing if expired.
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('eBay API credentials not configured (EBAY_CLIENT_ID / EBAY_CLIENT_SECRET)');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(BROWSE_SCOPE)}`,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`eBay OAuth failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: now + (data.expires_in - 60) * 1000, // subtract 60s buffer
  };

  console.log('[eBay] Access token refreshed, expires in', data.expires_in, 'seconds');
  return cachedToken.value;
}

/**
 * Enforce minimum delay between eBay API calls.
 */
async function enforceDelay(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

interface EbayItem {
  title: string;
  price: { value: string; currency: string };
  condition?: string;
}

/**
 * Search eBay active fixed-price listings.
 */
async function searchEbay(
  query: string,
  categoryId: string,
  conditionId: string,
): Promise<EbayItem[]> {
  await enforceDelay();
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    category_ids: categoryId,
    filter: `conditionIds:{${conditionId}},buyingOptions:{FIXED_PRICE}`,
    sort: 'price',
    limit: '50',
  });

  const url = `${EBAY_API_BASE}/buy/browse/v1/item_summary/search?${params}`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[eBay] Browse API error (${res.status}): ${body}`);
    return [];
  }

  const data = await res.json();
  return (data.itemSummaries || []) as EbayItem[];
}

/**
 * Filter eBay results for relevance and remove price outliers.
 *
 * Rules:
 * 1. Title must contain the item number (e.g. "sw0001" or "75192")
 * 2. Prices must be in USD
 * 3. Remove outliers beyond 3x / below 0.2x the median (catches bundles, mislabeled)
 * 4. Require at least 3 clean results
 */
function filterAndNormalize(items: EbayItem[], itemNo: string): number[] | null {
  const itemNoLower = itemNo.toLowerCase();

  // Must contain the item number somewhere in the title
  const relevant = items.filter(item =>
    item.title.toLowerCase().includes(itemNoLower) &&
    item.price.currency === 'USD'
  );

  if (relevant.length < 3) {
    console.log(`[eBay] Only ${relevant.length} relevant results for ${itemNo} (need 3+), skipping`);
    return null;
  }

  const prices = relevant.map(item => parseFloat(item.price.value)).filter(p => p > 0);

  if (prices.length < 3) return null;

  // Compute median for outlier removal
  const sorted = [...prices].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  const clean = prices.filter(p => p >= median * 0.2 && p <= median * 3);

  if (clean.length < 3) {
    console.log(`[eBay] Only ${clean.length} clean prices after outlier removal for ${itemNo}, skipping`);
    return null;
  }

  return clean;
}

/**
 * Compute PricingData fields from a list of clean prices.
 *
 * Since Browse API shows current listings (not sold history), we use:
 *   six_month_avg = current_avg (best estimate we have for historical)
 *   current_avg   = mean of filtered listing prices
 *   current_lowest = min of filtered listing prices
 *   suggested_price = average of the three non-zero components
 */
function computePricing(prices: number[]): Pick<PricingData, 'sixMonthAverage' | 'currentAverage' | 'currentLowest' | 'suggestedPrice'> {
  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const lowest = Math.min(...prices);

  const components = [avg, avg, lowest].filter(p => p > 0);
  const suggested = components.reduce((sum, p) => sum + p, 0) / components.length;

  return {
    sixMonthAverage: parseFloat(avg.toFixed(2)),
    currentAverage: parseFloat(avg.toFixed(2)),
    currentLowest: parseFloat(lowest.toFixed(2)),
    suggestedPrice: parseFloat(suggested.toFixed(2)),
  };
}

/**
 * Fetch pricing for a LEGO minifig or set from eBay Browse API.
 *
 * Returns null if eBay doesn't have enough relevant listings to compute a
 * reliable price (< 3 clean results after filtering).
 *
 * On success, writes result to PriceCache with price_source='ebay'.
 */
export async function fetchEbayPricing(
  itemNo: string,
  itemType: 'MINIFIG' | 'SET',
  condition: 'new' | 'used',
): Promise<PricingData | null> {
  try {
    const categoryId = itemType === 'MINIFIG' ? CATEGORY_MINIFIG : CATEGORY_SET;
    const conditionId = condition === 'new' ? CONDITION_NEW : CONDITION_USED;
    const typeLabel = itemType === 'MINIFIG' ? 'minifigure' : 'set';
    const query = `LEGO ${typeLabel} ${itemNo}`;

    console.log(`[eBay] Searching for ${itemNo} (${condition}): "${query}"`);

    const items = await searchEbay(query, categoryId, conditionId);
    console.log(`[eBay] Raw results for ${itemNo}: ${items.length} listings`);

    const cleanPrices = filterAndNormalize(items, itemNo);
    if (!cleanPrices) {
      console.log(`[eBay] Insufficient data for ${itemNo} — not caching`);
      return null;
    }

    const pricing = computePricing(cleanPrices);
    // Confidence: 0.75 for 10+ results, 0.6 for 3–9 results
    const confidence = cleanPrices.length >= 10 ? 0.75 : 0.6;

    console.log(`[eBay] ${itemNo} (${condition}): suggested=$${pricing.suggestedPrice} from ${cleanPrices.length} listings (confidence=${confidence})`);

    // Cache the eBay price — 6-hour TTL same as BrickLink
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

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
          six_month_avg: pricing.sixMonthAverage,
          current_avg: pricing.currentAverage,
          current_lowest: pricing.currentLowest,
          suggested_price: pricing.suggestedPrice,
          cached_at: new Date(),
          expires_at: expiresAt,
          currency_code: 'USD',
          price_source: 'ebay',
          confidence,
        },
        create: {
          item_no: itemNo,
          item_type: itemType,
          condition,
          country_code: 'US',
          region: '',
          currency_code: 'USD',
          six_month_avg: pricing.sixMonthAverage,
          current_avg: pricing.currentAverage,
          current_lowest: pricing.currentLowest,
          suggested_price: pricing.suggestedPrice,
          expires_at: expiresAt,
          price_source: 'ebay',
          confidence,
        },
      });
    } catch (err: any) {
      if (err.code !== 'P2002') {
        console.error(`[eBay] Cache write error for ${itemNo}:`, err);
      }
    }

    // NOTE: eBay prices are intentionally NOT recorded to PriceHistory.
    // Price history tracks only BrickLink data (authoritative sold/stock data).
    // Mixing eBay estimates would pollute historical trends.

    return {
      ...pricing,
      currencyCode: 'USD',
      cached_at: new Date().toISOString(),
      price_source: 'ebay',
      confidence,
    };
  } catch (err) {
    console.error(`[eBay] fetchEbayPricing failed for ${itemNo}:`, err);
    return null;
  }
}
