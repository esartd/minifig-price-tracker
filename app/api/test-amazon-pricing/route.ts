import { NextResponse } from 'next/server';
import { fetchAmazonPrice, isAmazonPricingConfigured, formatPrice } from '@/lib/amazon-pricing';

export const runtime = 'edge';


/**
 * Test endpoint for Amazon PA-API integration
 * GET /api/test-amazon-pricing?asin=B0XXXXXX
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get('asin');

  // Check if PA-API is configured
  if (!isAmazonPricingConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'Amazon PA-API not configured. Check .env.local for credentials.'
    }, { status: 500 });
  }

  // Default test ASIN: LEGO Star Wars Millennium Falcon
  const testAsin = asin || 'B075SDMMMV';

  try {
    console.log(`Fetching pricing for ASIN: ${testAsin}`);
    const pricing = await fetchAmazonPrice(testAsin);

    if (!pricing) {
      return NextResponse.json({
        success: false,
        error: `No pricing data found for ASIN: ${testAsin}`,
        asin: testAsin
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      asin: pricing.asin,
      currentPrice: formatPrice(pricing.currentPrice, pricing.currency),
      listPrice: formatPrice(pricing.listPrice, pricing.currency),
      discountPercent: pricing.discountPercent,
      isPrime: pricing.isPrime,
      isAvailable: pricing.isAvailable,
      currency: pricing.currency,
      lastUpdated: pricing.lastUpdated,
      raw: pricing
    });
  } catch (error: any) {
    console.error('Amazon PA-API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch pricing data',
      details: error.toString()
    }, { status: 500 });
  }
}
