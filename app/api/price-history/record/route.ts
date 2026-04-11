import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Get all unique minifig + condition combinations from users' collections
    const uniqueMinifigs = await prisma.collectionItem.findMany({
      select: {
        minifigure_no: true,
        condition: true,
      },
      distinct: ['minifigure_no', 'condition'],
    });

    let recordedCount = 0;
    let skippedCount = 0;

    // For each unique minifig, check if we have fresh pricing data and record it
    for (const item of uniqueMinifigs) {
      const priceCache = await prisma.priceCache.findUnique({
        where: {
          minifigure_no_condition: {
            minifigure_no: item.minifigure_no,
            condition: item.condition,
          },
        },
      });

      // Only record if we have valid cached data
      if (priceCache && priceCache.expires_at > new Date()) {
        await prisma.priceHistory.create({
          data: {
            minifigure_no: item.minifigure_no,
            condition: item.condition,
            six_month_avg: priceCache.six_month_avg,
            current_avg: priceCache.current_avg,
            current_lowest: priceCache.current_lowest,
            suggested_price: priceCache.suggested_price,
          },
        });
        recordedCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Recorded ${recordedCount} price snapshots, skipped ${skippedCount} (no fresh data)`,
      recorded: recordedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error('Price history recording error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record price history' },
      { status: 500 }
    );
  }
}
