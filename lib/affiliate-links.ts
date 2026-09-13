/**
 * Affiliate link utilities for Amazon Associates and LEGO Partner Program monetization
 */

const AMAZON_AFFILIATE_TAG =
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
  process.env.AMAZON_AFFILIATE_TAG ||
  'ericksu0c-20';

/**
 * Amazon storefronts by the visitor's COUNTRY.
 *
 * Same reasoning as EBAY_SITES_BY_COUNTRY in lib/ebay-affiliate-links.ts:
 * language says nothing about where someone can buy. A German speaker in Ohio
 * wants amazon.com; an English speaker in Manchester wants amazon.co.uk.
 *
 * This list is Amazon's "Earn Globally" set and nothing else. Those twelve
 * storefronts pay out to the existing US account once they are linked at
 * Manage My Account -> Link Stores, so each is reachable without a new
 * Associates registration. Countries outside it were removed deliberately:
 * Mexico and Belgium serve no locale this site runs and would need their own
 * account, so listing them only implied a route that could never pay.
 *
 * Brazil is the one exception, and it earns its place: the `pt` locale here is
 * Brazilian Portuguese, not European, so BR is a storefront real visitors want.
 * It is NOT part of Earn Globally and needs a separate account, which is why
 * it sits here with no tag and falls through until one exists.
 *
 * Portugal is absent on purpose -- it has no Amazon of its own (amazon.es
 * serves it) and is not what the `pt` subdomain means. Every country not
 * listed falls through to the default rather than getting a made-up host.
 */
const AMAZON_HOSTS: Record<string, string> = {
  US: 'www.amazon.com',
  // Earn Globally: linkable to the US account, no separate registration.
  CA: 'www.amazon.ca',
  GB: 'www.amazon.co.uk',
  DE: 'www.amazon.de',
  FR: 'www.amazon.fr',
  IT: 'www.amazon.it',
  ES: 'www.amazon.es',
  NL: 'www.amazon.nl',
  SE: 'www.amazon.se',
  PL: 'www.amazon.pl',
  AU: 'www.amazon.com.au',
  SG: 'www.amazon.sg',
  JP: 'www.amazon.co.jp',
  // Its own programme, its own account. Here for the pt (Brazilian) locale.
  BR: 'www.amazon.com.br',
};

/**
 * Tracking ID per marketplace, read from one env var so adding a country is a
 * config change rather than a code change:
 *
 *   NEXT_PUBLIC_AMAZON_TAGS="GB:intobrick-21,DE:intobrick0d-21"
 *
 * NEXT_PUBLIC_ on purpose. Every Amazon button on this site renders in a client
 * component, and Next.js replaces a non-public `process.env.X` with undefined
 * in the browser bundle -- the old server-only AMAZON_AFFILIATE_TAG has always
 * silently fallen back to the hard-coded literal below, which happened to be
 * the right value. A per-country map cannot rely on that luck.
 *
 * Each marketplace needs its OWN Associates account and its own tag; a US tag
 * on amazon.co.uk tracks nothing. So a country is only routed to its local
 * store once a tag for it exists here -- see amazonStoreForCountry.
 */
function parseAmazonTags(raw: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const entry of raw.split(',')) {
    const [country, tag] = entry.split(':').map((part) => part.trim());
    const code = (country || '').toUpperCase();
    if (code && tag && AMAZON_HOSTS[code]) tags[code] = tag;
  }
  return tags;
}

const AMAZON_TAGS: Record<string, string> = {
  ...parseAmazonTags(process.env.NEXT_PUBLIC_AMAZON_TAGS || ''),
  // The US tag is not configurable through the map: it is the fallback every
  // other path depends on, and an empty map must never leave us untagged.
  US: AMAZON_AFFILIATE_TAG,
};

/**
 * The storefront and tracking ID to use for a visitor.
 *
 * Falls back to amazon.com + the US tag unless BOTH a host and a tag are known
 * for the country. That fallback is deliberate and load-bearing: sending a
 * British visitor to amazon.co.uk carrying a US tag would earn nothing at all,
 * whereas amazon.com still pays on international orders and lets Amazon's own
 * OneLink localisation do its work if it is enabled on the account.
 */
export function amazonStoreForCountry(country?: string | null): { host: string; tag: string } {
  const code = (country || '').toUpperCase();
  const host = AMAZON_HOSTS[code];
  const tag = AMAZON_TAGS[code];
  if (host && tag) return { host, tag };
  return { host: AMAZON_HOSTS.US, tag: AMAZON_TAGS.US };
}
const LEGO_AFFILIATE_ID = process.env.LEGO_AFFILIATE_ID || ''; // Set in env when approved

/**
 * LEGO.com affiliate link generator for LEGO sets
 * @param setNumber - LEGO set number (e.g., "75373")
 */
export function generateLegoSetLink(setNumber: string): string {
  // Remove any prefix from set number (e.g., "75373-1" becomes "75373")
  const cleanSetNumber = setNumber.split('-')[0];

  if (LEGO_AFFILIATE_ID) {
    // With affiliate ID (when approved)
    return `https://www.lego.com/en-us/product/${cleanSetNumber}?affiliate_id=${LEGO_AFFILIATE_ID}`;
  }

  // Without affiliate ID (direct link)
  return `https://www.lego.com/en-us/product/${cleanSetNumber}`;
}

/**
 * Amazon Associates link generator for LEGO sets
 * @param setNumber - LEGO set number (e.g., "75373")
 * @param setName - LEGO set name for search query
 */
export function generateAmazonLegoSetLink(
  setNumber: string,
  setName: string,
  country?: string | null
): string {
  // Search for LEGO set on Amazon (most reliable for finding current inventory)
  const searchQuery = `LEGO ${setNumber} ${setName}`;
  const encodedQuery = encodeURIComponent(searchQuery);
  const { host, tag } = amazonStoreForCountry(country);

  return `https://${host}/s?k=${encodedQuery}&tag=${tag}`;
}

/**
 * Amazon Associates direct product link (if you have ASIN)
 * @param asin - Amazon product ASIN
 */
export function generateAmazonAffiliateLink(asin: string, country?: string | null): string {
  const { host, tag } = amazonStoreForCountry(country);
  return `https://${host}/dp/${asin}?tag=${tag}`;
}

/**
 * BrickLink catalog link generator - goes directly to stores/sellers tab
 * NOTE: BrickLink does NOT have an affiliate program (shut down after LEGO acquisition)
 * This is purely for user convenience - no revenue generated
 * @param itemNo - Item number (e.g., "75192-1")
 * @param itemType - 'SET' for sets, 'MINIFIG' for minifigs (default: 'SET')
 */
export function generateBrickLinkAffiliateLink(itemNo: string, itemType: 'SET' | 'MINIFIG' = 'SET'): string {
  // BrickLink uses short codes: S for sets, M for minifigs
  const typeCode = itemType === 'SET' ? 'S' : 'M';

  // Base URL with item
  let url = `https://www.bricklink.com/v2/catalog/catalogitem.page?${typeCode}=${itemNo}`;

  // Add hash to go directly to stores/sellers tab (where people buy)
  // T=S = Tab: Stores, O={"iconly":0} = Options: show all sellers
  url += `#T=S&O={%22iconly%22:0}`;

  return url;
}

/**
 * Amazon Associates link for LEGO minifigures
 * @param minifigNo - Minifig number (e.g., "sw1219")
 * @param minifigName - Minifig name for search query
 */
export function generateAmazonMinifigLink(
  minifigNo: string,
  minifigName: string,
  country?: string | null
): string {
  const searchQuery = `LEGO Minifigure ${minifigNo} ${minifigName}`;
  const encodedQuery = encodeURIComponent(searchQuery);
  const { host, tag } = amazonStoreForCountry(country);

  return `https://${host}/s?k=${encodedQuery}&tag=${tag}`;
}

/**
 * BrickLink minifig page link
 * @param minifigNo - Minifig number (e.g., "sw1219")
 */
export function generateBrickLinkMinifigLink(minifigNo: string): string {
  return generateBrickLinkAffiliateLink(minifigNo, 'MINIFIG');
}

/**
 * Rakuten/LinkSynergy deep link generator for LEGO sets on LEGO.com
 * @param setNumber - LEGO set number (e.g., "75373-1")
 * @param setName - LEGO set name (optional, for future use)
 */
export function generateRakutenLegoSetLink(setNumber: string, setName?: string): string {
  const cleanSetNumber = setNumber.split('-')[0]; // "75373-1" → "75373"
  const rakutenId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID || process.env.RAKUTEN_AFFILIATE_ID;
  const rakutenMid = process.env.NEXT_PUBLIC_RAKUTEN_MID || process.env.RAKUTEN_MID;

  if (!rakutenId || !rakutenMid) {
    // Fallback to direct LEGO.com link if credentials not configured
    return `https://www.lego.com/en-us/product/${cleanSetNumber}`;
  }

  // Rakuten/LinkSynergy deep link format
  const destinationUrl = `https://www.lego.com/en-us/product/${cleanSetNumber}`;
  const encodedUrl = encodeURIComponent(destinationUrl);

  return `https://click.linksynergy.com/deeplink?id=${rakutenId}&mid=${rakutenMid}&murl=${encodedUrl}`;
}

/**
 * Rakuten/LinkSynergy banner link generator for LEGO.com homepage
 * @param bannerId - Banner identifier for tracking
 */
export function generateRakutenBannerLink(bannerId: string): string {
  const rakutenId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID || process.env.RAKUTEN_AFFILIATE_ID;
  const rakutenMid = process.env.NEXT_PUBLIC_RAKUTEN_MID || process.env.RAKUTEN_MID;

  if (!rakutenId || !rakutenMid) {
    // Fallback to direct LEGO.com link if credentials not configured
    return 'https://www.lego.com/en-us';
  }

  const destinationUrl = 'https://www.lego.com/en-us';
  const encodedUrl = encodeURIComponent(destinationUrl);

  return `https://click.linksynergy.com/deeplink?id=${rakutenId}&mid=${rakutenMid}&murl=${encodedUrl}`;
}
