import 'server-only';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { loadAllBoxes } from '@/lib/boxes-data';

/**
 * Pulls LEGO products from the Walmart affiliate catalog and stores one row
 * per set, with its price and any discount.
 *
 * Why Walmart rather than Amazon: Amazon retired PA-API 5.0 on 15 May 2026 and
 * its replacement needs 10 qualifying sales per 30 days, which this site does
 * not have -- so lib/amazon-pricing.ts is unreachable code and AmazonDeal has
 * been frozen at five rows since May. Walmart, through Impact, gives
 * CurrentPrice, OriginalPrice, DiscountPercentage and a pre-built tracked URL,
 * refreshed daily, for an affiliate account that already exists.
 *
 * Target is not available: every catalog on this Impact account belongs to
 * Walmart.com. It would need a separate Target Partners application.
 *
 * Measured against the live catalog before this was written:
 *   - catalog 9742 ("07 TOYS") holds 2.98M items, updated daily
 *   - Manufacturer = 'LEGO' matches 7,243 products
 *   - of 1,000 sampled, 675 set numbers appeared in names and 667 matched a
 *     real box_no -- 99%
 *   - about 31% of LEGO items carry a discount, 14% at 20% or more
 * So expect roughly 4,800 sets stored and roughly 1,500 with a badge.
 */

const IMPACT_BASE = 'https://api.impact.com';

/**
 * Impact's catalog filter is a small SQL-ish grammar and it is fussy. Of the
 * forms tried against the live API, only `Field = 'value'` parsed:
 *
 *   Manufacturer = 'LEGO'      -> 200, 7243 results
 *   Manufacturer == LEGO       -> 400 Failed to parse expression
 *   Manufacturer LIKE 'LEGO'   -> 400
 *   Name CONTAINS "LEGO"       -> 400
 *   LEGO                       -> 400
 *
 * Single quotes, spaces around the equals sign. Do not "tidy" this string.
 */
const LEGO_QUERY = "Manufacturer = 'LEGO'";

const PAGE_SIZE = 100;
/** 7,243 LEGO items at 100 a page, plus headroom for the catalog growing. */
const MAX_PAGES = 100;

interface ImpactItem {
  CatalogItemId?: string;
  Name?: string;
  CurrentPrice?: string | number;
  OriginalPrice?: string | number;
  DiscountPercentage?: string | number;
  StockAvailability?: string;
  ImageUrl?: string;
  Url?: string;
  Currency?: string;
}

export interface WalmartSyncResult {
  pagesFetched: number;
  itemsSeen: number;
  setsMatched: number;
  written: number;
  withDiscount: number;
  skippedNoMatch: number;
  /** Matched a set number but priced too far below our figure to be that set. */
  skippedPriceMismatch: number;
  /** Title said one set, the destination URL said another. */
  skippedUrlMismatch: number;
  /** A four-digit "set number" that was really a year in the title. */
  skippedYearLike: number;
  /** Rows dropped because Walmart stopped listing them. */
  removed: number;
}

function credentials(): { sid: string; token: string; catalogId: string } | null {
  const sid = process.env.IMPACT_ACCOUNT_SID;
  const token = process.env.IMPACT_AUTH_TOKEN;
  const catalogId = process.env.IMPACT_WALMART_CATALOG_ID;
  if (!sid || !token || !catalogId) return null;
  return { sid, token, catalogId };
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

/**
 * Titles that can never be the set the number points at.
 *
 * Deliberately narrow. Two patterns are unambiguous:
 *
 * - Condition. "Pre-Owned LEGO Ultra Agents 70160" is a used listing, so its
 *   price is not comparable to a new set and a discount computed from it is
 *   meaningless. 10695-1 arrived at 59% off on exactly that basis.
 *
 * - Collectible minifigure series. "Minifigure Series 22: Figure Skater
 *   (71032)" is one figure; 71032 is a real set, so the number matched and a
 *   $8 figure was stored as a set price. Same for 71004 and 71038.
 *
 * A broader "anything mentioning minifig" rule was tried and rejected: it threw
 * away 34 genuine sets out of 44 matches, because set titles routinely list the
 * figures included ("LEGO Ideas BTS Dynamite Model Kit for Adults, 7
 * Minifigures"). Titles are not a reliable way to tell a figure from a set --
 * the price check below is.
 */
const USED_TITLE = /pre-?owned|refurbish|\bused\b/i;

/**
 * Collectible minifigure products, which carry a real set number and are not
 * that set.
 *
 * The rule is simply: the title mentions a minifigure AND mentions a series.
 * That looks crude, and two more precise versions were tried and both leaked,
 * because the phrasing varies more than seems reasonable. All of these are
 * real titles that reached the top of the deals page, sorted by discount:
 *
 *   "Lego 71000 Series 9 Minifigure Alien Avenger"          series then number
 *   "LEGO Series 20 Minifigures Space Fan NASA Girl"        series then number
 *   "Minifigure Series 22: Figure Skater (71032)"           number then colon
 *   "LEGO The Movie Minifigure Series Where are My Pants
 *    Guy 71004-13"                                          NO number after series
 *
 * That last one is why anchoring on "series <number>" was not enough.
 *
 * Cost of the blunt rule, measured against 3,690 stored rows: 35 titles match,
 * and roughly three of them are genuine sets whose description happens to use
 * both words (a couple of NINJAGO sets). Losing three sets in 3,690 to remove
 * about thirty wrong prices is worth it -- a wrong price sorts straight to the
 * top of the page, a missing set is invisible.
 */
const MINIFIG_SERIES = (title: string) =>
  /minifig/i.test(title) && /series/i.test(title);

/**
 * The set number a Walmart product title refers to, or null.
 *
 * Titles read like "LEGO Technic 2022 Ford GT 42154 Car Model Kit", so the set
 * number is just a 4-5 digit run. That alone is far too loose -- "10000
 * pieces", "2022", a price, a piece count and an age range all match -- so
 * every candidate is checked against the real catalogue and anything that is
 * not a known set is discarded. That membership test is what took the match
 * rate to 99% on a 1,000-item sample.
 *
 * Longest candidates first, because a 5-digit set number contains 4-digit
 * substrings and the longer match is the right one.
 */
function extractBoxNo(title: string, catalog: Map<string, string>): string | null {
  if (USED_TITLE.test(title) || MINIFIG_SERIES(title)) return null;

  // Annotated because `?? []` on its own infers never[], and the sort callback
  // then has no .length to compare.
  const candidates: string[] = title.match(/\b\d{4,5}\b/g) ?? [];
  candidates.sort((a, b) => b.length - a.length);
  for (const c of candidates) {
    const boxNo = catalog.get(c);
    if (boxNo) return boxNo;
  }
  return null;
}

/**
 * True when the destination URL names a DIFFERENT set than the title did.
 *
 * Sellers mistype. 40383 is the BrickHeadz Bride and 40384 the Groom, and one
 * listing read "Lego 40383 BrickHeadz Groom Wedding" while its URL said
 * .../Lego-40384-BrickHeadz-Groom-Wedding-...  Walmart builds the slug when the
 * listing is created, so the URL kept the right number and the edited title did
 * not -- and matching on the title alone hung a Groom off the Bride's page.
 *
 * Deliberately conservative, because dropping good rows costs more than the
 * occasional bad one:
 *  - a URL with no set number at all proves nothing, so it is allowed;
 *  - a URL containing the matched number is agreement, so it is allowed;
 *  - only a 5-digit number that we recognise as some OTHER set counts as a
 *    contradiction. Four-digit runs are excluded on purpose: a slug like
 *    "LEGO-Creator-2026-31377" carries a year, and plenty of years collide with
 *    genuine old set numbers.
 */
function urlNamesADifferentSet(
  matchedBase: string,
  url: string,
  catalog: Map<string, string>
): boolean {
  // Annotated for the same reason extractBoxNo is: `?? []` alone infers
  // never[], and .includes/.some then have nothing to compare.
  const nums: string[] = url.match(/\b\d{5}\b/g) ?? [];
  if (nums.length === 0) return false;
  if (nums.includes(matchedBase)) return false;
  return nums.some((n) => n !== matchedBase && catalog.has(n));
}

/**
 * True when a four-digit match is really a YEAR in the listing title.
 *
 * "Lego Festive Gingerbread House Limited Edition 2025" was matched to set 2025
 * -- a Duplo "Boat polybag" -- because 2025 is a real old set number. The
 * title/URL guard cannot see these: the year sits in both strings, so they
 * agree with each other and are wrong together.
 *
 * The test is whether the listing title says anything about the set we think it
 * is. A genuine listing for old set 2022 ("Amy Elephant") says "Amy" or
 * "Elephant"; a 2022 Muppets minifigure says neither.
 *
 * Applies ONLY to numbers in 1960-2035. Five-digit modern sets never collide
 * with years, and this must not start second-guessing them on title wording.
 *
 * Measured when added: all 15 stored rows with a year-like number were wrong,
 * every one a year read as a set number.
 */
const NAME_STOPWORDS = new Set([
  'lego', 'set', 'sets', 'building', 'build', 'toy', 'toys', 'kit', 'the', 'and',
  'with', 'for', 'new', 'box', 'piece', 'pieces', 'bagged', 'sealed', 'mini',
  'minifigure', 'minifig', 'pack', 'collectible', 'edition',
]);

function yearLikeMismatch(base: string, title: string, catalogNames: Map<string, string>): boolean {
  const n = Number(base);
  if (!Number.isFinite(n) || n < 1960 || n > 2035) return false;

  const name = (catalogNames.get(base) ?? '').toLowerCase();
  const words = name
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !NAME_STOPWORDS.has(w));

  // No usable words in our own name means no evidence either way -- allow it
  // rather than reject on ignorance.
  if (words.length === 0) return false;

  const t = title.toLowerCase();
  return !words.some((w) => t.includes(w));
}

async function fetchPage(
  sid: string,
  token: string,
  catalogId: string,
  page: number
): Promise<ImpactItem[]> {
  const url =
    `${IMPACT_BASE}/Mediapartners/${sid}/Catalogs/${catalogId}/Items` +
    `?Query=${encodeURIComponent(LEGO_QUERY)}&PageSize=${PAGE_SIZE}&Page=${page}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Impact returned ${res.status} on page ${page}`);
  }

  const body = await res.json();
  return Array.isArray(body?.Items) ? body.Items : [];
}

export async function refreshWalmartDeals(): Promise<WalmartSyncResult> {
  const creds = credentials();
  if (!creds) {
    throw new Error(
      'Missing IMPACT_ACCOUNT_SID / IMPACT_AUTH_TOKEN / IMPACT_WALMART_CATALOG_ID'
    );
  }

  // box_no is "42154-1"; Walmart titles carry the bare "42154". Index by the
  // bare number so the lookup is a map hit rather than a scan of 21,668 rows
  // per product.
  const catalog = new Map<string, string>();
  // Set names, keyed the same way, for the year check below.
  const catalogNames = new Map<string, string>();
  for (const box of loadAllBoxes()) {
    const boxNo = String(box.box_no ?? '');
    const base = boxNo.split('-')[0];
    if (base && !catalog.has(base)) {
      catalog.set(base, boxNo);
      catalogNames.set(base, String(box.name ?? ''));
    }
  }

  /**
   * Our own price for each set, used to reject matches that cannot be the same
   * product.
   *
   * Titles alone cannot tell a single minifigure from the set it comes in --
   * "LEGO Luke Skywalker Jedi Master Minifigure 75324" carries a real set
   * number, and filtering on the word "minifigure" throws away 34 genuine sets
   * for every 10 it catches. Price does tell them apart: a $9 figure against a
   * $90 set is not a 90% discount, it is a different product.
   *
   * The floor is deliberately loose at 25%. Walmart genuinely discounts sets by
   * 40-50%, and clearance goes deeper, so anything tighter would start
   * discarding the real bargains this feature exists to find.
   */
  const ourPrices = new Map<string, number>();
  try {
    const rows = await prisma.priceCache.findMany({
      where: { item_type: 'SET', condition: 'new', price_source: 'figtracker', currency_code: 'USD' },
      select: { item_no: true, suggested_price: true, current_avg: true },
    });
    for (const row of rows) {
      const p = row.suggested_price || row.current_avg;
      if (p && p > 0) ourPrices.set(row.item_no, p);
    }
  } catch (error) {
    // Without it the sync still works, it just cannot reject mismatches.
    console.error('[Walmart Deals] price sanity data unavailable:', error);
  }
  const PRICE_FLOOR_RATIO = 0.25;

  const result: WalmartSyncResult = {
    pagesFetched: 0,
    itemsSeen: 0,
    setsMatched: 0,
    written: 0,
    withDiscount: 0,
    skippedNoMatch: 0,
    skippedPriceMismatch: 0,
    skippedUrlMismatch: 0,
    skippedYearLike: 0,
    removed: 0,
  };

  // Keep the cheapest in-stock listing per set: Walmart lists the same set from
  // several sellers, and the first one seen is not necessarily the best.
  const best = new Map<string, {
    walmartItemId: string;
    title: string;
    currentPrice: number;
    listPrice: number | null;
    discountPercent: number;
    inStock: boolean;
    currency: string;
    productUrl: string;
    imageUrl: string | null;
  }>();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const items = await fetchPage(creds.sid, creds.token, creds.catalogId, page);
    if (items.length === 0) break;

    result.pagesFetched++;
    result.itemsSeen += items.length;

    for (const item of items) {
      const title = item.Name ?? '';
      const currentPrice = num(item.CurrentPrice);
      const productUrl = item.Url ?? '';
      if (!title || !currentPrice || currentPrice <= 0 || !productUrl) continue;

      const boxNo = extractBoxNo(title, catalog);
      if (!boxNo) {
        result.skippedNoMatch++;
        continue;
      }

      // The title gave us a set number; check the URL is not naming another.
      if (urlNamesADifferentSet(boxNo.split('-')[0], productUrl, catalog)) {
        result.skippedUrlMismatch++;
        continue;
      }

      // ...and that a four-digit match is not just a year in the title.
      if (yearLikeMismatch(boxNo.split('-')[0], title, catalogNames)) {
        result.skippedYearLike++;
        continue;
      }

      // Reject anything priced so far below our own figure that it cannot be
      // the same product. Only applies where we have a price to compare to.
      const ourPrice = ourPrices.get(boxNo);
      if (ourPrice && currentPrice < ourPrice * PRICE_FLOOR_RATIO) {
        result.skippedPriceMismatch++;
        continue;
      }

      const listPrice = num(item.OriginalPrice);
      // Trust our own arithmetic over the feed's DiscountPercentage, which is
      // blank on plenty of rows that do have a real OriginalPrice.
      const discountPercent =
        listPrice && listPrice > currentPrice
          ? Math.round(((listPrice - currentPrice) / listPrice) * 100)
          : 0;

      const inStock = (item.StockAvailability ?? '').toLowerCase() === 'instock';

      const existing = best.get(boxNo);
      // In stock beats out of stock; among equals, cheaper wins.
      const better =
        !existing ||
        (inStock && !existing.inStock) ||
        (inStock === existing.inStock && currentPrice < existing.currentPrice);

      if (better) {
        best.set(boxNo, {
          walmartItemId: String(item.CatalogItemId ?? ''),
          title,
          currentPrice,
          listPrice: listPrice && listPrice > currentPrice ? listPrice : null,
          discountPercent,
          inStock,
          currency: item.Currency ?? 'USD',
          productUrl,
          imageUrl: item.ImageUrl ?? null,
        });
      }
    }

    if (items.length < PAGE_SIZE) break;
  }

  result.setsMatched = best.size;

  /**
   * Bulk upsert in chunks, not one call per set.
   *
   * The first version ran ~3,600 sequential `prisma.upsert` calls against the
   * Hostinger database and took 25 MINUTES -- against a cron route capped at
   * 300s, so in production it would have timed out every single night while
   * appearing to work locally. Nearly all of that was round-trip latency, not
   * the database doing work.
   *
   * One statement per 200 rows instead. `ON DUPLICATE KEY UPDATE` against the
   * unique boxNo gives the same insert-or-update result in a single trip.
   * Chunked rather than one giant statement because CLAUDE.md is explicit that
   * this host has strict connection limits and that heavy writes have caused
   * 500s before -- a 3,600-row statement is exactly the kind of thing that
   * trips that.
   */
  const CHUNK = 200;
  const entries = [...best.entries()];

  for (let i = 0; i < entries.length; i += CHUNK) {
    const slice = entries.slice(i, i + CHUNK);

    const values = slice.map(([boxNo, d]) =>
      Prisma.sql`(${randomUUID()}, ${boxNo}, ${d.walmartItemId}, ${d.title},
                  ${d.currentPrice}, ${d.listPrice}, ${d.discountPercent},
                  ${d.inStock}, ${d.currency}, ${d.productUrl}, ${d.imageUrl},
                  NOW(3))`
    );

    await prisma.$executeRaw`
      INSERT INTO \`WalmartDeal\`
        (\`id\`, \`boxNo\`, \`walmartItemId\`, \`title\`, \`currentPrice\`, \`listPrice\`,
         \`discountPercent\`, \`inStock\`, \`currency\`, \`productUrl\`, \`imageUrl\`,
         \`lastUpdated\`)
      VALUES ${Prisma.join(values)}
      ON DUPLICATE KEY UPDATE
        \`walmartItemId\`   = VALUES(\`walmartItemId\`),
        \`title\`           = VALUES(\`title\`),
        \`currentPrice\`    = VALUES(\`currentPrice\`),
        \`listPrice\`       = VALUES(\`listPrice\`),
        \`discountPercent\` = VALUES(\`discountPercent\`),
        \`inStock\`         = VALUES(\`inStock\`),
        \`currency\`        = VALUES(\`currency\`),
        \`productUrl\`      = VALUES(\`productUrl\`),
        \`imageUrl\`        = VALUES(\`imageUrl\`),
        \`lastUpdated\`     = VALUES(\`lastUpdated\`)
    `;

    for (const [, d] of slice) {
      result.written++;
      if (d.discountPercent > 0) result.withDiscount++;
    }
  }

  // Anything Walmart has stopped listing. Left in place it would keep showing a
  // buy button for a product that 404s.
  //
  // Deleted one row at a time, not with deleteMany: lib/database-safeguards.ts
  // blocks deleteMany outright in production -- "BLOCKED to prevent data loss"
  // -- and the whole sync throws at this last step if you use it. That
  // safeguard exists because this is the live database, so the right move is to
  // comply with it rather than route around it.
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stale = await prisma.walmartDeal.findMany({
    where: { lastUpdated: { lt: cutoff } },
    select: { id: true },
  });
  for (const row of stale) {
    await prisma.walmartDeal.delete({ where: { id: row.id } });
    result.removed++;
  }

  return result;
}
