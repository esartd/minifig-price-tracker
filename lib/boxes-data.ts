/**
 * LEGO Boxes (Sets) data utilities
 * Loads boxes from boxes.json for user collections and browse experience
 */

import fs from 'fs';
import path from 'path';
import { LegoBox } from '@/types';

// In-memory cache with expiration
let cachedBoxes: LegoBox[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes - matches minifigs cache
const CACHE_VERSION = '2026-05-02'; // Increment to bust cache after catalog updates

/**
 * Load all boxes from boxes.json (cached with 15min TTL)
 */
export function loadAllBoxes(): LegoBox[] {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedBoxes && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedBoxes;
  }

  console.log('[BOXES] Loading from filesystem:', cachedBoxes ? 'cache expired' : 'first load');

  try {
    const boxesPath = path.join(process.cwd(), 'public/catalog/boxes.json');
    const fileContent = fs.readFileSync(boxesPath, 'utf-8');
    cachedBoxes = JSON.parse(fileContent);
    cacheTimestamp = now;
    return cachedBoxes!;
  } catch (error) {
    console.error('Error loading boxes.json:', error);
    return [];
  }
}

/**
 * Get recent boxes (last 3 years by default) filtered by criteria
 */
export function getRecentBoxes(options: {
  yearMin?: number;
  theme?: string;
  excludeAdvents?: boolean;
  excludePromotional?: boolean;
  limit?: number;
} = {}): LegoBox[] {
  const boxes = loadAllBoxes();
  const currentYear = new Date().getFullYear();
  const minYear = options.yearMin !== undefined ? options.yearMin : (currentYear - 2);

  let filtered = boxes.filter(box => {
    const year = parseInt(box.year_released);
    if (isNaN(year) || year < minYear) return false;

    const nameL = box.name.toLowerCase();
    const categoryL = box.category_name.toLowerCase();

    // Exclude advent calendar sub-sets if requested
    if (options.excludeAdvents && categoryL.includes('advent sub-set')) return false;

    // Exclude promotional/service packs if requested
    if (options.excludePromotional && (
      categoryL.includes('promotional') ||
      categoryL.includes('service pack') ||
      categoryL.includes('polybag') ||
      nameL.includes('foil pack') ||
      nameL.includes('gift with purchase') ||
      nameL.includes('gwp')
    )) return false;

    // Filter by theme if specified
    if (options.theme) {
      const themeL = options.theme.toLowerCase();
      if (!categoryL.includes(themeL) && !nameL.includes(themeL)) return false;
    }

    return true;
  });

  // Sort by year descending (newest first)
  filtered.sort((a, b) => parseInt(b.year_released) - parseInt(a.year_released));

  return options.limit ? filtered.slice(0, options.limit) : filtered;
}

/**
 * Search boxes by name, number, or category
 *
 * TEST CASES:
 * ✓ "75192-1" → Exact set match only
 * ✓ "millennium falcon" → Millennium Falcon sets
 * ✓ Multi-word queries work correctly
 */
export function searchBoxes(query: string, limit: number = 50): LegoBox[] {
  const boxes = loadAllBoxes();
  const queryL = query.toLowerCase().trim();

  if (!queryL) {
    return boxes.slice(0, limit);
  }

  // 1. Intent detection: Is this a set ID?
  const isBoxNumber = /^\d{4,5}(-\d+)?$/i.test(queryL);

  // 2. Exact ID match (fast path)
  if (isBoxNumber) {
    const exact = boxes.find(b => b.box_no.toLowerCase() === queryL);
    if (exact) return [exact];
  }

  // 3. Scoring function (same logic as minifigs)
  function calculateScore(box: LegoBox): number {
    const nameL = box.name.toLowerCase();
    const idL = box.box_no.toLowerCase();
    const categoryL = box.category_name.toLowerCase();

    // Normalize: remove hyphens/special chars (e.g., "N-1" → "n1")
    const nameNormalized = nameL.replace(/[\-']/g, '');
    const queryNormalized = queryL.replace(/[\-']/g, '');

    // Exact matches
    if (nameL === queryL || nameNormalized === queryNormalized) return 1000;
    if (idL === queryL) return 1000;

    // Name starts with
    if (nameL.startsWith(queryL) || nameNormalized.startsWith(queryNormalized)) return 500;

    // Tokenize
    const nameWords = nameL.split(/[\s\/\-]+/);
    const categoryWords = categoryL.split(/[\s\/\-]+/);

    // Word boundary exact
    if (nameWords.some(w => w === queryL)) return 400;

    // Word prefix (with length check)
    if (nameWords.some(w => {
      if (!w.startsWith(queryL)) return false;
      return queryL.length / w.length >= 0.6 || w.length <= queryL.length + 2;
    })) return 300;

    // ID matching
    if (idL.startsWith(queryL)) return 250;
    if (idL.includes(queryL)) return 200;

    // Multi-word queries
    const queryWords = queryL.split(/\s+/).filter(w => w.length >= 2);
    if (queryWords.length > 1) {
      // Try normalized matching (handles "n1" matching "n-1")
      const queryWordsNormalized = queryWords.map(w => w.replace(/[\-']/g, ''));
      const nameWordsNormalized = nameWords.map(w => w.replace(/[\-']/g, ''));

      const allMatchNormalized = queryWordsNormalized.every(qWord =>
        nameWordsNormalized.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))
      );
      if (allMatchNormalized) return 85;

      // Fallback to regular matching
      const allMatch = queryWords.every(qWord =>
        nameWords.some(nWord => nWord.startsWith(qWord))
      );
      if (allMatch) return 85;
    }

    // Category matching ONLY if query is specific (>6 chars) to avoid pollution
    if (queryL.length > 6) {
      if (categoryWords.some(w => w === queryL)) return 30;
      if (categoryWords.some(w => w.startsWith(queryL) && w.length >= 8)) return 15;
    }

    return 0; // NO substring matching
  }

  // 4. Score, filter, and sort
  const matches = boxes
    .map(b => ({ ...b, score: calculateScore(b) }))
    .filter(b => b.score > 0)
    .sort((a, b) => {
      // Primary: Score
      if (b.score !== a.score) return b.score - a.score;

      // Secondary: Year
      const aYear = parseInt(a.year_released || '0') || 0;
      const bYear = parseInt(b.year_released || '0') || 0;
      if (bYear !== aYear) return bYear - aYear;

      // Tertiary: ID
      return b.box_no.localeCompare(a.box_no);
    });

  return matches.slice(0, limit);
}

/**
 * Get box by exact box_no
 */
export function getBoxByNumber(boxNo: string): LegoBox | null {
  const boxes = loadAllBoxes();
  return boxes.find(box => box.box_no === boxNo) || null;
}

/**
 * Get popular themes (categories with most sets from recent years)
 */
export function getPopularThemes(limit: number = 10): Array<{theme: string; count: number}> {
  const currentYear = new Date().getFullYear();
  const recentBoxes = getRecentBoxes({ yearMin: currentYear - 2 });

  const themeCounts = recentBoxes.reduce((acc, box) => {
    // Extract main theme (e.g., "Friends" from "Friends / Heartlake City")
    const mainTheme = box.category_name.split('/')[0].trim();
    acc[mainTheme] = (acc[mainTheme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(themeCounts)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get all unique themes from the catalog
 */
export function getAllThemes(): string[] {
  const boxes = loadAllBoxes();
  const themes = new Set<string>();

  boxes.forEach(box => {
    const mainTheme = box.category_name.split('/')[0].trim();
    themes.add(mainTheme);
  });

  return Array.from(themes).sort();
}
