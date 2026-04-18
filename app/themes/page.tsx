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

    // Fetch representative minifig and check if theme is current
    const currentYear = new Date().getFullYear();
    const themesWithImages = await Promise.all(
      groupedThemes.map(async (theme) => {
        let minifigNo: string | null = null;

        // STEP 1: Check manual overrides for special cases
        if (THEME_OVERRIDES[theme.parent]) {
          minifigNo = THEME_OVERRIDES[theme.parent];
        } else {
          // STEP 2: Use newest minifig as fallback (fast, simple)
          const newestMinifig = await prismaPublic.minifigCatalog.findFirst({
            where: {
              category_name: {
                startsWith: theme.parent
              }
            },
            orderBy: [
              { year_released: 'desc' },
              { minifigure_no: 'desc' }
            ],
            select: {
              minifigure_no: true
            }
          });

          minifigNo = newestMinifig?.minifigure_no || null;
        }

        const hasRecentMinifigs = await prismaPublic.minifigCatalog.findFirst({
          where: {
            category_name: {
              startsWith: theme.parent
            },
            year_released: {
              gte: (currentYear - 2).toString()
            }
          },
          select: {
            minifigure_no: true
          }
        });

        return {
          ...theme,
          representativeImage: minifigNo
            ? `https://img.bricklink.com/ItemImage/MN/0/${minifigNo}.png`
            : null,
          isCurrent: !!hasRecentMinifigs
        };
      })
    );

    return themesWithImages;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const themes = await getThemes();

  return <ThemesClient themes={themes} />;
}
