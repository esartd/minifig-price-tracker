import { NextRequest, NextResponse } from 'next/server';
import { searchMinifigs } from '@/lib/catalog-static';
import { searchBoxes } from '@/lib/boxes-data';
import { expandSynonyms } from '@/lib/search-synonyms';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Apply synonym expansion
    const { expanded, matched, synonym } = expandSynonyms(query);
    const finalQuery = expanded;

    // Search both minifigs and sets in parallel
    const [minifigs, sets] = await Promise.all([
      Promise.resolve(searchMinifigs(finalQuery, limit)),
      Promise.resolve(searchBoxes(finalQuery, limit))
    ]);

    return NextResponse.json({
      success: true,
      data: {
        minifigs,
        sets,
        query: finalQuery
      },
      synonymExpanded: matched ? {
        original: query,
        expanded: finalQuery,
        category: synonym?.category
      } : undefined
    });
  } catch (error) {
    console.error('Error in unified search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
