// Simple in-memory rate limiter
// For production use with multiple servers, consider Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const ipRequests = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRequests.entries()) {
    if (entry.resetTime < now) {
      ipRequests.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export function rateLimit(
  ip: string,
  maxRequests: number = 100, // Max requests per window
  windowMs: number = 60 * 1000 // 1 minute window
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipRequests.get(ip);

  // No existing entry or expired - create new
  if (!entry || entry.resetTime < now) {
    ipRequests.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - entry.count };
}
