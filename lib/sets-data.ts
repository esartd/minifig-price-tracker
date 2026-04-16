/**
 * LEGO Sets data utilities
 * Loads current sets from Sets.txt for affiliate advertising
 *
 * "Current" = sets from last 3 years (e.g., 2024-2026 in 2026)
 * This matches the minifig catalog's definition of current themes
 */

import fs from 'fs';
import path from 'path';

/**
 * Number of years to look back for "current" sets
 * Kept in sync with theme page's definition of current themes
 */
const CURRENT_YEARS_LOOKBACK = 2; // Last 3 years (currentYear - 2)

export interface LegoSet {
  categoryId: number;
  categoryName: string;
  no: string;
  name: string;
  yearReleased: number;
  weight: string;
  dimensions: string;
}

// In-memory cache with expiration
let cachedCurrentSets: LegoSet[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Load current sets from Sets.txt (cached with 24h TTL)
 * "Current" = sets from last 3 years based on CURRENT_YEARS_LOOKBACK constant
 */
export function loadCurrentSets(): LegoSet[] {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedCurrentSets && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedCurrentSets;
  }

  try {
    const setsPath = path.join(process.cwd(), 'Sets.txt');
    const fileContent = fs.readFileSync(setsPath, 'utf-8');
    const lines = fileContent.split('\n').slice(3); // Skip header rows

    const currentYear = new Date().getFullYear();
    const minYear = currentYear - CURRENT_YEARS_LOOKBACK;

    cachedCurrentSets = lines
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split('\t');
        if (parts.length < 7) return null;

        const year = parseInt(parts[4]);
        // Only include current sets
        if (isNaN(year) || year < minYear) return null;

        const setNo = parts[2] || '';
        const setName = parts[3] || '';
        const setNameLower = setName.toLowerCase();

        // Get current month (1-12) to check for advent calendars
        const currentMonth = new Date().getMonth() + 1; // 0-11, so add 1
        const isDecember = currentMonth === 12;

        // Filter out non-purchasable sets
        if (
          setNo.startsWith('L00') || // Paper bags (L0002234-1)
          setNo.startsWith('912') || // Promotional paper bags (912501-1)
          setNameLower.includes('paper bag') ||
          setNameLower.includes('polybag') ||
          setNameLower.includes('gift with purchase') ||
          setNameLower.includes('gwp') ||
          setNameLower.includes('store exclusive build') ||
          setNameLower.includes('brand store') ||
          setNameLower.includes('lego brand') ||
          setNameLower.includes('promotional') ||
          setNameLower.includes('giveaway') ||
          (!isDecember && setNameLower.includes('advent calendar')) // Only show advent calendars in December
        ) {
          return null;
        }

        return {
          categoryId: parseInt(parts[0]) || 0,
          categoryName: parts[1] || '',
          no: setNo,
          name: setName,
          yearReleased: year,
          weight: parts[5] || '',
          dimensions: parts[6] || ''
        };
      })
      .filter((set): set is LegoSet => set !== null);

    cacheTimestamp = now; // Update cache timestamp
    return cachedCurrentSets;
  } catch (error) {
    console.error('Error loading Sets.txt:', error);
    return [];
  }
}

/**
 * Get newest current sets from a specific theme (sorted by year DESC)
 * Uses sets already filtered by loadCurrentSets() (within CURRENT_YEARS_LOOKBACK)
 * @param themeName - Theme name (e.g., "Star Wars", "Harry Potter")
 * @param count - Number of newest sets to return
 */
export function getNewestCurrentSetsFromTheme(themeName: string, count: number = 1): LegoSet[] {
  const allCurrentSets = loadCurrentSets();

  // Normalize theme name for flexible matching
  const normalizedTheme = themeName.toLowerCase().trim();

  // Theme mapping for flexible matching (category names vs user-facing theme names)
  const themeMap: Record<string, string[]> = {
    'star wars': ['star wars'],
    'harry potter': ['harry potter'],
    'marvel': ['marvel', 'spider-man', 'avengers', 'super heroes'],
    'dc': ['dc', 'batman', 'superman', 'super heroes'],
    'super heroes': ['marvel', 'dc', 'super heroes'],
    'ninjago': ['ninjago'],
    'city': ['city'],
    'friends': ['friends'],
    'creator': ['creator'],
    'technic': ['technic'],
    'architecture': ['architecture'],
    'ideas': ['ideas'],
    'disney': ['disney'],
    'speed champions': ['speed champions'],
    'minecraft': ['minecraft'],
    'despicable me': ['despicable me and minions', 'despicable me', 'minions'],
    'minions': ['despicable me and minions', 'despicable me', 'minions']
  };

  // Find matching theme variations
  let matchingThemes: string[] = [normalizedTheme];
  for (const [key, variations] of Object.entries(themeMap)) {
    if (variations.some(v => normalizedTheme.includes(v) || v.includes(normalizedTheme))) {
      matchingThemes = variations;
      break;
    }
  }

  // Filter sets matching any theme variation
  const themeSets = allCurrentSets.filter(set =>
    matchingThemes.some(theme =>
      set.categoryName.toLowerCase().includes(theme) ||
      theme.includes(set.categoryName.toLowerCase())
    )
  );

  if (themeSets.length === 0) {
    // Fallback: return newest sets from any theme
    const sorted = [...allCurrentSets].sort((a, b) => b.yearReleased - a.yearReleased);
    return sorted.slice(0, count);
  }

  // Sort by year descending (newest first), then return top N
  const sorted = [...themeSets].sort((a, b) => b.yearReleased - a.yearReleased);
  return sorted.slice(0, Math.min(count, sorted.length));
}

/**
 * Get random current sets from a specific theme
 * Only returns sets if theme is "current" (has sets within CURRENT_YEARS_LOOKBACK)
 * @param themeName - Theme name (e.g., "Star Wars", "Harry Potter")
 * @param count - Number of random sets to return
 */
export function getRandomCurrentSetsFromTheme(themeName: string, count: number = 3): LegoSet[] {
  const allCurrentSets = loadCurrentSets();
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - CURRENT_YEARS_LOOKBACK;

  // Normalize theme name for flexible matching
  const normalizedTheme = themeName.toLowerCase().trim();

  // Theme mapping for flexible matching (category names vs user-facing theme names)
  const themeMap: Record<string, string[]> = {
    'star wars': ['star wars'],
    'harry potter': ['harry potter'],
    'marvel': ['marvel', 'spider-man', 'avengers', 'super heroes'],
    'dc': ['dc', 'batman', 'superman', 'super heroes'],
    'super heroes': ['marvel', 'dc', 'super heroes'],
    'ninjago': ['ninjago'],
    'city': ['city'],
    'friends': ['friends'],
    'creator': ['creator'],
    'technic': ['technic'],
    'architecture': ['architecture'],
    'ideas': ['ideas'],
    'disney': ['disney'],
    'speed champions': ['speed champions'],
    'minecraft': ['minecraft'],
    'despicable me': ['despicable me and minions', 'despicable me', 'minions'],
    'minions': ['despicable me and minions', 'despicable me', 'minions']
  };

  // Find matching theme variations
  let matchingThemes: string[] = [normalizedTheme];
  for (const [key, variations] of Object.entries(themeMap)) {
    if (variations.some(v => normalizedTheme.includes(v) || v.includes(normalizedTheme))) {
      matchingThemes = variations;
      break;
    }
  }

  // Only show sets from this theme AND from last 2 years
  const themeSets = allCurrentSets.filter(set =>
    set.yearReleased >= minYear &&
    matchingThemes.some(theme =>
      set.categoryName.toLowerCase().includes(theme) ||
      theme.includes(set.categoryName.toLowerCase())
    )
  );

  // If no current sets for this theme, return empty (don't show ads for non-current themes)
  if (themeSets.length === 0) {
    return [];
  }

  // Shuffle and return random sets from last 2 years
  const shuffled = [...themeSets].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get LEGO set image URL from BrickLink
 * @param setNo - Set number (e.g., "75373-1")
 */
export function getSetImageUrl(setNo: string): string {
  // BrickLink set image URL pattern
  return `https://img.bricklink.com/ItemImage/SN/0/${setNo}.png`;
}

/**
 * Generate LEGO.com product URL slug from set number and name
 * @param setNo - Set number (e.g., "75373-1")
 * @param setName - Set name (e.g., "Ambush on Mandalore Battle Pack")
 */
export function generateLegoUrlSlug(setNo: string, setName: string): string {
  // Remove -1 suffix from set number
  const cleanSetNo = setNo.replace(/-\d+$/, '');

  // Convert name to URL-friendly slug
  const nameSlug = setName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Remove duplicate hyphens
    .trim();

  return `${nameSlug}-${cleanSetNo}`;
}
