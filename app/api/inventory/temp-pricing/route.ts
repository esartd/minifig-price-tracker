import { NextRequest, NextResponse } from 'next/server';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS, LOGGED_OUT_TTL_HOURS } from '@/lib/pricing-orchestrator';
import { auth } from '@/auth';
import { getDisplayCurrency, convertPricingToCurrency, PRICE_FIELDS } from '@/lib/display-currency';


/**
 * Prices are fetched and cached in USD for everyone (see lib/bricklink.ts:
 * one cache row per item, shared worldwide) and converted here, per request,
 * for display. Dynamic on purpose: the conversion depends on who is asking,
 * so this response must never be cached and handed to the next visitor.
 */
export const dynamic = 'force-dynamic';

// GET /api/inventory/temp-pricing?itemNo=sw0001&condition=new
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo');
    const conditionParam = searchParams.get('condition');
    const condition = (conditionParam === 'used' ? 'used' : 'new') as 'new' | 'used';
    const itemName = searchParams.get('itemName') || undefined;

    if (!itemNo) {
      return NextResponse.json(
        { success: false, error: 'Missing itemNo parameter' },
        { status: 400 }
      );
    }

    const session = await auth();
    const countryCode = session?.user?.preferredCountryCode || 'US';
    const region = session?.user?.preferredRegion || 'north_america';
    const cacheTtlHours = session?.user?.id ? LOGGED_IN_TTL_HOURS : LOGGED_OUT_TTL_HOURS;

    const pricingData = await pricingOrchestrator.getMinifigPrice(
      itemNo,
      condition,
      countryCode,
      region,
      session?.user?.id,
      'api-endpoint',
      false,
      itemName,
      cacheTtlHours,
    );

    const currency = await getDisplayCurrency();
    const pricing = pricingData
      ? await convertPricingToCurrency(pricingData, currency.code, PRICE_FIELDS)
      : pricingData;

    return NextResponse.json({
      success: true,
      pricing,
      currency: currency.code,
      // The page says "converted from USD" when this is true, so nobody reads
      // a converted figure as the exact amount BrickLink quoted.
      currencyConverted: currency.converted,
    });
  } catch (error) {
    console.error('Error fetching temp pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
