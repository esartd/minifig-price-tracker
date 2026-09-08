/**
 * Fill description_<locale> for all ten locales, on both catalog tables.
 *
 * Why this exists rather than the two scripts that came before it:
 *
 *   auto-generate-minifig-descriptions.ts  minifigs only, and until recently
 *                                          four locales hard-coded inline
 *   generate-all-set-descriptions.ts       sets only, English and German only,
 *                                          and writes to a JSON file rather
 *                                          than to SetsCatalog
 *
 * Both now share lib/catalog-descriptions.ts, so there is one place where the
 * wording lives and one place to add locale eleven.
 *
 * SAFE TO RE-RUN. It only writes rows where a locale column is still empty, so
 * an interrupted run resumes where it stopped and a second run is a no-op.
 * Nothing is overwritten -- a description someone wrote by hand stays.
 *
 * Run it on the VPS (the database is Hostinger, and the deploy key is locked to
 * a forced command, so this needs the hPanel web console):
 *
 *   cd /var/www/figtracker && npx tsx scripts/backfill-catalog-descriptions.ts
 *
 * Add --dry-run to print what it would write and touch nothing.
 */

import { PrismaClient } from '@prisma/client';
import { buildDescriptions, LOCALES } from '../lib/catalog-descriptions';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');
const BATCH = 200;

/** Columns we ask for and may write. */
const COLUMNS = LOCALES.map((l) => `description_${l}` as const);

function missingLocales(row: Record<string, unknown>): string[] {
  return COLUMNS.filter((c) => {
    const v = row[c];
    return typeof v !== 'string' || v.trim().length === 0;
  });
}

async function backfill(
  label: string,
  findMany: (skip: number) => Promise<any[]>,
  update: (key: string, data: Record<string, string>) => Promise<unknown>,
  keyOf: (row: any) => string,
  nameOf: (row: any) => string,
  themeOf: (row: any) => string
) {
  let skip = 0;
  let seen = 0;
  let written = 0;
  let alreadyComplete = 0;

  for (;;) {
    const rows = await findMany(skip);
    if (rows.length === 0) break;

    for (const row of rows) {
      seen++;
      const missing = missingLocales(row);
      if (missing.length === 0) {
        alreadyComplete++;
        continue;
      }

      const all = buildDescriptions(nameOf(row), themeOf(row));
      // Only the empty ones. A hand-written description is never replaced.
      const data: Record<string, string> = {};
      for (const c of missing) data[c] = all[c];

      if (DRY_RUN) {
        if (written < 3) {
          console.log(`\n  ${label} ${keyOf(row)} -- would write ${missing.length} locale(s)`);
          for (const c of missing.slice(0, 3)) console.log(`    ${c}: ${data[c]}`);
        }
      } else {
        try {
          await update(keyOf(row), data);
        } catch (error: any) {
          if (error?.code !== 'P2025') throw error; // row vanished; skip it
          continue;
        }
      }
      written++;

      if (written % 500 === 0) {
        console.log(`  ${label}: ${written} written, ${alreadyComplete} already complete, ${seen} seen`);
      }
    }

    skip += rows.length;
  }

  console.log(
    `\n${label}: ${written} row(s) ${DRY_RUN ? 'would be' : ''} updated, ` +
      `${alreadyComplete} already had all ten locales, ${seen} scanned.`
  );
  return written;
}

async function main() {
  console.log(
    DRY_RUN
      ? 'Dry run -- nothing will be written.\n'
      : 'Backfilling catalog descriptions for all ten locales.\n'
  );

  const select = Object.fromEntries(COLUMNS.map((c) => [c, true]));

  const minifigs = await backfill(
    'MinifigCatalog',
    (skip) =>
      prisma.minifigCatalog.findMany({
        skip,
        take: BATCH,
        orderBy: { minifigure_no: 'asc' },
        select: { minifigure_no: true, name: true, category_name: true, ...select },
      }),
    (key, data) =>
      prisma.minifigCatalog.update({ where: { minifigure_no: key }, data }),
    (r) => r.minifigure_no,
    (r) => r.name,
    (r) => r.category_name
  );

  const sets = await backfill(
    'SetsCatalog',
    (skip) =>
      prisma.setsCatalog.findMany({
        skip,
        take: BATCH,
        orderBy: { box_no: 'asc' },
        select: { box_no: true, name: true, category_name: true, ...select },
      }),
    (key, data) => prisma.setsCatalog.update({ where: { box_no: key }, data }),
    (r) => r.box_no,
    (r) => r.name,
    (r) => r.category_name
  );

  console.log(`\nDone. ${minifigs + sets} row(s) ${DRY_RUN ? 'would be' : ''} written in total.`);
}

main()
  .catch((error) => {
    console.error('\nBackfill failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
