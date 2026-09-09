import { NextRequest, NextResponse } from 'next/server';
import { getRetiringSoonSets } from '@/lib/retiring-soon-algorithm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme') || undefined;
    const timeline = searchParams.get('timeline') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const minScore = parseInt(searchParams.get('minScore') || '50');

    const { items, total } = await getRetiringSoonSets({
      theme,
      timeline,
      limit,
      offset,
      minScore
    });

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        count: items.length,
        // Every qualifying set, so the client knows whether more remain.
        total,
        offset,
        limit,
        hasMore: offset + items.length < total,
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
