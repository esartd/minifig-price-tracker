/**
 * Update theme images cache with better representative sets
 * Picks recent, popular, and visually appealing sets for each theme
 */

import fs from 'fs';
import path from 'path';

interface LegoBox {
  box_no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released: string;
  weight: string;
  image_url: string;
  updated_at: string;
}

interface ThemeCache {
  representativeImage: string;
  fallbackImages: string[];
  lastVerified: string;
  setCount: number;
}

// Load boxes catalog
const boxesPath = path.join(process.cwd(), 'public/catalog/boxes.json');
const boxes: LegoBox[] = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));

// Load current theme cache
const cachePath = path.join(process.cwd(), 'lib/theme-images-cache.json');
const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));

console.log(`Loaded ${boxes.length} sets`);

// Group boxes by parent theme
const themeGroups = new Map<string, LegoBox[]>();

boxes.forEach(box => {
  const parent = box.category_name.split(' / ')[0].trim();
  if (!themeGroups.has(parent)) {
    themeGroups.set(parent, []);
  }
  themeGroups.get(parent)!.push(box);
});

console.log(`Found ${themeGroups.size} unique themes`);

// Manual overrides (from user's selections)
const manualOverrides: Record<string, string> = {
  'Star Wars': '75460-1',
  'The Hobbit and The Lord of the Rings': '10316-1',
  '(Other)': 'GearSet-4',
  'BrickLink': '5009260-1',
  'LEGO Originals': '11926-1',
  'Modulex': 'Modulex-12'
};

// Score a set to determine how good it is as a theme representative
function scoreSet(box: LegoBox): number {
  let score = 0;

  // Recent sets are better (2020+)
  const year = parseInt(box.year_released);
  if (year >= 2024) score += 50;
  else if (year >= 2022) score += 30;
  else if (year >= 2020) score += 20;
  else if (year >= 2015) score += 10;

  // Has weight (more complete data)
  if (box.weight && box.weight !== '?' && box.weight !== '0') score += 20;

  // Avoid promotional/polybag sets (usually smaller set numbers)
  const hasHyphen = box.box_no.includes('-');
  if (hasHyphen) {
    const setNum = parseInt(box.box_no.split('-')[0]);
    if (setNum >= 10000) score += 30; // Bigger sets (Ideas, Icons, etc.)
    else if (setNum >= 1000) score += 20; // Standard sets
    else if (setNum >= 100) score += 10; // Smaller sets
    // Polybags/tiny sets get no bonus
  }

  // Prefer sets with longer names (usually more interesting)
  if (box.name.length > 30) score += 10;

  // Avoid certain keywords
  const lowerName = box.name.toLowerCase();
  if (lowerName.includes('polybag')) score -= 20;
  if (lowerName.includes('keychain')) score -= 30;
  if (lowerName.includes('magnet')) score -= 30;
  if (lowerName.includes('promotional')) score -= 20;
  if (lowerName.includes('colors only')) score -= 40;

  return score;
}

// Update theme cache
const updatedThemes: Record<string, ThemeCache> = {};

themeGroups.forEach((themeSets, themeName) => {
  console.log(`\nProcessing theme: ${themeName} (${themeSets.length} sets)`);

  // Check for manual override
  if (manualOverrides[themeName]) {
    const overrideSet = boxes.find(b => b.box_no === manualOverrides[themeName]);
    if (overrideSet) {
      console.log(`  ✓ Using manual override: ${overrideSet.name}`);

      // Get other good sets as fallbacks
      const fallbacks = themeSets
        .filter(b => b.box_no !== overrideSet.box_no)
        .sort((a, b) => scoreSet(b) - scoreSet(a))
        .slice(0, 5)
        .map(b => b.image_url);

      updatedThemes[themeName] = {
        representativeImage: overrideSet.image_url,
        fallbackImages: fallbacks,
        lastVerified: new Date().toISOString(),
        setCount: themeSets.length
      };
      return;
    }
  }

  // Score all sets and pick the best
  const scored = themeSets.map(box => ({
    box,
    score: scoreSet(box)
  })).sort((a, b) => b.score - a.score);

  const best = scored[0].box;
  console.log(`  → Best: ${best.name} (${best.box_no}) - Score: ${scored[0].score}`);

  // Get top 6 as representative + fallbacks
  const topSets = scored.slice(0, 6).map(s => s.box.image_url);

  updatedThemes[themeName] = {
    representativeImage: topSets[0],
    fallbackImages: topSets.slice(1, 6),
    lastVerified: new Date().toISOString(),
    setCount: themeSets.length
  };
});

// Write updated cache
const outputData = {
  _comment: "This file caches the verified working image for each LEGO set theme",
  _lastUpdated: new Date().toISOString(),
  _totalThemes: themeGroups.size,
  themes: updatedThemes
};

fs.writeFileSync(cachePath, JSON.stringify(outputData, null, 2));

console.log(`\n✅ Updated ${themeGroups.size} themes in cache`);
console.log(`📝 Cache file: ${cachePath}`);
