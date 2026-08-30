/**
 * Reading FigTracker's BrickLink-derived catalog data.
 *
 * These are catalog concerns, not marketplace concerns — every adapter needs
 * them and none of them owns them.
 */

/**
 * Parse a catalog weight into grams.
 *
 * Catalog JSON stores weight as a string in grams and uses "?" for unknown —
 * about 19% of sets and under 1% of minifigs.
 */
export function parseCatalogWeight(weight: string | number | null | undefined): number | null {
  if (weight === null || weight === undefined || weight === '') return null;
  if (typeof weight === 'number') return Number.isFinite(weight) && weight > 0 ? weight : null;

  const trimmed = weight.trim();
  if (trimmed === '' || trimmed === '?') return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Strip a BrickLink variant suffix for display: "75192-1" reads as "75192" to a
 * buyer. The full number still goes in the SKU column so the seller can
 * reconcile the listing back to FigTracker.
 *
 * Never use this for a BrickLink export — BrickLink wants the full number.
 */
export function displaySetNumber(boxNo: string): string {
  return boxNo.replace(/-\d+$/, '');
}

/**
 * Reduce a BrickLink category path to its top-level theme:
 * "Star Wars / The Bad Batch" becomes "Star Wars".
 */
export function themeFromCategory(categoryName: string | null | undefined): string {
  if (!categoryName) return '';
  return categoryName.split(' / ')[0].trim();
}
