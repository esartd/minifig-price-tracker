import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';

// GET /api/collection/temp-pricing?itemNo=sw0001&condition=new
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo');
    const condition = searchParams.get('condition') || 'new';

    if (!itemNo) {
      return NextResponse.json(
        { success: false, error: 'Missing itemNo parameter' },
        { status: 400 }
      );
    }

    // Fetch pricing data from BrickLink
    const pricingData = await bricklinkAPI.calculatePricingData(
      itemNo,
      condition as 'new' | 'used'
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
