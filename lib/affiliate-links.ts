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
 * BrickLink affiliate link generator (for future use)
 * @param itemType - 'S' for sets, 'M' for minifigs
 * @param itemNo - Item number
 */
export function generateBrickLinkAffiliateLink(itemType: string, itemNo: string): string {
  const bricklinkId = process.env.BRICKLINK_AFFILIATE_ID || '';
  if (!bricklinkId) {
    return `https://www.bricklink.com/v2/catalog/catalogitem.page?${itemType}=${itemNo}`;
  }

  // BrickLink affiliate structure (verify with their docs when you get approved)
  return `https://www.bricklink.com/v2/catalog/catalogitem.page?${itemType}=${itemNo}&affid=${bricklinkId}`;
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
