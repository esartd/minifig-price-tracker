import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const categories = await prisma.minifigCatalog.groupBy({
      by: ['category_id', 'category_name'],
      where: {
        category_name: {
          startsWith: theme
        }
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
          // Use manual mapping - search for this specific character
          const manualMatch = await prisma.minifigCatalog.findFirst({
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

        // STEP 2: If no manual mapping or character not found, auto-detect by counting variants
        if (!representativeMinifig) {
          const allMinifigs = await prisma.minifigCatalog.findMany({
            where: {
              category_name: sub.fullName
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

            representativeMinifig = mainCharacterMinifig;
          }
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
