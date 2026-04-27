import { NextResponse } from 'next/server';
import { getAllCategories, getRecentMinifigs } from '@/lib/catalog-static';
import { THEME_OVERRIDES } from '@/lib/theme-main-characters';

export async function GET() {
  try {
    // Get all unique categories with counts from static catalog
    const categoriesData = await getAllCategories();
    const categories = categoriesData.map(cat => ({
      category_id: cat.id,
      category_name: cat.name,
      _count: { minifigure_no: cat.count }
    }));

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

    // Determine which themes are current (released in last 2 years)
    const recentMinifigs = await getRecentMinifigs(2);
    const getParent = (categoryName: string) => categoryName.split(' / ')[0];
    const recentThemes = new Set<string>();
    for (const minifig of recentMinifigs) {
      recentThemes.add(getParent(minifig.category_name));
    }

    // Use manual overrides only - never query for images
    const themesWithImages = groupedThemes.map(theme => {
      const minifigNo = THEME_OVERRIDES[theme.parent] || null;

      return {
        ...theme,
        representativeImage: minifigNo
          ? `/api/images/minifig/${minifigNo}`
          : null,
        isCurrent: recentThemes.has(theme.parent)
      };
    });

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
