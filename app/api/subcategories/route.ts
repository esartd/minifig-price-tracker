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

    return NextResponse.json({
      success: true,
      data: subcategories,
      theme,
      total: subcategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
