import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minifigure_no = searchParams.get('minifigure_no');
    const condition = searchParams.get('condition');
    const timeframe = searchParams.get('timeframe') || '6months'; // Default: 6 months

    if (!minifigure_no || !condition) {
      return NextResponse.json(
        { success: false, error: 'Missing minifigure_no or condition' },
        { status: 400 }
      );
    }

    // Calculate date filter based on timeframe
    let dateFilter = {};
    if (timeframe === '6months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      dateFilter = { recorded_at: { gte: sixMonthsAgo } };
    }
    // For 'all' timeframe, no date filter

    // Fetch price history for this minifig, sorted by date (oldest first for charting)
    const history = await prisma.priceHistory.findMany({
      where: {
        minifigure_no,
        condition,
        ...dateFilter,
      },
      orderBy: {
        recorded_at: 'asc',
      },
    });

    // Calculate some useful stats (based on suggested_price - the most important number)
    const stats = history.length > 0 ? {
      dataPoints: history.length,
      firstRecorded: history[0].recorded_at,
      lastRecorded: history[history.length - 1].recorded_at,
      currentPrice: history[history.length - 1].suggested_price,
      lowestPrice: Math.min(...history.map(h => h.suggested_price)),
      highestPrice: Math.max(...history.map(h => h.suggested_price)),
      priceChange: history.length > 1
        ? ((history[history.length - 1].suggested_price - history[0].suggested_price) / history[0].suggested_price * 100).toFixed(2)
        : 0,
    } : null;

    return NextResponse.json({
      success: true,
      data: history,
      stats,
    });
  } catch (error) {
    console.error('Price history fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}
