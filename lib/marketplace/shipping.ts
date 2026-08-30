/**
 * Picking a shipping profile from an item's catalog weight.
 *
 * Generic over the band table so each marketplace supplies its own; only the
 * rounding policy lives here.
 */

export const GRAMS_PER_OUNCE = 28.3495;

export interface ShippingBand {
  label: string;
  /** Upper bound of the band, in ounces. */
  maxOz: number;
  /**
   * Set when there is a gap beneath this band in the marketplace's ladder, i.e.
   * the previous band's ceiling is well below this one's. Anything landing in
   * that gap is quoted noticeably more shipping than it deserves, so we flag it
   * rather than quietly overcharging the buyer.
   */
  gapBelowOz?: number;
}

export interface ShippingPick {
  profile: string;
  /** Set when the seller should double-check before uploading. */
  warning?: string;
}

export interface ShippingPickOptions {
  /** Allowance for mailer + padding, in ounces. */
  packagingOz?: number;
  /** Band to fall back to when the catalog has no weight. Defaults to the lightest. */
  fallbackProfile?: string;
  /** Marketplace name, used in the warning text so it reads naturally. */
  marketplaceLabel?: string;
}

/**
 * Choose the band for an item.
 *
 * A marketplace shipping profile means *packed* weight — item plus mailer plus
 * padding — and marketplaces are explicit that under-declaring means the seller
 * eats the carrier adjustment. So this adds a packaging allowance and rounds
 * *up* to the first band that can hold the result. Erring heavy costs the buyer
 * a little; erring light costs the seller real money.
 *
 * `bands` must be sorted ascending by `maxOz`.
 */
export function pickShippingProfile(
  grams: number | null,
  bands: ReadonlyArray<ShippingBand>,
  options: ShippingPickOptions = {}
): ShippingPick {
  const { packagingOz = 2, fallbackProfile, marketplaceLabel = 'the marketplace' } = options;
  const fallback = fallbackProfile ?? bands[0]?.label ?? '';

  if (grams === null || !Number.isFinite(grams) || grams <= 0) {
    return {
      profile: fallback,
      warning: 'No catalog weight for this item — using a default. Check before uploading.',
    };
  }

  const packedOz = grams / GRAMS_PER_OUNCE + packagingOz;

  const band = bands.find((b) => packedOz <= b.maxOz);

  if (!band) {
    const heaviest = bands[bands.length - 1];
    return {
      profile: heaviest.label,
      warning: `Packed weight is about ${packedOz.toFixed(0)} oz, heavier than ${marketplaceLabel}'s largest standard profile. Create a custom shipping profile for this one.`,
    };
  }

  if (band.gapBelowOz !== undefined && packedOz < band.gapBelowOz) {
    return {
      profile: band.label,
      warning: `Packed weight is about ${packedOz.toFixed(0)} oz, which falls in a gap in ${marketplaceLabel}'s standard profiles. A custom profile would quote shipping more accurately.`,
    };
  }

  return { profile: band.label };
}
