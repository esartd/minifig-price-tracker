import { NextRequest, NextResponse } from 'next/server';
import { getRandomCurrentSetsFromTheme, getSetImageUrl } from '@/lib/sets-data';

// Cache for 1 hour on CDN
export const revalidate = 3600;

/**
 * GET /api/sets/random?theme=Star Wars&count=5
 * Returns random LEGO sets from last 2 years from a theme for affiliate advertising
 * Returns different sets on each request (shuffled randomly)
 * Count dynamically scales based on page length (max 10)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme');
    const count = Math.min(10, parseInt(searchParams.get('count') || '3')); // Max 10

    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme parameter required' },
        { status: 400 }
      );
    }

    // Get random sets from the theme (last 2 years)
    const sets = getRandomCurrentSetsFromTheme(theme, count);

    // Format response with image URLs
    const formattedSets = sets.map(set => ({
      setNumber: set.no.replace(/-\d+$/, ''), // Remove -1 suffix
      name: set.name,
      theme: set.categoryName,
      year: set.yearReleased,
      imageUrl: getSetImageUrl(set.no)
    }));

    return NextResponse.json({
      success: true,
      data: formattedSets,
      count: formattedSets.length
    });
  } catch (error) {
    console.error('Error fetching random sets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sets' },
      { status: 500 }
    );
  }
}
