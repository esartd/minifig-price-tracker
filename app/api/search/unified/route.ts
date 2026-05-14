import { NextRequest, NextResponse } from 'next/server';
import { searchMinifigs } from '@/lib/catalog-static';
import { searchBoxes } from '@/lib/boxes-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Search both minifigs and sets in parallel
    const [minifigs, sets] = await Promise.all([
      Promise.resolve(searchMinifigs(query, limit)),
      Promise.resolve(searchBoxes(query, limit))
    ]);

    return NextResponse.json({
      success: true,
      data: {
        minifigs,
        sets,
        query
      }
    });
  } catch (error) {
    console.error('Error in unified search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
