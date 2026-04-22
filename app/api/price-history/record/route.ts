import { NextResponse } from 'next/server';
import { prisma, prismaPublic } from '@/lib/prisma';

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
    let refreshedCount = 0;

    // For each unique minifig, ensure we have fresh pricing data
    for (const item of uniqueMinifigs) {
      try {
        // Check if price cache exists and is fresh (default US region)
        const priceCache = await prisma.priceCache.findUnique({
          where: {
            item_no_item_type_condition_country_code_region: {
              item_no: item.minifigure_no,
              item_type: 'MINIFIG',
              condition: item.condition,
              country_code: 'US',
              region: 'north_america',
            },
          },
        });

        let currentPriceData = priceCache;

        // If no cache or expired, fetch fresh pricing
        if (!priceCache || priceCache.expires_at <= new Date()) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
            const response = await fetch(
              `${baseUrl}/api/inventory/temp-pricing?itemNo=${encodeURIComponent(item.minifigure_no)}&condition=${item.condition}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const data = await response.json();

            if (data.success && data.pricing) {
              // Fetch the updated cache after the API refreshed it (default US region)
              currentPriceData = await prisma.priceCache.findUnique({
                where: {
                  item_no_item_type_condition_country_code_region: {
                    item_no: item.minifigure_no,
                    item_type: 'MINIFIG',
                    condition: item.condition,
                    country_code: 'US',
                    region: 'north_america',
                  },
                },
              });
              refreshedCount++;
            }
          } catch (fetchError) {
            console.error(`Failed to refresh pricing for ${item.minifigure_no}:`, fetchError);
          }
        }

        // Record history if we have valid data
        if (currentPriceData) {
          await prisma.priceHistory.create({
            data: {
              minifigure_no: item.minifigure_no,
              condition: item.condition,
              six_month_avg: currentPriceData.six_month_avg,
              current_avg: currentPriceData.current_avg,
              current_lowest: currentPriceData.current_lowest,
              suggested_price: currentPriceData.suggested_price,
            },
          });
          recordedCount++;
        } else {
          skippedCount++;
        }
      } catch (itemError) {
        console.error(`Error processing ${item.minifigure_no}:`, itemError);
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Recorded ${recordedCount} price snapshots (refreshed ${refreshedCount}), skipped ${skippedCount}`,
      recorded: recordedCount,
      refreshed: refreshedCount,
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
