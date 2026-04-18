import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// GET /api/collection/temp-pricing?itemNo=sw0001&condition=new
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo');
    const conditionParam = searchParams.get('condition');
    const condition = (conditionParam === 'used' ? 'used' : 'new') as 'new' | 'used';

    if (!itemNo) {
      return NextResponse.json(
        { success: false, error: 'Missing itemNo parameter' },
        { status: 400 }
      );
    }

    // Get user's regional preferences from session
    const session = await auth();
    const countryCode = session?.user?.preferredCountryCode || 'US';
    const region = session?.user?.preferredRegion || 'north_america';

    // Fetch pricing data from BrickLink with specified condition
    const pricingData = await bricklinkAPI.calculatePricingData(
      itemNo,
      condition,
      countryCode,
      region
    );

    return NextResponse.json({
      success: true,
      pricing: pricingData
    });
  } catch (error) {
    console.error('Error fetching temp pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
