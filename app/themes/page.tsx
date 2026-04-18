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

    // Fetch representative minifigs and recent status in bulk (optimized)
    const currentYear = new Date().getFullYear();
    const themeParents = groupedThemes.map(t => t.parent);

    // Fetch ONLY recent minifigs (much smaller dataset ~200 vs 18k)
    const recentMinifigs = await prismaPublic.minifigCatalog.findMany({
      where: {
        year_released: {
          gte: (currentYear - 2).toString()
        }
      },
      select: {
        minifigure_no: true,
        category_name: true,
      },
      orderBy: [
        { year_released: 'desc' },
        { minifigure_no: 'desc' }
      ]
    });

    // Build maps from recent minifigs only
    const getParent = (categoryName: string) => categoryName.split(' / ')[0];

    const recentThemes = new Set<string>();
    const newestRecentByTheme = new Map<string, string>();

    for (const minifig of recentMinifigs) {
      const parent = getParent(minifig.category_name);
      recentThemes.add(parent);
      if (!newestRecentByTheme.has(parent)) {
        newestRecentByTheme.set(parent, minifig.minifigure_no);
      }
    }

    // Debug logging
    console.log(`[THEMES DEBUG] Found ${recentThemes.size} current themes from ${currentYear - 2}+ minifigs`);

    // For themes without recent minifigs, get their full category list and find newest
    const themesNeedingImages = themeParents.filter(p => !newestRecentByTheme.has(p));
    const themeCategories = groupedThemes
      .filter(t => themesNeedingImages.includes(t.parent))
      .map(t => ({
        parent: t.parent,
        categoryNames: [t.parent, ...t.subcategories.map(s => s.fullName)]
      }));

    const olderMinifigs = await Promise.all(
      themeCategories.map(({ parent, categoryNames }) =>
        prismaPublic.minifigCatalog.findFirst({
          where: {
            category_name: {
              in: categoryNames
            }
          },
          orderBy: [
            { year_released: 'desc' },
            { minifigure_no: 'desc' }
          ],
          select: {
            minifigure_no: true,
          }
        }).then(m => ({ parent, minifigNo: m?.minifigure_no }))
      )
    );

    // Combine images
    const newestByTheme = new Map(newestRecentByTheme);
    for (const { parent, minifigNo } of olderMinifigs) {
      if (minifigNo) {
        newestByTheme.set(parent, minifigNo);
      }
    }

    // Map themes with images
    const themesWithImages = groupedThemes.map(theme => {
      let minifigNo: string | null = null;
      let isCurrent = false;

      // Check manual overrides first
      if (THEME_OVERRIDES[theme.parent]) {
        minifigNo = THEME_OVERRIDES[theme.parent];
        isCurrent = true; // Assume overrides are current
      } else {
        minifigNo = newestByTheme.get(theme.parent) || null;
        isCurrent = recentThemes.has(theme.parent);
      }

      return {
        ...theme,
        representativeImage: minifigNo
          ? `https://img.bricklink.com/ItemImage/MN/0/${minifigNo}.png`
          : null,
        isCurrent
      };
    });

    return themesWithImages;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Temporarily disable cache to force refresh
export const revalidate = 0;

export default async function CategoriesPage() {
  const themes = await getThemes();

  return <ThemesClient themes={themes} />;
}
