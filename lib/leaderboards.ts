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

/**
 * Generate default display name from user's full name
 * Format: "FirstName L." (first name + last initial)
 * If no name, returns "Anonymous Collector"
 */
export function generateDefaultDisplayName(fullName: string | null | undefined): string {
  if (!fullName || !fullName.trim()) {
    return 'Anonymous Collector';
  }

  const parts = fullName.trim().split(' ');

  if (parts.length === 1) {
    // Only first name
    return parts[0];
  }

  // First name + last initial
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstName} ${lastInitial}.`;
}
