/**
 * Affiliate link utilities for Amazon Associates monetization
 */

const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'ericksu0c-20';

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
