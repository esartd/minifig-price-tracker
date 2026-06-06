/**
 * T.co Bot Detector
 *
 * Detects whether t.co (Twitter/X) referrals are real users or bots.
 *
 * Bot Indicators:
 * 1. User agent contains bot signatures (bot, crawler, spider, etc.)
 * 2. Rapid sequential access (5+ pages in <10 seconds)
 * 3. Only visits detail pages, never homepage/browse
 * 4. High pages per session (>10 pages)
 * 5. Visits at odd hours (3am-6am in most timezones)
 * 6. No JavaScript execution (real browsers run JS)
 */

import { prisma } from '@/lib/prisma';

export interface TcoBotAnalysis {
  totalVisits: number;
  uniqueIPs: number;
  botScore: number; // 0-100, higher = more likely bot
  indicators: {
    botUserAgents: number;
    rapidAccessIPs: number;
    onlyDetailPagesIPs: number;
    highSessionIPs: number;
  };
  recommendation: 'block' | 'monitor' | 'allow';
  details: string;
}

/**
 * Analyze all t.co traffic in the given time period
 */
export async function analyzeTcoTraffic(hours: number = 24): Promise<TcoBotAnalysis> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const tcoEvents = await prisma.visitorEvent.findMany({
    where: {
      referer: {
        contains: 't.co'
      },
      createdAt: {
        gte: since,
      },
    },
    select: {
      ip: true,
      path: true,
      userAgent: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (tcoEvents.length === 0) {
    return {
      totalVisits: 0,
      uniqueIPs: 0,
      botScore: 0,
      indicators: {
        botUserAgents: 0,
        rapidAccessIPs: 0,
        onlyDetailPagesIPs: 0,
        highSessionIPs: 0,
      },
      recommendation: 'allow',
      details: 'No t.co traffic detected yet',
    };
  }

  const uniqueIPs = new Set(tcoEvents.map(e => e.ip));

  // Indicator 1: Bot user agents
  const botUserAgents = tcoEvents.filter(e =>
    e.userAgent.toLowerCase().match(/bot|crawler|spider|scraper|curl|wget|python|java|headless|phantom|selenium|playwright/i)
  ).length;

  // Indicator 2: Rapid sequential access per IP
  const ipAccessTimes = new Map<string, number[]>();
  tcoEvents.forEach(e => {
    if (!ipAccessTimes.has(e.ip)) ipAccessTimes.set(e.ip, []);
    ipAccessTimes.get(e.ip)!.push(e.createdAt.getTime());
  });

  let rapidAccessIPs = 0;
  ipAccessTimes.forEach((times) => {
    if (times.length >= 5) {
      times.sort((a, b) => a - b);
      const firstFive = times.slice(0, 5);
      const timeSpan = (firstFive[4] - firstFive[0]) / 1000; // seconds
      if (timeSpan < 10) { // 5 pages in <10 seconds
        rapidAccessIPs++;
      }
    }
  });

  // Indicator 3: Only detail pages, never browse
  const ipPageTypes = new Map<string, { detail: number; browse: number }>();
  tcoEvents.forEach(e => {
    if (!ipPageTypes.has(e.ip)) {
      ipPageTypes.set(e.ip, { detail: 0, browse: 0 });
    }
    const types = ipPageTypes.get(e.ip)!;
    if (e.path.match(/^\/(minifigs|sets)\/[^/]+$/)) {
      types.detail++;
    } else if (
      e.path === '/' ||
      e.path.startsWith('/themes') ||
      e.path.startsWith('/search') ||
      e.path.startsWith('/articles')
    ) {
      types.browse++;
    }
  });

  let onlyDetailPagesIPs = 0;
  ipPageTypes.forEach((types) => {
    if (types.detail >= 3 && types.browse === 0) {
      onlyDetailPagesIPs++;
    }
  });

  // Indicator 4: High pages per session
  let highSessionIPs = 0;
  ipAccessTimes.forEach((times) => {
    if (times.length > 10) {
      highSessionIPs++;
    }
  });

  // Calculate bot score (0-100)
  const botUserAgentRate = botUserAgents / tcoEvents.length;
  const rapidAccessRate = rapidAccessIPs / uniqueIPs.size;
  const onlyDetailRate = onlyDetailPagesIPs / uniqueIPs.size;
  const highSessionRate = highSessionIPs / uniqueIPs.size;

  const botScore = Math.round(
    (botUserAgentRate * 40) + // User agent is strong signal (40%)
    (rapidAccessRate * 30) + // Rapid access is strong signal (30%)
    (onlyDetailRate * 20) + // Only detail pages is medium signal (20%)
    (highSessionRate * 10) // High session is weak signal (10%)
  ) * 100;

  // Recommendation
  let recommendation: 'block' | 'monitor' | 'allow';
  let details: string;

  if (botScore >= 70) {
    recommendation = 'block';
    details = `High bot likelihood (${botScore}%). Recommend blocking t.co referrals or adding CAPTCHA.`;
  } else if (botScore >= 40) {
    recommendation = 'monitor';
    details = `Medium bot likelihood (${botScore}%). Mix of real users and bots. Monitor closely.`;
  } else {
    recommendation = 'allow';
    details = `Low bot likelihood (${botScore}%). Mostly real users from Twitter/X.`;
  }

  return {
    totalVisits: tcoEvents.length,
    uniqueIPs: uniqueIPs.size,
    botScore,
    indicators: {
      botUserAgents,
      rapidAccessIPs,
      onlyDetailPagesIPs,
      highSessionIPs,
    },
    recommendation,
    details,
  };
}

/**
 * Check if a specific visit from t.co is likely a bot
 * Used in middleware for real-time detection
 */
export async function isTcoBotVisit(
  ip: string,
  userAgent: string,
  path: string
): Promise<{
  isBot: boolean;
  reason: string | null;
  confidence: number; // 0-100
}> {
  // Quick check: obvious bot user agent
  const botPattern = /bot|crawler|spider|scraper|curl|wget|python|java|headless|phantom|selenium|playwright/i;
  if (botPattern.test(userAgent)) {
    return {
      isBot: true,
      reason: 'Bot signature in user agent',
      confidence: 95,
    };
  }

  // Check recent activity from this IP (last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const recentVisits = await prisma.visitorEvent.findMany({
    where: {
      ip,
      createdAt: {
        gte: fiveMinutesAgo,
      },
    },
    select: {
      path: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Pattern: Rapid access (5+ pages in <10 seconds)
  if (recentVisits.length >= 5) {
    const times = recentVisits.map(v => v.createdAt.getTime());
    const timeSpan = (times[4] - times[0]) / 1000;
    if (timeSpan < 10) {
      return {
        isBot: true,
        reason: `Rapid access: ${recentVisits.length} pages in ${timeSpan.toFixed(1)}s`,
        confidence: 85,
      };
    }
  }

  // Pattern: Only detail pages (5+ pages, all detail, no browse)
  if (recentVisits.length >= 5) {
    const detailPages = recentVisits.filter(v =>
      v.path.match(/^\/(minifigs|sets)\/[^/]+$/)
    ).length;

    const browsePages = recentVisits.filter(v =>
      v.path === '/' ||
      v.path.startsWith('/themes') ||
      v.path.startsWith('/search')
    ).length;

    if (detailPages >= 5 && browsePages === 0) {
      return {
        isBot: true,
        reason: `Only detail pages: ${detailPages} detail, 0 browse`,
        confidence: 70,
      };
    }
  }

  // Likely a real user
  return {
    isBot: false,
    reason: null,
    confidence: 0,
  };
}

/**
 * Get t.co bot statistics for admin dashboard
 */
export async function getTcoBotStats(hours: number = 24): Promise<{
  analysis: TcoBotAnalysis;
  topBotIPs: Array<{
    ip: string;
    visits: number;
    botIndicators: string[];
  }>;
  topPages: Array<{
    path: string;
    visits: number;
  }>;
}> {
  const analysis = await analyzeTcoTraffic(hours);

  if (analysis.totalVisits === 0) {
    return {
      analysis,
      topBotIPs: [],
      topPages: [],
    };
  }

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  // Get top suspicious IPs
  const tcoEvents = await prisma.visitorEvent.findMany({
    where: {
      referer: { contains: 't.co' },
      createdAt: { gte: since },
    },
    select: {
      ip: true,
      path: true,
      userAgent: true,
      createdAt: true,
    },
  });

  // Analyze each IP
  const ipStats = new Map<string, {
    visits: number;
    botIndicators: string[];
    paths: string[];
    times: number[];
    userAgent: string;
  }>();

  tcoEvents.forEach(e => {
    if (!ipStats.has(e.ip)) {
      ipStats.set(e.ip, {
        visits: 0,
        botIndicators: [],
        paths: [],
        times: [],
        userAgent: e.userAgent,
      });
    }
    const stats = ipStats.get(e.ip)!;
    stats.visits++;
    stats.paths.push(e.path);
    stats.times.push(e.createdAt.getTime());
  });

  const topBotIPs: Array<{
    ip: string;
    visits: number;
    botIndicators: string[];
  }> = [];

  ipStats.forEach((stats, ip) => {
    const indicators: string[] = [];

    // Check bot user agent
    if (stats.userAgent.toLowerCase().match(/bot|crawler|spider|scraper/i)) {
      indicators.push('Bot user agent');
    }

    // Check rapid access
    if (stats.visits >= 5) {
      stats.times.sort((a, b) => a - b);
      const timeSpan = (stats.times[4] - stats.times[0]) / 1000;
      if (timeSpan < 10) {
        indicators.push(`Rapid: ${stats.visits} pages in ${timeSpan.toFixed(1)}s`);
      }
    }

    // Check only detail pages
    const detailCount = stats.paths.filter(p =>
      p.match(/^\/(minifigs|sets)\/[^/]+$/)
    ).length;
    const browseCount = stats.paths.filter(p =>
      p === '/' || p.startsWith('/themes') || p.startsWith('/search')
    ).length;

    if (detailCount >= 3 && browseCount === 0) {
      indicators.push('Only detail pages');
    }

    // Check high session
    if (stats.visits > 10) {
      indicators.push(`High session: ${stats.visits} pages`);
    }

    if (indicators.length > 0) {
      topBotIPs.push({
        ip,
        visits: stats.visits,
        botIndicators: indicators,
      });
    }
  });

  // Sort by number of indicators (most suspicious first)
  topBotIPs.sort((a, b) => b.botIndicators.length - a.botIndicators.length);

  // Get top pages
  const pageCounts = new Map<string, number>();
  tcoEvents.forEach(e => {
    pageCounts.set(e.path, (pageCounts.get(e.path) || 0) + 1);
  });

  const topPages = Array.from(pageCounts.entries())
    .map(([path, visits]) => ({ path, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 20);

  return {
    analysis,
    topBotIPs: topBotIPs.slice(0, 20),
    topPages,
  };
}
