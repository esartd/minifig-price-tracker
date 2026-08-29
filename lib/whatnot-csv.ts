/**
 * Whatnot bulk-import CSV builder.
 *
 * Column order and every exact-match value below come from Whatnot's live
 * "United States, Australia, and the Netherlands (non-Coins)" template:
 * https://docs.google.com/spreadsheets/d/1UNxbyQoXjpjuqYcCE_Ie94OTCEB7lXR7Yz84aynILW4
 *
 * Whatnot rejects a row outright if Category / Sub Category / Type / Condition /
 * Shipping Profile don't match its approved list character-for-character, so these
 * constants are the contract. Don't "tidy" the spelling or capitalisation.
 *
 * Pure module: no I/O, no Prisma, no Next. Safe to unit-test on its own.
 */

// ---------------------------------------------------------------------------
// Whatnot's approved values
// ---------------------------------------------------------------------------

/** Header row, in the exact order Whatnot's importer expects. */
export const WHATNOT_COLUMNS = [
  'Category',
  'Sub Category',
  'Title',
  'Description',
  'Quantity',
  'Type',
  'Price',
  'Shipping Profile',
  'Offerable',
  'Hazmat',
  'Condition',
  'Cost Per Item',
  'SKU',
  'Image URL 1',
  'Image URL 2',
  'Image URL 3',
  'Image URL 4',
  'Image URL 5',
  'Image URL 6',
  'Image URL 7',
  'Image URL 8',
] as const;

/** Every LEGO item we export sits under this one category. */
export const WHATNOT_CATEGORY = 'Toys & Hobbies';

export const WHATNOT_SUBCATEGORY = {
  minifig: 'LEGO Minifigures',
  set: 'LEGO Sets',
} as const;

export const WHATNOT_TYPES = ['Auction', 'Buy it Now', 'Giveaway'] as const;
export type WhatnotType = (typeof WHATNOT_TYPES)[number];

/**
 * Conditions are keyed by Sub Category, not Category. All three LEGO
 * sub-categories (Minifigures, Sets, Other LEGO) share this same list.
 */
export const WHATNOT_LEGO_CONDITIONS = [
  'New in box',
  'New with damaged box',
  'New without box',
  'Used - Like New',
  'Used - Good',
  'Used - Fair',
  'Used - Poor',
] as const;
export type WhatnotCondition = (typeof WHATNOT_LEGO_CONDITIONS)[number];

export const WHATNOT_HAZMAT = 'Not Hazmat';

/**
 * Imperial shipping bands from the template, with their upper bound in ounces.
 *
 * Whatnot's own list has gaps (nothing between 3 and 4 oz, or between 6 and
 * 10 lbs), so `pickShippingProfile` rounds up to the next band that can
 * actually hold the weight rather than trying to interpolate.
 *
 * Ordered ascending — `pickShippingProfile` relies on that.
 */
export const WHATNOT_SHIPPING_BANDS: ReadonlyArray<{ label: string; maxOz: number }> = [
  { label: '0-1 oz', maxOz: 1 },
  { label: '1-3 oz', maxOz: 3 },
  { label: '4-7 oz', maxOz: 7 },
  { label: '8-11 oz', maxOz: 11 },
  { label: '12-15 oz', maxOz: 15 },
  { label: '1 lb', maxOz: 16 },
  { label: '1-2 lbs', maxOz: 32 },
  { label: '2-3 lbs', maxOz: 48 },
  { label: '3-4 lbs', maxOz: 64 },
  { label: '4-6 lbs', maxOz: 96 },
  { label: '10-14 lbs', maxOz: 224 },
];

export const GRAMS_PER_OUNCE = 28.3495;

// ---------------------------------------------------------------------------
// CSV encoding
// ---------------------------------------------------------------------------

/**
 * True if a value would be treated as a formula when the user opens the CSV
 * in Sheets or Excel to eyeball it before uploading.
 *
 * A leading "-" only counts when it isn't just a negative number, so ordinary
 * values like "-5" stay untouched.
 */
function looksLikeFormula(value: string): boolean {
  if (!value) return false;
  const first = value[0];
  if (first === '=' || first === '+' || first === '@') return true;
  if (first === '-' && !/^-\d/.test(value)) return true;
  // Tab / CR at the start is another known spreadsheet-injection vector.
  return first === '\t' || first === '\r';
}

/**
 * Encode one field per RFC 4180.
 *
 * Descriptions are multi-line, so the embedded-newline case is the common one
 * here, not an edge case: any field containing a comma, quote, or newline gets
 * wrapped in quotes with inner quotes doubled.
 *
 * The formula guard is deliberately narrow. Prefixing an apostrophe changes the
 * value Whatnot receives, so it only fires on genuinely dangerous input — which
 * a LEGO catalog name realistically never is — rather than on every field.
 */
export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';

  let str = String(value);
  if (str === '') return '';

  if (looksLikeFormula(str)) {
    str = `'${str}`;
  }

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/** Join one row of already-raw values into a CSV line. */
export function buildCsvLine(values: ReadonlyArray<string | number | null | undefined>): string {
  return values.map(escapeCsvField).join(',');
}

/**
 * Serialise rows to a complete CSV document.
 *
 * CRLF line endings per RFC 4180. Plain UTF-8 with no BOM — a BOM helps Excel
 * guess the encoding but risks confusing Whatnot's parser, and the file's real
 * destination is Whatnot, not Excel.
 */
export function buildCsv(rows: ReadonlyArray<WhatnotRow>): string {
  const lines = [buildCsvLine(WHATNOT_COLUMNS)];
  for (const row of rows) {
    lines.push(buildCsvLine(rowToValues(row)));
  }
  return lines.join('\r\n') + '\r\n';
}

// ---------------------------------------------------------------------------
// Row shape
// ---------------------------------------------------------------------------

export interface WhatnotRow {
  category: string;
  subCategory: string;
  title: string;
  description: string;
  quantity: number;
  type: WhatnotType;
  price: string;
  shippingProfile: string;
  offerable: 'TRUE' | 'FALSE';
  hazmat: string;
  condition: WhatnotCondition;
  costPerItem: string;
  sku: string;
  imageUrls: string[];
}

function rowToValues(row: WhatnotRow): Array<string | number> {
  const images = Array.from({ length: 8 }, (_, i) => row.imageUrls[i] ?? '');
  return [
    row.category,
    row.subCategory,
    row.title,
    row.description,
    row.quantity,
    row.type,
    row.price,
    row.shippingProfile,
    row.offerable,
    row.hazmat,
    row.condition,
    row.costPerItem,
    row.sku,
    ...images,
  ];
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

export type SourceCondition = 'new' | 'used';

export interface ConditionMapping {
  new: WhatnotCondition;
  used: WhatnotCondition;
}

/**
 * FigTracker only records `new` / `used`, while Whatnot wants one of seven.
 * These defaults are the conservative reading of each: a loose minifig sold as
 * "new" is almost never boxed, and "used" claims no better than Good so the
 * buyer isn't disappointed.
 *
 * Both are overridable per export, and per row in the preview.
 */
export const DEFAULT_CONDITION_MAPPING: ConditionMapping = {
  new: 'New without box',
  used: 'Used - Good',
};

export function mapCondition(
  condition: string,
  mapping: ConditionMapping = DEFAULT_CONDITION_MAPPING
): WhatnotCondition {
  return condition === 'new' ? mapping.new : mapping.used;
}

export interface ShippingPick {
  profile: string;
  /** Set when the seller should double-check before uploading. */
  warning?: string;
}

/**
 * Choose a shipping profile from the item's catalog weight.
 *
 * Whatnot's profile means *packed* weight — item plus mailer plus padding —
 * and their docs are explicit that under-declaring means the seller eats the
 * carrier adjustment. So this adds a packaging allowance and then rounds *up*
 * to the first band that can hold the result. Erring heavy costs the buyer a
 * little; erring light costs the seller real money.
 *
 * @param grams        Catalog weight of the item itself, or null if unknown.
 * @param packagingOz  Allowance for mailer + padding. Default 2 oz.
 */
export function pickShippingProfile(
  grams: number | null,
  packagingOz = 2,
  fallbackProfile = '1-3 oz'
): ShippingPick {
  if (grams === null || !Number.isFinite(grams) || grams <= 0) {
    return {
      profile: fallbackProfile,
      warning: 'No catalog weight for this item — using a default. Check before uploading.',
    };
  }

  const packedOz = grams / GRAMS_PER_OUNCE + packagingOz;

  const band = WHATNOT_SHIPPING_BANDS.find((b) => packedOz <= b.maxOz);

  if (!band) {
    const heaviest = WHATNOT_SHIPPING_BANDS[WHATNOT_SHIPPING_BANDS.length - 1];
    return {
      profile: heaviest.label,
      warning: `Packed weight is about ${packedOz.toFixed(0)} oz, heavier than Whatnot's largest standard profile. Create a custom shipping profile for this one.`,
    };
  }

  // Whatnot's ladder jumps from 6 lbs straight to 10-14 lbs. Landing in that
  // gap means the buyer is quoted for noticeably more than the item weighs.
  if (band.label === '10-14 lbs' && packedOz < 160) {
    return {
      profile: band.label,
      warning: `Packed weight is about ${packedOz.toFixed(0)} oz, which falls in a gap in Whatnot's standard profiles. A custom profile would quote shipping more accurately.`,
    };
  }

  return { profile: band.label };
}

/**
 * Parse a catalog weight into grams.
 *
 * Catalog JSON stores weight as a string in grams, and uses "?" for unknown —
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

export type PriceRounding = 'exact' | 'whole' | 'ninetyNine';

/**
 * Apply the seller's markup and rounding to a suggested price.
 *
 * Always returns a plain decimal string with no currency symbol or thousands
 * separator — the Whatnot template's Price column is a bare number, and the US
 * template expects USD.
 */
export function formatPrice(
  suggestedUsd: number,
  markupPercent = 0,
  rounding: PriceRounding = 'exact'
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
      return marked.toFixed(2);
  }
}

/**
 * Trim a title to `maxLength` without cutting a word in half.
 *
 * Whatnot doesn't publish a title limit in the help article or the template, so
 * 80 is a deliberately conservative default. The in-app set listing generator
 * uses 100 as its own ceiling.
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
 * Strip a BrickLink variant suffix for display: "75192-1" reads as "75192" to a
 * buyer. The full number still goes in the SKU column so the seller can
 * reconcile the listing back to FigTracker.
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

export function buildMinifigTitle(
  characterName: string,
  theme: string,
  itemNo: string,
  maxLength = 80
): string {
  const parts = ['LEGO', theme, characterName, 'Minifigure', itemNo].filter(Boolean);
  return truncateTitle(parts.join(' '), maxLength);
}

export function buildSetTitle(
  setName: string,
  theme: string,
  boxNo: string,
  maxLength = 80
): string {
  const parts = ['LEGO', theme, displaySetNumber(boxNo), setName].filter(Boolean);
  return truncateTitle(parts.join(' '), maxLength);
}
