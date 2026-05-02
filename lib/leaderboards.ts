/**
 * Leaderboard helper functions
 */

import { getCurrentSeason } from './donations';

/**
 * Track when a user's collection count changes for leaderboard
 * We store a snapshot each quarter to calculate "top collectors this quarter"
 */
export interface CollectionSnapshot {
  userId: string;
  season: string; // "2026-Q2"
  minifigCount: number;
  setCount: number;
  recordedAt: Date;
}

/**
 * Check if we need a new snapshot for this season
 * Snapshots are taken once per quarter per user
 */
export function needsNewSnapshot(lastSnapshotSeason: string | null): boolean {
  const currentSeason = getCurrentSeason();
  return lastSnapshotSeason !== currentSeason;
}
