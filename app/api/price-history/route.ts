import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minifigure_no = searchParams.get('minifigure_no');
    const condition = searchParams.get('condition');

    if (!minifigure_no || !condition) {
      return NextResponse.json(
        { success: false, error: 'Missing minifigure_no or condition' },
        { status: 400 }
      );
    }

    // Fetch price history for this minifig, sorted by date (oldest first for charting)
    const history = await prisma.priceHistory.findMany({
      where: {
        minifigure_no,
        condition,
      },
      orderBy: {
        recorded_at: 'asc',
      },
    });

    // Calculate some useful stats
    const stats = history.length > 0 ? {
      dataPoints: history.length,
      firstRecorded: history[0].recorded_at,
      lastRecorded: history[history.length - 1].recorded_at,
      currentPrice: history[history.length - 1].current_avg,
      lowestPrice: Math.min(...history.map(h => h.current_avg)),
      highestPrice: Math.max(...history.map(h => h.current_avg)),
      priceChange: history.length > 1
        ? ((history[history.length - 1].current_avg - history[0].current_avg) / history[0].current_avg * 100).toFixed(2)
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
