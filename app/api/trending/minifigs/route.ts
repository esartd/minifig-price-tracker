import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get trending minifigs based on recent activity
// This is a simplified version - in production you'd track actual page views
export async function GET() {
  try {
    // Get top 12 minifigs that are most frequently in user collections
    // This is a proxy for "popular/trending" since we don't have view tracking yet
    const trending = await prisma.personalCollectionItem.groupBy({
      by: ['minifigure_no'],
      _count: {
        minifigure_no: true
      },
      orderBy: {
        _count: {
          minifigure_no: 'desc'
        }
      },
      take: 12
    });

    // Get minifig details for each trending item
    const minifigNos = trending.map(t => t.minifigure_no);
    const minifigs = await prisma.minifigCatalog.findMany({
      where: {
        minifigure_no: { in: minifigNos }
      },
      select: {
        minifigure_no: true,
        name: true,
        category_name: true,
        year_released: true
      }
    });

    // Combine trending data with minifig details
    const result = trending.map(t => {
      const minifig = minifigs.find(m => m.minifigure_no === t.minifigure_no);
      return {
        no: t.minifigure_no,
        name: minifig?.name || 'Unknown',
        categoryName: minifig?.category_name || 'Unknown',
        yearReleased: minifig?.year_released || null,
        imageUrl: `https://img.bricklink.com/ItemImage/MN/0/${t.minifigure_no}.png`,
        userCount: t._count.minifigure_no
      };
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[TRENDING API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending minifigs' },
      { status: 500 }
    );
  }
}
