import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        _count: {
          minifigure_no: 'desc'
        }
      }
    });

    const subcategories = categories.map(cat => {
      const parts = cat.category_name.split(' / ');
      const subTheme = parts.slice(1).join(' / ') || 'General';

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
        const representativeMinifig = await prisma.minifigCatalog.findFirst({
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

        return {
          ...sub,
          representativeImage: representativeMinifig
            ? `https://img.bricklink.com/ItemImage/MN/0/${representativeMinifig.minifigure_no}.png`
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
