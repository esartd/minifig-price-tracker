import { NextResponse } from 'next/server';

/**
 * Consolidated cron endpoint - runs all scheduled tasks
 * Hostinger only allows 1 cron job, so this handles everything
 *
 * SETUP IN HOSTINGER:
 * Set cron to run every 6 hours (runs at 12 AM, 6 AM, 12 PM, 6 PM UTC)
 * URL: https://figtracker.ericksu.com/api/cron/consolidated
 * Method: GET
 *
 * Tasks:
 * 1. Collection Price Pre-warming (every run) - Pre-cache prices for all user collections
 *
 * Note: Price history recording is now opportunistic (records when pricing is fetched)
 * and doesn't need a scheduled cron job.
 */
export async function GET(request: Request) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tasks: []
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    // Vercel cron jobs send this header automatically
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';

    // Verify authorization (allow Vercel cron or Bearer token if CRON_SECRET is set)
    if (cronSecret && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TASK 1: Collection Price Pre-warming (runs EVERY time - every 6 hours)
    // This pre-caches prices for all items in user collections for instant page loads
    console.log('Starting collection price pre-warming...');
    try {
      const collectionPriceResponse = await fetch(`${baseUrl}/api/cron/refresh-collection-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cronSecret && { 'Authorization': `Bearer ${cronSecret}` })
        }
      });
      const collectionPriceData = await collectionPriceResponse.json();

      results.tasks.push({
        name: 'collection-price-prewarm',
        status: collectionPriceData.success ? 'success' : 'failed',
        data: collectionPriceData
      });
      console.log('Collection price pre-warming completed:', collectionPriceData);
    } catch (error) {
      console.error('Collection price pre-warming failed:', error);
      results.tasks.push({
        name: 'collection-price-prewarm',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Price refresh and price history are now handled opportunistically:
    // - Price refresh: Happens when users view collections (progressive loading)
    // - Price history: Recorded automatically when fresh pricing is fetched
    // This eliminates timeout issues and makes the site more responsive.

    return NextResponse.json({
      success: true,
      message: 'Cron tasks completed',
      results
    });

  } catch (error) {
    console.error('Consolidated cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Cron execution failed',
        results
      },
      { status: 500 }
    );
  }
}
