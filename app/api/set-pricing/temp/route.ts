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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const boxNo = searchParams.get('boxNo');
    const condition = searchParams.get('condition') || 'new';
    const countryCode = searchParams.get('countryCode') || 'US';
    const region = searchParams.get('region') || 'north_america';

    console.log(`[Set Pricing API] boxNo=${boxNo}, condition=${condition}, countryCode=${countryCode}, region=${region}`);

    if (!boxNo) {
      return NextResponse.json(
        { success: false, error: 'Missing boxNo parameter' },
        { status: 400 }
      );
    }

    const session = await auth();
    const cacheTtlHours = session?.user?.id ? LOGGED_IN_TTL_HOURS : LOGGED_OUT_TTL_HOURS;

    const pricing = await pricingOrchestrator.getSetPrice(
      boxNo,
      condition as 'new' | 'used',
      countryCode,
      region,
      session?.user?.id,
      false,
      undefined,
      cacheTtlHours,
    );

    console.log(`[Set Pricing API] Result for ${boxNo}: suggested=$${pricing?.suggestedPrice ?? 0}`);

    const currency = await getDisplayCurrency();
    const converted = pricing
      ? await convertPricingToCurrency(pricing, currency.code, PRICE_FIELDS)
      : pricing;

    return NextResponse.json({
      success: true,
      pricing: converted,
      currency: currency.code,
      currencyConverted: currency.converted,
    });
  } catch (error) {
    console.error('Error fetching set pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
