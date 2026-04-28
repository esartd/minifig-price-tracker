import SetsThemesClient from './sets-themes-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse LEGO Sets by Theme',
  description: 'Explore LEGO sets organized by theme. Browse Star Wars, Harry Potter, Friends, and 170+ other themes.',
};

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

async function getThemes(): Promise<{ themes: Theme[]; currentThemes: Theme[] }> {
  try {
    // In server components, we can import the API logic directly instead of fetching
    const { loadAllBoxes } = await import('@/lib/boxes-data');
    const fs = await import('fs');
    const path = await import('path');

    const boxes = loadAllBoxes();
    const currentYear = new Date().getFullYear();

    // Load permanent theme images cache
    const cacheFilePath = path.join(process.cwd(), 'lib', 'theme-images-cache.json');
    let themeImagesCache: any = { themes: {} };
    try {
      const cacheContent = fs.readFileSync(cacheFilePath, 'utf-8');
      themeImagesCache = JSON.parse(cacheContent);
    } catch (error) {
      console.warn('Could not load theme images cache:', error);
    }

    // Group by parent theme
    const themeGroups = new Map<string, any>();

    boxes.forEach(box => {
      const parent = box.category_name.split(' / ')[0].trim();
      const isCurrent = box.year_released === currentYear.toString();

      if (!themeGroups.has(parent)) {
        // Use permanent cached images if available
        const cachedTheme = themeImagesCache.themes[parent];

        themeGroups.set(parent, {
          parent,
          subcategories: new Map(),
          totalCount: 0,
          representativeImage: cachedTheme?.representativeImage || null,
          fallbackImages: cachedTheme?.fallbackImages || [],
          isCurrent: false
        });
      }

      const theme = themeGroups.get(parent);
      theme.totalCount++;

      if (isCurrent) {
        theme.isCurrent = true;
      }

      // Only add fallback images if none are cached
      if (theme.fallbackImages.length === 0 && box.image_url) {
        if (theme.fallbackImages.length < 5) {
          theme.fallbackImages.push(box.image_url);
        }
      }

      // Track subcategories
      const parts = box.category_name.split(' / ');
      if (parts.length > 1) {
        const subName = parts.slice(1).join(' / ');
        if (!theme.subcategories.has(subName)) {
          theme.subcategories.set(subName, {
            name: subName,
            fullName: box.category_name,
            count: 0
          });
        }
        theme.subcategories.get(subName).count++;
      }
    });

    // Convert to array format
    const allThemes = Array.from(themeGroups.values()).map(theme => ({
      ...theme,
      subcategories: Array.from(theme.subcategories.values())
    }));

    const currentThemes = allThemes.filter(t => t.isCurrent);
    const otherThemes = allThemes.filter(t => !t.isCurrent);

    return {
      themes: otherThemes.sort((a, b) => a.parent.localeCompare(b.parent)),
      currentThemes: currentThemes.sort((a, b) => a.parent.localeCompare(b.parent))
    };
  } catch (error) {
    console.error('Error fetching themes:', error);
    return { themes: [], currentThemes: [] };
  }
}

export default async function SetsThemesPage() {
  const { themes, currentThemes } = await getThemes();

  return <SetsThemesClient themes={themes} currentThemes={currentThemes} />;
}
