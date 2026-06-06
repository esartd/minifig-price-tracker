/**
 * IP Blocker - Automatic blocking of scrapers based on behavior patterns
 *
 * Monitors visitor behavior and automatically blocks IPs that exhibit:
 * - High page volume with no referer (80%+ no referer, 10+ pages)
 * - Rapid sequential access (10+ pages in 1 minute)
 * - Only detail page access (never browse/search)
 */

import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export interface BlockedIP {
  id: string;
  ip: string; // Hashed
  country: string;
  reason: string;
  firstSeen: Date;
  lastSeen: Date;
  totalRequests: number;
  blockedAt: Date;
  expiresAt: Date | null; // null = permanent
  active: boolean;
}

/**
 * Hash IP for storage
 */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.NEXTAUTH_SECRET).digest('hex').substring(0, 16);
}

/**
 * Check if an IP should be blocked based on recent behavior
 */
export async function shouldBlockIP(ip: string): Promise<{
  shouldBlock: boolean;
  reason: string | null;
}> {
  const hashedIP = hashIP(ip);

  // Check if already blocked
  const existingBlock = await prisma.$queryRawUnsafe<any[]>(`
    SELECT * FROM BlockedIP
    WHERE ip = ? AND active = 1
    AND (expiresAt IS NULL OR expiresAt > NOW())
    LIMIT 1
  `, hashedIP);

  if (existingBlock.length > 0) {
    return { shouldBlock: true, reason: 'Already blocked' };
  }

  // Get recent activity (last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const recentEvents = await prisma.visitorEvent.findMany({
    where: {
      ip: hashedIP,
      createdAt: {
        gte: fiveMinutesAgo,
      },
    },
    select: {
      path: true,
      referer: true,
      createdAt: true,
      eventType: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (recentEvents.length === 0) {
    return { shouldBlock: false, reason: null };
  }

  // Pattern 1: Rapid access (10+ pages in 1 minute)
  if (recentEvents.length >= 10) {
    const first = recentEvents[0].createdAt.getTime();
    const tenth = recentEvents[9].createdAt.getTime();
    const minutesBetween = (tenth - first) / 1000 / 60;

    if (minutesBetween < 1) {
      return {
        shouldBlock: true,
        reason: `Rapid access: ${recentEvents.length} pages in ${Math.round(minutesBetween * 60)} seconds`,
      };
    }
  }

  // Pattern 2: High no-referer rate on detail pages (80%+ no referer, 10+ pages)
  const detailPageEvents = recentEvents.filter(e =>
    e.path.match(/^\/minifigs\/[^/]+$/) || e.path.match(/^\/sets\/[^/]+$/)
  );

  if (detailPageEvents.length >= 10) {
    const noRefererCount = detailPageEvents.filter(e => !e.referer).length;
    const noRefererRate = noRefererCount / detailPageEvents.length;

    if (noRefererRate >= 0.8) {
      return {
        shouldBlock: true,
        reason: `Scraping pattern: ${Math.round(noRefererRate * 100)}% no referer (${noRefererCount}/${detailPageEvents.length} pages)`,
      };
    }
  }

  // Pattern 3: Only detail pages, never browse (20+ pages, 0 browse pages)
  if (recentEvents.length >= 20) {
    const browsePages = recentEvents.filter(e =>
      e.path === '/' ||
      e.path === '/search' ||
      e.path.startsWith('/themes') ||
      e.path.startsWith('/sets-themes')
    );

    if (browsePages.length === 0) {
      return {
        shouldBlock: true,
        reason: `Automated scraping: ${recentEvents.length} detail pages, 0 browse pages`,
      };
    }
  }

  return { shouldBlock: false, reason: null };
}

/**
 * Block an IP address
 */
export async function blockIP(
  ip: string,
  country: string,
  reason: string,
  durationHours: number | null = 24 // null = permanent
): Promise<void> {
  const hashedIP = hashIP(ip);

  // Get first and last seen times
  const events = await prisma.visitorEvent.findMany({
    where: { ip: hashedIP },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const firstSeen = events.length > 0 ? events[0].createdAt : new Date();
  const lastSeen = events.length > 0 ? events[events.length - 1].createdAt : new Date();
  const totalRequests = events.length;

  const expiresAt = durationHours ? new Date(Date.now() + durationHours * 60 * 60 * 1000) : null;

  // Insert block record
  await prisma.$executeRawUnsafe(`
    INSERT INTO BlockedIP (id, ip, country, reason, firstSeen, lastSeen, totalRequests, blockedAt, expiresAt, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 1)
    ON DUPLICATE KEY UPDATE
      lastSeen = VALUES(lastSeen),
      totalRequests = VALUES(totalRequests),
      reason = VALUES(reason),
      expiresAt = VALUES(expiresAt),
      active = 1
  `,
    `blk_${Date.now()}`,
    hashedIP,
    country,
    reason,
    firstSeen,
    lastSeen,
    totalRequests,
    expiresAt
  );

  console.log(`[IP BLOCKER] 🚫 Blocked IP ${hashedIP} from ${country}: ${reason}`);
}

/**
 * Check if an IP is blocked (for middleware)
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
  const hashedIP = hashIP(ip);

  const blocked = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id FROM BlockedIP
    WHERE ip = ? AND active = 1
    AND (expiresAt IS NULL OR expiresAt > NOW())
    LIMIT 1
  `, hashedIP);

  return blocked.length > 0;
}

/**
 * Unblock an IP address
 */
export async function unblockIP(ip: string): Promise<void> {
  const hashedIP = hashIP(ip);

  await prisma.$executeRawUnsafe(`
    UPDATE BlockedIP
    SET active = 0
    WHERE ip = ?
  `, hashedIP);

  console.log(`[IP BLOCKER] ✅ Unblocked IP ${hashedIP}`);
}

/**
 * Clean up expired blocks (run daily via cron)
 */
export async function cleanupExpiredBlocks(): Promise<number> {
  const result = await prisma.$executeRawUnsafe(`
    UPDATE BlockedIP
    SET active = 0
    WHERE active = 1
    AND expiresAt IS NOT NULL
    AND expiresAt < NOW()
  `);

  console.log(`[IP BLOCKER] 🧹 Cleaned up ${result} expired blocks`);
  return result as number;
}
