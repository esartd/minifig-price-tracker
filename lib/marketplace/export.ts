/**
 * Turns a slice of a user's collection into normalised export items.
 *
 * Marketplace-agnostic: loads the rows, joins catalog data (theme, weight,
 * description), settles the price, and hands each adapter a finished
 * `ExportItem`. Adapters never touch Prisma or the catalog.
 */

import { database } from '@/lib/database';
import { prisma } from '@/lib/prisma';
import { findMinifigByNumber } from '@/lib/catalog-static';
import { getBoxByNumber } from '@/lib/boxes-data';
import { parseCatalogWeight, themeFromCategory } from './catalog';
import { cleanName } from './titles';
import {
  isExportSource,
  itemTypeForSource,
  EXPORT_SOURCES,
  type CatalogItemType,
  type ExportItem,
  type ExportSource,
} from './types';

/** Hard ceiling on one export, so a malformed request can't tie up the server. */
export const MAX_EXPORT_ITEMS = 1000;

/**
 * Fetch the user's items for one collection.
 *
 * Country defaults to US on purpose. The US marketplace templates price in USD,
 * and the collection pages convert prices into the user's display currency — so
 * asking for the user's own region here would quietly write, say, euros into a
 * dollars column.
 */
async function loadItems(
  userId: string,
  source: ExportSource,
  countryCode = 'US',
  region = ''
): Promise<any[]> {
  switch (source) {
    case 'minifig-inventory':
      return database.getAllItems(userId, countryCode, region);
    case 'minifig-collection':
      return database.getAllPersonalItems(userId, countryCode, region);
    case 'set-inventory':
      return database.getAllSetInventoryItems(userId, countryCode, region);
    case 'set-collection':
      return database.getAllSetPersonalCollectionItems(userId, countryCode, region);
  }
}

/** Catalog descriptions live in the DB, in four languages. */
async function loadDescriptions(
  itemType: CatalogItemType,
  itemNos: string[],
  locale: 'en' | 'de' | 'fr' | 'es' = 'en'
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (itemNos.length === 0) return map;

  const column = `description_${locale}` as const;

  try {
    if (itemType === 'minifig') {
      const rows = await prisma.minifigCatalog.findMany({
        where: { minifigure_no: { in: itemNos } },
        select: { minifigure_no: true, [column]: true } as any,
      });
      for (const row of rows as any[]) {
        if (row[column]) map.set(row.minifigure_no, row[column]);
      }
    } else {
      const rows = await prisma.setsCatalog.findMany({
        where: { box_no: { in: itemNos } },
        select: { box_no: true, [column]: true } as any,
      });
      for (const row of rows as any[]) {
        if (row[column]) map.set(row.box_no, row[column]);
      }
    }
  } catch (error) {
    // A missing description is cosmetic — never fail the whole export over it.
    console.warn('[marketplace/export] description lookup failed:', error);
  }

  return map;
}

/** An item that can't be exported at all, and why. */
export interface SkippedItem {
  itemId: string;
  itemNo: string;
  name: string;
  reason: string;
}

export interface CollectResult {
  items: ExportItem[];
  skipped: SkippedItem[];
  /** Warnings raised while collecting, before any adapter sees the item. */
  warningsByItemNo: Map<string, string[]>;
  /** How many rows the user selected, including the ones that got skipped. */
  totalSelected: number;
}

/**
 * Load and normalise the selected items.
 *
 * Image URLs are left unset; the export route fills them in after mirroring,
 * and only for adapters that ask for images.
 */
export async function collectExportItems(
  userId: string,
  source: ExportSource,
  itemIds: string[]
): Promise<CollectResult> {
  const itemType = itemTypeForSource(source);
  const all = await loadItems(userId, source);

  // Ownership is implicit: loadItems only ever returns this user's rows, so an
  // id belonging to someone else simply doesn't match anything here.
  const selected = itemIds.length > 0 ? all.filter((item) => itemIds.includes(item.id)) : all;

  const itemNos = Array.from(
    new Set(selected.map((item) => (itemType === 'minifig' ? item.minifigure_no : item.box_no)))
  );
  const descriptions = await loadDescriptions(itemType, itemNos);

  const items: ExportItem[] = [];
  const skipped: SkippedItem[] = [];
  const warningsByItemNo = new Map<string, string[]>();

  for (const item of selected) {
    const itemNo = itemType === 'minifig' ? item.minifigure_no : item.box_no;
    const name = itemType === 'minifig' ? item.minifigure_name : item.set_name;

    const suggested = item.pricing?.suggestedPrice ?? 0;

    if (!suggested || suggested <= 0) {
      skipped.push({
        itemId: item.id,
        itemNo,
        name,
        reason:
          'No price available yet — FigTracker has no recent BrickLink data for this item. Refresh its price, then export again.',
      });
      continue;
    }

    const warnings: string[] = [];

    const currency = item.pricing?.currencyCode;
    if (currency && currency !== 'USD') {
      warnings.push(
        `Price came back as ${currency}, but the Whatnot US template expects USD. Check this row.`
      );
    }

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

    if (warnings.length) warningsByItemNo.set(itemNo, warnings);

    items.push({
      itemId: item.id,
      itemType,
      itemNo,
      name,
      cleanedName: cleanName(name),
      theme,
      quantity: item.quantity ?? 1,
      condition: item.condition === 'new' ? 'new' : 'used',
      priceUsd: suggested,
      currencyCode: currency,
      weightGrams: grams,
      catalogDescription: descriptions.get(itemNo),
      notes: item.notes,
    });
  }

  return { items, skipped, warningsByItemNo, totalSelected: selected.length };
}

// ---------------------------------------------------------------------------
// Request parsing
// ---------------------------------------------------------------------------

export interface ParsedExportRequest {
  source: ExportSource;
  itemIds: string[];
  /** Marketplace ids the user ticked. */
  marketplaces: string[];
  /** Raw per-marketplace options, keyed by marketplace id. Each adapter validates its own. */
  optionsByMarketplace: Record<string, unknown>;
}

/**
 * Result of validating a request body.
 *
 * Flat rather than a discriminated union: this project compiles with
 * `strict: false`, which turns off the narrowing a `{ok:true} | {ok:false}`
 * union would rely on. Callers check `error` first.
 */
export interface ParseResult {
  error: string | null;
  value: ParsedExportRequest | null;
}

/**
 * Validate and normalise a request body from the export tool.
 *
 * Only the envelope is checked here — source, item ids, which marketplaces.
 * Each adapter clamps its own settings in `parseOptions`.
 */
export function parseExportRequest(body: unknown, knownMarketplaces: string[]): ParseResult {
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
    ? raw.itemIds
        .filter((id: unknown): id is string => typeof id === 'string')
        .slice(0, MAX_EXPORT_ITEMS)
    : [];

  const requested: string[] = Array.isArray(raw.marketplaces)
    ? raw.marketplaces.filter((m: unknown): m is string => typeof m === 'string')
    : [];

  const marketplaces = requested.filter((m) => knownMarketplaces.includes(m));

  if (marketplaces.length === 0) {
    return {
      error: `Pick at least one marketplace. Available: ${knownMarketplaces.join(', ')}`,
      value: null,
    };
  }

  const optionsByMarketplace: Record<string, unknown> =
    raw.optionsByMarketplace && typeof raw.optionsByMarketplace === 'object'
      ? raw.optionsByMarketplace
      : {};

  return {
    error: null,
    value: { source: raw.source, itemIds, marketplaces, optionsByMarketplace },
  };
}
