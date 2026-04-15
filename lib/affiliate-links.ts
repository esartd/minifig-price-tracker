/**
 * Affiliate Link Management
 *
 * Centralized helper for generating affiliate links to monetize FigTracker
 */

interface AffiliateConfig {
  amazon?: string;      // Amazon Associates tag
  rakuten?: string;     // Rakuten Advertising (for LEGO.com)
  bricklink?: string;   // BrickLink affiliate ID (optional)
}

// Load affiliate IDs from environment
const AFFILIATE_IDS: AffiliateConfig = {
  amazon: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || process.env.AMAZON_AFFILIATE_TAG,
  rakuten: process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID || process.env.RAKUTEN_AFFILIATE_ID,
  bricklink: process.env.NEXT_PUBLIC_BRICKLINK_AFFILIATE_ID || process.env.BRICKLINK_AFFILIATE_ID,
};

/**
 * Generate Amazon affiliate link for a LEGO set
 *
 * Amazon search URL with affiliate tag - searches for the specific set number
 * Users can then buy the set and you earn commission
 */
export function getAmazonSetUrl(setNo: string, setName: string): string {
  // Clean set number: "75301-1" → "75301"
  const cleanSetNo = setNo.split('-')[0];

  // Create search query: "LEGO 75301" or "LEGO 75301 Set Name"
  const searchQuery = encodeURIComponent(`LEGO ${cleanSetNo} ${setName}`);
  const baseUrl = `https://www.amazon.com/s?k=${searchQuery}`;

  if (AFFILIATE_IDS.amazon) {
    return `${baseUrl}&tag=${AFFILIATE_IDS.amazon}`;
  }

  return baseUrl;
}

/**
 * Generate direct Amazon product URL if ASIN is known
 *
 * @param asin - Amazon Standard Identification Number (e.g., "B08XQXZ7YZ")
 */
export function getAmazonProductUrl(asin: string): string {
  const baseUrl = `https://www.amazon.com/dp/${asin}`;

  if (AFFILIATE_IDS.amazon) {
    return `${baseUrl}?tag=${AFFILIATE_IDS.amazon}`;
  }

  return baseUrl;
}

/**
 * Generate LEGO.com affiliate link via Rakuten
 *
 * When Rakuten affiliate is set up, this will generate proper tracking links
 * For now, returns direct LEGO.com product page
 */
export function getLegoOfficialUrl(setNo: string): string {
  const cleanSetNo = setNo.split('-')[0];
  const baseUrl = `https://www.lego.com/en-us/product/${cleanSetNo}`;

  // TODO: Add Rakuten deep linking when available
  // Rakuten typically requires special API calls for deep links
  if (AFFILIATE_IDS.rakuten) {
    // Placeholder for future Rakuten integration
    // return `https://click.linksynergy.com/deeplink?id=${AFFILIATE_IDS.rakuten}&mid=13923&murl=${encodeURIComponent(baseUrl)}`;
  }

  return baseUrl;
}

/**
 * Generate BrickLink set URL (for reference/comparison, not primary affiliate)
 */
export function getBrickLinkSetUrl(setNo: string): string {
  const baseUrl = `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${setNo}`;

  if (AFFILIATE_IDS.bricklink) {
    return `${baseUrl}&afflid=${AFFILIATE_IDS.bricklink}`;
  }

  return baseUrl;
}

/**
 * Generate BrickLink price guide URL (for minifigure reference)
 */
export function getBrickLinkPriceGuideUrl(minifigNo: string): string {
  const baseUrl = `https://www.bricklink.com/catalogPG.asp?M=${minifigNo}&ColorID=0`;

  if (AFFILIATE_IDS.bricklink) {
    return `${baseUrl}&afflid=${AFFILIATE_IDS.bricklink}`;
  }

  return baseUrl;
}

/**
 * Check which affiliate programs are configured
 */
export function getConfiguredAffiliates(): {
  amazon: boolean;
  rakuten: boolean;
  bricklink: boolean;
} {
  return {
    amazon: !!AFFILIATE_IDS.amazon,
    rakuten: !!AFFILIATE_IDS.rakuten,
    bricklink: !!AFFILIATE_IDS.bricklink,
  };
}

/**
 * Get the primary purchase platform (Amazon preferred for best conversion)
 */
export function getPrimaryAffiliate(): 'amazon' | 'rakuten' | 'bricklink' | null {
  if (AFFILIATE_IDS.amazon) return 'amazon';
  if (AFFILIATE_IDS.rakuten) return 'rakuten';
  if (AFFILIATE_IDS.bricklink) return 'bricklink';
  return null;
}
