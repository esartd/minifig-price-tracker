import { prisma } from '@/lib/prisma';
import ThemesClient from './themes-client';

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
    const categories = await prisma.minifigCatalog.groupBy({
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

    // Theme overrides - Use iconic characters for main themes
    const themeOverrides: Record<string, string> = {
      // Star Wars - Use Darth Vader (most iconic)
      'Star Wars': 'sw1502', // Darth Vader - SMART Minifigure (latest)

      // Super Heroes - Use Spider-Man (most popular)
      'Super Heroes': 'sh0614', // Spider-Man Noir (latest)

      // Harry Potter - Use Harry Potter
      'Harry Potter': 'hp610', // Harry Potter (latest)

      // Indiana Jones - Use Indiana Jones
      'Indiana Jones': 'iaj046', // Indiana Jones (latest)

      // Pirates - Use Jack Sparrow
      'Pirates': 'poc044', // Captain Jack Sparrow (latest)

      // Jurassic World - Use Owen
      'Jurassic World': 'jw102', // Owen Grady (latest)

      // LEGO Movie - Use Emmet (using newest from theme since we found it exists)
      'The LEGO Movie': 'tlm053', // From The LEGO Movie theme

      // Scala - Use non-blurry minifig
      'Scala': 'sw1360'
    };

    // Fetch representative minifig and check if theme is current
    const currentYear = new Date().getFullYear();
    const themesWithImages = await Promise.all(
      groupedThemes.map(async (theme) => {
        let minifigNo: string | null = null;

        if (themeOverrides[theme.parent]) {
          minifigNo = themeOverrides[theme.parent];
        } else {
          const representativeMinifig = await prisma.minifigCatalog.findFirst({
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
              minifigure_no: true,
              year_released: true
            }
          });
          minifigNo = representativeMinifig?.minifigure_no || null;
        }

        const hasRecentMinifigs = await prisma.minifigCatalog.findFirst({
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
