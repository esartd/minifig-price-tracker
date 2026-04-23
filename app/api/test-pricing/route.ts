import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo') || 'sw1319'; // Clone Trooper as test
    const condition = searchParams.get('condition') || 'new';
    const itemType = searchParams.get('type') || 'minifig'; // 'minifig' or 'set'
    const countryCode = session.user?.preferredCountryCode || 'US';

    console.log(`\n========== TEST PRICING START ==========`);
    console.log(`Item: ${itemNo}, Type: ${itemType}, Condition: ${condition}, Country: ${countryCode}`);

    const startTime = Date.now();

    const conditionCode = condition === 'new' ? 'N' : 'U';
    const currencyConfig = await import('@/lib/currency-config');
    const currency = currencyConfig.getCurrencyByCountryCode(countryCode);
    const currencyCode = currency?.code || 'USD';

    // Try to get raw price guide for debugging (different method for sets vs minifigs)
    let rawPriceGuide = null;
    let apiError = null;

    try {
      if (itemType === 'set') {
        rawPriceGuide = await bricklinkAPI.getSetPriceGuide(itemNo, conditionCode, countryCode, '', currencyCode);
      } else {
        rawPriceGuide = await bricklinkAPI.getPriceGuide(itemNo, conditionCode, countryCode, '', currencyCode);
      }
    } catch (err: any) {
      apiError = err.message;
      console.error('Error getting raw price guide:', err);
    }

    // Get calculated pricing
    let pricing;
    if (itemType === 'set') {
      pricing = await bricklinkAPI.calculateSetPricing(itemNo, condition as 'new' | 'used', countryCode, '');
    } else {
      pricing = await bricklinkAPI.calculatePricingData(itemNo, condition as 'new' | 'used', countryCode, '');
    }
    const duration = Date.now() - startTime;

    console.log(`Result: ${JSON.stringify(pricing)}`);
    console.log(`Duration: ${duration}ms`);

    // Capture and log the lastError before responding
    const lastError = (bricklinkAPI as any).lastError;
    console.log(`Last Error from BricklinkAPI:`, lastError);
    console.log(`========== TEST PRICING END ==========\n`);

    return NextResponse.json({
      success: true,
      item: itemNo,
      itemType,
      condition,
      countryCode,
      currencyCode,
      duration: `${duration}ms`,
      pricing,
      rawPriceGuide, // Include raw Bricklink response to see what's actually returned
      apiError, // Include any errors
      bricklinkLastError: lastError, // Capture internal error details
      note: rawPriceGuide ? 'Got data' : 'Null response from Bricklink'
    });
  } catch (error: any) {
    console.error('Test pricing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch test pricing' },
      { status: 500 }
    );
  }
}
