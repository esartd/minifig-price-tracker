import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendScrapingAlerts } from '@/lib/scraping-alerts';

/**
 * Cron Job: Check for scraping alerts
 *
 * Runs every hour to detect unusual scraping activity
 * Sends email alerts for high-severity issues
 *
 * Setup in cron:
 * 0 * * * * curl https://figtracker.ericksu.com/api/cron/check-scraping-alerts
 */

export async function GET(request: NextRequest) {
  try {
    console.log('[CRON] Starting scraping alerts check...');

    const alerts = await checkAndSendScrapingAlerts();

    const highSeverity = alerts.filter(a => a.severity === 'high').length;
    const mediumSeverity = alerts.filter(a => a.severity === 'medium').length;

    console.log(`[CRON] Scraping alerts check complete: ${highSeverity} high, ${mediumSeverity} medium`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      alerts: {
        total: alerts.length,
        high: highSeverity,
        medium: mediumSeverity,
        low: alerts.filter(a => a.severity === 'low').length,
      },
      details: alerts,
    });

  } catch (error: any) {
    console.error('[CRON] Scraping alerts check failed:', error.message);

    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
