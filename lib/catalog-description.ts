import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { Locale } from '@/lib/i18n-subdomain';

/**
 * Localised catalogue descriptions, read from the database.
 *
 * ## Why this module exists
 *
 * Descriptions live in `MinifigCatalog` / `SetsCatalog`, never in
 * `public/catalog/*.json` -- those files are regenerated from BrickLink twice a
 * month and would wipe the text on every update. See CLAUDE.md.
 *
 * Both a page's `generateMetadata` and its component body need the same
 * description, and Next.js runs them as separate invocations. The minifig page
 * handled that by issuing the identical `findUnique` twice
 * (`app/minifigs/[itemNo]/page.tsx`, once near the top and once in the page
 * body). That works, but it doubles the query count on the two highest-traffic
 * route families on the site, against a Hostinger instance with a strict
 * connection cap -- the same cap that has already taken production down once.
 *
 * `cache()` from React dedupes per request, so metadata and body share one
 * query. Keyed by item number only, not by locale: all ten columns come back in
 * the same row, so asking per-locale would defeat the deduplication for no gain.
 */

type DescriptionRow = Record<`description_${Locale}`, string | null>;

const DESCRIPTION_COLUMNS = {
  description_en: true,
  description_de: true,
  description_fr: true,
  description_es: true,
  description_it: true,
  description_ja: true,
  description_nl: true,
  description_pl: true,
  description_pt: true,
  description_sv: true,
} as const;

const loadSetRow = cache(async (boxNo: string): Promise<DescriptionRow | null> =>
  prisma.setsCatalog
    .findUnique({ where: { box_no: boxNo }, select: DESCRIPTION_COLUMNS })
    .catch(() => null)
);

const loadMinifigRow = cache(async (itemNo: string): Promise<DescriptionRow | null> =>
  prisma.minifigCatalog
    .findUnique({ where: { minifigure_no: itemNo }, select: DESCRIPTION_COLUMNS })
    .catch(() => null)
);

/**
 * Falls back to English rather than to nothing.
 *
 * A locale column is null wherever generation has not reached it yet -- set
 * coverage is uneven, from 48% (es) to 99% (nl). English body copy under a
 * translated title is imperfect, but an empty page is worse: it is the thin
 * content that stops the page ranking at all.
 */
function pick(row: DescriptionRow | null, locale: Locale): string {
  if (!row) return '';
  return row[`description_${locale}`] || row.description_en || '';
}

export async function getSetDescription(boxNo: string, locale: Locale): Promise<string> {
  return pick(await loadSetRow(boxNo), locale);
}

export async function getMinifigDescription(itemNo: string, locale: Locale): Promise<string> {
  return pick(await loadMinifigRow(itemNo), locale);
}
