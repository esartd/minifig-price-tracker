/**
 * Affiliate link utilities for Amazon Associates and LEGO Partner Program monetization
 */

const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'ericksu0c-20';
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
export function generateAmazonLegoSetLink(setNumber: string, setName: string): string {
  // Search for LEGO set on Amazon (most reliable for finding current inventory)
  const searchQuery = `LEGO ${setNumber} ${setName}`;
  const encodedQuery = encodeURIComponent(searchQuery);

  return `https://www.amazon.com/s?k=${encodedQuery}&tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * Amazon Associates direct product link (if you have ASIN)
 * @param asin - Amazon product ASIN
 */
export function generateAmazonAffiliateLink(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * BrickLink catalog link generator - goes directly to stores/sellers tab
 * @param itemType - 'S' for sets, 'M' for minifigs
 * @param itemNo - Item number
 */
export function generateBrickLinkAffiliateLink(itemType: string, itemNo: string): string {
  const bricklinkId = process.env.BRICKLINK_AFFILIATE_ID || '';

  // Base URL with item
  let url = `https://www.bricklink.com/v2/catalog/catalogitem.page?${itemType}=${itemNo}`;

  // Add affiliate ID if available
  if (bricklinkId) {
    url += `&affid=${bricklinkId}`;
  }

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
export function generateAmazonMinifigLink(minifigNo: string, minifigName: string): string {
  const searchQuery = `LEGO Minifigure ${minifigNo} ${minifigName}`;
  const encodedQuery = encodeURIComponent(searchQuery);

  return `https://www.amazon.com/s?k=${encodedQuery}&tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * BrickLink minifig page link
 * @param minifigNo - Minifig number (e.g., "sw1219")
 */
export function generateBrickLinkMinifigLink(minifigNo: string): string {
  return generateBrickLinkAffiliateLink('M', minifigNo);
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
