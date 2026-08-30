/**
 * Building buyer-facing listing titles.
 *
 * Marketplaces differ in what they want — eBay rewards keyword-dense titles,
 * BrickLink doesn't use a title at all — so adapters supply the parts and the
 * length cap, and this module only handles assembly and trimming.
 */

/**
 * Trim a title to `maxLength` without cutting a word in half.
 */
export function truncateTitle(title: string, maxLength = 80): string {
  const clean = title.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;

  const cut = clean.slice(0, maxLength);

  // The cut already landed on a word boundary — keep the whole thing.
  if (clean[maxLength] === ' ') return cut.trim();

  const lastSpace = cut.lastIndexOf(' ');
  // Only fall back to a hard cut if the first "word" is itself longer than the limit.
  return (lastSpace > maxLength * 0.5 ? cut.slice(0, lastSpace) : cut).trim();
}

/**
 * Tidy a catalog name for a buyer-facing title.
 *
 * Catalog names carry trailing qualifiers that eat the title's character budget
 * without helping a buyer — parenthetical variant detail ("Boba Fett (Cloud City
 * - Printed Arms)") and comma-separated sub-titles ("Hard Hat Emmet, The LEGO
 * Movie"). Trimming both leaves room for the item number, which LEGO buyers
 * actually search on. The full name still appears in the description.
 *
 * Same rule as `extractCharacterName` in lib/listing-templates.ts, which the
 * per-item listing generator applies.
 */
export function cleanName(fullName: string): string {
  if (!fullName) return '';

  let base = fullName;
  const parenIndex = base.indexOf('(');
  if (parenIndex > -1) base = base.slice(0, parenIndex);

  const commaIndex = base.indexOf(',');
  if (commaIndex > -1) base = base.slice(0, commaIndex);

  return base.trim() || fullName.trim();
}

/** Join title parts, dropping empties, then trim to the cap. */
export function buildTitle(parts: ReadonlyArray<string>, maxLength = 80): string {
  return truncateTitle(parts.filter(Boolean).join(' '), maxLength);
}
