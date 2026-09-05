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
  isSetCompleteness,
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

/** One item as a signed-out visitor's browser stores it. */
export interface GuestExportItem {
  itemNo: string;
  itemType: 'minifig' | 'set';
  name: string;
  quantity?: number;
  condition?: string;
  action?: 'sell' | 'keep';
}

/** Guest collections are capped at 100 items client-side; mirror that here. */
export const MAX_GUEST_EXPORT_ITEMS = 100;

/**
 * Turn a guest's localStorage collection into rows the collector understands.
 *
 * Prices are read from the price cache rather than taken from the request.
 * The client does hold a price — it stored one when the item was added — but
 * that copy can be weeks stale, and a number posted from a browser has no
 * business ending up in a file the seller will price real inventory from.
 *
 * Cache-only by design: a guest export must never trigger BrickLink fetches.
 * CLAUDE.md records the daily budget being exhausted by 5am from exactly this
 * kind of per-request call, and an unauthenticated endpoint is the last place
 * to reintroduce it. Items with no cached price fall through to the collector,
 * which skips them with a message explaining why.
 */
export async function guestRowsFromItems(
  items: GuestExportItem[],
  source: ExportSource
): Promise<any[]> {
  const itemType = itemTypeForSource(source);
  const wantedAction = source.endsWith('-inventory') ? 'sell' : 'keep';

  const mine = items
    .filter((item) => item && typeof item.itemNo === 'string' && item.itemNo.trim())
    .filter((item) => item.itemType === itemType)
    // An item with no action recorded is treated as for-sale, matching how the
    // guest badge presents them.
    .filter((item) => (item.action ?? 'sell') === wantedAction)
    .slice(0, MAX_GUEST_EXPORT_ITEMS);

  if (mine.length === 0) return [];

  const prices = new Map<string, number>();
  try {
    const rows = await prisma.priceCache.findMany({
      where: {
        item_no: { in: mine.map((item) => item.itemNo) },
        item_type: itemType === 'minifig' ? 'MINIFIG' : 'SET',
        price_source: 'figtracker',
      },
      select: { item_no: true, condition: true, suggested_price: true },
    });
    for (const row of rows) prices.set(`${row.item_no}::${row.condition}`, row.suggested_price);
  } catch (error) {
    console.error('[export] guest price lookup failed:', error);
  }

  return mine.map((item, index) => {
    const condition = item.condition === 'new' ? 'new' : 'used';
    const suggested =
      prices.get(`${item.itemNo}::${condition}`) ?? prices.get(`${item.itemNo}::new`) ?? 0;

    return {
      id: `guest-${index}`,
      minifigure_no: item.itemNo,
      box_no: item.itemNo,
      minifigure_name: item.name,
      set_name: item.name,
      quantity: Number.isFinite(item.quantity) && item.quantity! > 0 ? item.quantity : 1,
      condition,
      pricing: { suggestedPrice: suggested, currencyCode: 'USD' },
    };
  });
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
  // Ownership is implicit: loadItems only ever returns this user's rows, so an
  // id belonging to someone else simply doesn't match anything here.
  return collectExportItemsFromRows(await loadItems(userId, source), source, itemIds);
}

/**
 * The same normalisation, over rows the caller already has.
 *
 * Signed-out visitors keep their collection in localStorage — see
 * lib/guestCollectionStorage.ts — so there is no user id to load from and no
 * database row to own. They were previously turned away at the export page
 * even after building a collection, which meant bouncing the visitors who had
 * done the most work.
 *
 * Nothing here trusts the caller for anything that matters: prices are looked
 * up server-side by item number, and the response only ever contains what was
 * sent in. A forged row can produce a wrong file for the person who forged it
 * and nothing else.
 */
export async function collectExportItemsFromRows(
  all: any[],
  source: ExportSource,
  itemIds: string[]
): Promise<CollectResult> {
  const itemType = itemTypeForSource(source);
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
      costUsd: typeof item.cost === 'number' && item.cost > 0 ? item.cost : undefined,
      completeness: isSetCompleteness(item.completeness) ? item.completeness : undefined,
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
