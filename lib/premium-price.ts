import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { convertPrice } from '@/lib/currency-converter';
import { getLiveExchangeRates } from '@/lib/live-exchange-rates';
import { getCurrencyByCode } from '@/lib/currency-config';

/**
 * What Premium costs, shown in the reader's currency.
 *
 * Stripe bills this subscription in USD and has no per-currency prices
 * configured, so the converted figure is genuinely an estimate — the card
 * statement will say dollars. That is why `isConverted` exists: the page has
 * to say so. Showing "4,60 €" and then charging $4.99 is the kind of surprise
 * that produces chargebacks and refund requests, and it is a worse outcome
 * than simply showing the dollar price.
 *
 * If Stripe multi-currency prices are added later, this is the seam: read the
 * matching `currency_options` entry and drop the "billed in USD" note.
 */

export const PREMIUM_USD_PER_MONTH = 4.99;

// Which currency a visitor most likely wants, by locale. Only used when we do
// not know better -- a signed-in user's own preference always wins.
const LOCALE_CURRENCY: Record<string, string> = {
  en: 'USD',
  de: 'EUR',
  fr: 'EUR',
  es: 'EUR',
  it: 'EUR',
  nl: 'EUR',
  pt: 'EUR',
  pl: 'PLN',
  sv: 'SEK',
  ja: 'JPY',
};

export type PremiumPrice = {
  /** Formatted for display, e.g. "$4.99" or "4,60 €". */
  display: string;
  /** The currency actually shown. */
  currency: string;
  /** True when this is a converted estimate rather than the billed amount. */
  isConverted: boolean;
  /** Always the real charge, formatted: "$4.99". */
  billedDisplay: string;
};

function format(amount: number, currencyCode: string): string {
  const config = getCurrencyByCode(currencyCode);
  try {
    return new Intl.NumberFormat(config?.locale || 'en-US', {
      style: 'currency',
      currency: currencyCode,
      // Yen and similar have no minor unit; Intl already knows the right
      // number of decimals per currency, so do not override it.
    }).format(amount);
  } catch {
    return `${config?.symbol || ''}${amount.toFixed(2)}`;
  }
}

export async function getPremiumPrice(locale: string): Promise<PremiumPrice> {
  const billedDisplay = format(PREMIUM_USD_PER_MONTH, 'USD');

  let currency = LOCALE_CURRENCY[locale] || 'USD';

  // A signed-in user has told us what they want to see prices in; that beats
  // any guess from the hostname.
  try {
    const session = await auth();
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { preferredCurrency: true },
      });
      if (user?.preferredCurrency) currency = user.preferredCurrency;
    }
  } catch {
    // Never let a session lookup break the pricing card.
  }

  if (currency === 'USD' || !getCurrencyByCode(currency)) {
    return { display: billedDisplay, currency: 'USD', isConverted: false, billedDisplay };
  }

  let rates;
  try {
    rates = (await getLiveExchangeRates()).rates;
  } catch {
    rates = undefined;
  }

  const converted = convertPrice(PREMIUM_USD_PER_MONTH, currency, rates);

  // convertPrice returns the USD amount unchanged when it has no rate. Showing
  // "4.99" labelled as euros would be wrong, so fall back to dollars instead.
  if (converted === PREMIUM_USD_PER_MONTH && currency !== 'USD') {
    return { display: billedDisplay, currency: 'USD', isConverted: false, billedDisplay };
  }

  return {
    display: format(converted, currency),
    currency,
    isConverted: true,
    billedDisplay,
  };
}
