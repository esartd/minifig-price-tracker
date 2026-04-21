import { NextResponse } from 'next/server';
import { loadAllBoxes, getRecentBoxes, getPopularThemes } from '@/lib/boxes-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allBoxes = loadAllBoxes();
    const recentBoxes = getRecentBoxes();
    const popularThemes = getPopularThemes(10);

    return NextResponse.json({
      success: true,
      data: {
        totalSets: allBoxes.length,
        recentSets: recentBoxes.length,
        themes: popularThemes
      }
    });
  } catch (error) {
    console.error('Error loading box stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}
