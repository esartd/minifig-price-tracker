import { NextResponse } from 'next/server';
import { prisma, prismaPublic } from '@/lib/prisma';
import { auth } from '@/auth';

// GET - Check current API usage for today
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get today's call count from database
    const tracker = await prismaPublic.apiCallTracker.findUnique({
      where: { date: today }
    });

    const MAX_CALLS_PER_DAY = 5000;
    const callsUsed = tracker?.call_count || 0;
    const callsRemaining = MAX_CALLS_PER_DAY - callsUsed;
    const percentageUsed = Math.round((callsUsed / MAX_CALLS_PER_DAY) * 100);

    return NextResponse.json({
      success: true,
      data: {
        date: today,
        callsUsed,
        callsRemaining,
        maxCallsPerDay: MAX_CALLS_PER_DAY,
        percentageUsed,
        lastCallAt: tracker?.last_call_at || null,
        status: percentageUsed < 50 ? 'healthy' : percentageUsed < 80 ? 'warning' : 'critical'
      }
    });
  } catch (error) {
    console.error('Error fetching API usage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API usage' },
      { status: 500 }
    );
  }
}
