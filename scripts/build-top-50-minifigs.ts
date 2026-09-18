/**
 * Replace the "Most Valuable Star Wars Minifigures" stub with a real top 50.
 *
 * The article is titled "Top 50 Most Valuable LEGO Minifigures" in all ten
 * locales and named four. That is the kind of mismatch a reader notices
 * immediately, and translating it would have produced it in nine more
 * languages.
 *
 * ## Where the numbers come from
 *
 * Our own PriceCache, filtered hard:
 *
 *   six_month_avg > 0   BrickLink recorded actual sales. Rows without this are
 *                       priced purely from what sellers are asking, which is
 *                       exactly what this article tells readers not to trust --
 *                       and there are 6,773 of them.
 *   confidence >= 0.9   excludes the same unbacked rows a second way.
 *   currency USD, condition new, price_source figtracker
 *
 * Run after scripts/reprice-stored-cache.ts. Before that correction the top of
 * this list was nonsense: sh0045 sat at $10,311 against a sold average of $934,
 * because two of the three blend components are asking prices and one seller
 * had listed it at $15,000.
 *
 * Spot-checked against Brickset and BrickEconomy: Mr. Gold $8,299 here against
 * Brickset's $8,299, Chrome Gold C-3PO $1,658 against ~$1,938, Cloud City Boba
 * Fett $1,184 against ~$1,296 used. Close enough to publish.
 *
 * ## Why a table and not fifty paragraphs
 *
 * Every row links to our own page for that figure, so the live price is one
 * click away and the article degrades gracefully as values drift. That is fifty
 * internal links into pages we want crawled, from a page people actually land
 * on.
 *
 *   npx tsx --env-file=.env.local scripts/build-top-50-minifigs.ts          # dry run
 *   npx tsx --env-file=.env.local scripts/build-top-50-minifigs.ts --apply
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

const SLUG = 'most-valuable-lego-minifigures-2026';
const COUNT = 50;

/** Month the prices were read, stated in the article so it ages honestly. */
const AS_OF = 'September 2026';

interface Row {
  item_no: string;
  name: string;
  year_released: string | null;
  category_name: string;
  sold: number;
  suggested: number;
}

function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US');
}

/** Markdown tables break on a pipe, and BrickLink names contain them rarely but do. */
function cell(s: string): string {
  return s.replace(/\|/g, '\\|').trim();
}

async function main() {
  console.log(APPLY ? '\nBUILDING TOP 50\n' : '\nDRY RUN (pass --apply to write)\n');

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `SELECT pc.item_no, m.name, m.year_released, m.category_name,
            pc.six_month_avg AS sold, pc.suggested_price AS suggested
       FROM PriceCache pc
       JOIN MinifigCatalog m ON m.minifigure_no = pc.item_no
      WHERE pc.item_type = 'MINIFIG'
        AND pc.\`condition\` = 'new'
        AND pc.currency_code = 'USD'
        AND pc.price_source = 'figtracker'
        AND pc.six_month_avg > 0
        AND pc.confidence >= 0.9
      ORDER BY pc.suggested_price DESC
      LIMIT ${COUNT}`
  );

  if (rows.length < COUNT) {
    console.log(`  only ${rows.length} sales-backed rows -- refusing to claim a top ${COUNT}`);
    await prisma.$disconnect();
    return;
  }

  const header =
    `| # | Minifigure | Theme | Year | Our price | Sold average |\n` +
    `|---|---|---|---|---|---|`;

  const body = rows
    .map((r, i) => {
      const theme = cell(String(r.category_name).split(' / ')[0]);
      const name = cell(r.name);
      const year = r.year_released && /^\d{4}$/.test(r.year_released) ? r.year_released : '—';
      return `| ${i + 1} | [${name}](/minifigs/${r.item_no}) | ${theme} | ${year} | ${money(Number(r.suggested))} | ${money(Number(r.sold))} |`;
    })
    .join('\n');

  const intro =
    `Here are the 50 most valuable LEGO minifigures on IntoBrick as of ${AS_OF}, ranked by our own blended market price. ` +
    `Every one of them has recorded sales on Bricklink in the last six months — figures priced only from what sellers are *asking* are deliberately excluded, ` +
    `because an asking price is a hope, not a market value. ` +
    `The "sold average" column is what the figure has actually changed hands for, so you can see where the two diverge. ` +
    `Click any name for the live price.`;

  const [row] = await prisma.$queryRawUnsafe<{ contentBlocks: string }[]>(
    'SELECT contentBlocks FROM Article WHERE slug = ?',
    SLUG
  );
  if (!row) {
    console.log('  article not found');
    await prisma.$disconnect();
    return;
  }

  const blocks: any[] = JSON.parse(row.contentBlocks);

  // Anchor on the existing "Most Valuable Star Wars Minifigures:" heading and
  // replace the four example paragraphs that follow it. Those four are kept as
  // context further down rather than deleted -- they explain WHY each figure is
  // rare, which a table cannot.
  const anchorIdx = blocks.findIndex(
    (b) => b.type === 'heading' && /Most Valuable Star Wars Minifigures/i.test(String(b.text || ''))
  );
  if (anchorIdx === -1) {
    console.log('  anchor heading not found -- refusing to guess where the table goes');
    await prisma.$disconnect();
    return;
  }

  // Already built? Replace in place rather than stacking a second table.
  const existing = blocks.findIndex((b) => b.id === 'block-top50-table');
  const newBlocks = [
    { id: 'block-top50-heading', type: 'heading', level: 2, text: `The 50 Most Valuable Minifigures Right Now` },
    { id: 'block-top50-intro', type: 'paragraph', text: intro },
    { id: 'block-top50-table', type: 'paragraph', text: `${header}\n${body}` },
  ];

  if (existing !== -1) {
    const headIdx = blocks.findIndex((b) => b.id === 'block-top50-heading');
    const start = headIdx !== -1 ? headIdx : existing;
    blocks.splice(start, newBlocks.length, ...newBlocks);
    console.log('  replaced the existing table');
  } else {
    blocks.splice(anchorIdx, 0, ...newBlocks);
    console.log(`  inserted before block index ${anchorIdx}`);
  }

  console.log(`  ${rows.length} figures, ${money(Number(rows[0].suggested))} down to ${money(Number(rows[rows.length - 1].suggested))}`);
  console.log('\n  first three rows:');
  body.split('\n').slice(0, 3).forEach((l) => console.log('    ' + l.slice(0, 120)));

  if (!APPLY) {
    console.log('\nNothing written.\n');
    await prisma.$disconnect();
    return;
  }

  await prisma.$executeRawUnsafe(
    'UPDATE Article SET contentBlocks = ? WHERE slug = ?',
    JSON.stringify(blocks),
    SLUG
  );
  console.log('\nDone.\n');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
