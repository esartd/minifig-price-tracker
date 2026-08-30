/**
 * Turning FigTracker's suggested price into the number a marketplace wants.
 */

export type PriceRounding = 'exact' | 'whole' | 'ninetyNine';

/**
 * Apply the seller's markup and rounding.
 *
 * Always returns a plain decimal string with no currency symbol or thousands
 * separator — every marketplace's price column is a bare number.
 *
 * @param decimals  Places for 'exact'. Default 2; BrickLink accepts 4 and its
 *                  sellers routinely price sub-cent, so its adapter passes 4.
 */
export function formatPrice(
  suggestedUsd: number,
  markupPercent = 0,
  rounding: PriceRounding = 'exact',
  decimals = 2
): string {
  const marked = suggestedUsd * (1 + markupPercent / 100);

  switch (rounding) {
    case 'whole':
      return String(Math.max(1, Math.round(marked)));
    case 'ninetyNine': {
      const floor = Math.max(0, Math.floor(marked));
      return `${floor}.99`;
    }
    case 'exact':
    default:
      return marked.toFixed(decimals);
  }
}

export function isPriceRounding(value: unknown): value is PriceRounding {
  return value === 'exact' || value === 'whole' || value === 'ninetyNine';
}
