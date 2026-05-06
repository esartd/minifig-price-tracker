/**
 * eBay Partner Network (EPN) Affiliate Link Generator
 *
 * STATUS: READY TO USE
 * Campaign ID: 5339150379
 *
 * Uses eBay's modern API format with mkcid/mkrid parameters
 *
 * Button Order:
 * - Minifigures: eBay → BrickLink → Amazon
 * - Sets: eBay → Amazon → BrickLink
 */

// eBay site mapping by locale
const EBAY_SITES = {
  'en': 'ebay.com',
  'de': 'ebay.de',
  'fr': 'ebay.fr',
  'es': 'ebay.es',
  'en-GB': 'ebay.co.uk',
  'it': 'ebay.it',
} as const;

type Locale = keyof typeof EBAY_SITES;

/**
 * Generate eBay affiliate search link for a LEGO minifigure
 *
 * @param minifigNumber - BrickLink minifig number (e.g., "sw0001")
 * @param minifigName - Name for search query
 * @param locale - User locale for regional eBay site
 * @returns Affiliate URL that searches eBay for the minifigure
 */
export function generateEbayMinifigLink(
  minifigNumber: string,
  minifigName: string,
  locale: string = 'en'
): string {
  const campaignId = process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID || '5339150379';

  // Determine eBay site based on locale
  const ebaySite = EBAY_SITES[locale as Locale] || EBAY_SITES['en'];

  // Build search query: "LEGO [minifig number] [minifig name]"
  // Example: "LEGO sw0001 Luke Skywalker"
  const searchQuery = `LEGO ${minifigNumber} ${minifigName}`;
  const encodedQuery = encodeURIComponent(searchQuery);

  // Get marketing routing ID for this eBay site
  const mkrid = getMarketingRoutingId(ebaySite);

  // eBay Partner Network URL structure (modern API format)
  // Format: https://www.ebay.com/sch/i.html?_nkw=[query]
  //         &mkcid=1
  //         &mkrid=711-53200-19255-0
  //         &siteid=0
  //         &campid=5339150379
  //         &toolid=10001
  //         &mkevt=1

  const affiliateUrl =
    `https://www.${ebaySite}/sch/i.html?_nkw=${encodedQuery}` +
    `&mkcid=1` +
    `&mkrid=${mkrid}` +
    `&siteid=0` +
    `&campid=${campaignId}` +
    `&toolid=10001` +
    `&mkevt=1`;

  return affiliateUrl;
}

/**
 * Generate eBay affiliate search link for a LEGO set
 *
 * @param setNumber - LEGO set number (e.g., "75192-1")
 * @param setName - Set name for search query
 * @param locale - User locale for regional eBay site
 * @returns Affiliate URL that searches eBay for the set
 */
export function generateEbaySetLink(
  setNumber: string,
  setName: string,
  locale: string = 'en'
): string {
  const campaignId = process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID || '5339150379';

  // Determine eBay site based on locale
  const ebaySite = EBAY_SITES[locale as Locale] || EBAY_SITES['en'];

  // Build search query: "LEGO [set number] [set name]"
  // Strip "-1" suffix for cleaner search
  const cleanSetNumber = setNumber.replace(/-1$/, '');
  const searchQuery = `LEGO ${cleanSetNumber} ${setName}`;
  const encodedQuery = encodeURIComponent(searchQuery);

  // Get marketing routing ID for this eBay site
  const mkrid = getMarketingRoutingId(ebaySite);

  const affiliateUrl =
    `https://www.${ebaySite}/sch/i.html?_nkw=${encodedQuery}` +
    `&mkcid=1` +
    `&mkrid=${mkrid}` +
    `&siteid=0` +
    `&campid=${campaignId}` +
    `&toolid=10001` +
    `&mkevt=1`;

  return affiliateUrl;
}

/**
 * Get the marketing routing ID (mkrid) for each eBay site
 * These IDs are used in the modern eBay Partner Network API
 */
function getMarketingRoutingId(ebaySite: string): string {
  const mkridMap: Record<string, string> = {
    'ebay.com': '711-53200-19255-0',      // US
    'ebay.de': '707-53477-19255-0',       // Germany
    'ebay.fr': '709-53476-19255-0',       // France
    'ebay.es': '1185-53479-19255-0',      // Spain
    'ebay.co.uk': '710-53481-19255-0',    // UK
    'ebay.it': '724-53478-19255-0',       // Italy
  };

  return mkridMap[ebaySite] || mkridMap['ebay.com'];
}

/**
 * Check if eBay affiliate is properly configured
 */
export function isEbayAffiliateConfigured(): boolean {
  const campaignId = process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID;
  return !!campaignId;
}

/**
 * Get display-friendly eBay site name for current locale
 */
export function getEbaySiteName(locale: string = 'en'): string {
  const siteNames: Record<string, string> = {
    'en': 'eBay.com',
    'de': 'eBay.de',
    'fr': 'eBay.fr',
    'es': 'eBay.es',
    'en-GB': 'eBay.co.uk',
    'it': 'eBay.it',
  };

  return siteNames[locale] || 'eBay';
}
