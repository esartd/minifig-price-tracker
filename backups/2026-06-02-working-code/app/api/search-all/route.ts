import { NextRequest, NextResponse } from 'next/server';
import { searchMinifigs } from '@/lib/catalog-static';
import { searchBoxes } from '@/lib/boxes-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          minifigs: [],
          sets: []
        }
      });
    }

    // Search both minifigures and sets in parallel - show ALL results (no limit)
    const [minifigs, sets] = await Promise.all([
      searchMinifigs(query, 10000), // Effectively unlimited
      Promise.resolve(searchBoxes(query, 10000)) // Effectively unlimited
    ]);

    return NextResponse.json({
      success: true,
      data: {
        minifigs,
        sets
      }
    }, {
      headers: {
        // Cache search results for 1 minute
        // This eliminates duplicate searches from same users without staleness
        'Cache-Control': 'public, max-age=60, s-maxage=60',
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
