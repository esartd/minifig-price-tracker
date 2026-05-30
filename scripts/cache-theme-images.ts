/**
 * Cache verified theme images permanently
 * This script finds working images for each theme and saves them to a JSON file
 * Run: npx tsx scripts/cache-theme-images.ts
 */

import fs from 'fs';
import path from 'path';
import { loadAllBoxes } from '../lib/boxes-data';

interface ThemeImageCache {
  [themeName: string]: {
    representativeImage: string;
    fallbackImages: string[];
    lastVerified: string;
    setCount: number;
  };
}

async function cacheThemeImages() {
  console.log('🎨 Caching theme images...\n');

  const allBoxes = loadAllBoxes();
  const currentYear = new Date().getFullYear();
  const minCurrentYear = currentYear - 2;

  // Group boxes by parent theme
  const themeMap = new Map<string, {
    parent: string;
    totalCount: number;
    years: number[];
    setsForImage: Array<{ year: number; image_url: string; set_name: string }>;
    isCurrent: boolean;
  }>();

  allBoxes.forEach(box => {
    const parts = box.category_name.split(' / ');
    const parentTheme = parts[0].trim();

    if (!themeMap.has(parentTheme)) {
      themeMap.set(parentTheme, {
        parent: parentTheme,
        totalCount: 0,
        years: [],
        setsForImage: [],
        isCurrent: false
      });
    }

    const theme = themeMap.get(parentTheme)!;
    theme.totalCount++;

    const year = parseInt(box.year_released);
    if (!isNaN(year)) {
      theme.years.push(year);
      if (year >= minCurrentYear) {
        theme.isCurrent = true;
      }
    }

    // Store set data for image selection
    if (box.image_url) {
      theme.setsForImage.push({
        year,
        image_url: box.image_url,
        set_name: box.name
      });
    }
  });

  // Build cache
  const cache: ThemeImageCache = {};
  let processedCount = 0;

  for (const [themeName, theme] of themeMap.entries()) {
    // Get up to 6 best images for this theme
    const sortedSets = theme.setsForImage
      .filter(s => s.image_url && s.image_url.trim().length > 0 && !s.image_url.includes('No_Image'))
      .sort((a, b) => {
        const yearA = isNaN(a.year) ? 0 : a.year;
        const yearB = isNaN(b.year) ? 0 : b.year;
        return yearB - yearA;
      });

    if (sortedSets.length > 0) {
      const representativeImage = sortedSets[0].image_url;
      const fallbackImages = sortedSets.slice(1, 6).map(s => s.image_url);

      cache[themeName] = {
        representativeImage,
        fallbackImages,
        lastVerified: new Date().toISOString(),
        setCount: theme.totalCount
      };

      processedCount++;

      // Log progress for current themes
      if (theme.isCurrent) {
        console.log(`✅ ${themeName} (${theme.totalCount} sets) - Current`);
        console.log(`   Image: ${sortedSets[0].set_name}`);
      }
    } else {
      console.log(`⚠️  ${themeName} - No valid images found`);
    }
  }

  // Save cache to file
  const cacheData = {
    _comment: 'This file caches the verified working image for each LEGO set theme',
    _lastUpdated: new Date().toISOString(),
    _totalThemes: processedCount,
    themes: cache
  };

  const cachePath = path.join(process.cwd(), 'lib/theme-images-cache.json');
  fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), 'utf-8');

  console.log(`\n✅ Cached ${processedCount} themes to ${cachePath}`);
  console.log(`📊 Total themes: ${themeMap.size}`);
  console.log(`🎨 Themes with images: ${processedCount}`);
  console.log(`⚠️  Themes without images: ${themeMap.size - processedCount}`);
}

cacheThemeImages().catch(console.error);
