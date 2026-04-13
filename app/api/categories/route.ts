import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all unique categories with counts
    const categories = await prisma.minifigCatalog.groupBy({
      by: ['category_id', 'category_name'],
      _count: {
        minifigure_no: true
      },
      orderBy: {
        _count: {
          minifigure_no: 'desc'
        }
      }
    });

    const categoriesWithCounts = categories.map(cat => ({
      id: cat.category_id,
      name: cat.category_name,
      count: cat._count.minifigure_no
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
      total: categoriesWithCounts.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
