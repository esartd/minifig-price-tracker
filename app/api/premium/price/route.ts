import { NextRequest, NextResponse } from 'next/server';
import { getLocaleFromHost } from '@/lib/i18n-subdomain';
import { getPremiumPrice } from '@/lib/premium-price';

/**
 * What Premium costs, in the reader's currency.
 *
 * Exists because /account is a client component and lib/premium-price.ts is
 * server-only (it reads the session and the database). /premium is a server
 * component and calls that module directly; this route is the same answer for
 * the client side, so the two pages cannot drift apart.
 *
 * They HAD drifted: /premium converted the price and said "Approximate. Billed
 * in US dollars ($4.99)" when it did, while /account printed the literal
 * "$4.99" with no conversion and no note -- on the page where the upgrade
 * button actually lives. A German reader saw a euro figure on one page and a
 * bare dollar sign on the other.
 *
 * Not cached: the conversion depends on the signed-in user's own currency
 * preference, so a shared cache would serve one user's currency to another.
 * The underlying exchange rates are cached inside lib/live-exchange-rates.
 */
export async function GET(request: NextRequest) {
  try {
    const locale = getLocaleFromHost(request.headers.get('host') || '');
    const price = await getPremiumPrice(locale);
    return NextResponse.json({ success: true, price });
  } catch (error) {
    console.error('[Premium Price] Error:', error);
    // The caller falls back to the plain dollar price, which is always
    // correct -- it is what Stripe charges.
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
