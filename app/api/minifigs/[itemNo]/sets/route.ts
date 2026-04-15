import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemNo: string }> }
) {
  try {
    const { itemNo } = await params;

    if (!itemNo) {
      return NextResponse.json(
        { success: false, error: 'Item number required' },
        { status: 400 }
      );
    }

    // Fetch sets containing this minifigure from BrickLink API
    const sets = await bricklinkAPI.getSetsContainingMinifig(itemNo);

    return NextResponse.json({
      success: true,
      sets,
      count: sets.length
    });
  } catch (error: any) {
    console.error('Error fetching sets:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sets' },
      { status: 500 }
    );
  }
}
