import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo') || 'sw1319';
    const itemType = searchParams.get('type') || 'minifig';

    console.log(`Testing guide_type for ${itemNo}`);

    // Test with guide_type=stock
    const stockUrl = itemType === 'set'
      ? `/items/SET/${itemNo}/price?new_or_used=N&guide_type=stock&currency_code=USD`
      : `/items/MINIFIG/${itemNo}/price?new_or_used=U&guide_type=stock&currency_code=USD`;

    const stockData = await (bricklinkAPI as any).makeRequest(stockUrl);

    // Test with guide_type=sold
    const soldUrl = itemType === 'set'
      ? `/items/SET/${itemNo}/price?new_or_used=N&guide_type=sold&currency_code=USD`
      : `/items/MINIFIG/${itemNo}/price?new_or_used=U&guide_type=sold&currency_code=USD`;

    const soldData = await (bricklinkAPI as any).makeRequest(soldUrl);

    return NextResponse.json({
      success: true,
      item: itemNo,
      stock: {
        data: stockData,
        fields: stockData ? Object.keys(stockData) : []
      },
      sold: {
        data: soldData,
        fields: soldData ? Object.keys(soldData) : []
      },
      comparison: {
        stockAvg: stockData?.avg_price,
        soldAvg: soldData?.avg_price,
        different: stockData?.avg_price !== soldData?.avg_price
      }
    });
  } catch (error: any) {
    console.error('Test guide types error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
