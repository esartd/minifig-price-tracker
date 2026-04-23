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
    const countryCode = session.user?.preferredCountryCode || 'US';

    console.log(`\n========== TEST PRICING START ==========`);
    console.log(`Item: ${itemNo}, Condition: ${condition}, Country: ${countryCode}`);

    const startTime = Date.now();
    const pricing = await bricklinkAPI.calculatePricingData(
      itemNo,
      condition as 'new' | 'used',
      countryCode,
      '' // empty region
    );
    const duration = Date.now() - startTime;

    console.log(`Result: ${JSON.stringify(pricing)}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`========== TEST PRICING END ==========\n`);

    return NextResponse.json({
      success: true,
      item: itemNo,
      condition,
      countryCode,
      duration: `${duration}ms`,
      pricing
    });
  } catch (error: any) {
    console.error('Test pricing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch test pricing' },
      { status: 500 }
    );
  }
}
