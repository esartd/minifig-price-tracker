/**
 * Shared vocabulary for bulk marketplace exports.
 *
 * The pipeline is: user's collection rows -> normalised `ExportItem` -> a
 * marketplace adapter turns each item into that marketplace's own row shape ->
 * the adapter serialises to CSV or XML.
 *
 * Everything marketplace-specific lives behind `MarketplaceAdapter`, so adding
 * a marketplace means adding one adapter, not touching the pipeline.
 */

export type CatalogItemType = 'minifig' | 'set';

/**
 * The only condition FigTracker actually records. Every marketplace has its own
 * richer vocabulary; adapters map outward from these two values.
 */
export type SourceCondition = 'new' | 'used';

/**
 * How complete a set is. Stored per set on the collection models, because
 * BrickLink requires it on every set listing and it can't be derived from
 * new/used.
 */
export const SET_COMPLETENESS = ['complete', 'incomplete', 'sealed'] as const;
export type SetCompleteness = (typeof SET_COMPLETENESS)[number];

export function isSetCompleteness(value: unknown): value is SetCompleteness {
  return typeof value === 'string' && (SET_COMPLETENESS as readonly string[]).includes(value);
}

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

/**
 * One of the user's items, with everything any marketplace might need already
 * resolved — catalog joins done, price settled, weight parsed.
 *
 * Adapters read from this and never touch Prisma or the catalog themselves.
 */
export interface ExportItem {
  itemId: string;
  itemType: CatalogItemType;
  /** BrickLink catalog number, e.g. "sw0001a" or "75192-1". */
  itemNo: string;
  /** Full catalog name. */
  name: string;
  /** Name with parenthetical and comma-separated qualifiers trimmed, for titles. */
  cleanedName: string;
  /** Top-level theme, e.g. "Star Wars". */
  theme: string;
  quantity: number;
  condition: SourceCondition;
  /** Suggested price in USD. Guaranteed > 0 — priceless items never become ExportItems. */
  priceUsd: number;
  /** Currency the price cache reported, for the mismatch warning. */
  currencyCode?: string;
  /** Catalog weight in grams, or null when the catalog doesn't know. */
  weightGrams: number | null;
  catalogDescription?: string;
  /** Seller's own note on the item. */
  notes?: string;
  /**
   * What the seller paid, in USD. Fills Whatnot's "Cost Per Item" and
   * BrickLink's MYCOST. Undefined when they haven't recorded it.
   */
  costUsd?: number;
  /**
   * Sets only. BrickLink requires this on every set; undefined means the seller
   * hasn't recorded it, which adapters flag rather than guess.
   */
  completeness?: SetCompleteness;
  /**
   * Publicly-fetchable image URL. Filled in by the export route after mirroring,
   * and only for adapters whose `needsImages` is true.
   */
  imageUrl?: string;
}

/** A single downloadable file produced by an adapter. */
export interface ExportFile {
  /** Filename without extension; the route adds the marketplace's extension. */
  nameHint: string;
  content: string;
}

/** What an adapter produces for one item: a row, plus anything to flag. */
export interface AdapterRowResult<TRow> {
  row: TRow;
  warnings: string[];
}

/**
 * Everything a marketplace needs in order to be exportable.
 *
 * `TRow` is the adapter's private row shape; the pipeline only ever passes it
 * back into the same adapter's `serialise`, so it stays opaque.
 */
export interface MarketplaceAdapter<TRow = unknown, TOptions = unknown> {
  id: string;
  /** Human label, used in filenames and the UI. */
  label: string;
  /** e.g. "csv", "xml". */
  fileExtension: string;
  mimeType: string;
  /**
   * True when the adapter emits image URLs, so the route knows whether to spend
   * time mirroring images. BrickLink uses its own catalog photos and sets this
   * false, which skips the slowest part of an export entirely.
   */
  needsImages: boolean;
  /** Validate and clamp this marketplace's own settings. */
  parseOptions(raw: unknown): TOptions;
  /** Build one row. Returning null drops the item. */
  toRow(item: ExportItem, options: TOptions): AdapterRowResult<TRow> | null;
  /**
   * Serialise rows into one or more files. More than one when the marketplace
   * caps file size — BrickLink rejects anything over 200KB.
   */
  serialise(rows: TRow[], options: TOptions): ExportFile[];
}
