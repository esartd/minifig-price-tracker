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

    // Theme overrides for special cases
    const themeOverrides: Record<string, string> = {
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
          // Get all minifigs in this theme to find character with most variants
          const allMinifigs = await prisma.minifigCatalog.findMany({
            where: {
              category_name: {
                startsWith: theme.parent
              }
            },
            select: {
              minifigure_no: true,
              name: true,
              year_released: true
            }
          });

          if (allMinifigs.length > 0) {
            // Extract character names and count variants
            const characterCounts = new Map<string, { count: number; latestMinifig: string; latestYear: string | null }>();

            allMinifigs.forEach(minifig => {
              // Extract character name (before " - ", "," or "(")
              const characterName = minifig.name.split(/\s+-\s+|,|\(/)[0].trim().toLowerCase();

              if (!characterCounts.has(characterName)) {
                characterCounts.set(characterName, {
                  count: 0,
                  latestMinifig: minifig.minifigure_no,
                  latestYear: minifig.year_released
                });
              }

              const current = characterCounts.get(characterName)!;
              current.count++;

              // Keep track of the latest minifig for this character
              if (!current.latestYear ||
                  (minifig.year_released && minifig.year_released > current.latestYear)) {
                current.latestMinifig = minifig.minifigure_no;
                current.latestYear = minifig.year_released;
              } else if (minifig.year_released === current.latestYear &&
                         minifig.minifigure_no > current.latestMinifig) {
                current.latestMinifig = minifig.minifigure_no;
              }
            });

            // Find character with most variants
            let maxCount = 0;
            let mainCharacterMinifig = allMinifigs[0].minifigure_no; // fallback

            characterCounts.forEach((data, characterName) => {
              if (data.count > maxCount) {
                maxCount = data.count;
                mainCharacterMinifig = data.latestMinifig;
              }
            });

            minifigNo = mainCharacterMinifig;
          }
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
