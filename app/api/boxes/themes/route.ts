import { NextResponse } from 'next/server';
import { loadAllBoxes } from '@/lib/boxes-data';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Load cached theme images
let themeImagesCache: any = null;
function loadThemeImagesCache() {
  if (themeImagesCache) return themeImagesCache;

  try {
    const cachePath = path.join(process.cwd(), 'lib/theme-images-cache.json');
    const cacheContent = fs.readFileSync(cachePath, 'utf-8');
    themeImagesCache = JSON.parse(cacheContent);
    return themeImagesCache;
  } catch (error) {
    console.error('Error loading theme images cache:', error);
    return { themes: {} };
  }
}

interface Theme {
  parent: string;
  subcategories: Array<{
    name: string;
    fullName: string;
    count: number;
  }>;
  totalCount: number;
  representativeImage: string | null;
  fallbackImages: string[];
  isCurrent: boolean;
}

export async function GET() {
  try {
    const allBoxes = loadAllBoxes();
    const currentYear = new Date().getFullYear();
    const minCurrentYear = currentYear - 2;

    // Load cached theme images
    const imageCache = loadThemeImagesCache();

    // Group boxes by parent theme
    const themeMap = new Map<string, {
      parent: string;
      subcategories: Map<string, { name: string; fullName: string; count: number }>;
      totalCount: number;
      images: string[];
      years: number[];
      setsForImage: Array<{ year: number; image_url: string }>;
    }>();

    allBoxes.forEach(box => {
      const parts = box.category_name.split(' / ');
      const parentTheme = parts[0].trim();
      const subCategory = parts.length > 1 ? parts.slice(1).join(' / ').trim() : null;

      if (!themeMap.has(parentTheme)) {
        themeMap.set(parentTheme, {
          parent: parentTheme,
          subcategories: new Map(),
          totalCount: 0,
          images: [],
          years: [],
          setsForImage: [] // Store full set data for image selection
        });
      }

      const theme = themeMap.get(parentTheme)!;
      theme.totalCount++;

      const year = parseInt(box.year_released);
      if (!isNaN(year)) {
        theme.years.push(year);
      }

      // Store set data for later image selection
      if (box.image_url) {
        theme.setsForImage.push({
          year,
          image_url: box.image_url
        });
      }

      // Track subcategories
      if (subCategory) {
        const subKey = subCategory;
        if (!theme.subcategories.has(subKey)) {
          theme.subcategories.set(subKey, {
            name: subCategory,
            fullName: box.category_name,
            count: 0
          });
        }
        const sub = theme.subcategories.get(subKey)!;
        sub.count++;
      }
    });

    // Convert to array format
    const themes: Theme[] = Array.from(themeMap.values())
      .map(theme => {
        // Determine if theme is current (has sets from last 2 years)
        const isCurrent = theme.years.some(year => year >= minCurrentYear);

        // Use cached images if available, otherwise compute
        let representativeImage = null;
        let fallbackImages: string[] = [];

        const cachedTheme = imageCache.themes?.[theme.parent];
        if (cachedTheme) {
          // Use pre-cached images (no API calls needed!)
          representativeImage = cachedTheme.representativeImage;
          fallbackImages = cachedTheme.fallbackImages || [];
        } else if (theme.setsForImage.length > 0) {
          // Fallback: compute if not in cache
          const sortedSets = theme.setsForImage
            .filter(s => s.image_url && s.image_url.trim().length > 0 && !s.image_url.includes('No_Image'))
            .sort((a, b) => {
              const yearA = isNaN(a.year) ? 0 : a.year;
              const yearB = isNaN(b.year) ? 0 : b.year;
              return yearB - yearA;
            });

          if (sortedSets.length > 0) {
            representativeImage = sortedSets[0].image_url;
            fallbackImages = sortedSets.slice(1, 6).map(s => s.image_url);
          }
        }

        return {
          parent: theme.parent,
          subcategories: Array.from(theme.subcategories.values())
            .sort((a, b) => b.count - a.count), // Sort by count descending
          totalCount: theme.totalCount,
          representativeImage,
          fallbackImages,
          isCurrent
        };
      })
      .sort((a, b) => a.parent.localeCompare(b.parent)); // Sort themes alphabetically A-Z

    // Separate current and all themes
    const currentThemes = themes.filter(t => t.isCurrent);

    return NextResponse.json({
      success: true,
      data: {
        themes,
        currentThemes,
        totalThemes: themes.length
      }
    });
  } catch (error) {
    console.error('Error loading themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load themes' },
      { status: 500 }
    );
  }
}
