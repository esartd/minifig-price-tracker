/**
 * eBay Partner Network (EPN) Affiliate Link Generator
 *
 * STATUS: NOT YET INTEGRATED - Waiting for Publisher ID from EPN
 *
 * To activate:
 * 1. Get Publisher ID from https://epn.ebay.com/
 * 2. Add to .env:
 *    EBAY_CAMPAIGN_ID=5339150379
 *    EBAY_PUBLISHER_ID=5338xxxxxx (your publisher ID)
 * 3. Import and use these functions in minifig/set pages
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
  const publisherId = process.env.NEXT_PUBLIC_EBAY_PUBLISHER_ID || 'PUBLISHER_ID_NEEDED';

  // Determine eBay site based on locale
  const ebaySite = EBAY_SITES[locale as Locale] || EBAY_SITES['en'];

  // Build search query: "LEGO [minifig number] [minifig name]"
  // Example: "LEGO sw0001 Luke Skywalker"
  const searchQuery = `LEGO ${minifigNumber} ${minifigName}`;
  const encodedQuery = encodeURIComponent(searchQuery);

  // eBay Partner Network URL structure
  // Format: https://rover.ebay.com/rover/1/711-53200-19255-0/1
  //         ?mpre=https%3A%2F%2Fwww.ebay.com%2Fsch%2Fi.html%3F_nkw%3D[query]
  //         &campid=[campaign_id]
  //         &toolid=10001
  //         &customid=[custom_tracking]

  const ebaySearchUrl = `https://www.${ebaySite}/sch/i.html?_nkw=${encodedQuery}`;
  const encodedEbayUrl = encodeURIComponent(ebaySearchUrl);

  // eBay Rover link (affiliate link wrapper)
  const roverDomain = getRoverDomain(ebaySite);
  const affiliateUrl =
    `https://rover.ebay.com/rover/1/${roverDomain}/1` +
    `?mpre=${encodedEbayUrl}` +
    `&campid=${campaignId}` +
    `&toolid=10001` +
    `&customid=minifig_${minifigNumber}`;

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
  const publisherId = process.env.NEXT_PUBLIC_EBAY_PUBLISHER_ID || 'PUBLISHER_ID_NEEDED';

  // Determine eBay site based on locale
  const ebaySite = EBAY_SITES[locale as Locale] || EBAY_SITES['en'];

  // Build search query: "LEGO [set number] [set name]"
  // Strip "-1" suffix for cleaner search
  const cleanSetNumber = setNumber.replace(/-1$/, '');
  const searchQuery = `LEGO ${cleanSetNumber} ${setName}`;
  const encodedQuery = encodeURIComponent(searchQuery);

  const ebaySearchUrl = `https://www.${ebaySite}/sch/i.html?_nkw=${encodedQuery}`;
  const encodedEbayUrl = encodeURIComponent(ebaySearchUrl);

  const roverDomain = getRoverDomain(ebaySite);
  const affiliateUrl =
    `https://rover.ebay.com/rover/1/${roverDomain}/1` +
    `?mpre=${encodedEbayUrl}` +
    `&campid=${campaignId}` +
    `&toolid=10001` +
    `&customid=set_${cleanSetNumber}`;

  return affiliateUrl;
}

/**
 * Get the correct eBay Rover domain ID for each eBay site
 * Different eBay sites use different rover domain codes
 */
function getRoverDomain(ebaySite: string): string {
  const roverMap: Record<string, string> = {
    'ebay.com': '711-53200-19255-0',      // US
    'ebay.de': '707-53477-19255-0',       // Germany
    'ebay.fr': '709-53476-19255-0',       // France
    'ebay.es': '1185-53479-19255-0',      // Spain
    'ebay.co.uk': '710-53481-19255-0',    // UK
    'ebay.it': '724-53478-19255-0',       // Italy
  };

  return roverMap[ebaySite] || roverMap['ebay.com'];
}

/**
 * Check if eBay affiliate is properly configured
 */
export function isEbayAffiliateConfigured(): boolean {
  const publisherId = process.env.NEXT_PUBLIC_EBAY_PUBLISHER_ID;
  return !!publisherId && publisherId !== 'PUBLISHER_ID_NEEDED';
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
