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
 */
export function searchBoxes(query: string, limit: number = 50): LegoBox[] {
  const boxes = loadAllBoxes();
  const queryL = query.toLowerCase().trim();

  if (!queryL) {
    return boxes.slice(0, limit);
  }

  const matches = boxes.filter(box =>
    box.name.toLowerCase().includes(queryL) ||
    box.box_no.toLowerCase().includes(queryL) ||
    box.category_name.toLowerCase().includes(queryL)
  );

  // Sort by relevance: exact matches first, then year descending
  matches.sort((a, b) => {
    const aExact = a.box_no.toLowerCase() === queryL || a.name.toLowerCase() === queryL;
    const bExact = b.box_no.toLowerCase() === queryL || b.name.toLowerCase() === queryL;

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // Parse years, treating invalid values as 0 to sort them last
    const aYear = !a.year_released || isNaN(parseInt(a.year_released)) ? 0 : parseInt(a.year_released);
    const bYear = !b.year_released || isNaN(parseInt(b.year_released)) ? 0 : parseInt(b.year_released);
    return bYear - aYear;
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
