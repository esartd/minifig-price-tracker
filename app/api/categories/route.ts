import { NextResponse } from 'next/server';
import { prisma, prismaPublic } from '@/lib/prisma';

export async function GET() {
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
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    // Parse category names and group by parent theme
    // e.g., "Star Wars / Star Wars Episode 1" → parent: "Star Wars"
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
      const parentTheme = parts[0]; // "Star Wars", "Town", etc.
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

    // Convert to array and sort alphabetically (A-Z)
    const groupedThemes = Array.from(themeMap.values())
      .sort((a, b) => a.parent.localeCompare(b.parent))
      .map(theme => ({
        ...theme,
        subcategories: theme.subcategories.sort((a, b) => a.name.localeCompare(b.name))
      }));

    // Special override minifigures for certain themes (for appropriate representation)
    const themeOverrides: Record<string, string> = {
      'Scala': '23049' // Use dressed minifig instead of naked one
    };

    // Fetch a representative minifig and check if theme is current (last 2 years)
    const currentYear = new Date().getFullYear();
    const themesWithImages = await Promise.all(
      groupedThemes.map(async (theme) => {
        let minifigNo: string | null = null;

        // Check if there's a manual override for this theme
        if (themeOverrides[theme.parent]) {
          minifigNo = themeOverrides[theme.parent];
        } else {
          // Otherwise, get the newest minifig
          const representativeMinifig = await prismaPublic.minifigCatalog.findFirst({
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

        // Check if theme has minifigures from last 2 calendar years
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

    return NextResponse.json({
      success: true,
      data: themesWithImages,
      total: themesWithImages.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
