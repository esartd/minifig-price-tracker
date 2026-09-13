import { headers } from 'next/headers';

/**
 * Where the visitor is, from Cloudflare.
 *
 * One place, because several features now turn on it and they must agree. The
 * home page picks Walmart or Amazon; /premium and /account decide whether to
 * advertise Walmart deal alerts. A visitor shown Amazon on the home page and
 * sold Walmart alerts on the pricing page has been told two different things.
 *
 * COUNTRY, never language. A German speaker in Ohio can buy from Walmart; an
 * English speaker in Manchester cannot, and the locale subdomain says nothing
 * about either.
 *
 * Server-side only, deliberately. This must not be resolved in the browser or
 * kept in a cookie: cache-handler.js stores rendered routes in MySQL, so a
 * response carrying one visitor's country can be handed to the next. Client
 * components read it from /api/geo, which is force-dynamic.
 */

/**
 * Countries where the Walmart affiliate feed is usable.
 *
 * Exactly one. The Impact catalogue is the US programme -- 3,833 rows, every
 * one priced in USD and pointing at walmart.com. Walmart Canada and Walmart
 * Mexico are separate businesses with separate affiliate programmes we are not
 * in; the UK (Asda) and Japan (Seiyu) operations were sold years ago. There is
 * no other Walmart to send anyone to.
 */
const WALMART_COUNTRIES = new Set(['US']);

/**
 * Unknown resolves to the US experience.
 *
 * Cloudflare reports XX for anonymised traffic, and the header is absent
 * entirely when the app is reached without the proxy -- which is how it runs
 * locally and in the build. Defaulting the other way would hide the deals from
 * every developer and from any visitor Cloudflare chooses not to place.
 */
export function countryHasWalmart(country: string | null | undefined): boolean {
  const c = (country || '').toUpperCase();
  if (c === '' || c === 'XX') return true;
  return WALMART_COUNTRIES.has(c);
}

/** The visitor's ISO country code, or '' when Cloudflare did not say. */
export async function getVisitorCountry(): Promise<string> {
  const hdrs = await headers();
  return (hdrs.get('cf-ipcountry') || '').toUpperCase();
}

/** True when this visitor can actually buy from the Walmart deals we list. */
export async function visitorHasWalmart(): Promise<boolean> {
  return countryHasWalmart(await getVisitorCountry());
}
