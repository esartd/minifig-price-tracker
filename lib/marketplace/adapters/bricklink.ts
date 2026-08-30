/**
 * BrickLink mass inventory upload adapter.
 *
 * XML, not CSV. Spec verified against BrickLink's own documentation:
 * https://www.bricklink.com/help.asp?helpID=22
 *
 * Required on every item: ITEMTYPE, COLOR, PRICE, QTY, CONDITION.
 * SUBCONDITION is required for sets. ITEMID is technically optional but
 * omitting it makes the listing far harder for buyers to find, and ours are
 * already BrickLink catalog numbers, so we always send it.
 *
 * Two constraints shape this file:
 *  - BrickLink caps an upload at 204,800 bytes, so a large export is split.
 *  - It rolls back the entire file if any row errors, which is why validation
 *    happens before download rather than after.
 *
 * Note BrickLink needs no images (it uses its own catalog photos) and no title
 * (listings are keyed by item number), which makes this adapter much smaller
 * than Whatnot's.
 */

import { buildXmlDocument } from '@/lib/xml';
import { formatPrice, isPriceRounding, type PriceRounding } from '../pricing';
import type {
  AdapterRowResult,
  ExportFile,
  ExportItem,
  MarketplaceAdapter,
  SetCompleteness,
} from '../types';

/** BrickLink's own cap. Anything larger is rejected outright. */
export const BRICKLINK_MAX_FILE_BYTES = 204_800;

/** Item type codes. We only ever list minifigs (M) and sets (S). */
const ITEM_TYPE_CODE = {
  minifig: 'M',
  set: 'S',
} as const;

/**
 * COLOR is required even when meaningless. 0 is BrickLink's "Not Applicable",
 * which is correct for anything that isn't a part.
 */
const COLOR_NOT_APPLICABLE = 0;

/** BrickLink's SUBCONDITION codes for sets. */
const SUBCONDITION_CODE: Record<SetCompleteness, string> = {
  complete: 'C',
  incomplete: 'I',
  sealed: 'S',
};

export interface BricklinkOptions {
  markupPercent: number;
  rounding: PriceRounding;
  /** Fallback when a set has no recorded completeness. */
  defaultCompleteness: SetCompleteness;
  /** Write what the seller paid into MYCOST. */
  includeCost: boolean;
  /** Put items in the stockroom instead of live on the store. */
  stockroom: boolean;
  /** Keep the listing after it sells (RETAIN). */
  retain: boolean;
  /** Send the catalog description as REMARKS. Off by default — remarks are private notes. */
  includeNotes: boolean;
}

export const DEFAULT_BRICKLINK_OPTIONS: BricklinkOptions = {
  markupPercent: 0,
  rounding: 'exact',
  defaultCompleteness: 'complete',
  includeCost: true,
  stockroom: false,
  retain: false,
  includeNotes: true,
};

function isCompleteness(value: unknown): value is SetCompleteness {
  return value === 'complete' || value === 'incomplete' || value === 'sealed';
}

function toNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface BricklinkRow {
  itemType: string;
  itemId: string;
  color: number;
  price: string;
  qty: number;
  condition: 'N' | 'U';
  subCondition?: string;
  remarks?: string;
  myCost?: string;
}

/** Ordered field list, matching BrickLink's documented tag names. */
function rowToFields(row: BricklinkRow): Array<[string, string | number | null | undefined]> {
  return [
    ['ITEMTYPE', row.itemType],
    ['ITEMID', row.itemId],
    ['COLOR', row.color],
    ['PRICE', row.price],
    ['QTY', row.qty],
    ['CONDITION', row.condition],
    ['SUBCONDITION', row.subCondition],
    ['REMARKS', row.remarks],
    ['MYCOST', row.myCost],
  ];
}

export const bricklinkAdapter: MarketplaceAdapter<BricklinkRow, BricklinkOptions> = {
  id: 'bricklink',
  label: 'BrickLink',
  fileExtension: 'xml',
  mimeType: 'application/xml; charset=utf-8',
  // BrickLink shows its own catalog photos, so we never send image URLs.
  needsImages: false,

  parseOptions(raw: unknown): BricklinkOptions {
    const o = (raw ?? {}) as Record<string, any>;
    const d = DEFAULT_BRICKLINK_OPTIONS;

    return {
      markupPercent: clamp(toNumber(o.markupPercent, d.markupPercent), -90, 500),
      rounding: isPriceRounding(o.rounding) ? o.rounding : d.rounding,
      defaultCompleteness: isCompleteness(o.defaultCompleteness)
        ? o.defaultCompleteness
        : d.defaultCompleteness,
      includeCost: typeof o.includeCost === 'boolean' ? o.includeCost : d.includeCost,
      stockroom: typeof o.stockroom === 'boolean' ? o.stockroom : d.stockroom,
      retain: typeof o.retain === 'boolean' ? o.retain : d.retain,
      includeNotes: typeof o.includeNotes === 'boolean' ? o.includeNotes : d.includeNotes,
    };
  },

  toRow(item: ExportItem, options: BricklinkOptions): AdapterRowResult<BricklinkRow> {
    const warnings: string[] = [];

    let subCondition: string | undefined;
    if (item.itemType === 'set') {
      const completeness = item.completeness ?? options.defaultCompleteness;
      if (!item.completeness) {
        warnings.push(
          `BrickLink needs to know whether a set is complete, incomplete or sealed. This one isn't recorded, so it will be sent as "${options.defaultCompleteness}".`
        );
      }
      subCondition = SUBCONDITION_CODE[completeness];
    }

    // Remarks are the seller's private note on the lot, not a buyer-facing
    // description, so only the seller's own note goes here — never the catalog
    // blurb, which would be noise in their inventory list.
    const remarks = options.includeNotes ? item.notes?.trim() || undefined : undefined;

    return {
      warnings,
      row: {
        itemType: ITEM_TYPE_CODE[item.itemType],
        // Full catalog number including any variant suffix — BrickLink keys on it.
        itemId: item.itemNo,
        color: COLOR_NOT_APPLICABLE,
        // BrickLink accepts 4 decimal places and its sellers routinely price
        // below a cent, so don't round to 2 the way a US marketplace would.
        price: formatPrice(item.priceUsd, options.markupPercent, options.rounding, 4),
        qty: item.quantity,
        condition: item.condition === 'new' ? 'N' : 'U',
        subCondition,
        remarks,
        myCost:
          options.includeCost && item.costUsd !== undefined
            ? item.costUsd.toFixed(4)
            : undefined,
      },
    };
  },

  serialise(rows: BricklinkRow[]): ExportFile[] {
    const files: ExportFile[] = [];
    let batch: BricklinkRow[] = [];

    const render = (items: BricklinkRow[]) =>
      buildXmlDocument('INVENTORY', 'ITEM', items.map(rowToFields));

    for (const row of rows) {
      const candidate = [...batch, row];

      if (
        batch.length > 0 &&
        Buffer.byteLength(render(candidate), 'utf8') > BRICKLINK_MAX_FILE_BYTES
      ) {
        files.push({ nameHint: 'bricklink', content: render(batch) });
        batch = [row];
      } else {
        batch = candidate;
      }
    }

    if (batch.length > 0) {
      files.push({ nameHint: 'bricklink', content: render(batch) });
    }

    return files;
  },
};
