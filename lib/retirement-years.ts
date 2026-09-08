/**
 * Groups retirement predictions into the sections the /retiring-soon page
 * renders.
 *
 * Why year and not quarter: retiring-soon-algorithm.ts does not predict a
 * quarter. estimateRetirementQuarter() hard-codes one --
 *
 *     // Assume Q4 retirement (most common)
 *     const quarter = `Q4 ${estimatedRetirementYear}`;
 *
 * -- so every prediction in the catalog carries the same "Q4", and the only
 * real signal in that string is the year. Grouping by quarter would create
 * headings that claim a precision the model does not have, and would produce
 * exactly one group per year anyway.
 *
 * This file deliberately has no imports. It must stay importable from a
 * 'use client' component, and retiring-soon-algorithm.ts pulls in @/lib/prisma
 * and @/lib/boxes-data -- a value import from there would drag the database
 * client into the browser bundle. (The `import type` in the client components
 * is erased at compile time and is safe.)
 */

export type RetirementConfidence = 'low' | 'medium' | 'high';

/** The minimum shape this module needs. RetirementPrediction satisfies it. */
export interface YearGroupable {
  estimatedRetirementQuarter?: string;
  confidence: RetirementConfidence;
}

export interface YearGroup<T> {
  /** Stable React key: 'overdue' | '2026' | 'unknown'. */
  key: string;
  kind: 'overdue' | 'year' | 'unknown';
  /** null for the overdue-with-no-year and unknown buckets. */
  year: number | null;
  sets: T[];
  count: number;
  /** The shared confidence when every set agrees, otherwise null. */
  uniformConfidence: RetirementConfidence | null;
}

/**
 * Pulls the year out of a stored quarter string such as "Q4 2026".
 *
 * Returns null for anything it cannot read. The array this runs over arrives
 * as untyped JSON from /api/sets/retiring-soon, so this must never throw on a
 * malformed or missing value -- those land in the "unknown" bucket instead.
 *
 * Deliberately does NOT fall back to estimatedRetirementDate. That field is a
 * Date on the server and an ISO string after the client refetch, and the
 * server builds it as local `new Date(y, 11, 31)`. Reading a year off a
 * 31 December timestamp gives different answers either side of a timezone,
 * which is a hydration mismatch waiting to happen. The quarter string carries
 * no timezone at all.
 */
export function parseRetirementYear(quarter?: string | null): number | null {
  if (typeof quarter !== 'string') return null;
  const match = quarter.match(/(\d{4})/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

/**
 * Buckets predictions into sections, ordered: overdue first, then years
 * ascending, then anything undated.
 *
 * Input order is preserved inside each bucket. The API delivers the array
 * already sorted by retirementScore descending, and a Map keeps insertion
 * order, so the strongest candidates stay at the top of their own section.
 *
 * `currentYear` is a parameter rather than a `new Date()` call inside this
 * function so the server render and the client hydration agree on it. Reading
 * the clock here would let the two disagree across the New Year boundary in
 * different timezones.
 */
export function groupByRetirementYear<T extends YearGroupable>(
  sets: readonly T[],
  currentYear: number
): YearGroup<T>[] {
  const buckets = new Map<string, { kind: YearGroup<T>['kind']; year: number | null; sets: T[] }>();

  for (const set of sets) {
    const year = parseRetirementYear(set.estimatedRetirementQuarter);

    let key: string;
    let kind: YearGroup<T>['kind'];
    if (year === null) {
      key = 'unknown';
      kind = 'unknown';
    } else if (year < currentYear) {
      // Past its estimate. These used to be reachable only through the
      // "0-3 months" tab, whose filter was `date <= now + 90 days` and so
      // swept up everything overdue under a HIGH URGENCY label.
      key = 'overdue';
      kind = 'overdue';
    } else {
      key = String(year);
      kind = 'year';
    }

    const existing = buckets.get(key);
    if (existing) {
      existing.sets.push(set);
    } else {
      buckets.set(key, { kind, year: kind === 'year' ? year : null, sets: [set] });
    }
  }

  const groups: YearGroup<T>[] = [];
  for (const [key, bucket] of buckets) {
    let uniform: RetirementConfidence | null = bucket.sets[0].confidence;
    for (const set of bucket.sets) {
      if (set.confidence !== uniform) {
        uniform = null;
        break;
      }
    }
    groups.push({
      key,
      kind: bucket.kind,
      year: bucket.year,
      sets: bucket.sets,
      count: bucket.sets.length,
      uniformConfidence: uniform,
    });
  }

  // Overdue first, then years ascending, then undated. Only one bucket can
  // exist per rank, so ties are impossible.
  const rank = (g: YearGroup<T>) => {
    if (g.kind === 'overdue') return Number.MIN_SAFE_INTEGER;
    if (g.kind === 'unknown') return Number.MAX_SAFE_INTEGER;
    return g.year as number;
  };
  groups.sort((a, b) => rank(a) - rank(b));

  return groups;
}

/**
 * Picks `total` items spread across year buckets instead of taking the highest
 * scorers outright.
 *
 * /retiring-soon selected the top N by age score, and because that score is
 * driven by how far past its expected lifespan a set is, the result was 100
 * sets that all shared one year -- measured, not assumed: at limit=100 the API
 * returned Q4 2026 for every single row, and every progress bar was red. Year
 * headings and a colour scale are both pointless against data like that.
 *
 * Round-robins instead: the best from each year, then the second best from
 * each year, and so on. Order within a bucket is preserved, so callers should
 * pass an already-score-sorted array and each year stays ranked internally.
 */
export function takeBalancedByYear<T>(
  items: readonly T[],
  yearOf: (item: T) => number | null,
  total: number
): T[] {
  if (total <= 0) return [];

  const buckets = new Map<number, T[]>();
  const undated: T[] = [];
  for (const item of items) {
    const year = yearOf(item);
    if (year === null) {
      undated.push(item);
      continue;
    }
    const bucket = buckets.get(year);
    if (bucket) bucket.push(item);
    else buckets.set(year, [item]);
  }

  const years = [...buckets.keys()].sort((a, b) => a - b);
  const out: T[] = [];

  for (let depth = 0; out.length < total; depth++) {
    let addedThisPass = false;
    for (const year of years) {
      const bucket = buckets.get(year) as T[];
      if (depth < bucket.length) {
        out.push(bucket[depth]);
        addedThisPass = true;
        if (out.length >= total) break;
      }
    }
    if (!addedThisPass) break;
  }

  // Undated entries fill any remaining room rather than displacing dated ones.
  for (const item of undated) {
    if (out.length >= total) break;
    out.push(item);
  }

  return out;
}
