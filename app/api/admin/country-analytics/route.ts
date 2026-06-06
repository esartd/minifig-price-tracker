import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Admin Country Analytics API
 *
 * Returns detailed analytics for a specific country:
 * - Total page views
 * - Unique visitors
 * - Top visited pages
 * - Hourly traffic pattern
 * - Scraping indicators
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
    const country = searchParams.get('country');
    const days = parseInt(searchParams.get('days') || '7');

    if (!country) {
      return NextResponse.json(
        { error: 'Missing country parameter' },
        { status: 400 }
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Get all events for this country in the time period
    const events = await prisma.visitorEvent.findMany({
      where: {
        country,
        createdAt: {
          gte: since,
        },
      },
      select: {
        id: true,
        ip: true,
        path: true,
        referer: true,
        eventType: true,
        metadata: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate metrics
    const totalViews = events.length;
    const uniqueIPs = new Set(events.map(e => e.ip)).size;

    // Top pages
    const pageCounts = new Map<string, number>();
    events.forEach(e => {
      const count = pageCounts.get(e.path) || 0;
      pageCounts.set(e.path, count + 1);
    });

    const topPages = Array.from(pageCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Hourly pattern (UTC)
    const hourlyCounts = new Map<number, number>();
    events.forEach(e => {
      const hour = new Date(e.createdAt).getUTCHours();
      const count = hourlyCounts.get(hour) || 0;
      hourlyCounts.set(hour, count + 1);
    });

    const hourlyPattern = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourlyCounts.get(i) || 0,
    }));

    // Scraping indicators
    const detailPageEvents = events.filter(e =>
      e.path.match(/^\/minifigs\/[^/]+$/) || e.path.match(/^\/sets\/[^/]+$/)
    );

    const noRefererCount = detailPageEvents.filter(e => !e.referer).length;
    const noRefererRate = detailPageEvents.length > 0
      ? noRefererCount / detailPageEvents.length
      : 0;

    // Identify suspicious IPs (no referer on 80%+ of detail pages)
    const ipDetailPageCounts = new Map<string, { total: number; noReferer: number }>();
    detailPageEvents.forEach(e => {
      const existing = ipDetailPageCounts.get(e.ip) || { total: 0, noReferer: 0 };
      existing.total++;
      if (!e.referer) existing.noReferer++;
      ipDetailPageCounts.set(e.ip, existing);
    });

    const suspiciousIPs = Array.from(ipDetailPageCounts.entries())
      .filter(([_, counts]) => {
        const rate = counts.noReferer / counts.total;
        return counts.total >= 5 && rate >= 0.8; // 80%+ no referer, 5+ pages
      })
      .map(([ip, counts]) => ({
        ip,
        totalPages: counts.total,
        noRefererPages: counts.noReferer,
        noRefererRate: counts.noReferer / counts.total,
      }))
      .sort((a, b) => b.totalPages - a.totalPages);

    // Average pages per session (rough estimate based on IP)
    const avgPagesPerSession = uniqueIPs > 0
      ? totalViews / uniqueIPs
      : 0;

    return NextResponse.json({
      success: true,
      country,
      days,
      metrics: {
        totalViews,
        uniqueVisitors: uniqueIPs,
        avgPagesPerSession: Math.round(avgPagesPerSession * 10) / 10,
      },
      topPages,
      hourlyPattern,
      scrapingIndicators: {
        noRefererRate: Math.round(noRefererRate * 100),
        suspiciousIPs: suspiciousIPs.slice(0, 10), // Top 10 suspicious IPs
        totalSuspiciousIPs: suspiciousIPs.length,
      },
    });

  } catch (error: any) {
    console.error('[Country Analytics] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
