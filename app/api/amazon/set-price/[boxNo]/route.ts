import { NextRequest, NextResponse } from 'next/server';
import { prismaPublic } from '@/lib/prisma';
import { fetchAmazonPrice } from '@/lib/amazon-pricing';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boxNo: string }> }
) {
  try {
    const { boxNo } = await params;

    // Check if we have cached pricing in AmazonDeal table
    const cached = await prismaPublic.amazonDeal.findUnique({
      where: { boxNo }
    });

    // Return cached if less than 24 hours old
    if (cached && cached.lastUpdated) {
      const age = Date.now() - new Date(cached.lastUpdated).getTime();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      if (age < TWENTY_FOUR_HOURS) {
        return NextResponse.json({
          success: true,
          data: {
            asin: cached.asin,
            currentPrice: cached.currentPrice,
            listPrice: cached.listPrice,
            discountPercent: cached.discountPercent,
            isPrime: cached.isPrime,
            cached: true
          }
        });
      }
    }

    // If no cache or stale, fetch from Amazon API
    if (cached?.asin) {
      const freshData = await fetchAmazonPrice(cached.asin);

      if (freshData && freshData.currentPrice) {
        // Update cache
        await prismaPublic.amazonDeal.update({
          where: { boxNo },
          data: {
            currentPrice: freshData.currentPrice,
            listPrice: freshData.listPrice || freshData.currentPrice,
            discountPercent: freshData.discountPercent || 0,
            isPrime: freshData.isPrime,
            lastUpdated: new Date()
          }
        });

        return NextResponse.json({
          success: true,
          data: {
            asin: freshData.asin,
            currentPrice: freshData.currentPrice,
            listPrice: freshData.listPrice,
            discountPercent: freshData.discountPercent,
            isPrime: freshData.isPrime,
            cached: false
          }
        });
      }
    }

    // No ASIN mapping exists
    return NextResponse.json({
      success: false,
      error: 'No Amazon listing found'
    });

  } catch (error: any) {
    console.error(`[Amazon Price API] Error:`, error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
