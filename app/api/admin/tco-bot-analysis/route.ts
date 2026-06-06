import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTcoBotStats } from '@/lib/tco-bot-detector';

/**
 * Admin T.co Bot Analysis API
 *
 * Returns detailed analysis of t.co (Twitter/X) referral traffic
 * to determine if visitors are real users or automated bots
 */

export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'ericksu0c@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const hours = parseInt(searchParams.get('hours') || '24');

    const stats = await getTcoBotStats(hours);

    return NextResponse.json({
      success: true,
      hours,
      ...stats,
    });

  } catch (error: any) {
    console.error('[T.co Bot Analysis] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze t.co traffic' },
      { status: 500 }
    );
  }
}
