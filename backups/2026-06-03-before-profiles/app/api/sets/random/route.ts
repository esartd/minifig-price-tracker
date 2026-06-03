import { NextRequest, NextResponse } from 'next/server';
import { getRandomCurrentSetsFromTheme, getSetImageUrl } from '@/lib/sets-data';
import { getRandomFeaturedSets } from '@/lib/featured-sets';

// Force dynamic rendering (searchParams requires dynamic)
export const dynamic = 'force-dynamic';

/**
 * GET /api/sets/random?theme=Star Wars&count=5
 * Returns random LEGO sets from last 2 years from a theme for affiliate advertising
 * Prioritizes manually curated featured sets, falls back to auto-generated from Sets.txt
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

    // Try to get featured sets first (manually curated with direct Amazon links)
    const featuredSets = getRandomFeaturedSets(theme, count);

    if (featuredSets.length > 0) {
      // Use featured sets (already have direct Amazon URLs)
      const formattedSets = featuredSets.map(set => ({
        setNumber: set.setNumber,
        name: set.name,
        theme: set.theme,
        year: set.year,
        imageUrl: set.imageUrl,
        amazonUrl: set.amazonUrl // Include direct Amazon URL
      }));

      return NextResponse.json({
        success: true,
        data: formattedSets,
        count: formattedSets.length
      });
    }

    // Fallback: Get random sets from the theme (last 2 years) from Sets.txt
    const sets = getRandomCurrentSetsFromTheme(theme, count);

    // Format response with image URLs (no direct Amazon URL)
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
