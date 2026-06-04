/**
 * BrickLink API Call Logger
 *
 * Tracks every BrickLink API call with source attribution to understand
 * where the 5,000/day quota is being spent.
 *
 * Usage:
 *   logBrickLinkCall({
 *     endpoint: '/items/MINIFIG/sw0001/price',
 *     source: 'minifig-page-metadata',
 *     itemNo: 'sw0001'
 *   });
 */

export interface BrickLinkCallLog {
  endpoint: string;
  source: 'cron-seed' | 'minifig-page-render' | 'minifig-page-metadata' | 'set-page-render' | 'set-page-metadata' | 'api-endpoint' | 'user-request' | 'background-job' | 'unknown';
  itemNo?: string;
  timestamp?: Date;
}

// In-memory counter (resets on restart - that's OK, just for diagnostics)
const callCounts = new Map<string, number>();

export function logBrickLinkCall(log: BrickLinkCallLog) {
  const timestamp = log.timestamp || new Date();
  const key = log.source;

  // Increment counter
  callCounts.set(key, (callCounts.get(key) || 0) + 1);

  // Log to console with clear formatting
  console.log(
    `[📞 BRICKLINK API] source="${log.source}" | endpoint="${log.endpoint}" | item="${log.itemNo || 'n/a'}" | time="${timestamp.toISOString()}" | count=${callCounts.get(key)}`
  );
}

export function getBrickLinkCallStats() {
  const stats: Record<string, number> = {};
  callCounts.forEach((count, source) => {
    stats[source] = count;
  });
  return stats;
}

export function resetBrickLinkCallStats() {
  callCounts.clear();
}
