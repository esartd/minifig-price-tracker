/**
 * eBay Browse API pricing client
 *
 * Returns raw listing prices (avg, lowest) for the orchestrator to blend
 * into the unified FigTracker Market Price formula.
 *
 * Auth: OAuth2 Client Credentials flow (Application Access Token, no user login needed)
 * API: eBay Browse API v1 — public listings search, no personal data involved
 */

import { prisma } from './prisma';

const EBAY_API_BASE = 'https://api.ebay.com';
const TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const BROWSE_SCOPE = 'https://api.ebay.com/oauth/api_scope';

// Minimum 3 seconds between eBay calls to be a good API citizen
const MIN_DELAY_MS = 3000;
let lastRequestTime = 0;

const EBAY_MAX_CALLS_PER_DAY = 5000;

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
    expiresAt: now + (data.expires_in - 60) * 1000,
  };

  console.log('[eBay] Access token refreshed, expires in', data.expires_in, 'seconds');
  return cachedToken.value;
}

/**
 * Enforce minimum delay between eBay API calls and track daily usage.
 * Throws if the 5,000/day limit is reached — same protection as BrickLink.
 */
async function enforceRateLimit(): Promise<void> {
  const today = `ebay-${new Date().toISOString().split('T')[0]}`; // e.g. "ebay-2026-06-17"

  let tracker = await prisma.apiCallTracker.findUnique({ where: { date: today } });
  if (!tracker) {
    tracker = await prisma.apiCallTracker.create({ data: { date: today, call_count: 0 } });
  }

  if (tracker.call_count >= EBAY_MAX_CALLS_PER_DAY) {
    throw new Error(`eBay API daily limit reached (${EBAY_MAX_CALLS_PER_DAY} calls/day). Resets at midnight UTC.`);
  }

  if (tracker.call_count >= EBAY_MAX_CALLS_PER_DAY * 0.9) {
    console.warn(`[eBay] ⚠️ Approaching daily limit (${tracker.call_count + 1}/${EBAY_MAX_CALLS_PER_DAY})`);
  }

  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();

  await prisma.apiCallTracker.update({
    where: { date: today },
    data: { call_count: tracker.call_count + 1, last_call_at: new Date() },
  });
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
  conditionId: string,
): Promise<EbayItem[]> {
  await enforceRateLimit();
  const token = await getAccessToken();

  // Build URL manually — URLSearchParams encodes {} in filter values which breaks eBay's filter syntax.
  const url = `${EBAY_API_BASE}/buy/browse/v1/item_summary/search`
    + `?q=${encodeURIComponent(query)}`
    + `&filter=conditionIds:{${conditionId}},buyingOptions:{FIXED_PRICE}`
    + `&sort=price&limit=50`;

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
 * Requires at least 3 clean USD results.
 */
function filterAndNormalize(items: EbayItem[], itemNo: string): number[] | null {
  const relevant = items.filter(item => item.price.currency === 'USD');

  if (relevant.length < 3) {
    console.log(`[eBay] Only ${relevant.length} USD results for ${itemNo} (need 3+), skipping`);
    return null;
  }

  const prices = relevant.map(item => parseFloat(item.price.value)).filter(p => p > 0);
  if (prices.length < 3) return null;

  const sorted = [...prices].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const clean = prices.filter(p => p >= median * 0.2 && p <= median * 3);

  if (clean.length < 3) {
    console.log(`[eBay] Only ${clean.length} clean prices after outlier removal for ${itemNo}, skipping`);
    return null;
  }

  return clean;
}

export interface EbayListingPrices {
  avg: number;
  lowest: number;
  listingCount: number;
}

/**
 * Fetch raw eBay listing prices for blending into FigTracker Market Price.
 *
 * Returns { avg, lowest } from current active listings, or null if < 3 clean results.
 * Does NOT write to PriceCache — the orchestrator owns cache writes.
 */
export async function getEbayListingPrices(
  itemNo: string,
  itemType: 'MINIFIG' | 'SET',
  condition: 'new' | 'used',
): Promise<EbayListingPrices | null> {
  const conditionId = condition === 'new' ? '1000' : '3000';
  const query = `LEGO ${itemNo}`;

  console.log(`[eBay] Searching for ${itemNo} (${condition}): "${query}"`);

  // Let daily-limit errors bubble up so the orchestrator can detect them.
  // Catch everything else and return null (no listings is fine).
  let items: EbayItem[];
  try {
    items = await searchEbay(query, conditionId);
  } catch (err: any) {
    if (err?.message?.includes('daily limit')) throw err;
    console.error(`[eBay] getEbayListingPrices failed for ${itemNo}:`, err);
    return null;
  }

  console.log(`[eBay] Raw results for ${itemNo}: ${items.length} listings`);

  const cleanPrices = filterAndNormalize(items, itemNo);
  if (!cleanPrices) return null;

  const avg = parseFloat((cleanPrices.reduce((sum, p) => sum + p, 0) / cleanPrices.length).toFixed(2));
  const lowest = parseFloat(Math.min(...cleanPrices).toFixed(2));

  console.log(`[eBay] ${itemNo} (${condition}): avg=$${avg}, lowest=$${lowest} from ${cleanPrices.length} listings`);

  return { avg, lowest, listingCount: cleanPrices.length };
}
