import { NextResponse } from 'next/server';
import { fetchSetContents } from '@/lib/set-contents';

/**
 * GET /api/sets/[boxNo]/contents
 *
 * Returns minifigs in a set
 * Fetches from BrickLink API if not cached, otherwise returns cached data
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ boxNo: string }> }
) {
  try {
    const { boxNo } = await params;

    if (!boxNo) {
      return NextResponse.json(
        { error: 'Set number is required' },
        { status: 400 }
      );
    }

    const result = await fetchSetContents(boxNo, 'user_view');

    return NextResponse.json({
      set_no: boxNo,
      minifigs: result.minifigs,
      cached: result.cached,
      count: result.minifigs.length
    });
  } catch (error) {
    console.error('[SET CONTENTS API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch set contents' },
      { status: 500 }
    );
  }
}
