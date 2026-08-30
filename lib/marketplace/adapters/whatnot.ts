/**
 * Whatnot bulk-import adapter.
 *
 * Column order and every exact-match value below come from Whatnot's live
 * "United States, Australia, and the Netherlands (non-Coins)" template:
 * https://docs.google.com/spreadsheets/d/1UNxbyQoXjpjuqYcCE_Ie94OTCEB7lXR7Yz84aynILW4
 *
 * Whatnot rejects a row outright if Category / Sub Category / Type / Condition /
 * Shipping Profile don't match its approved list character-for-character, so
 * these constants are the contract. Don't "tidy" the spelling or capitalisation.
 */

import { buildCsv } from '@/lib/csv';
import { buildTitle } from '../titles';
import { displaySetNumber } from '../catalog';
import { formatPrice, isPriceRounding, type PriceRounding } from '../pricing';
import { pickShippingProfile, type ShippingBand } from '../shipping';
import type {
  AdapterRowResult,
  ExportFile,
  ExportItem,
  MarketplaceAdapter,
  SourceCondition,
} from '../types';

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
 * Whatnot's own list has gaps — nothing between 3 and 4 oz, or between 6 and
 * 10 lbs. The 6-to-10 lb gap is wide enough to over-quote a buyer noticeably,
 * so it's flagged via `gapBelowOz`.
 */
export const WHATNOT_SHIPPING_BANDS: ReadonlyArray<ShippingBand> = [
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
  { label: '10-14 lbs', maxOz: 224, gapBelowOz: 160 },
];

export interface WhatnotConditionMapping {
  new: WhatnotCondition;
  used: WhatnotCondition;
}

/**
 * FigTracker only records `new` / `used`, while Whatnot wants one of seven.
 * These defaults are the conservative reading of each: a loose minifig sold as
 * "new" is almost never boxed, and "used" claims no better than Good so the
 * buyer isn't disappointed.
 */
export const DEFAULT_CONDITION_MAPPING: WhatnotConditionMapping = {
  new: 'New without box',
  used: 'Used - Good',
};

export function mapWhatnotCondition(
  condition: SourceCondition | string,
  mapping: WhatnotConditionMapping = DEFAULT_CONDITION_MAPPING
): WhatnotCondition {
  return condition === 'new' ? mapping.new : mapping.used;
}

function isWhatnotCondition(value: unknown): value is WhatnotCondition {
  return (
    typeof value === 'string' &&
    (WHATNOT_LEGO_CONDITIONS as readonly string[]).includes(value)
  );
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface WhatnotOptions {
  type: WhatnotType;
  markupPercent: number;
  rounding: PriceRounding;
  conditionMapping: WhatnotConditionMapping;
  packagingOz: number;
  offerable: boolean;
  includeImages: boolean;
  titleMaxLength: number;
}

export const DEFAULT_WHATNOT_OPTIONS: WhatnotOptions = {
  type: 'Buy it Now',
  markupPercent: 0,
  rounding: 'exact',
  conditionMapping: DEFAULT_CONDITION_MAPPING,
  packagingOz: 2,
  offerable: true,
  includeImages: true,
  titleMaxLength: 80,
};

function toNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// Row
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

function buildWhatnotTitle(item: ExportItem, maxLength: number): string {
  return item.itemType === 'minifig'
    ? buildTitle(['LEGO', item.theme, item.cleanedName, 'Minifigure', item.itemNo], maxLength)
    : buildTitle(
        ['LEGO', item.theme, displaySetNumber(item.itemNo), item.cleanedName],
        maxLength
      );
}

function buildDescription(item: ExportItem, condition: WhatnotCondition): string {
  const parts: string[] = [];

  parts.push(
    item.catalogDescription?.trim() ||
      `Authentic LEGO ${item.itemType === 'minifig' ? 'minifigure' : 'set'}: ${item.name}.`
  );

  if (item.notes?.trim()) parts.push(item.notes.trim());

  parts.push(`Condition: ${condition}`);
  parts.push(`${item.itemType === 'minifig' ? 'Minifigure' : 'Set'} number: ${item.itemNo}`);

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export const whatnotAdapter: MarketplaceAdapter<WhatnotRow, WhatnotOptions> = {
  id: 'whatnot',
  label: 'Whatnot',
  fileExtension: 'csv',
  mimeType: 'text/csv; charset=utf-8',
  needsImages: true,

  parseOptions(raw: unknown): WhatnotOptions {
    const o = (raw ?? {}) as Record<string, any>;
    const d = DEFAULT_WHATNOT_OPTIONS;

    return {
      type: (WHATNOT_TYPES as readonly string[]).includes(o.type) ? o.type : d.type,
      markupPercent: clamp(toNumber(o.markupPercent, d.markupPercent), -90, 500),
      rounding: isPriceRounding(o.rounding) ? o.rounding : d.rounding,
      conditionMapping: {
        new: isWhatnotCondition(o.conditionMapping?.new)
          ? o.conditionMapping.new
          : d.conditionMapping.new,
        used: isWhatnotCondition(o.conditionMapping?.used)
          ? o.conditionMapping.used
          : d.conditionMapping.used,
      },
      packagingOz: clamp(toNumber(o.packagingOz, d.packagingOz), 0, 64),
      offerable: typeof o.offerable === 'boolean' ? o.offerable : d.offerable,
      includeImages: typeof o.includeImages === 'boolean' ? o.includeImages : d.includeImages,
      titleMaxLength: clamp(toNumber(o.titleMaxLength, d.titleMaxLength), 20, 140),
    };
  },

  toRow(item: ExportItem, options: WhatnotOptions): AdapterRowResult<WhatnotRow> {
    const warnings: string[] = [];

    const shipping = pickShippingProfile(item.weightGrams, WHATNOT_SHIPPING_BANDS, {
      packagingOz: options.packagingOz,
      fallbackProfile: '1-3 oz',
      marketplaceLabel: 'Whatnot',
    });
    if (shipping.warning) warnings.push(shipping.warning);

    const condition = mapWhatnotCondition(item.condition, options.conditionMapping);

    return {
      warnings,
      row: {
        category: WHATNOT_CATEGORY,
        subCategory:
          item.itemType === 'minifig' ? WHATNOT_SUBCATEGORY.minifig : WHATNOT_SUBCATEGORY.set,
        title: buildWhatnotTitle(item, options.titleMaxLength),
        description: buildDescription(item, condition),
        quantity: item.quantity,
        type: options.type,
        price: formatPrice(item.priceUsd, options.markupPercent, options.rounding),
        shippingProfile: shipping.profile,
        // Offers only mean anything on a fixed-price listing.
        offerable: options.offerable && options.type === 'Buy it Now' ? 'TRUE' : 'FALSE',
        hazmat: WHATNOT_HAZMAT,
        condition,
        costPerItem: item.costUsd !== undefined ? item.costUsd.toFixed(2) : '',
        sku: item.itemNo,
        imageUrls: item.imageUrl ? [item.imageUrl] : [],
      },
    };
  },

  serialise(rows: WhatnotRow[]): ExportFile[] {
    return [{ nameHint: 'whatnot', content: buildCsv(WHATNOT_COLUMNS, rows.map(rowToValues)) }];
  },
};
