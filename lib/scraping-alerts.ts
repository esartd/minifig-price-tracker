/**
 * Scraping Alert System
 *
 * Monitors for unusual scraping activity and sends email alerts
 */

import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export interface ScrapingAlert {
  type: 'spike' | 'new_country' | 'high_rate' | 'blocked_ip';
  country: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  metrics: {
    totalRequests?: number;
    uniqueIPs?: number;
    noRefererRate?: number;
    suspiciousIPs?: number;
  };
  timestamp: Date;
}

/**
 * Check for scraping anomalies and send alerts
 * Run this via cron every hour
 */
export async function checkAndSendScrapingAlerts(): Promise<ScrapingAlert[]> {
  const alerts: ScrapingAlert[] = [];

  // Check last hour of activity
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Get activity by country
  const recentActivity = await prisma.visitorEvent.groupBy({
    by: ['country'],
    where: {
      createdAt: {
        gte: oneHourAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Check each country for anomalies
  for (const activity of recentActivity) {
    const country = activity.country;
    const totalRequests = activity._count.id;

    // Alert 1: Traffic spike (>100 requests/hour from single country)
    if (totalRequests > 100) {
      const events = await prisma.visitorEvent.findMany({
        where: {
          country,
          createdAt: { gte: oneHourAgo },
        },
        select: {
          ip: true,
          referer: true,
          path: true,
        },
      });

      const uniqueIPs = new Set(events.map(e => e.ip)).size;
      const detailPages = events.filter(e =>
        e.path.match(/^\/minifigs\/[^/]+$/) || e.path.match(/^\/sets\/[^/]+$/)
      );
      const noRefererRate = detailPages.length > 0
        ? detailPages.filter(e => !e.referer).length / detailPages.length
        : 0;

      // High scraping activity
      if (noRefererRate > 0.7 && uniqueIPs < 10) {
        alerts.push({
          type: 'spike',
          country,
          severity: 'high',
          message: `Heavy scraping detected from ${country}: ${totalRequests} requests from ${uniqueIPs} IPs with ${Math.round(noRefererRate * 100)}% no-referer rate`,
          metrics: {
            totalRequests,
            uniqueIPs,
            noRefererRate: Math.round(noRefererRate * 100),
          },
          timestamp: new Date(),
        });
      }
      // Moderate traffic spike (may be legitimate)
      else if (totalRequests > 200) {
        alerts.push({
          type: 'spike',
          country,
          severity: 'medium',
          message: `Traffic spike from ${country}: ${totalRequests} requests from ${uniqueIPs} IPs`,
          metrics: {
            totalRequests,
            uniqueIPs,
          },
          timestamp: new Date(),
        });
      }
    }
  }

  // Alert 2: Check blocked IPs in last hour
  const recentBlocks = await prisma.$queryRawUnsafe<any[]>(`
    SELECT country, COUNT(*) as count
    FROM BlockedIP
    WHERE blockedAt >= ?
    GROUP BY country
  `, oneHourAgo);

  for (const block of recentBlocks) {
    if (block.count >= 5) {
      alerts.push({
        type: 'blocked_ip',
        country: block.country,
        severity: 'medium',
        message: `Auto-blocked ${block.count} IPs from ${block.country} in last hour`,
        metrics: {
          suspiciousIPs: block.count,
        },
        timestamp: new Date(),
      });
    }
  }

  // Send email if there are high-severity alerts
  const highSeverityAlerts = alerts.filter(a => a.severity === 'high');

  if (highSeverityAlerts.length > 0) {
    await sendScrapingAlertEmail(highSeverityAlerts);
  }

  return alerts;
}

/**
 * Send email alert for scraping activity
 */
async function sendScrapingAlertEmail(alerts: ScrapingAlert[]): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Scraping Alerts] ⚠️  Resend API key not configured - email not sent');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const alertsHTML = alerts.map(alert => `
    <div style="border-left: 4px solid #dc2626; padding: 12px; margin: 16px 0; background: #fef2f2;">
      <strong style="color: #dc2626;">${alert.type.toUpperCase()}: ${alert.country}</strong>
      <p style="margin: 8px 0;">${alert.message}</p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        ${alert.metrics.totalRequests ? `<li>Total Requests: ${alert.metrics.totalRequests}</li>` : ''}
        ${alert.metrics.uniqueIPs ? `<li>Unique IPs: ${alert.metrics.uniqueIPs}</li>` : ''}
        ${alert.metrics.noRefererRate ? `<li>No Referer Rate: ${alert.metrics.noRefererRate}%</li>` : ''}
        ${alert.metrics.suspiciousIPs ? `<li>Suspicious IPs: ${alert.metrics.suspiciousIPs}</li>` : ''}
      </ul>
      <small style="color: #737373;">Detected at: ${alert.timestamp.toLocaleString('en-US', { timeZone: 'America/Denver' })} MT</small>
    </div>
  `).join('');

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'ericksu0c@gmail.com',
      subject: `🚨 FigTracker Scraping Alert: ${alerts.length} High-Severity Issues`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px;">
          <h1 style="color: #dc2626;">Scraping Activity Detected</h1>
          <p>High-severity scraping activity has been detected on FigTracker:</p>
          ${alertsHTML}
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
          <p>
            <a href="https://figtracker.ericksu.com/admin/visitor-analytics" style="color: #3b82f6; text-decoration: none;">
              View Visitor Analytics Dashboard →
            </a>
          </p>
          <p style="color: #737373; font-size: 14px;">
            This is an automated alert from FigTracker. IPs exhibiting scraping patterns are automatically blocked for 24 hours.
          </p>
        </div>
      `,
    });

    console.log(`[Scraping Alerts] ✅ Sent email alert for ${alerts.length} high-severity issues`);
  } catch (error: any) {
    console.error('[Scraping Alerts] ❌ Failed to send email:', error.message);
  }
}

/**
 * Get recent alerts for admin dashboard
 */
export async function getRecentAlerts(hours: number = 24): Promise<ScrapingAlert[]> {
  // This would query a ScrapingAlert table if we wanted to persist alerts
  // For now, just check current state
  return checkAndSendScrapingAlerts();
}
