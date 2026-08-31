/**
 * eBay File Exchange adapter.
 *
 * Field names, required markers and allowed values come from eBay's own
 * "File Exchange Basic Template Instructions" (v3.5.2). Category and condition
 * IDs were fetched live from eBay's Taxonomy and Sell Metadata APIs rather than
 * guessed — see the constants below.
 *
 * Two things make eBay stricter than the other adapters:
 *  - `*Description` may not contain line breaks. Raw newlines break the row, so
 *    the description is emitted as HTML with <p> and <br>.
 *  - Several required fields are seller business decisions eBay won't infer —
 *    where you are, how fast you ship, whether you take returns. They're
 *    exposed as settings with conservative defaults.
 *
 * The one thing still worth checking against a real upload is `Action` handling
 * and any category-specific item specifics eBay may demand; File Exchange
 * reports those per row rather than rejecting the file.
 */

import { buildCsv } from '@/lib/csv';
import { buildTitle } from '../titles';
import { displaySetNumber } from '../catalog';
import { formatPrice, isPriceRounding, type PriceRounding } from '../pricing';
import type {
  AdapterRowResult,
  ExportFile,
  ExportItem,
  MarketplaceAdapter,
} from '../types';

// ---------------------------------------------------------------------------
// Values verified against eBay's live APIs (EBAY_US, category tree 0)
// ---------------------------------------------------------------------------

/**
 * Toys & Hobbies > Building Toys > LEGO (R) Building Toys > ...
 * Confirmed via commerce/taxonomy get_category_suggestions.
 */
export const EBAY_CATEGORY = {
  minifig: '263012', // LEGO (R) Minifigures
  set: '19006', // LEGO (R) Complete Sets & Packs
} as const;

/**
 * Allowed ConditionIDs per category, from sell/metadata
 * get_item_condition_policies. Condition IDs are numeric and category-specific,
 * so these are not interchangeable with any other category's.
 *
 *   263012 (Minifigures): 1000 New, 3000 Used
 *   19006  (Sets):        1000 New, 1500 New: Other, 3000 Used
 */
export const EBAY_CONDITION = {
  new: '1000',
  newOther: '1500',
  used: '3000',
} as const;

/** Durations eBay accepts. GTC is fixed-price only. */
export const EBAY_DURATIONS = ['1', '3', '5', '7', '10', '30', 'GTC'] as const;
export type EbayDuration = (typeof EBAY_DURATIONS)[number];

export const EBAY_FORMATS = ['FixedPrice', 'Auction'] as const;
export type EbayFormat = (typeof EBAY_FORMATS)[number];

export const EBAY_COLUMNS = [
  // Action must be the first cell of the first row.
  '*Action',
  '*Category',
  'Title',
  '*Description',
  '*ConditionID',
  'PicURL',
  '*Format',
  '*StartPrice',
  '*Quantity',
  '*Duration',
  '*Location',
  '*DispatchTimeMax',
  '*ReturnsAcceptedOption',
  '*ShippingType',
  'ShippingService-1:Option',
  'ShippingService-1:Cost',
  'CustomLabel',
] as const;

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface EbayOptions {
  markupPercent: number;
  rounding: PriceRounding;
  format: EbayFormat;
  duration: EbayDuration;
  /** State and country, e.g. "Utah, United States". eBay rejects a postal code here. */
  location: string;
  /** Business days to dispatch after cleared payment. */
  dispatchTimeMax: number;
  returnsAccepted: boolean;
  /** Flat-rate shipping service code, e.g. USPSFirstClass. */
  shippingService: string;
  shippingCost: number;
  includeImages: boolean;
  titleMaxLength: number;
}

export const DEFAULT_EBAY_OPTIONS: EbayOptions = {
  markupPercent: 0,
  rounding: 'exact',
  format: 'FixedPrice',
  duration: 'GTC',
  location: '',
  dispatchTimeMax: 3,
  returnsAccepted: true,
  shippingService: 'USPSFirstClass',
  shippingCost: 4.99,
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

export interface EbayRow {
  action: string;
  category: string;
  title: string;
  description: string;
  conditionId: string;
  picUrl: string;
  format: string;
  startPrice: string;
  quantity: number;
  duration: string;
  location: string;
  dispatchTimeMax: number;
  returnsAcceptedOption: string;
  shippingType: string;
  shippingServiceOption: string;
  shippingServiceCost: string;
  customLabel: string;
}

function rowToValues(row: EbayRow): Array<string | number> {
  return [
    row.action,
    row.category,
    row.title,
    row.description,
    row.conditionId,
    row.picUrl,
    row.format,
    row.startPrice,
    row.quantity,
    row.duration,
    row.location,
    row.dispatchTimeMax,
    row.returnsAcceptedOption,
    row.shippingType,
    row.shippingServiceOption,
    row.shippingServiceCost,
    row.customLabel,
  ];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * eBay's Description field cannot contain line breaks — a raw newline breaks
 * the row apart. Paragraphs become <p> instead.
 */
function buildEbayDescription(item: ExportItem): string {
  const paragraphs: string[] = [];

  paragraphs.push(
    escapeHtml(
      item.catalogDescription?.trim() ||
        `Authentic LEGO ${item.itemType === 'minifig' ? 'minifigure' : 'set'}: ${item.name}.`
    )
  );

  if (item.notes?.trim()) paragraphs.push(escapeHtml(item.notes.trim()));

  if (item.itemType === 'set' && item.completeness) {
    paragraphs.push(`Completeness: ${escapeHtml(item.completeness)}`);
  }

  paragraphs.push(
    `${item.itemType === 'minifig' ? 'Minifigure' : 'Set'} number: ${escapeHtml(item.itemNo)}`
  );

  return paragraphs.map((p) => `<p>${p}</p>`).join('');
}

function buildEbayTitle(item: ExportItem, maxLength: number): string {
  // eBay rewards keyword density, so the item number and "LEGO" both stay in.
  return item.itemType === 'minifig'
    ? buildTitle(
        ['LEGO', item.theme, item.cleanedName, 'Minifigure', item.itemNo],
        maxLength
      )
    : buildTitle(
        ['LEGO', item.theme, displaySetNumber(item.itemNo), item.cleanedName, 'Set'],
        maxLength
      );
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export const ebayAdapter: MarketplaceAdapter<EbayRow, EbayOptions> = {
  id: 'ebay',
  label: 'eBay',
  fileExtension: 'csv',
  mimeType: 'text/csv; charset=utf-8',
  needsImages: true,

  parseOptions(raw: unknown): EbayOptions {
    const o = (raw ?? {}) as Record<string, any>;
    const d = DEFAULT_EBAY_OPTIONS;

    return {
      markupPercent: clamp(toNumber(o.markupPercent, d.markupPercent), -90, 500),
      rounding: isPriceRounding(o.rounding) ? o.rounding : d.rounding,
      format: (EBAY_FORMATS as readonly string[]).includes(o.format) ? o.format : d.format,
      duration: (EBAY_DURATIONS as readonly string[]).includes(String(o.duration))
        ? (String(o.duration) as EbayDuration)
        : d.duration,
      location: typeof o.location === 'string' ? o.location.slice(0, 45).trim() : d.location,
      dispatchTimeMax: clamp(toNumber(o.dispatchTimeMax, d.dispatchTimeMax), 0, 30),
      returnsAccepted:
        typeof o.returnsAccepted === 'boolean' ? o.returnsAccepted : d.returnsAccepted,
      shippingService:
        typeof o.shippingService === 'string' && o.shippingService.trim()
          ? o.shippingService.trim()
          : d.shippingService,
      shippingCost: clamp(toNumber(o.shippingCost, d.shippingCost), 0, 999),
      includeImages: typeof o.includeImages === 'boolean' ? o.includeImages : d.includeImages,
      titleMaxLength: clamp(toNumber(o.titleMaxLength, d.titleMaxLength), 20, 80),
    };
  },

  toRow(item: ExportItem, options: EbayOptions): AdapterRowResult<EbayRow> {
    const warnings: string[] = [];

    if (!options.location) {
      warnings.push(
        'eBay needs to know where the item ships from. Set your location in the eBay settings above, or the upload will be rejected.'
      );
    }

    // GTC is fixed-price only; an auction with GTC is rejected.
    let duration = options.duration;
    if (options.format === 'Auction' && duration === 'GTC') {
      duration = '7';
      warnings.push(
        'eBay does not allow Good Til Cancelled on auctions, so this row uses a 7-day duration instead.'
      );
    }

    return {
      warnings,
      row: {
        action: 'Add',
        category:
          item.itemType === 'minifig' ? EBAY_CATEGORY.minifig : EBAY_CATEGORY.set,
        title: buildEbayTitle(item, options.titleMaxLength),
        description: buildEbayDescription(item),
        conditionId: item.condition === 'new' ? EBAY_CONDITION.new : EBAY_CONDITION.used,
        picUrl: item.imageUrl ?? '',
        format: options.format,
        startPrice: formatPrice(item.priceUsd, options.markupPercent, options.rounding),
        quantity: item.quantity,
        duration,
        location: options.location,
        dispatchTimeMax: options.dispatchTimeMax,
        returnsAcceptedOption: options.returnsAccepted
          ? 'ReturnsAccepted'
          : 'ReturnsNotAccepted',
        shippingType: 'Flat',
        shippingServiceOption: options.shippingService,
        shippingServiceCost: options.shippingCost.toFixed(2),
        customLabel: item.itemNo,
      },
    };
  },

  serialise(rows: EbayRow[]): ExportFile[] {
    return [{ nameHint: 'ebay', content: buildCsv(EBAY_COLUMNS, rows.map(rowToValues)) }];
  },
};
