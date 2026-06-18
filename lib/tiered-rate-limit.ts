// Tiered rate limiting - different limits based on request cost
// Protects expensive operations while allowing free browsing

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest?: number; // For burst protection
}

const ipRequests = new Map<string, Map<string, RateLimitEntry>>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, tiers] of ipRequests.entries()) {
    for (const [tier, entry] of tiers.entries()) {
      if (entry.resetTime < now) {
        tiers.delete(tier);
      }
    }
    if (tiers.size === 0) {
      ipRequests.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstMax?: number; // Optional: max requests in burst window
  burstWindowMs?: number; // Optional: burst window (e.g., 10 seconds)
}

export function tieredRateLimit(
  ip: string,
  tier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn?: number } {
  const now = Date.now();

  // Get or create tier map for this IP
  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, new Map());
  }
  const tiers = ipRequests.get(ip)!;

  // Get or create entry for this tier
  let entry = tiers.get(tier);

  // No existing entry or expired - create new
  if (!entry || entry.resetTime < now) {
    tiers.set(tier, {
      count: 1,
      resetTime: now + config.windowMs,
      lastRequest: now,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Burst protection (if configured)
  if (config.burstMax && config.burstWindowMs && entry.lastRequest) {
    const timeSinceLastRequest = now - entry.lastRequest;
    if (timeSinceLastRequest < config.burstWindowMs) {
      // Calculate burst window count
      const burstWindowStart = now - config.burstWindowMs;
      // Simple approximation: if multiple requests in burst window, deny
      if (entry.count >= config.burstMax && entry.resetTime > burstWindowStart) {
        return {
          allowed: false,
          remaining: 0,
          resetIn: entry.resetTime - now,
        };
      }
    }
  }

  // Increment count
  entry.count++;
  entry.lastRequest = now;

  // Check if over sustained limit
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

// Predefined tier configurations
export const RATE_LIMIT_TIERS = {
  // Regular pages (cached, cheap to serve)
  PAGES: {
    maxRequests: 300,
    windowMs: 60 * 1000, // 1 minute
  },

  // Search (moderate cost, users type quickly)
  SEARCH: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    burstMax: 20, // Max 20 requests in 10 seconds
    burstWindowMs: 10 * 1000,
  },

  // Collection/Profile pages (database queries)
  COLLECTION: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },

  // Normal API endpoints (database lookups)
  API_NORMAL: {
    maxRequests: 60,
    windowMs: 60 * 1000,
  },

  // BrickLink pricing API (CRITICAL: Must respect 3-second delays)
  // 20 requests per minute = 1 request every 3 seconds
  // This enforces BrickLink API compliance
  API_PRICING: {
    maxRequests: 20,
    windowMs: 60 * 1000,
    burstMax: 3, // Max 3 requests in 10 seconds (prevents rapid-fire)
    burstWindowMs: 10 * 1000,
  },

  // Database write operations (expensive)
  API_WRITE: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },

  // Cron/Admin endpoints (very expensive)
  API_CRON: {
    maxRequests: 5,
    windowMs: 60 * 1000,
  },

  // User authentication endpoints
  AUTH: {
    maxRequests: 30,
    windowMs: 60 * 1000,
    burstMax: 5, // Prevent brute force
    burstWindowMs: 10 * 1000,
  },
} as const;

// Helper to determine tier from pathname
export function getTierForPath(pathname: string): { tier: string; config: RateLimitConfig } {
  // Static assets - no rate limiting needed
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/avatars') ||
    pathname.startsWith('/catalog') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return {
      tier: 'STATIC',
      config: { maxRequests: 999999, windowMs: 1000 }, // Effectively unlimited
    };
  }

  // Cron/Admin endpoints (most restrictive)
  if (pathname.startsWith('/api/cron')) {
    return { tier: 'API_CRON', config: RATE_LIMIT_TIERS.API_CRON };
  }

  // BrickLink pricing API (CRITICAL: 3-second delays)
  if (
    pathname.includes('/api/minifigs/') && pathname.endsWith('/pricing') ||
    pathname.startsWith('/api/refresh-pricing') ||
    pathname.startsWith('/api/sets/') && pathname.endsWith('/pricing')
  ) {
    return { tier: 'API_PRICING', config: RATE_LIMIT_TIERS.API_PRICING };
  }

  // Database write operations
  if (
    pathname.startsWith('/api/collection') && ['POST', 'PUT', 'DELETE'].some(m => pathname.includes(m)) ||
    pathname.startsWith('/api/inventory') && ['POST', 'PUT', 'DELETE'].some(m => pathname.includes(m)) ||
    pathname.startsWith('/api/wishlist') && ['POST', 'PUT', 'DELETE'].some(m => pathname.includes(m))
  ) {
    return { tier: 'API_WRITE', config: RATE_LIMIT_TIERS.API_WRITE };
  }

  // Authentication endpoints
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/signup')
  ) {
    return { tier: 'AUTH', config: RATE_LIMIT_TIERS.AUTH };
  }

  // Search endpoints
  if (pathname.startsWith('/search') || pathname.startsWith('/api/search')) {
    return { tier: 'SEARCH', config: RATE_LIMIT_TIERS.SEARCH };
  }

  // Collection/Profile pages
  if (
    pathname.startsWith('/collection') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/sets-collection') ||
    pathname.startsWith('/sets-inventory') ||
    pathname.startsWith('/account')
  ) {
    return { tier: 'COLLECTION', config: RATE_LIMIT_TIERS.COLLECTION };
  }

  // API endpoints (general)
  if (pathname.startsWith('/api/')) {
    return { tier: 'API_NORMAL', config: RATE_LIMIT_TIERS.API_NORMAL };
  }

  // Regular pages (most generous)
  return { tier: 'PAGES', config: RATE_LIMIT_TIERS.PAGES };
}
