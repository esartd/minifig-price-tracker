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

    // Cap the results. This used to ask for 10,000 of each ("effectively
    // unlimited"), which meant typing a single character returned 11,888 items
    // and a 4.2 MB response taking over a second — to render a handful on
    // screen. Capping is safe because both searches score and sort before
    // slicing: an exact ID match scores 1000 and short-circuits, so the item
    // you're looking for is at the top, never truncated off the end.
    const requested = Number(searchParams.get('limit'));
    const limit =
      Number.isFinite(requested) && requested > 0 ? Math.min(requested, 500) : 100;

    const [minifigs, sets] = await Promise.all([
      searchMinifigs(query, limit),
      Promise.resolve(searchBoxes(query, limit)),
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
