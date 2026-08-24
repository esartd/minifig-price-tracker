/**
 * Server-side live exchange rate fetching + caching.
 *
 * Backs app/api/exchange-rates/route.ts. Fetches current USD-based rates
 * from a free, no-API-key provider (open.er-api.com, updates once every 24h)
 * and caches the result in memory for 24h so we don't hit the external API
 * on every request. This process runs as a single long-lived PM2 process
 * (not serverless), so an in-memory cache here is safe and avoids needing a
 * DB table or schema change just to cache a small daily-refreshed value.
 *
 * Falls back to the static FALLBACK_EXCHANGE_RATES table (see
 * lib/currency-converter.ts) if the live fetch fails and we have no
 * previously-fetched rates to serve instead.
 */

import { FALLBACK_EXCHANGE_RATES } from './currency-converter';

const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';
const LIVE_TTL_MS = 24 * 60 * 60 * 1000; // matches the provider's own update cadence
const RETRY_INTERVAL_MS = 60 * 60 * 1000; // don't hammer the API if it's down; retry hourly instead
const FETCH_TIMEOUT_MS = 5000;

interface ExchangeRateCache {
  rates: Record<string, number> | null;
  fetchedAt: number;
  lastAttemptAt: number;
  source: 'live' | 'fallback';
}

const cache: ExchangeRateCache = {
  rates: null,
  fetchedAt: 0,
  lastAttemptAt: 0,
  source: 'fallback',
};

export interface LiveExchangeRatesResult {
  rates: Record<string, number>;
  source: 'live' | 'fallback';
  updatedAt: number;
}

export async function getLiveExchangeRates(): Promise<LiveExchangeRatesResult> {
  const now = Date.now();

  const cacheIsFreshLive = cache.rates && cache.source === 'live' && now - cache.fetchedAt < LIVE_TTL_MS;
  const attemptedTooRecently = now - cache.lastAttemptAt < RETRY_INTERVAL_MS;

  if (cacheIsFreshLive || (cache.rates && attemptedTooRecently)) {
    return { rates: cache.rates!, source: cache.source, updatedAt: cache.fetchedAt };
  }

  cache.lastAttemptAt = now;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(EXCHANGE_RATE_API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.result !== 'success' || !data.rates || typeof data.rates !== 'object') {
      throw new Error('Exchange rate API returned an unexpected payload');
    }

    cache.rates = { USD: 1, ...data.rates };
    cache.fetchedAt = now;
    cache.source = 'live';

    return { rates: cache.rates, source: 'live', updatedAt: cache.fetchedAt };
  } catch (error) {
    console.error('[exchange-rates] Live fetch failed:', error);

    // Serve whatever we already have (even if stale) rather than the
    // static table -- a day-old live rate is still better than one that's
    // been frozen since this file was written.
    if (cache.rates) {
      return { rates: cache.rates, source: cache.source, updatedAt: cache.fetchedAt };
    }

    cache.rates = FALLBACK_EXCHANGE_RATES;
    cache.fetchedAt = now;
    cache.source = 'fallback';
    return { rates: cache.rates, source: 'fallback', updatedAt: cache.fetchedAt };
  }
}
