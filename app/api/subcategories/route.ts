import { NextRequest, NextResponse } from 'next/server';
import { prisma, prismaPublic } from '@/lib/prisma';
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

    // Get all subcategories for this theme
    // Use exact match for parent theme OR "parent / sub-theme" format
    // This prevents "Friends" from matching "Friends TV Series"
    const categories = await prismaPublic.minifigCatalog.groupBy({
      by: ['category_id', 'category_name'],
      where: {
        OR: [
          { category_name: theme }, // Exact match (e.g., "Friends")
          { category_name: { startsWith: `${theme} / ` } } // Sub-themes (e.g., "Friends / Series 1")
        ]
      },
      _count: {
        minifigure_no: true
      },
      orderBy: {
        category_name: 'asc'
      }
    });

    const subcategories = categories.map(cat => {
      const parts = cat.category_name.split(' / ');
      const subTheme = parts.slice(1).join(' / ') || 'Uncategorized';

      return {
        id: cat.category_id,
        fullName: cat.category_name,
        subTheme,
        count: cat._count.minifigure_no
      };
    });

    // Fetch representative images for each subcategory
    const subcategoriesWithImages = await Promise.all(
      subcategories.map(async (sub) => {
        // STEP 1: Check if we have a manual mapping for this sub-theme
        const knownMainCharacter = getMainCharacter(sub.subTheme);
        let representativeMinifig = null;

        if (knownMainCharacter) {
          // Check if it's a direct minifig ID (e.g., "sw1507") or character name
          if (/^[a-z]+\d+[a-z]?$/i.test(knownMainCharacter)) {
            // Direct minifig ID - use it directly
            representativeMinifig = knownMainCharacter;
          } else {
            // Character name - search for it
            const manualMatch = await prismaPublic.minifigCatalog.findFirst({
              where: {
                category_name: sub.fullName,
                search_name: {
                  contains: knownMainCharacter.toLowerCase()
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

            if (manualMatch) {
              representativeMinifig = manualMatch.minifigure_no;
            }
          }
        }

        // STEP 2: If no manual mapping or not found, use newest minifig (fast fallback)
        if (!representativeMinifig) {
          const newestMinifig = await prismaPublic.minifigCatalog.findFirst({
            where: {
              category_name: sub.fullName
            },
            orderBy: [
              { year_released: 'desc' },
              { minifigure_no: 'desc' }
            ],
            select: {
              minifigure_no: true
            }
          });

          representativeMinifig = newestMinifig?.minifigure_no || null;
        }

        return {
          ...sub,
          representativeImage: representativeMinifig
            ? `https://img.bricklink.com/ItemImage/MN/0/${representativeMinifig}.png`
            : null
        };
      })
    );

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
