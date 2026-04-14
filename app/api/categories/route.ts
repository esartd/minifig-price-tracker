import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all unique categories with counts
    const categories = await prisma.minifigCatalog.groupBy({
      by: ['category_id', 'category_name'],
      _count: {
        minifigure_no: true
      }
    });

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

    // Fetch a representative minifig for each theme (newest by year, then ID)
    const themesWithImages = await Promise.all(
      groupedThemes.map(async (theme) => {
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
            minifigure_no: true
          }
        });

        return {
          ...theme,
          representativeImage: representativeMinifig
            ? `https://img.bricklink.com/ItemImage/MN/0/${representativeMinifig.minifigure_no}.png`
            : null
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
