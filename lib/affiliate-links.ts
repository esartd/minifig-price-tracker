/**
 * Affiliate link utilities for monetization
 */

// Rakuten Advertising (LEGO.com)
// Note: The * in the ID should NOT be URL encoded in the ID parameter itself
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || 'g*DYfXR3HYU';
const RAKUTEN_OFFER_ID = '1606623'; // LEGO.com offer ID

// Amazon Associates
const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'ericksu0c-20';

/**
 * Generate Rakuten affiliate link for LEGO.com
 * Since we can't reliably generate product URLs, we use deep links via Rakuten's deeplink generator
 * This requires using the simpler format that Rakuten's system will process
 *
 * @param setNumber - LEGO set number (e.g., "75373")
 * @param setName - Set name for context
 */
export function generateLegoAffiliateLink(setNumber: string, setName: string): string {
  // LEGO.com homepage with affiliate tracking
  // Users will need to search for the set, but we still get credit for purchases
  const legoUrl = 'https://www.lego.com/en-us';

  // Rakuten deep link with proper URL encoding
  // The * in the ID needs to be %2A for URL encoding
  const encodedId = RAKUTEN_AFFILIATE_ID.replace('*', '%2A');

  // Use subid to track which set was clicked (for your own analytics)
  const affiliateLink = `https://click.linksynergy.com/deeplink?id=${encodedId}&mid=13923&murl=${encodeURIComponent(legoUrl)}`;

  return affiliateLink;
}

/**
 * Generate tracking pixel URL for Rakuten (1x1 transparent image for conversion tracking)
 */
export function generateTrackingPixel(setNumber: string): string {
  return `https://ad.linksynergy.com/fs-bin/show?id=${encodeURIComponent(RAKUTEN_AFFILIATE_ID)}&bids=${RAKUTEN_OFFER_ID}.1&type=2&subid=${encodeURIComponent(setNumber)}`;
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
