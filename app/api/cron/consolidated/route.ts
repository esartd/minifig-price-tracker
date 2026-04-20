import { NextResponse } from 'next/server';

/**
 * Consolidated cron endpoint - runs all scheduled tasks
 * Hostinger only allows 1 cron job, so this calls all sub-tasks
 *
 * Schedule: Daily at 2 AM UTC (adjust in Hostinger cron settings)
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tasks: []
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';

    // Task 1: Record price history
    console.log('Starting price history recording...');
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

    // Add more tasks here as needed
    // Task 2: Example - cleanup old data
    // Task 3: Example - send email digests

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
