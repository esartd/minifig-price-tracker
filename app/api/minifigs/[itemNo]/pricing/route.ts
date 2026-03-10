import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemNo: string }> }
) {
  try {
    const { itemNo } = await params;
    const searchParams = request.nextUrl.searchParams;
    const condition = searchParams.get('condition') as 'new' | 'used' || 'new';

    const pricing = await bricklinkAPI.calculatePricingData(itemNo, condition);

    return NextResponse.json({ success: true, data: pricing });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}
