/**
 * Turns a slice of a user's collection into Whatnot CSV rows.
 *
 * Sits between the API routes and the pure builders in lib/whatnot-csv.ts:
 * loads the items, joins catalog data (theme, weight, description), applies the
 * seller's options, and reports anything the seller should look at before
 * uploading.
 */

import { database } from '@/lib/database';
import { prisma } from '@/lib/prisma';
import { findMinifigByNumber } from '@/lib/catalog-static';
import { getBoxByNumber } from '@/lib/boxes-data';
import type { CatalogItemType } from '@/lib/listing-images';
import {
  DEFAULT_CONDITION_MAPPING,
  WHATNOT_CATEGORY,
  WHATNOT_HAZMAT,
  WHATNOT_LEGO_CONDITIONS,
  WHATNOT_SUBCATEGORY,
  buildMinifigTitle,
  buildSetTitle,
  formatPrice,
  mapCondition,
  parseCatalogWeight,
  pickShippingProfile,
  themeFromCategory,
  type ConditionMapping,
  type PriceRounding,
  type WhatnotCondition,
  type WhatnotRow,
  type WhatnotType,
} from '@/lib/whatnot-csv';

export const EXPORT_SOURCES = [
  'minifig-inventory',
  'minifig-collection',
  'set-inventory',
  'set-collection',
] as const;
export type ExportSource = (typeof EXPORT_SOURCES)[number];

export function isExportSource(value: unknown): value is ExportSource {
  return typeof value === 'string' && (EXPORT_SOURCES as readonly string[]).includes(value);
}

export function itemTypeForSource(source: ExportSource): CatalogItemType {
  return source === 'set-inventory' || source === 'set-collection' ? 'set' : 'minifig';
}

export interface ExportOptions {
  type: WhatnotType;
  markupPercent: number;
  rounding: PriceRounding;
  conditionMapping: ConditionMapping;
  packagingOz: number;
  offerable: boolean;
  includeImages: boolean;
  titleMaxLength: number;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  type: 'Buy it Now',
  markupPercent: 0,
  rounding: 'exact',
  conditionMapping: DEFAULT_CONDITION_MAPPING,
  packagingOz: 2,
  offerable: true,
  includeImages: true,
  titleMaxLength: 80,
};

/** Hard ceiling on one export, so a malformed request can't tie up the server. */
export const MAX_EXPORT_ITEMS = 1000;

export interface ParsedExportRequest {
  source: ExportSource;
  itemIds: string[];
  options: ExportOptions;
}

/**
 * Result of validating a request body.
 *
 * Flat rather than a discriminated union: this project compiles with
 * `strict: false`, which turns off the narrowing a `{ok: true} | {ok: false}`
 * union would rely on. Callers check `error` first.
 */
export interface ParseResult {
  error: string | null;
  value: ParsedExportRequest | null;
}

/**
 * Validate and normalise a request body from the export tool.
 *
 * Everything is clamped rather than trusted: a negative markup or a 900 oz
 * packaging allowance would silently produce nonsense listings.
 */
export function parseExportRequest(body: unknown): ParseResult {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body', value: null };
  }

  const raw = body as Record<string, any>;

  if (!isExportSource(raw.source)) {
    return {
      error: `Invalid source. Must be one of: ${EXPORT_SOURCES.join(', ')}`,
      value: null,
    };
  }

  const itemIds = Array.isArray(raw.itemIds)
    ? raw.itemIds.filter((id: unknown): id is string => typeof id === 'string').slice(0, MAX_EXPORT_ITEMS)
    : [];

  const o = (raw.options ?? {}) as Record<string, any>;
  const d = DEFAULT_EXPORT_OPTIONS;

  const type: WhatnotType = ['Auction', 'Buy it Now', 'Giveaway'].includes(o.type)
    ? o.type
    : d.type;

  const rounding: PriceRounding = ['exact', 'whole', 'ninetyNine'].includes(o.rounding)
    ? o.rounding
    : d.rounding;

  const conditionMapping: ConditionMapping = {
    new: isWhatnotCondition(o.conditionMapping?.new)
      ? o.conditionMapping.new
      : d.conditionMapping.new,
    used: isWhatnotCondition(o.conditionMapping?.used)
      ? o.conditionMapping.used
      : d.conditionMapping.used,
  };

  return {
    error: null,
    value: {
      source: raw.source,
      itemIds,
      options: {
        type,
        markupPercent: clamp(toNumber(o.markupPercent, d.markupPercent), -90, 500),
        rounding,
        conditionMapping,
        packagingOz: clamp(toNumber(o.packagingOz, d.packagingOz), 0, 64),
        offerable: typeof o.offerable === 'boolean' ? o.offerable : d.offerable,
        includeImages: typeof o.includeImages === 'boolean' ? o.includeImages : d.includeImages,
        titleMaxLength: clamp(toNumber(o.titleMaxLength, d.titleMaxLength), 20, 140),
      },
    },
  };
}

function isWhatnotCondition(value: unknown): value is WhatnotCondition {
  return (
    typeof value === 'string' &&
    (WHATNOT_LEGO_CONDITIONS as readonly string[]).includes(value)
  );
}

function toNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** One item's outcome: either a row to export, or a reason it was left out. */
export interface BuiltItem {
  itemId: string;
  itemNo: string;
  itemType: CatalogItemType;
  name: string;
  row: WhatnotRow | null;
  /** Non-blocking things the seller should check (weight guesses, missing image). */
  warnings: string[];
  /** Set when the item can't be exported at all. */
  skippedReason?: string;
}

export interface BuildResult {
  items: BuiltItem[];
  rows: WhatnotRow[];
  skipped: BuiltItem[];
}

/**
 * Fetch the user's items for one collection.
 *
 * Country is pinned to US on purpose. The US Whatnot template's Price column is
 * USD, and the collection pages convert prices into the user's display currency
 * — so asking for the user's own region here would quietly write, say, euros
 * into a dollars column.
 */
async function loadItems(userId: string, source: ExportSource): Promise<any[]> {
  switch (source) {
    case 'minifig-inventory':
      return database.getAllItems(userId, 'US', '');
    case 'minifig-collection':
      return database.getAllPersonalItems(userId, 'US', '');
    case 'set-inventory':
      return database.getAllSetInventoryItems(userId, 'US', '');
    case 'set-collection':
      return database.getAllSetPersonalCollectionItems(userId, 'US', '');
  }
}

/** Catalog descriptions live in the DB, in four languages. */
async function loadDescriptions(
  itemType: CatalogItemType,
  itemNos: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (itemNos.length === 0) return map;

  try {
    if (itemType === 'minifig') {
      const rows = await prisma.minifigCatalog.findMany({
        where: { minifigure_no: { in: itemNos } },
        select: { minifigure_no: true, description_en: true },
      });
      for (const row of rows) {
        if (row.description_en) map.set(row.minifigure_no, row.description_en);
      }
    } else {
      const rows = await prisma.setsCatalog.findMany({
        where: { box_no: { in: itemNos } },
        select: { box_no: true, description_en: true },
      });
      for (const row of rows) {
        if (row.description_en) map.set(row.box_no, row.description_en);
      }
    }
  } catch (error) {
    // A missing description is cosmetic — never fail the whole export over it.
    console.warn('[whatnot-export] description lookup failed:', error);
  }

  return map;
}

function buildDescription(
  name: string,
  itemNo: string,
  itemType: CatalogItemType,
  condition: WhatnotCondition,
  catalogDescription: string | undefined,
  sellerNotes: string | undefined
): string {
  const parts: string[] = [];

  parts.push(
    catalogDescription?.trim() ||
      `Authentic LEGO ${itemType === 'minifig' ? 'minifigure' : 'set'}: ${name}.`
  );

  if (sellerNotes?.trim()) parts.push(sellerNotes.trim());

  parts.push(`Condition: ${condition}`);
  parts.push(`${itemType === 'minifig' ? 'Minifigure' : 'Set'} number: ${itemNo}`);

  return parts.join('\n\n');
}

/**
 * Build rows for the selected items.
 *
 * Image URLs are left blank here; the export route fills them in after
 * mirroring, so the preview stays fast and touches no network.
 */
export async function buildExportRows(
  userId: string,
  source: ExportSource,
  itemIds: string[],
  options: ExportOptions
): Promise<BuildResult> {
  const itemType = itemTypeForSource(source);
  const all = await loadItems(userId, source);

  // Ownership is implicit: loadItems only ever returns this user's rows, so an
  // id belonging to someone else simply doesn't match anything here.
  const selected =
    itemIds.length > 0 ? all.filter((item) => itemIds.includes(item.id)) : all;

  const itemNos = Array.from(
    new Set(
      selected.map((item) => (itemType === 'minifig' ? item.minifigure_no : item.box_no))
    )
  );
  const descriptions = await loadDescriptions(itemType, itemNos);

  const items: BuiltItem[] = [];

  for (const item of selected) {
    const itemNo = itemType === 'minifig' ? item.minifigure_no : item.box_no;
    const name = itemType === 'minifig' ? item.minifigure_name : item.set_name;
    const warnings: string[] = [];

    const built: BuiltItem = {
      itemId: item.id,
      itemNo,
      itemType,
      name,
      row: null,
      warnings,
    };

    // --- price -----------------------------------------------------------
    const suggested = item.pricing?.suggestedPrice ?? 0;

    if (!suggested || suggested <= 0) {
      built.skippedReason =
        'No price available yet — FigTracker has no recent BrickLink data for this item. Refresh its price, then export again.';
      items.push(built);
      continue;
    }

    const currency = item.pricing?.currencyCode;
    if (currency && currency !== 'USD') {
      warnings.push(
        `Price came back as ${currency}, but the Whatnot US template expects USD. Check this row.`
      );
    }

    // --- catalog: theme + weight ----------------------------------------
    let theme = '';
    let grams: number | null = null;

    if (itemType === 'minifig') {
      const catalog = await findMinifigByNumber(itemNo);
      theme = themeFromCategory(catalog?.category_name);
      grams = parseCatalogWeight(catalog?.weight);
    } else {
      const box = getBoxByNumber(itemNo);
      theme = themeFromCategory(box?.category_name ?? item.category_name);
      grams = parseCatalogWeight(box?.weight);
    }

    const shipping = pickShippingProfile(grams, options.packagingOz);
    if (shipping.warning) warnings.push(shipping.warning);

    // --- the row ---------------------------------------------------------
    const condition = mapCondition(item.condition, options.conditionMapping);

    const title =
      itemType === 'minifig'
        ? buildMinifigTitle(cleanName(name), theme, itemNo, options.titleMaxLength)
        : buildSetTitle(cleanName(name), theme, itemNo, options.titleMaxLength);

    built.row = {
      category: WHATNOT_CATEGORY,
      subCategory: itemType === 'minifig' ? WHATNOT_SUBCATEGORY.minifig : WHATNOT_SUBCATEGORY.set,
      title,
      description: buildDescription(
        name,
        itemNo,
        itemType,
        condition,
        descriptions.get(itemNo),
        item.notes
      ),
      quantity: item.quantity ?? 1,
      type: options.type,
      price: formatPrice(suggested, options.markupPercent, options.rounding),
      shippingProfile: shipping.profile,
      // Offers only mean anything on a fixed-price listing.
      offerable: options.offerable && options.type === 'Buy it Now' ? 'TRUE' : 'FALSE',
      hazmat: WHATNOT_HAZMAT,
      condition,
      costPerItem: '',
      sku: itemNo,
      imageUrls: [],
    };

    items.push(built);
  }

  return {
    items,
    rows: items.filter((i) => i.row).map((i) => i.row as WhatnotRow),
    skipped: items.filter((i) => i.skippedReason),
  };
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
 * Same rule as extractCharacterName() in lib/listing-templates.ts, which the
 * per-item listing generator already applies.
 */
function cleanName(fullName: string): string {
  if (!fullName) return '';

  let base = fullName;
  const parenIndex = base.indexOf('(');
  if (parenIndex > -1) base = base.slice(0, parenIndex);

  const commaIndex = base.indexOf(',');
  if (commaIndex > -1) base = base.slice(0, commaIndex);

  return base.trim() || fullName.trim();
}
