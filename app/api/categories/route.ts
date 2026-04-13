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

    // Convert to array and sort by count
    const groupedThemes = Array.from(themeMap.values())
      .sort((a, b) => b.totalCount - a.totalCount)
      .map(theme => ({
        ...theme,
        subcategories: theme.subcategories.sort((a, b) => b.count - a.count)
      }));

    return NextResponse.json({
      success: true,
      data: groupedThemes,
      total: groupedThemes.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
