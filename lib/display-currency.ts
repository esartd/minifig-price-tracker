import { auth } from '@/auth';
import { getVisitorCountry } from '@/lib/visitor-country';
import { getCurrencyByCountryCode, getCurrencyByCode } from '@/lib/currency-config';
import { convertPrice } from '@/lib/currency-converter';
import { getLiveExchangeRates } from '@/lib/live-exchange-rates';

/**
 * Which currency to show this visitor a price in.
 *
 * The site used to answer "USD" for everyone who was not signed in: each
 * pricing route began `session?.user?.preferredCountryCode || 'US'`, so a
 * reader in Manchester or Sao Paulo was quoted dollars with no way to tell.
 * Worse, the prices rendered as a bare "$9.14" -- which is four different
 * currencies depending on who is reading it.
 *
 * COUNTRY, not language, for the same reason the eBay and Walmart routing is:
 * the old CurrencyBanner read navigator.language, and most browsers report
 * en-US regardless of where they are standing.
 *
 * Priority:
 *   1. A signed-in user's own saved preference. They chose it; it wins.
 *   2. The country Cloudflare reports for this request.
 *   3. USD.
 *
 * ## This must never change what we ASK BrickLink for
 *
 * lib/bricklink.ts pins `cacheCountryCode = 'US'` and `currencyCodeValue =
 * 'USD'` deliberately: one cache row per (item, condition), shared by every
 * visitor on earth. Passing real country codes down into the price fetch would
 * fragment that cache per country and multiply the API calls behind it, and
 * the budget is 5,000 a day for the whole site -- the June 2026 incident in
 * CLAUDE.md was exactly this, a single careless call site draining the budget
 * by 5am.
 *
 * So prices stay fetched and cached in USD, and only the DISPLAY is converted,
 * here, after the fact. That costs nothing: the rates are fetched once and
 * cached for 24h, and convertPrice falls back to a static table if the
 * provider is down.
 */

export type DisplayCurrency = {
  /** ISO code to show and to format with, e.g. "GBP". */
  code: string;
  /** True when the figure is a conversion of a USD price rather than USD itself. */
  converted: boolean;
};

export async function getDisplayCurrency(): Promise<DisplayCurrency> {
  const session = await auth();

  /**
   * A CHOSEN currency outranks where they are -- people travel, and someone
   * who picked GBP wants GBP from an airport in Dubai.
   *
   * `currencyChosen` and not merely a non-empty preferredCurrency: that column
   * defaults to 'USD', so every signed-in reader looked like they had chosen
   * dollars and location could never apply to them. currencyChosenAt is NULL
   * until they actually pick one in settings.
   */
  const preferred = session?.user?.preferredCurrency;
  if (session?.user?.currencyChosen && preferred && getCurrencyByCode(preferred)) {
    return { code: preferred, converted: preferred !== 'USD' };
  }

  const country = await getVisitorCountry();
  const local = country ? getCurrencyByCountryCode(country.toUpperCase()) : undefined;
  if (local) return { code: local.code, converted: local.code !== 'USD' };

  // A country we have no currency for keeps dollars. An honest USD figure is
  // better than a wrong local one.
  return { code: 'USD', converted: false };
}

/**
 * Convert a USD price object's numeric fields into `currency`.
 *
 * Returns the object untouched for USD, so the common case allocates nothing
 * and cannot drift from the source numbers.
 */
export async function convertPricingToCurrency<T extends object>(
  pricing: T,
  currency: string,
  fields: string[],
): Promise<T & { currencyCode: string }> {
  if (currency === 'USD') {
    return { ...pricing, currencyCode: 'USD' };
  }

  let rates: Record<string, number> | undefined;
  try {
    rates = (await getLiveExchangeRates()).rates;
  } catch {
    // convertPrice falls back to its own static table rather than throwing.
  }

  const source = pricing as Record<string, unknown>;
  const out: Record<string, unknown> = { ...source, currencyCode: currency };
  for (const field of fields) {
    const value = source[field];
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      out[field] = convertPrice(value, currency, rates);
    }
  }
  return out as T & { currencyCode: string };
}

/** The price fields every pricing payload on this site carries. */
export const PRICE_FIELDS = [
  'sixMonthAverage',
  'currentAverage',
  'currentLowest',
  'suggestedPrice',
];
