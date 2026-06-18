import { NextResponse } from 'next/server';

/**
 * Consolidated cron endpoint
 * Hostinger only allows 1 cron job, so this handles all scheduled tasks.
 *
 * SETUP IN HOSTINGER:
 * URL: https://figtracker.ericksu.com/api/cron/consolidated
 * Method: GET
 * Schedule: Every 6 hours (or less frequently — no heavy tasks run here)
 *
 * Current tasks: none active
 *
 * Pricing pre-warming was removed (June 2026). With the unified 95/5 blended
 * pricing system, logged-in users have a 24h cache TTL. Prices refresh
 * on-demand via progressive fetch when a user visits their collection.
 * Pre-warming was burning ~2,400 API calls/day (48% of budget) for work
 * that the user's own first daily visit handles automatically.
 *
 * Other refreshes are handled opportunistically:
 * - Price refresh: Progressive fetch on collection pages (3-second delays)
 * - Price history: Recorded automatically when fresh pricing is fetched
 */
export async function GET(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';

    if (cronSecret && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cron ran — no active tasks',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Consolidated cron error:', error);
    return NextResponse.json(
      { success: false, error: 'Cron execution failed' },
      { status: 500 }
    );
  }
}
