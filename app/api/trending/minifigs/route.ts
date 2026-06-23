import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache for 24 hours to reduce database load
export const revalidate = 86400; // 24 hours

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
        userCount: Number(t._count.minifigure_no) // MySQL returns BigInt; cast to Number for JSON serialization
      };
    });

    return NextResponse.json({
      success: true,
      data: result
    }, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800'
      }
    });
  } catch (error) {
    console.error('[TRENDING API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending minifigs' },
      { status: 500 }
    );
  }
}
