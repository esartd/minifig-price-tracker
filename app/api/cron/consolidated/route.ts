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
 * 2. Price Refresh (every run) - Required every 6 hours per BrickLink API terms
 * 3. Price History (once daily) - Records historical snapshots
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

    // TASK 2: Refresh prices (runs EVERY time - every 6 hours)
    console.log('Starting price refresh...');
    try {
      const priceRefreshResponse = await fetch(`${baseUrl}/api/cron/refresh-prices`, {
        headers: {
          'Content-Type': 'application/json',
          ...(cronSecret && { 'Authorization': `Bearer ${cronSecret}` })
        }
      });
      const priceRefreshData = await priceRefreshResponse.json();

      results.tasks.push({
        name: 'price-refresh',
        status: priceRefreshData.success ? 'success' : 'failed',
        data: priceRefreshData
      });
      console.log('Price refresh completed:', priceRefreshData);
    } catch (error) {
      console.error('Price refresh failed:', error);
      results.tasks.push({
        name: 'price-refresh',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // TASK 3: Record price history (runs ONCE daily - only at midnight UTC)
    const currentHour = new Date().getUTCHours();
    if (currentHour === 0) { // Runs at 12 AM UTC
      console.log('Starting price history recording (daily task)...');
      try {
        const priceHistoryResponse = await fetch(`${baseUrl}/api/price-history/record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const priceHistoryData = await priceHistoryResponse.json();

        results.tasks.push({
          name: 'price-history',
          status: priceHistoryData.success ? 'success' : 'failed',
          data: priceHistoryData
        });
        console.log('Price history recording completed:', priceHistoryData);
      } catch (error) {
        console.error('Price history recording failed:', error);
        results.tasks.push({
          name: 'price-history',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      results.tasks.push({
        name: 'price-history',
        status: 'skipped',
        reason: `Only runs at midnight UTC (current hour: ${currentHour})`
      });
    }

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
