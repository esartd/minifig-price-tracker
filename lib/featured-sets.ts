/**
 * Manually curated featured sets with direct Amazon affiliate links
 * These take priority over auto-generated suggestions from Sets.txt
 */

export interface FeaturedSet {
  setNumber: string;
  name: string;
  theme: string;
  year: number;
  imageUrl: string;
  amazonUrl: string; // Direct Amazon affiliate link
}

/**
 * Featured Star Wars sets with direct Amazon links
 * Currently empty - falls back to auto-generated sets from last 2 years
 * Add sets here to override with specific affiliate links
 */
export const FEATURED_STAR_WARS_SETS: FeaturedSet[] = [];

/**
 * Get featured sets for a specific theme
 * Returns empty array if no featured sets exist for theme
 */
export function getFeaturedSetsForTheme(themeName: string): FeaturedSet[] {
  const normalizedTheme = themeName.toLowerCase().trim();

  if (normalizedTheme.includes('star wars') || normalizedTheme === 'star wars') {
    return FEATURED_STAR_WARS_SETS;
  }

  // Add more themes here as needed
  // if (normalizedTheme.includes('harry potter')) {
  //   return FEATURED_HARRY_POTTER_SETS;
  // }

  return [];
}

/**
 * Get random featured sets from a theme
 * @param themeName - Theme name (e.g., "Star Wars")
 * @param count - Number of sets to return
 */
export function getRandomFeaturedSets(themeName: string, count: number = 3): FeaturedSet[] {
  const featuredSets = getFeaturedSetsForTheme(themeName);

  if (featuredSets.length === 0) {
    return [];
  }

  // Shuffle and return requested count
  const shuffled = [...featuredSets].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
