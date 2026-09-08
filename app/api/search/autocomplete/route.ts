import { NextRequest, NextResponse } from 'next/server';
import { getAutocompleteSuggestions } from '@/lib/search-synonyms';
import { searchMinifigs } from '@/lib/catalog-static';
import { searchBoxes } from '@/lib/boxes-data';

export const dynamic = 'force-dynamic';

/**
 * Autocomplete API for search suggestions
 * Returns synonym suggestions + top minifigs/sets
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q') || '';

    if (query.length < 2) {
      // Same shape as the success case, just empty. This used to return an
      // array here and an object below, so every caller had to check the type
      // before reading .minifigs.
      return NextResponse.json({
        success: true,
        suggestions: { synonyms: [], minifigs: [], sets: [] },
      });
    }

    // Get synonym suggestions
    const synonymSuggestions = getAutocompleteSuggestions(query, 3);

    // Get top search results
    const [minifigs, sets] = await Promise.all([
      searchMinifigs(query, 5),
      Promise.resolve(searchBoxes(query, 5))
    ]);

    return NextResponse.json({
      success: true,
      suggestions: {
        synonyms: synonymSuggestions.map(s => ({
          input: s.input,
          canonical: s.canonical,
          category: s.category
        })),
        minifigs: minifigs.slice(0, 3).map(m => ({
          id: m.minifigure_no,
          name: m.name,
          image_url: m.image_url,
          category: m.category_name,
          year: m.year_released
        })),
        sets: sets.slice(0, 2).map(s => ({
          id: s.box_no,
          name: s.name,
          image_url: s.image_url,
          category: s.category_name,
          year: s.year_released
        }))
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 min cache
      }
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json(
      { success: false, error: 'Autocomplete failed' },
      { status: 500 }
    );
  }
}
