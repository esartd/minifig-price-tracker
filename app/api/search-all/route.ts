import { NextRequest, NextResponse } from 'next/server';
import { searchMinifigs } from '@/lib/catalog-static';
import { searchBoxes } from '@/lib/boxes-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '200');

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          minifigs: [],
          sets: []
        }
      });
    }

    // Search both minifigures and sets in parallel with full limit for each
    const [minifigs, sets] = await Promise.all([
      searchMinifigs(query, limit),
      Promise.resolve(searchBoxes(query, limit))
    ]);

    return NextResponse.json({
      success: true,
      data: {
        minifigs,
        sets
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
