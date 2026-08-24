/**
 * Client-side currency conversion
 * Converts USD prices to user's preferred currency
 */

import { PricingData } from '@/types';

// Static fallback rates (relative to 1 USD), last hand-updated 2026-06-08.
// This is ONLY used if the live rates endpoint (/api/exchange-rates, backed
// by lib/live-exchange-rates.ts) is unreachable -- normal operation fetches
// current rates instead of relying on this frozen snapshot. Kept here as a
// last-resort so conversion never hard-fails.
export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  'USD': 1.00,
  'EUR': 0.92,
  'GBP': 0.79,
  'CAD': 1.35,
  'AUD': 1.52,
  'JPY': 149.50,
  'CHF': 0.88,
  'SEK': 10.35,
  'NOK': 10.65,
  'DKK': 6.85,
  'PLN': 4.05,
  'CZK': 23.15,
  'HUF': 365.00,
  'RON': 4.55,
  'BGN': 1.80,
  'HRK': 6.93,
  'RSD': 108.00,
  'UAH': 40.50,
  'RUB': 92.00,
  'TRY': 32.50,
  'BRL': 5.05,
  'MXN': 17.15,
  'ARS': 985.00,
  'CLP': 950.00,
  'COP': 4050.00,
  'PEN': 3.75,
  'CNY': 7.25,
  'HKD': 7.80,
  'INR': 83.50,
  'IDR': 15750.00,
  'MYR': 4.45,
  'PHP': 56.50,
  'SGD': 1.34,
  'THB': 35.50,
  'VND': 24500.00,
  'KRW': 1335.00,
  'TWD': 31.50,
  'NZD': 1.68,
  'ZAR': 18.50,
  'ILS': 3.65,
  'AED': 3.67,
  'SAR': 3.75,
};

/**
 * Convert USD pricing data to target currency.
 *
 * `rates` should come from fetchLiveExchangeRates() (current rates, cached
 * server-side for 24h). Falls back to the static table above if omitted.
 */
export function convertPricing(
  pricingUSD: PricingData,
  targetCurrency: string,
  rates: Record<string, number> = FALLBACK_EXCHANGE_RATES
): PricingData {
  // If already in target currency or target is USD, return as-is
  if (pricingUSD.currencyCode === targetCurrency || targetCurrency === 'USD') {
    return pricingUSD;
  }

  const rate = rates[targetCurrency];

  // If we don't have the exchange rate, return USD (better than failing)
  if (!rate) {
    console.warn(`No exchange rate for ${targetCurrency}, showing USD`);
    return pricingUSD;
  }

  // Convert all price fields
  return {
    sixMonthAverage: parseFloat((pricingUSD.sixMonthAverage * rate).toFixed(2)),
    currentAverage: parseFloat((pricingUSD.currentAverage * rate).toFixed(2)),
    currentLowest: parseFloat((pricingUSD.currentLowest * rate).toFixed(2)),
    suggestedPrice: parseFloat((pricingUSD.suggestedPrice * rate).toFixed(2)),
    currencyCode: targetCurrency,
    cached_at: pricingUSD.cached_at,
  };
}

/**
 * Convert a single USD price to target currency
 */
export function convertPrice(
  priceUSD: number,
  targetCurrency: string,
  rates: Record<string, number> = FALLBACK_EXCHANGE_RATES
): number {
  if (targetCurrency === 'USD') return priceUSD;

  const rate = rates[targetCurrency];
  if (!rate) return priceUSD;

  return parseFloat((priceUSD * rate).toFixed(2));
}

/**
 * Get exchange rate for a currency (relative to USD)
 */
export function getExchangeRate(
  currency: string,
  rates: Record<string, number> = FALLBACK_EXCHANGE_RATES
): number {
  return rates[currency] || 1.0;
}

// ---------------------------------------------------------------------------
// Client-side fetch + cache for live rates
// ---------------------------------------------------------------------------

let clientCachedRates: Record<string, number> | null = null;
let clientCachedAt = 0;
const CLIENT_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour -- avoid re-fetching our own endpoint on every page within a session

/**
 * Fetch current exchange rates from our server (which fetches live rates
 * from an external provider and caches them for 24h -- see
 * lib/live-exchange-rates.ts). Caches the result in memory for this browser
 * session so multiple pages/components don't each trigger their own request.
 * Falls back to the static table on any failure.
 */
export async function fetchLiveExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (clientCachedRates && now - clientCachedAt < CLIENT_CACHE_TTL_MS) {
    return clientCachedRates;
  }

  try {
    const response = await fetch('/api/exchange-rates');
    if (!response.ok) throw new Error(`Exchange rate endpoint returned ${response.status}`);

    const data = await response.json();
    if (!data.rates || typeof data.rates !== 'object') {
      throw new Error('Exchange rate endpoint returned unexpected payload');
    }

    clientCachedRates = data.rates;
    clientCachedAt = now;
    return clientCachedRates!;
  } catch (error) {
    console.warn('Failed to fetch live exchange rates, using fallback table:', error);
    return FALLBACK_EXCHANGE_RATES;
  }
}
