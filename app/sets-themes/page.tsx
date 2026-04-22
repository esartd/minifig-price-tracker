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
    const { getPopularThemes } = await import('@/lib/boxes-data');

    const boxes = loadAllBoxes();
    const currentYear = new Date().getFullYear();

    // Group by parent theme
    const themeGroups = new Map<string, any>();

    boxes.forEach(box => {
      const parent = box.category_name.split(' / ')[0].trim();
      const isCurrent = box.year_released === currentYear.toString();

      if (!themeGroups.has(parent)) {
        themeGroups.set(parent, {
          parent,
          subcategories: new Map(),
          totalCount: 0,
          representativeImage: null,
          fallbackImages: [],
          isCurrent: false
        });
      }

      const theme = themeGroups.get(parent);
      theme.totalCount++;

      if (isCurrent) {
        theme.isCurrent = true;
      }

      // Add to fallback images
      if (theme.fallbackImages.length < 5 && box.image_url) {
        theme.fallbackImages.push(box.image_url);
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
      currentThemes: currentThemes.sort((a, b) => b.totalCount - a.totalCount)
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
