/**
 * Smart Bot Detection & Auto-Blocking System
 *
 * Automatically identifies and blocks IPs that behave like bots
 * Based on behavioral patterns, not just user-agent strings
 *
 * Bot Patterns Detected:
 * 1. Rapid sequential requests (faster than humanly possible)
 * 2. Direct detail page access with no referer (bypassing browse flow)
 * 3. No JavaScript execution (missing analytics/tracking calls)
 * 4. Repeated CAPTCHA failures
 * 5. Systematic URL pattern traversal (sw0001, sw0002, sw0003...)
 */

interface BotBehaviorTracker {
  requestTimestamps: number[];
  captchaAttempts: number;
  captchaFailures: number;
  noRefererCount: number;
  detailPageDirectHits: number;
  lastRequestPath: string;
  sequentialPattern: boolean;
  firstSeen: number;
  blacklisted: boolean;
  score: number; // Bot confidence score (0-100)
}

const ipBehavior = new Map<string, BotBehaviorTracker>();

// Clean up old entries every 5 minutes (memory management)
setInterval(() => {
  const now = Date.now();
  const EXPIRE_TIME = 30 * 60 * 1000; // 30 minutes
  for (const [ip, tracker] of ipBehavior.entries()) {
    if (now - tracker.firstSeen > EXPIRE_TIME && !tracker.blacklisted) {
      ipBehavior.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Track IP behavior and return bot confidence score
 * Score ranges: 0 = human, 100 = definitely bot
 */
export function trackBehavior(
  ip: string,
  pathname: string,
  referer: string | null,
  userAgent: string,
  isCaptchaPage: boolean = false
): { isBot: boolean; score: number; reason?: string } {
  const now = Date.now();

  // Get or create tracker
  let tracker = ipBehavior.get(ip);
  if (!tracker) {
    tracker = {
      requestTimestamps: [],
      captchaAttempts: 0,
      captchaFailures: 0,
      noRefererCount: 0,
      detailPageDirectHits: 0,
      lastRequestPath: '',
      sequentialPattern: false,
      firstSeen: now,
      blacklisted: false,
      score: 0,
    };
    ipBehavior.set(ip, tracker);
  }

  // Already blacklisted
  if (tracker.blacklisted) {
    return { isBot: true, score: 100, reason: 'Previously blacklisted' };
  }

  // Only track page navigations for speed/rate checks (not API calls)
  // API calls fire concurrently on every page load — counting them would
  // falsely flag real mobile users who load pages with multiple API requests
  const isApiRequest = pathname.startsWith('/api/');

  if (!isApiRequest) {
    // Track request timing (page navigations only)
    tracker.requestTimestamps.push(now);
    // Keep only last 20 requests
    if (tracker.requestTimestamps.length > 20) {
      tracker.requestTimestamps.shift();
    }
  }

  // PATTERN 1: Rapid page navigations (faster than 200ms between page loads)
  // 200ms is physically impossible for a human — click + network round trip alone takes longer.
  // 500ms was too low and caught fast browsers / users on good connections.
  if (!isApiRequest && tracker.requestTimestamps.length >= 5) {
    const recentRequests = tracker.requestTimestamps.slice(-5);
    const timeDiffs = recentRequests.slice(1).map((t, i) => t - recentRequests[i]);
    const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;

    if (avgDiff < 200) {
      tracker.score += 30;
    }
  }

  // PATTERN 2: Direct detail page hits with no referer
  // Real users regularly land on detail pages directly from Google, bookmarks, or shared links.
  // Only flag this when the count is very high — a scraper hits dozens, not 4 or 5.
  const isDetailPage = pathname.match(/^\/minifigs\/[^/]+$/) || pathname.match(/^\/sets\/[^/]+$/);
  if (isDetailPage && !referer) {
    tracker.noRefererCount++;
    tracker.detailPageDirectHits++;

    if (tracker.detailPageDirectHits > 15) {
      tracker.score += 25;
    }
  }

  // PATTERN 3: Sequential URL pattern (sw0001, sw0002, sw0003...)
  if (isDetailPage && tracker.lastRequestPath) {
    const currentMatch = pathname.match(/\/minifigs\/([a-z]+)(\d+)$/);
    const lastMatch = tracker.lastRequestPath.match(/\/minifigs\/([a-z]+)(\d+)$/);

    if (currentMatch && lastMatch) {
      const [, currentPrefix, currentNum] = currentMatch;
      const [, lastPrefix, lastNum] = lastMatch;

      // Same prefix, sequential numbers (sw0001 -> sw0002)
      if (currentPrefix === lastPrefix) {
        const numDiff = parseInt(currentNum) - parseInt(lastNum);
        if (Math.abs(numDiff) === 1) {
          tracker.sequentialPattern = true;
          tracker.score += 20;
        }
      }
    }
  }
  tracker.lastRequestPath = pathname;

  // PATTERN 4: CAPTCHA page hits (multiple = bot trying to bypass)
  if (isCaptchaPage) {
    tracker.captchaAttempts++;
    if (tracker.captchaAttempts > 3) {
      tracker.score += 15;
    }
  }

  // PATTERN 5: High page navigation rate (more than 60 page loads in 1 minute = 1/sec)
  // 20/min was too easy to hit by clicking quickly through a collection. 60/min is
  // physically impossible for a human browsing normally.
  const oneMinuteAgo = now - 60 * 1000;
  const recentCount = tracker.requestTimestamps.filter(t => t > oneMinuteAgo).length;
  if (recentCount > 60) {
    tracker.score += 30;
  }

  // PATTERN 6: Suspicious user agent patterns (even if not in blocklist)
  const suspiciousUAPatterns = ['python', 'curl', 'wget', 'scrapy', 'bot', 'crawler', 'spider'];
  if (suspiciousUAPatterns.some(p => userAgent.toLowerCase().includes(p))) {
    tracker.score += 20;
  }

  // Cap score at 100
  tracker.score = Math.min(tracker.score, 100);

  // Auto-blacklist if score exceeds threshold
  const BOT_THRESHOLD = 80;
  if (tracker.score >= BOT_THRESHOLD) {
    tracker.blacklisted = true;

    // Determine primary reason
    let reason = 'Multiple bot patterns detected';
    if (recentCount > 20) reason = 'High request rate (bot flooding)';
    else if (tracker.sequentialPattern) reason = 'Sequential URL traversal (scraper)';
    else if (tracker.detailPageDirectHits > 5) reason = 'Direct detail page hits (no browsing)';
    else if (tracker.captchaAttempts > 3) reason = 'Repeated CAPTCHA failures';

    return { isBot: true, score: tracker.score, reason };
  }

  return { isBot: false, score: tracker.score };
}

/**
 * Manually blacklist an IP
 */
export function blacklistIP(ip: string, reason: string) {
  const tracker = ipBehavior.get(ip);
  if (tracker) {
    tracker.blacklisted = true;
    tracker.score = 100;
  } else {
    ipBehavior.set(ip, {
      requestTimestamps: [Date.now()],
      captchaAttempts: 0,
      captchaFailures: 0,
      noRefererCount: 0,
      detailPageDirectHits: 0,
      lastRequestPath: '',
      sequentialPattern: false,
      firstSeen: Date.now(),
      blacklisted: true,
      score: 100,
    });
  }

  console.log(`[🚫 IP BLACKLISTED] ${ip} - Reason: ${reason}`);
}

/**
 * Check if IP is blacklisted
 */
export function isBlacklisted(ip: string): boolean {
  const tracker = ipBehavior.get(ip);
  return tracker?.blacklisted || false;
}

/**
 * Get current bot score for IP (for debugging/monitoring)
 */
export function getBotScore(ip: string): number {
  return ipBehavior.get(ip)?.score || 0;
}

/**
 * Get all currently tracked IPs (for admin dashboard)
 */
export function getAllTrackedIPs(): Array<{ ip: string; score: number; blacklisted: boolean }> {
  return Array.from(ipBehavior.entries()).map(([ip, tracker]) => ({
    ip,
    score: tracker.score,
    blacklisted: tracker.blacklisted,
  }));
}

/**
 * Reset/unblock an IP (for false positives)
 */
export function unblockIP(ip: string) {
  ipBehavior.delete(ip);
  console.log(`[✅ IP UNBLOCKED] ${ip}`);
}
