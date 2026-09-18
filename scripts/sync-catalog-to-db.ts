/**
 * Sync the non-description columns of MinifigCatalog / SetsCatalog from the
 * catalogue JSON files.
 *
 * ## Why this exists
 *
 * `scripts/update-catalogs-simple.ts` rewrites `public/catalog/minifigs.json`
 * and `boxes.json` from the BrickLink exports twice a month, and deliberately
 * never touches the database -- descriptions live in these tables precisely so
 * that a catalogue refresh cannot wipe them (see CLAUDE.md).
 *
 * The side effect nobody accounted for is that the tables' *other* columns then
 * never refresh either. They were populated once, when descriptions were first
 * generated, and have drifted ever since:
 *
 *   - 279 MinifigCatalog rows and 203 SetsCatalog rows carry the literal string
 *     "?" as `year_released`. The pages read the table, not the JSON, so
 *     es.intobrick.com/minifigs/sw1522 rendered "fue lanzada en ?" while
 *     minifigs.json had said 2026 since the September refresh.
 *   - ~460 minifigs and ~453 sets present in the JSON have no row here at all,
 *     so they have no description in any locale.
 *
 * This script closes both gaps and writes nothing else.
 *
 * ## What it will not do
 *
 * It never references any `description_*` column, nor `description_status` /
 * `description_generated_at`. New rows get the schema defaults for those
 * (`description_status = "pending"`), which is what they should be -- they are
 * genuinely awaiting generation. Existing rows keep whatever they have.
 *
 * ## Usage
 *
 *   npx tsx --env-file=.env.local scripts/sync-catalog-to-db.ts           # dry run
 *   npx tsx --env-file=.env.local scripts/sync-catalog-to-db.ts --apply   # write
 *
 * Dry run is the default on purpose: DATABASE_URL points at the live Hostinger
 * instance for local development as well as production. There is no staging
 * database to rehearse against.
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const APPLY = process.argv.includes('--apply');
const CATALOG_DIR = path.join(process.cwd(), 'public', 'catalog');

/**
 * Rows per INSERT. Hostinger caps connections hard enough to have taken
 * production down once, so this runs one statement at a time rather than
 * fanning out -- 41k rows in ~83 sequential statements.
 */
const BATCH_SIZE = 500;

/** BrickLink writes "?" for an unknown year; so did the old import. */
function cleanYear(raw: unknown): string | null {
  const v = String(raw ?? '').trim();
  if (!v || v === '?' || v === '0') return null;
  // Only accept something that actually looks like a year. Anything else is
  // left as null rather than written through, so a malformed export cannot
  // overwrite a year that is currently correct.
  return /^\d{4}$/.test(v) ? v : null;
}

function cleanWeightString(raw: unknown): string | null {
  const v = String(raw ?? '').trim();
  if (!v || v === '?' || v === '0') return null;
  return v;
}

function cleanWeightGrams(raw: unknown): number | null {
  const v = cleanWeightString(raw);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type SyncResult = { inserted: number; yearFixed: number; total: number };

/**
 * `year_released` is written with COALESCE so a null from the JSON never
 * clobbers a real year already in the table. Everything else is authoritative
 * from BrickLink and overwrites.
 */
async function syncMinifigs(dryRun: boolean): Promise<SyncResult> {
  const rows: any[] = JSON.parse(
    fs.readFileSync(path.join(CATALOG_DIR, 'minifigs.json'), 'utf8')
  );

  const existing = new Set(
    (
      await prisma.$queryRawUnsafe<{ minifigure_no: string }[]>(
        'SELECT minifigure_no FROM MinifigCatalog'
      )
    ).map((r) => r.minifigure_no)
  );

  const staleYear = new Set(
    (
      await prisma.$queryRawUnsafe<{ minifigure_no: string }[]>(
        "SELECT minifigure_no FROM MinifigCatalog WHERE year_released IS NULL OR year_released = '' OR year_released = '?'"
      )
    ).map((r) => r.minifigure_no)
  );

  const inserted = rows.filter((r) => !existing.has(r.minifigure_no)).length;
  const yearFixed = rows.filter(
    (r) => staleYear.has(r.minifigure_no) && cleanYear(r.year_released) !== null
  ).length;

  if (!dryRun) {
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => '(?,?,?,?,?,?,?,NOW(3),NOW(3))').join(',');
      const params: any[] = [];
      for (const r of batch) {
        params.push(
          r.minifigure_no,
          r.name,
          Number(r.category_id) || 0,
          r.category_name,
          cleanYear(r.year_released),
          cleanWeightGrams(r.weight),
          String(r.name).toLowerCase()
        );
      }
      await prisma.$executeRawUnsafe(
        `INSERT INTO MinifigCatalog
           (minifigure_no, name, category_id, category_name, year_released, weight_grams, search_name, created_at, updated_at)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE
           name          = VALUES(name),
           category_id   = VALUES(category_id),
           category_name = VALUES(category_name),
           year_released = COALESCE(VALUES(year_released), year_released),
           weight_grams  = COALESCE(VALUES(weight_grams), weight_grams),
           search_name   = VALUES(search_name),
           updated_at    = NOW(3)`,
        ...params
      );
      process.stdout.write(`\r   minifigs: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
    }
    process.stdout.write('\n');
  }

  return { inserted, yearFixed, total: rows.length };
}

async function syncSets(dryRun: boolean): Promise<SyncResult> {
  const rows: any[] = JSON.parse(
    fs.readFileSync(path.join(CATALOG_DIR, 'boxes.json'), 'utf8')
  );

  const existing = new Set(
    (
      await prisma.$queryRawUnsafe<{ box_no: string }[]>('SELECT box_no FROM SetsCatalog')
    ).map((r) => r.box_no)
  );

  const staleYear = new Set(
    (
      await prisma.$queryRawUnsafe<{ box_no: string }[]>(
        "SELECT box_no FROM SetsCatalog WHERE year_released IS NULL OR year_released = '' OR year_released = '?'"
      )
    ).map((r) => r.box_no)
  );

  const inserted = rows.filter((r) => !existing.has(r.box_no)).length;
  const yearFixed = rows.filter(
    (r) => staleYear.has(r.box_no) && cleanYear(r.year_released) !== null
  ).length;

  if (!dryRun) {
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => '(?,?,?,?,?,?,?,NOW(3),NOW(3))').join(',');
      const params: any[] = [];
      for (const r of batch) {
        params.push(
          r.box_no,
          r.name,
          Number(r.category_id) || 0,
          r.category_name,
          cleanYear(r.year_released),
          cleanWeightString(r.weight),
          String(r.name).toLowerCase()
        );
      }
      await prisma.$executeRawUnsafe(
        `INSERT INTO SetsCatalog
           (box_no, name, category_id, category_name, year_released, weight, search_name, created_at, updated_at)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE
           name          = VALUES(name),
           category_id   = VALUES(category_id),
           category_name = VALUES(category_name),
           year_released = COALESCE(VALUES(year_released), year_released),
           weight        = COALESCE(VALUES(weight), weight),
           search_name   = VALUES(search_name),
           updated_at    = NOW(3)`,
        ...params
      );
      process.stdout.write(`\r   sets: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
    }
    process.stdout.write('\n');
  }

  return { inserted, yearFixed, total: rows.length };
}

async function main() {
  console.log(APPLY ? '\nSYNCING CATALOG -> DATABASE\n' : '\nDRY RUN (pass --apply to write)\n');

  const m = await syncMinifigs(!APPLY);
  const s = await syncSets(!APPLY);

  const line = (label: string, r: SyncResult) =>
    console.log(
      `  ${label.padEnd(10)} ${String(r.total).padStart(6)} in JSON   ` +
        `${String(r.inserted).padStart(4)} new rows   ` +
        `${String(r.yearFixed).padStart(4)} years filled in`
    );

  console.log('');
  line('minifigs', m);
  line('sets', s);

  console.log(
    APPLY
      ? '\nDone. Descriptions were not touched.\n'
      : '\nNothing written. Re-run with --apply.\n'
  );

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
