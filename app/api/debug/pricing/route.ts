import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { bricklinkScraper } from '@/lib/bricklink-scraper';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo') || 'sw1219';
    const condition = searchParams.get('condition') || 'U';

    console.log(`\n=== DEBUG PRICING DATA FOR ${itemNo} (${condition}) ===\n`);

    // Get API data
    const apiData = await bricklinkAPI.getPriceGuide(itemNo, condition as 'N' | 'U');
    console.log('API Data:', JSON.stringify(apiData, null, 2));

    // Get scraped data
    const scrapedData = await bricklinkScraper.scrapePriceGuide(itemNo, condition as 'N' | 'U');
    console.log('Scraped Data:', JSON.stringify(scrapedData, null, 2));

    // Get combined pricing
    const pricing = await bricklinkAPI.calculatePricingData(itemNo, condition === 'N' ? 'new' : 'used');
    console.log('Combined Pricing:', JSON.stringify(pricing, null, 2));

    return NextResponse.json({
      success: true,
      itemNo,
      condition,
      apiData,
      scrapedData,
      combinedPricing: pricing,
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
