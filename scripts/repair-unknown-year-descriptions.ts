/**
 * Repair stored descriptions that say the item was released in "?".
 *
 * ## The bug this cleans up after
 *
 * The description generators interpolated `year_released` into an opening
 * sentence behind a `|| 'unknown'` guard. BrickLink writes "?" for an unknown
 * year and "?" is truthy, so the guard never fired and the placeholder was
 * written into the stored text:
 *
 *   en  "... from the DUPLO / Town / Fire theme was released in ?."
 *   fr  "... du thème DUPLO / Town / Fire a été publiée en ?."
 *   es  "... del tema DUPLO / Town / Fire fue lanzada en ?."
 *
 * Only en/fr/es are affected -- the other seven locales use templates that do
 * not interpolate a year. `scripts/translate-all-descriptions.ts` has been
 * fixed so it cannot reintroduce them, but that does not touch text already in
 * the database, which is what the pages actually render.
 *
 * ## Two cases
 *
 * 1. The year is now known. `scripts/sync-catalog-to-db.ts` refreshed
 *    `year_released` from the current BrickLink export, which filled in 21 of
 *    these. Substitute the real year.
 * 2. The year is genuinely unknown at BrickLink. Drop the clause entirely:
 *    "... from the X theme was released in ?." becomes "... from the X theme."
 *    That is grammatical in all three languages, which is why the clause is cut
 *    at the preposition rather than replaced with a word like "unknown".
 *
 * ## Usage
 *
 *   npx tsx --env-file=.env.local scripts/repair-unknown-year-descriptions.ts
 *   npx tsx --env-file=.env.local scripts/repair-unknown-year-descriptions.ts --apply
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

const TABLES = [
  { table: 'MinifigCatalog', id: 'minifigure_no' },
  { table: 'SetsCatalog', id: 'box_no' },
] as const;

/**
 * The exact clauses to remove, per locale.
 *
 * Both grammatical genders are listed because the same template was used for
 * minifigures ("lanzada", "publiée") and sets ("lanzado", "publié"). A string
 * that does not occur in a given table simply matches nothing.
 */
const UNKNOWN_CLAUSES: Record<string, string[]> = {
  en: [' was released in ?.'],
  fr: [' a été publiée en ?.', ' a été publié en ?.'],
  es: [' fue lanzada en ?.', ' fue lanzado en ?.'],
};

/** The preposition each locale uses, for the known-year substitution. */
const PREPOSITION: Record<string, string> = { en: 'in', fr: 'en', es: 'en' };

const LOCALES = Object.keys(UNKNOWN_CLAUSES);

async function count(table: string, locale: string): Promise<number> {
  const [r] = await prisma.$queryRawUnsafe<{ c: bigint }[]>(
    `SELECT COUNT(*) c FROM \`${table}\` WHERE description_${locale} LIKE '% ?.%'`
  );
  return Number(r.c);
}

async function main() {
  console.log(APPLY ? '\nREPAIRING\n' : '\nDRY RUN (pass --apply to write)\n');

  for (const { table } of TABLES) {
    for (const locale of LOCALES) {
      const before = await count(table, locale);
      if (before === 0) {
        console.log(`  ${table}.${locale}: clean`);
        continue;
      }

      if (!APPLY) {
        console.log(`  ${table}.${locale}: ${before} to repair`);
        continue;
      }

      // Case 1 -- year now known. Must run first: once the clause is removed
      // there is nothing left to substitute into.
      const prep = PREPOSITION[locale];
      const known = await prisma.$executeRawUnsafe(
        `UPDATE \`${table}\`
            SET description_${locale} = REPLACE(description_${locale},
                  '${prep} ?.', CONCAT('${prep} ', year_released, '.'))
          WHERE description_${locale} LIKE '% ?.%'
            AND year_released REGEXP '^[0-9]{4}$'`
      );

      // Case 2 -- still unknown. Cut the clause at the preposition.
      let removed = 0;
      for (const clause of UNKNOWN_CLAUSES[locale]) {
        removed += await prisma.$executeRawUnsafe(
          `UPDATE \`${table}\`
              SET description_${locale} = REPLACE(description_${locale}, ?, '.')
            WHERE description_${locale} LIKE '% ?.%'`,
          clause
        );
      }

      const after = await count(table, locale);
      console.log(
        `  ${table}.${locale}: ${before} -> ${after}   ` +
          `(${known} got a real year, ${removed} had the clause dropped)`
      );
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
