import { prismaPublic } from '@/lib/prisma';
import ThemesClient from './themes-client';
import { THEME_OVERRIDES } from '@/lib/theme-main-characters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse LEGO Minifigures by Theme - Star Wars, Harry Potter & More',
  description: 'Explore LEGO minifigures organized by theme. Browse Star Wars, Harry Potter, Marvel, DC, Ninjago, and 50+ other themes. Get pricing data and track your collection.',
  keywords: ['LEGO themes', 'Star Wars minifigures', 'Harry Potter LEGO', 'Marvel LEGO', 'DC LEGO', 'Ninjago minifigs', 'LEGO catalog by theme'],
  openGraph: {
    title: 'Browse LEGO Minifigures by Theme | FigTracker',
    description: 'Explore minifigures from Star Wars, Harry Potter, Marvel, and 50+ other LEGO themes with real-time pricing.',
    url: 'https://figtracker.ericksu.com/themes',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/themes',
  },
};

interface Theme {
  parent: string;
  subcategories: Array<{
    id: number;
    name: string;
    fullName: string;
    count: number;
  }>;
  totalCount: number;
  representativeImage: string | null;
  isCurrent: boolean;
}

async function getThemes(): Promise<Theme[]> {
  try {
    // Get all unique categories with counts
    const categories = await prismaPublic.minifigCatalog.groupBy({
      by: ['category_id', 'category_name'],
      _count: {
        minifigure_no: true
      }
    });

    // If no data, return empty array
    if (!categories || categories.length === 0) {
      return [];
    }

    // Parse category names and group by parent theme
    const themeMap = new Map<string, {
      parent: string;
      subcategories: Array<{
        id: number;
        name: string;
        fullName: string;
        count: number;
      }>;
      totalCount: number;
    }>();

    categories.forEach(cat => {
      const parts = cat.category_name.split(' / ');
      const parentTheme = parts[0];
      const subCategory = parts.length > 1 ? parts.slice(1).join(' / ') : null;

      if (!themeMap.has(parentTheme)) {
        themeMap.set(parentTheme, {
          parent: parentTheme,
          subcategories: [],
          totalCount: 0
        });
      }

      const theme = themeMap.get(parentTheme)!;
      theme.totalCount += cat._count.minifigure_no;

      if (subCategory) {
        theme.subcategories.push({
          id: cat.category_id,
          name: subCategory,
          fullName: cat.category_name,
          count: cat._count.minifigure_no
        });
      }
    });

    // Convert to array and sort alphabetically
    const groupedThemes = Array.from(themeMap.values())
      .sort((a, b) => a.parent.localeCompare(b.parent))
      .map(theme => ({
        ...theme,
        subcategories: theme.subcategories.sort((a, b) => a.name.localeCompare(b.name))
      }));

    // Determine which themes are current (released in last 2 years)
    const currentYear = new Date().getFullYear();
    const recentMinifigs = await prismaPublic.minifigCatalog.findMany({
      where: {
        year_released: {
          gte: (currentYear - 2).toString()
        }
      },
      select: {
        category_name: true,
      },
      distinct: ['category_name']
    });

    // Build set of current themes
    const getParent = (categoryName: string) => categoryName.split(' / ')[0];
    const recentThemes = new Set<string>();
    for (const minifig of recentMinifigs) {
      recentThemes.add(getParent(minifig.category_name));
    }

    console.log(`[THEMES DEBUG] Found ${recentThemes.size} current themes from ${currentYear - 2}+`);

    // Find themes that need images (not in THEME_OVERRIDES)
    const themesNeedingImages = groupedThemes.filter(t => !THEME_OVERRIDES[t.parent]);

    // Query for missing images (only if needed)
    const foundImages = new Map<string, string>();
    if (themesNeedingImages.length > 0) {
      console.log(`[THEMES] Finding images for ${themesNeedingImages.length} themes without overrides`);

      const allCategoryNames = themesNeedingImages.flatMap(t =>
        [t.parent, ...t.subcategories.map(s => s.fullName)]
      );

      const minifigs = await prismaPublic.minifigCatalog.findMany({
        where: {
          category_name: { in: allCategoryNames }
        },
        orderBy: [
          { year_released: 'desc' },
          { minifigure_no: 'desc' }
        ],
        select: {
          minifigure_no: true,
          category_name: true,
        }
      });

      // Map each theme to its newest minifig
      for (const theme of themesNeedingImages) {
        const categoryNames = [theme.parent, ...theme.subcategories.map(s => s.fullName)];
        const minifig = minifigs.find(m => categoryNames.includes(m.category_name));
        if (minifig) {
          foundImages.set(theme.parent, minifig.minifigure_no);
          // Log so user can add to THEME_OVERRIDES
          console.log(`[THEMES] ADD TO OVERRIDES: '${theme.parent}': '${minifig.minifigure_no}',`);
        }
      }
    }

    // Map themes with images
    const themesWithImages = groupedThemes.map(theme => {
      // Use manual override first, otherwise use found image
      const minifigNo = THEME_OVERRIDES[theme.parent] || foundImages.get(theme.parent) || null;

      return {
        ...theme,
        representativeImage: minifigNo
          ? `https://img.bricklink.com/ItemImage/MN/0/${minifigNo}.png`
          : null,
        isCurrent: recentThemes.has(theme.parent)
      };
    });

    return themesWithImages;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Cache for 1 hour - themes don't change often
export const revalidate = 3600;

export default async function CategoriesPage() {
  const themes = await getThemes();

  return <ThemesClient themes={themes} />;
}
