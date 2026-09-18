/**
 * Apply the sold-price cap and the sales-backed confidence flag to prices that
 * are already cached.
 *
 * lib/pricing-orchestrator.ts now drops asking prices more than 3x the actual
 * six-month sold average, caps the result at 2x that average, and marks a row
 * confidence 0.5 when BrickLink reported no sales at all. Both only take effect when a price is recomputed,
 * and recomputing means BrickLink calls -- 5,000 a day, against ~40,000 cached
 * rows. That would take over a week and starve the live site of budget.
 *
 * It is also unnecessary. Every input the blend uses is already stored on the
 * row: six_month_avg is the sold average, current_avg and current_lowest are
 * the asking figures. So the corrected value can be derived in place, with no
 * API calls at all.
 *
 * It only ever lowers a price, never raises one: a correction upward would mean
 * the stored value disagreed with the formula for a reason this script cannot
 * see, and raising someone's quoted price on a guess is the wrong risk. An
 * untouched row keeps exactly the number it had.
 *
 *   npx tsx --env-file=.env.local scripts/reprice-stored-cache.ts          # dry run
 *   npx tsx --env-file=.env.local scripts/reprice-stored-cache.ts --apply
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

/** Both must match lib/pricing-orchestrator.ts. */
const MAX_MULTIPLE_OF_SOLD = 2;
const OUTLIER_MULTIPLE_OF_SOLD = 3;

/**
 * The same arithmetic the orchestrator now performs, over stored components.
 *
 * eBay is deliberately left out: its contribution is 5% and its inputs were
 * never stored on the row, so folding it in would mean inventing a number.
 * Omitting it moves a price by at most a few percent and only ever toward the
 * BrickLink figure, which is the one under correction here.
 */
function recompute(sold: number, stockAvg: number, lowest: number): number {
  let values = [sold, stockAvg, lowest].filter((v) => v > 0);
  if (values.length === 0) return 0;

  if (sold > 0) {
    const kept = values.filter((v) => v <= sold * OUTLIER_MULTIPLE_OF_SOLD);
    values = kept.length > 0 ? kept : [sold];
  }

  const blended = values.reduce((s, v) => s + v, 0) / values.length;
  return parseFloat((sold > 0 ? Math.min(blended, sold * MAX_MULTIPLE_OF_SOLD) : blended).toFixed(2));
}

const BATCH_SIZE = 500;

interface Row {
  id: string;
  item_no: string;
  item_type: string;
  condition: string;
  currency_code: string;
  six_month_avg: number;
  current_avg: number;
  current_lowest: number;
  suggested_price: number;
  confidence: number;
}

async function main() {
  console.log(APPLY ? '\nREPRICING CACHED ROWS\n' : '\nDRY RUN (pass --apply to write)\n');

  // Only rows this site computed. Raw 'bricklink' rows are a different shape
  // and are not what the site displays.
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `SELECT id, item_no, item_type, \`condition\`, currency_code,
            six_month_avg, current_avg, current_lowest, suggested_price, confidence
       FROM PriceCache
      WHERE price_source = 'figtracker'`
  );

  const capped: { id: string; from: number; to: number; item: string }[] = [];
  const unbacked: string[] = [];

  for (const r of rows) {
    const sold = Number(r.six_month_avg);
    const suggested = Number(r.suggested_price);

    if (sold > 0) {
      const corrected = recompute(sold, Number(r.current_avg), Number(r.current_lowest));
      // Only ever lower a price here. A correction upward would mean the stored
      // value disagreed with the formula for some reason this script cannot see,
      // and raising someone's quoted price on a guess is the wrong risk to take.
      if (corrected > 0 && corrected < suggested - 0.01) {
        capped.push({ id: r.id, from: suggested, to: corrected, item: `${r.item_no} ${r.condition} ${r.currency_code}` });
      }
    } else if (suggested > 0 && Number(r.confidence) !== 0.5) {
      // No sales behind this number; the row should say so.
      unbacked.push(r.id);
    }
  }

  console.log(`  rows examined            : ${rows.length}`);
  console.log(`  prices to correct down   : ${capped.length}`);
  console.log(`  rows to mark unbacked    : ${unbacked.length}`);

  if (capped.length > 0) {
    const biggest = [...capped].sort((a, b) => (b.from - b.to) - (a.from - a.to)).slice(0, 8);
    console.log('\n  largest corrections:');
    for (const c of biggest) {
      console.log(`    ${c.item.padEnd(24)} $${c.from.toFixed(0).padStart(6)} -> $${c.to.toFixed(0).padStart(6)}`);
    }
  }

  if (!APPLY) {
    console.log('\nNothing written.\n');
    await prisma.$disconnect();
    return;
  }

  for (let i = 0; i < capped.length; i += BATCH_SIZE) {
    const batch = capped.slice(i, i + BATCH_SIZE);
    // CASE over the primary key: one statement per batch rather than one per row.
    const cases = batch.map(() => 'WHEN ? THEN ?').join(' ');
    const params: any[] = [];
    batch.forEach((c) => params.push(c.id, c.to));
    const ids = batch.map((c) => c.id);

    await prisma.$executeRawUnsafe(
      `UPDATE PriceCache
          SET suggested_price = CASE id ${cases} ELSE suggested_price END
        WHERE id IN (${ids.map(() => '?').join(',')})`,
      ...params,
      ...ids
    );
    process.stdout.write(`\r   capped ${Math.min(i + BATCH_SIZE, capped.length)}/${capped.length}`);
  }
  if (capped.length) process.stdout.write('\n');

  for (let i = 0; i < unbacked.length; i += BATCH_SIZE) {
    const batch = unbacked.slice(i, i + BATCH_SIZE);
    await prisma.$executeRawUnsafe(
      `UPDATE PriceCache SET confidence = 0.5 WHERE id IN (${batch.map(() => '?').join(',')})`,
      ...batch
    );
    process.stdout.write(`\r   marked ${Math.min(i + BATCH_SIZE, unbacked.length)}/${unbacked.length}`);
  }
  if (unbacked.length) process.stdout.write('\n');

  console.log('\nDone.\n');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
