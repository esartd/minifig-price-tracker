/**
 * Whatnot affiliate link generator.
 *
 * STATUS: READY TO USE
 * Partner ID: 2875567 (Erick Su), via impact.com
 *
 * Whatnot has no affiliate product feed and its Seller API only manages your
 * own store, so we cannot list other people's inventory. What we can do is
 * deep-link into Whatnot's search with affiliate credit attached, which is
 * what every link here produces.
 *
 * ## The two formats that matter
 *
 * Deep link:  {AFFILIATE_BASE}?u={url-encoded whatnot url}
 * Search url: https://www.whatnot.com/search?query={terms}
 *
 * Both were verified against the live site. Two details cost real time to
 * discover, so do not "tidy" them away:
 *
 *  - The search parameter is `query`, NOT `q`. Using `q` loads the search
 *    page with an empty query and renders "There's nothing here at the
 *    moment" — a working-looking page with no results.
 *  - `/search/<terms>` as a path segment is a 404. It must be a query string.
 *
 * ## Why the item number goes in the query
 *
 * Whatnot sellers commonly put BrickLink IDs in their listing titles, so
 * including the number sharpens the match — searching "LEGO Yoda sw0051"
 * surfaces listings literally titled "LEGO Star Wars Yoda Minifigure sw0051".
 * When nothing matches every word, Whatnot falls back to "Results matching
 * fewer words" rather than an empty page, so a rare item still lands
 * somewhere useful. Verified with both a common and an obscure minifig.
 */

/**
 * Erick's impact.com tracking link. Overridable so the link can be rotated
 * without a code change, matching how AMAZON_AFFILIATE_TAG and
 * NEXT_PUBLIC_EBAY_CAMPAIGN_ID are handled elsewhere.
 */
const AFFILIATE_BASE =
  process.env.NEXT_PUBLIC_WHATNOT_AFFILIATE_URL || 'https://whatnot.pxf.io/k4Jrdz';

const WHATNOT_SEARCH_URL = 'https://www.whatnot.com/search';

/** Sets are stored as "75192-1"; shoppers and sellers both say "75192". */
function displaySetNumber(boxNo: string): string {
  return boxNo.replace(/-\d+$/, '');
}

/**
 * Wrap any Whatnot URL in the affiliate redirect.
 *
 * Impact resolves `?u=` to the destination and appends its own tracking
 * (`irclickid`, `utm_partnerid=2875567`). Without the wrapper the visit is
 * untracked and earns nothing.
 */
export function buildWhatnotAffiliateUrl(destination: string): string {
  return `${AFFILIATE_BASE}?u=${encodeURIComponent(destination)}`;
}

/** Affiliate-tracked link to a Whatnot search for arbitrary terms. */
export function buildWhatnotSearchUrl(query: string): string {
  const terms = query.trim();
  if (!terms) return buildWhatnotAffiliateUrl('https://www.whatnot.com/');

  const search = `${WHATNOT_SEARCH_URL}?query=${encodeURIComponent(terms)}`;
  return buildWhatnotAffiliateUrl(search);
}

/**
 * Affiliate-tracked Whatnot search for a minifigure.
 *
 * @param itemNo   BrickLink minifig number, e.g. "sw0051"
 * @param name     Catalog name, e.g. "Yoda - Sand Green"
 */
export function buildWhatnotMinifigUrl(itemNo: string, name: string): string {
  return buildWhatnotSearchUrl(`LEGO ${name} ${itemNo}`);
}

/**
 * Affiliate-tracked Whatnot search for a set.
 *
 * @param itemNo   Catalog box number, with or without the "-1" suffix
 * @param name     Catalog name, e.g. "Millennium Falcon"
 */
export function buildWhatnotSetUrl(itemNo: string, name: string): string {
  return buildWhatnotSearchUrl(`LEGO ${name} ${displaySetNumber(itemNo)}`);
}
