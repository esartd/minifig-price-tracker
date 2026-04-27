import { NextRequest, NextResponse } from 'next/server';
import { getAllMinifigs } from '@/lib/catalog-static';
import { getMainCharacter, THEME_OVERRIDES } from '@/lib/theme-main-characters';

export const dynamic = 'force-dynamic';

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

    // First pass: try exact match
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

    // SAFEGUARD: If no results, try fuzzy match (case-insensitive, ignore special chars)
    if (categoryMap.size === 0) {
      console.warn(`⚠️  No exact match for theme "${theme}", trying fuzzy match...`);

      const normalizeTheme = (str: string) =>
        str.toLowerCase()
          .replace(/[^a-z0-9]/g, '');

      const normalizedQuery = normalizeTheme(theme);

      allMinifigs.forEach(m => {
        const parentTheme = m.category_name.split(' / ')[0];
        const normalizedParent = normalizeTheme(parentTheme);

        // Fuzzy match: normalized strings are equal
        if (normalizedParent === normalizedQuery || m.category_name.startsWith(`${parentTheme} / `)) {
          if (normalizedParent === normalizedQuery) {
            const existing = categoryMap.get(m.category_name);
            if (existing) {
              existing.count++;
            } else {
              categoryMap.set(m.category_name, { id: m.category_id, count: 1 });
            }
          }
        }
      });

      if (categoryMap.size > 0) {
        const foundTheme = Array.from(categoryMap.keys())[0].split(' / ')[0];
        console.log(`✅ Fuzzy match found: "${theme}" → "${foundTheme}"`);
      }
    }

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

    // Use manual overrides, fallback to first minifig from that subcategory
    const subcategoriesWithImages = subcategories.map(sub => {
      // Try full category name first (e.g., "Castle / Black Knights")
      // Then try just subTheme (e.g., "Black Knights")
      // Then try parent theme from THEME_OVERRIDES (e.g., "Castle")
      // Then try parent theme from THEME_MAIN_CHARACTERS for Uncategorized
      let knownMainCharacter = getMainCharacter(sub.fullName)
        || getMainCharacter(sub.subTheme)
        || (sub.subTheme === 'Uncategorized' ? THEME_OVERRIDES[theme] : null)
        || (sub.subTheme === 'Uncategorized' ? getMainCharacter(theme) : null);

      let representativeMinifig = null;

      if (knownMainCharacter && /^[a-z]+\d+[a-z]?$/i.test(knownMainCharacter)) {
        // Direct minifig ID - use it
        representativeMinifig = knownMainCharacter;
      } else {
        // Fallback: use first minifig from this exact subcategory
        const firstMinifig = allMinifigs.find(m => m.category_name === sub.fullName);
        if (firstMinifig) {
          representativeMinifig = firstMinifig.minifigure_no;
        }
      }

      return {
        ...sub,
        representativeImage: representativeMinifig
          ? `/api/images/minifig/${representativeMinifig}`
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
