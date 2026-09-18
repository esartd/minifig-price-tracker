/**
 * Replace one-sentence set descriptions with ones built from real data.
 *
 * ## The problem
 *
 * 8,550 rows in SetsCatalog carried an English description of 41-80 characters
 * -- "Tug from the Boat theme was released in 1973." -- and 454 more (the items
 * added by the September catalogue refresh) carried none at all. Those pages
 * are indexed, and at that length Google treats them as thin.
 *
 * ## What it writes
 *
 * lib/catalog-descriptions.mjs buildSetDescriptions(), which composes the
 * existing two-clause opening with sentences for the release year, the
 * sub-theme, and the set's minifigures by name. Facts only -- see the long note
 * on that function about why there is no piece count.
 *
 * The minifigure list is the part that matters: it is genuinely unique per set
 * and genuinely useful to someone deciding whether to buy. Contents are known
 * for 4,446 of the thin sets; the rest get year and sub-theme only and stay
 * short, because there is nothing else true to say about them.
 *
 * ## What it will not touch
 *
 * Anything with an English description over 80 characters. That covers the
 * ~200 hand-written flagship descriptions ("Imperial Shuttle features 2,503
 * pieces recreating the Lambda-class T-4a shuttle in UCS scale...") which are
 * the best content on the site and must not be replaced by a template. Checked
 * before writing this: none of them is under 80 characters.
 *
 * ## Usage
 *
 *   npx tsx --env-file=.env.local scripts/enrich-thin-set-descriptions.ts
 *   npx tsx --env-file=.env.local scripts/enrich-thin-set-descriptions.ts --apply
 */

import { PrismaClient } from '@prisma/client';
// @ts-expect-error -- .mjs module with no type declarations
import { buildSetDescriptions, buildDescriptions, LOCALES } from '../lib/catalog-descriptions.mjs';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

/**
 * Above this, assume a human or a richer generator wrote it. Do not touch.
 *
 * Counted in characters, which flatters compact scripts: a complete Japanese
 * description runs to about 78 characters where its English equivalent is 200+.
 * So a final report will still list ~1,200 Japanese rows and ~130 Polish ones
 * as "thin" when they are in fact finished -- spot-checked, they read
 * "DUPLOテーマのPuppy。1978年発売。..." and are complete. Re-running is harmless
 * (it rewrites them identically); the number just is not a to-do list.
 */
const THIN_MAX_CHARS = 80;

const BATCH_SIZE = 200;

interface SetRow {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string | null;
}

function splitTheme(categoryName: string): { theme: string; subtheme: string | null } {
  const parts = categoryName.split(' / ').map((p) => p.trim()).filter(Boolean);
  return {
    theme: parts[0] || 'LEGO',
    // Only the immediate sub-theme. Deeper paths ("DUPLO / Town / Fire") read
    // badly inside a sentence, and the last segment is the specific one.
    subtheme: parts.length > 1 ? parts[parts.length - 1] : null,
  };
}

function cleanYear(raw: string | null): string | null {
  const v = (raw ?? '').trim();
  return /^\d{4}$/.test(v) ? v : null;
}

interface Target {
  table: 'SetsCatalog' | 'MinifigCatalog';
  id: 'box_no' | 'minifigure_no';
  isSet: boolean;
}

const TARGETS: Target[] = [
  { table: 'SetsCatalog', id: 'box_no', isSet: true },
  { table: 'MinifigCatalog', id: 'minifigure_no', isSet: false },
];

/**
 * Minifigure names per set, for the contents sentence. Loaded once -- per-set
 * queries would be ~9,000 round trips against a connection cap that has
 * already caused an outage once.
 */
async function loadSetContents(): Promise<Map<string, string[]>> {
  const contents = await prisma.$queryRawUnsafe<{ set_no: string; name: string }[]>(
    `SELECT sc.set_no, m.name
       FROM SetContents sc
       JOIN MinifigCatalog m ON m.minifigure_no = sc.minifig_no
      ORDER BY sc.set_no, m.name`
  );

  const bySet = new Map<string, string[]>();
  for (const c of contents) {
    if (!bySet.has(c.set_no)) bySet.set(c.set_no, []);
    bySet.get(c.set_no)!.push(c.name);
  }
  return bySet;
}

/**
 * One locale column at a time.
 *
 * Deliberately per-column rather than writing all ten at once: a row can have
 * a perfectly good English description and an empty French one (2,404 sets were
 * exactly that), and rewriting the whole row would replace hand-written English
 * with a template. Only columns that are actually thin get touched.
 */
async function fillLocale(
  target: Target,
  locale: string,
  setContents: Map<string, string[]>,
  apply: boolean
): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<SetRow[]>(
    `SELECT ${target.id} AS box_no, name, category_name, year_released
       FROM ${target.table}
      WHERE description_${locale} IS NULL
         OR CHAR_LENGTH(description_${locale}) <= ${THIN_MAX_CHARS}
      ORDER BY ${target.id}`
  );

  if (rows.length === 0 || !apply) return rows.length;

  const col = `description_${locale}`;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    // MySQL has no multi-row UPDATE, so this is a CASE over the primary key.
    // One statement per batch beats 9,000 individual updates.
    const cases: string[] = [];
    const params: any[] = [];
    const ids: string[] = [];

    for (const row of batch) {
      const { theme, subtheme } = splitTheme(row.category_name);
      const built = target.isSet
        ? buildSetDescriptions(row.name, theme, {
            year: cleanYear(row.year_released),
            subtheme,
            minifigNames: setContents.get(row.box_no) ?? [],
          })
        : buildDescriptions(row.name, theme, { isSet: false });

      cases.push('WHEN ? THEN ?');
      params.push(row.box_no, built[col]);
      ids.push(row.box_no);
    }

    await prisma.$executeRawUnsafe(
      `UPDATE ${target.table}
          SET ${col} = CASE ${target.id} ${cases.join(' ')} ELSE ${col} END,
              description_generated_at = NOW(3)
        WHERE ${target.id} IN (${ids.map(() => '?').join(',')})`,
      ...params,
      ...ids
    );

    process.stdout.write(
      `\r   ${target.table}.${locale}: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}   `
    );
  }
  process.stdout.write('\n');

  return rows.length;
}

async function main() {
  console.log(APPLY ? '\nFILLING THIN DESCRIPTIONS\n' : '\nDRY RUN (pass --apply to write)\n');

  const setContents = await loadSetContents();

  for (const target of TARGETS) {
    console.log(`\n${target.table}`);
    for (const locale of LOCALES as string[]) {
      const n = await fillLocale(target, locale, setContents, APPLY);
      if (n === 0) {
        console.log(`   ${locale}: clean`);
      } else if (!APPLY) {
        console.log(`   ${locale}: ${n} thin or empty`);
      }
    }
  }

  console.log(APPLY ? '\nDone.\n' : '\nNothing written.\n');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
