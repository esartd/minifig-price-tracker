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
 * Add new sets here for priority placement
 *
 * For pre-order/new sets not yet in BrickLink:
 * - Use a placeholder image or fetch from Amazon product page
 * - setNumber can be approximate or 'pre-order-1', etc.
 * - Update with actual details once sets launch
 */
export const FEATURED_STAR_WARS_SETS: FeaturedSet[] = [
  {
    setNumber: 'New Set 1',
    name: 'Star Wars Pre-Order Set', // TODO: Update with actual name from Amazon/Users/erickkosysu/Desktop/Screenshot 2026-04-19 at 5.21.43 PM.png
    theme: 'Star Wars',
    year: 2025,
    imageUrl: 'https://via.placeholder.com/400x400/1e40af/ffffff?text=New+LEGO+Set', // TODO: Replace with actual image
    amazonUrl: 'https://amzn.to/4tlgKmN'
  },
  {
    setNumber: 'New Set 2',
    name: 'Star Wars Pre-Order Set', // TODO: Update with actual name from Amazon
    theme: 'Star Wars',
    year: 2025,
    imageUrl: 'https://via.placeholder.com/400x400/1e40af/ffffff?text=New+LEGO+Set', // TODO: Replace with actual image
    amazonUrl: 'https://amzn.to/4cUMvx6'
  },
  {
    setNumber: 'New Set 3',
    name: 'Star Wars Pre-Order Set', // TODO: Update with actual name from Amazon
    theme: 'Star Wars',
    year: 2025,
    imageUrl: 'https://via.placeholder.com/400x400/1e40af/ffffff?text=New+LEGO+Set', // TODO: Replace with actual image
    amazonUrl: 'https://amzn.to/4sHvOKc'
  }
];

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
