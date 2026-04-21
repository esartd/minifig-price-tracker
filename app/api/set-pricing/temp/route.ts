import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const boxNo = searchParams.get('boxNo');
    const condition = searchParams.get('condition') || 'new';
    const countryCode = searchParams.get('countryCode') || 'US';
    const region = searchParams.get('region') || 'north_america';

    if (!boxNo) {
      return NextResponse.json(
        { success: false, error: 'Missing boxNo parameter' },
        { status: 400 }
      );
    }

    const pricing = await bricklinkAPI.calculateSetPricing(
      boxNo,
      condition as 'new' | 'used',
      countryCode,
      region
    );

    return NextResponse.json({
      success: true,
      pricing
    });
  } catch (error) {
    console.error('Error fetching set pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
