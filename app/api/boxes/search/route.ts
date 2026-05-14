import { NextRequest, NextResponse } from 'next/server';
import { searchBoxes, getRecentBoxes, loadAllBoxes } from '@/lib/boxes-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const theme = searchParams.get('theme');
    const limit = parseInt(searchParams.get('limit') || '50');

    let results;

    if (theme) {
      // Filter by theme - get ALL boxes for this theme
      const allBoxes = loadAllBoxes();
      results = allBoxes.filter(box => {
        const parentTheme = box.category_name.split(' / ')[0].trim();
        return parentTheme.toLowerCase() === theme.toLowerCase();
      });

      // Sort by year descending
      results.sort((a, b) => parseInt(b.year_released) - parseInt(a.year_released));

      // Apply limit if specified
      if (limit && limit < results.length) {
        results = results.slice(0, limit);
      }
    } else if (query) {
      // Search by query
      results = searchBoxes(query, limit);
    } else {
      // Return recent boxes
      results = getRecentBoxes({ limit });
    }

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching boxes:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
