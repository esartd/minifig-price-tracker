/**
 * Minifigure content filtering utilities
 *
 * Some minifigures (e.g., Scala dolls without clothes) have anatomical details
 * that should be blurred for family-friendly display
 */

// Specific shirtless Scala minifig IDs that need blur
const SHIRTLESS_SCALA_IDS = new Set([
  'scaFemA01', // Caroline
  'scaFemA02', // Kate
  'scaFemA03', // Marita
  'scaFemA04', // Mother
  'scaFemA05', // Olivia
  'scaFemY01', // Andrea
  'scaFemY02', // Carla
  'scaFemY03', // Emma Restyle
  'scaFemY04', // Emma
  'scaFemY05', // Marie
  'scaFemY06', // Lotte
  'scaFemY07', // Marie with Very Long Hair
  'x30',       // Christian
  'x4cx01',    // Baby Thomas - Small Eyes
  'x4cx02'     // Baby Thomas - Large Eyes
]);

/**
 * Check if a minifigure should have its image blurred
 */
export function shouldBlurImage(minifigNo: string, name?: string): boolean {
  // Check explicit shirtless IDs
  if (SHIRTLESS_SCALA_IDS.has(minifigNo)) {
    return true;
  }

  // If name is provided, check if it's Scala without clothes
  if (name) {
    const nameLower = name.toLowerCase();
    const isScala = nameLower.includes('scala');
    const hasClothes = nameLower.includes('clothes') ||
                       nameLower.includes('outfit') ||
                       nameLower.includes('dressed');

    // Blur if it's Scala AND doesn't have clothes mentioned
    if (isScala && !hasClothes) {
      return true;
    }
  }

  return false;
}

/**
 * Get CSS styles for potentially sensitive minifig images
 */
export function getSensitiveImageStyles(minifigNo: string, name?: string): React.CSSProperties {
  if (shouldBlurImage(minifigNo, name)) {
    return {
      filter: 'blur(10px)',
      WebkitFilter: 'blur(10px)'
    };
  }
  return {};
}

/**
 * Check if a category/theme contains sensitive content
 */
export function isSensitiveTheme(categoryName: string): boolean {
  return categoryName.toLowerCase().includes('scala');
}
