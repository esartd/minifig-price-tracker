import { NextRequest, NextResponse } from 'next/server';
import { getRetiringSoonSets } from '@/lib/retiring-soon-algorithm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme') || undefined;
    const timeline = searchParams.get('timeline') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const minScore = parseInt(searchParams.get('minScore') || '50');

    const predictions = await getRetiringSoonSets({
      theme,
      timeline,
      limit,
      minScore
    });

    return NextResponse.json({
      success: true,
      data: predictions,
      meta: {
        count: predictions.length,
        theme: theme || 'all',
        timeline,
        algorithm: 'v1',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[API] Error fetching retiring sets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch retiring sets',
        data: []
      },
      { status: 500 }
    );
  }
}
