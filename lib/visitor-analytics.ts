/**
 * Visitor Analytics - Track geographic behavior patterns
 *
 * Monitors visitor behavior by country to detect:
 * - Real users vs scrapers
 * - Traffic patterns by region
 * - Page access patterns
 * - Conversion funnel by country
 */

export interface VisitorEvent {
  country: string;
  ip: string;
  userAgent: string;
  path: string;
  referer: string | null;
  eventType: 'page_view' | 'pricing_view' | 'affiliate_click' | 'search' | 'collection_action';
  metadata?: Record<string, any>;
  timestamp: Date;
  userId?: string | null;
}

/**
 * Track visitor behavior (fire-and-forget)
 * Called from middleware or API routes
 */
export async function trackVisitorEvent(event: VisitorEvent): Promise<void> {
  try {
    // Fire-and-forget POST to tracking API
    await fetch('/api/track-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      // Don't wait for response
    }).catch(err => {
      console.error('[Visitor Analytics] Failed to track (non-blocking):', err.message);
    });
  } catch (err) {
    // Silent fail - don't break user experience
    console.error('[Visitor Analytics] Error (non-blocking):', err);
  }
}

/**
 * Get visitor analytics for a specific country
 * Used in admin dashboard
 */
export async function getCountryAnalytics(country: string, days: number = 7): Promise<{
  totalViews: number;
  uniqueVisitors: number;
  topPages: Array<{ path: string; count: number }>;
  hourlyPattern: Array<{ hour: number; count: number }>;
  scrapingIndicators: {
    noRefererRate: number;
    avgPagesPerSession: number;
    suspiciousIPs: string[];
  };
}> {
  const response = await fetch(`/api/admin/country-analytics?country=${country}&days=${days}`);
  if (!response.ok) {
    throw new Error('Failed to fetch country analytics');
  }
  return response.json();
}

/**
 * Scraper detection heuristics
 */
export function isLikelyScraper(events: VisitorEvent[]): boolean {
  if (events.length === 0) return false;

  // Heuristic 1: No referer on 80%+ of detail page visits
  const detailPageEvents = events.filter(e =>
    e.path.match(/^\/minifigs\/[^/]+$/) || e.path.match(/^\/sets\/[^/]+$/)
  );
  const noRefererCount = detailPageEvents.filter(e => !e.referer).length;
  const noRefererRate = detailPageEvents.length > 0
    ? noRefererCount / detailPageEvents.length
    : 0;

  if (noRefererRate > 0.8) return true;

  // Heuristic 2: Rapid sequential page access (>10 pages/minute)
  const sortedEvents = [...events].sort((a, b) =>
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  if (sortedEvents.length >= 10) {
    const first = sortedEvents[0].timestamp.getTime();
    const tenth = sortedEvents[9].timestamp.getTime();
    const minutesBetween = (tenth - first) / 1000 / 60;

    if (minutesBetween < 1) return true; // 10+ pages in <1 minute
  }

  // Heuristic 3: Only visits detail pages, never browse/search pages
  const browsePages = events.filter(e =>
    e.path === '/' ||
    e.path === '/search' ||
    e.path.startsWith('/themes')
  );

  if (events.length > 5 && browsePages.length === 0) return true;

  return false;
}
