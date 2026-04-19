import { NextRequest, NextResponse } from 'next/server';
import { getAllMinifigs } from '@/lib/catalog-static';
import { getMainCharacter } from '@/lib/theme-main-characters';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme');

    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Missing theme parameter' },
        { status: 400 }
      );
    }

    console.log('Fetching subcategories for theme:', theme);

    // Get all minifigs from static catalog and group by category
    const allMinifigs = await getAllMinifigs();
    const categoryMap = new Map<string, { id: number; count: number }>();

    allMinifigs.forEach(m => {
      // Filter: exact match OR "parent / sub-theme" format
      if (m.category_name === theme || m.category_name.startsWith(`${theme} / `)) {
        const existing = categoryMap.get(m.category_name);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(m.category_name, { id: m.category_id, count: 1 });
        }
      }
    });

    const subcategories = Array.from(categoryMap.entries())
      .map(([categoryName, data]) => {
        const parts = categoryName.split(' / ');
        const subTheme = parts.slice(1).join(' / ') || 'Uncategorized';

        return {
          id: data.id,
          fullName: categoryName,
          subTheme,
          count: data.count
        };
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    // Use manual overrides, fallback to first minifig from subcategory
    const subcategoriesWithImages = subcategories.map(sub => {
      const knownMainCharacter = getMainCharacter(sub.subTheme);
      let representativeMinifig = null;

      if (knownMainCharacter && /^[a-z]+\d+[a-z]?$/i.test(knownMainCharacter)) {
        // Direct minifig ID - use it
        representativeMinifig = knownMainCharacter;
      } else {
        // Fallback: use first minifig from this subcategory
        const firstMinifig = allMinifigs.find(m => m.category_name === sub.fullName);
        if (firstMinifig) {
          representativeMinifig = firstMinifig.minifigure_no;
        }
      }

      return {
        ...sub,
        representativeImage: representativeMinifig
          ? `https://img.bricklink.com/ItemImage/MN/0/${representativeMinifig}.png`
          : null
      };
    });

    return NextResponse.json({
      success: true,
      data: subcategoriesWithImages,
      theme,
      total: subcategoriesWithImages.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
