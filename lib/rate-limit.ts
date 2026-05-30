import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

export function getRateLimitKey(request: NextRequest): string {
  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || real || 'unknown';
  return ip;
}

export function checkRateLimit(ip: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();

  // Clean up old entries periodically
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(ip);

  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetIn = Math.ceil((current.resetTime - now) / 1000);
    return { allowed: false, resetIn };
  }

  current.count++;
  return { allowed: true };
}

// Block common bot user agents
export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // No user agent = likely bot

  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /java/i,
    /scrapy/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /puppeteer/i,
    /playwright/i,
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}

// Reusable rate limit middleware
export function rateLimitResponse(
  request: NextRequest,
  options: {
    maxRequests?: number;
    windowMs?: number;
    blockBots?: boolean;
  } = {}
): NextResponse | null {
  const { blockBots = true } = options;

  // Block bots/scrapers
  if (blockBots) {
    const userAgent = request.headers.get('user-agent');
    if (isBot(userAgent)) {
      console.log(`[RATE LIMIT] Blocked bot: ${userAgent} from ${getRateLimitKey(request)}`);
      return NextResponse.json(
        { success: false, error: 'Bots not allowed' },
        { status: 403 }
      );
    }
  }

  // Rate limiting
  const ip = getRateLimitKey(request);
  const rateCheck = checkRateLimit(ip);

  if (!rateCheck.allowed) {
    console.log(`[RATE LIMIT] IP ${ip} exceeded limit, reset in ${rateCheck.resetIn}s`);
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateCheck.resetIn
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.resetIn),
          'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + (rateCheck.resetIn || 0))
        }
      }
    );
  }

  // Rate limit passed
  return null;
}
