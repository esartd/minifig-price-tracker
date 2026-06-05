import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocaleFromHost } from '@/lib/i18n-subdomain'
import { tieredRateLimit, getTierForPath } from '@/lib/tiered-rate-limit'

// Whitelisted IPs (no rate limiting)
const WHITELISTED_IPS = [
  '73.52.155.221', // User's IP (Erick)
];

// Legitimate search engine bots that should ALWAYS be allowed
const ALLOWED_BOTS = [
  'googlebot',           // Google Search
  'bingbot',             // Bing Search
  'slurp',               // Yahoo Search
  'duckduckbot',         // DuckDuckGo
  'baiduspider',         // Baidu (China)
  'yandexbot',           // Yandex (Russia)
  'facebookexternalhit', // Facebook crawler (for link previews)
  'twitterbot',          // Twitter crawler (for link previews)
  'whatsapp',            // WhatsApp link previews
  'telegrambot',         // Telegram link previews
  'applebot',            // Apple Search / Siri
  'linkedinbot',         // LinkedIn link previews
  'discordbot',          // Discord link previews
  'slackbot',            // Slack link previews
]

// Common scraper/bot user agents to block (excluding legitimate search engines)
const BLOCKED_USER_AGENTS = [
  'headless',
  'scrapy',
  'python-requests',
  'axios',
  'curl',
  'wget',
  'httpclient',
  'okhttp',
  'java/',
  'go-http-client',
  'selenium',
  'puppeteer',
  'playwright',
  'phantom',
  'ahrefsbot',        // SEO crawler
  'semrushbot',       // SEO crawler
  'mj12bot',          // Majestic SEO
  'dotbot',           // Moz
  'petalbot',         // Huawei search
  'bytespider',       // TikTok/ByteDance
  'claudebot',        // Anthropic
  'gptbot',           // OpenAI
  'chatgpt',          // OpenAI
  // Block generic patterns only if they don't match allowed bots
  'crawler',
  'spider',
  'scraper',
  'bot',              // Generic bot pattern (will be checked AFTER legitimate bots)
]

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // Always allow health check endpoint (for deployment monitoring)
  if (pathname === '/api/health') {
    const response = NextResponse.next()
    return response
  }

  // Always allow robots.txt (bots need to read it to know they're blocked)
  if (pathname === '/robots.txt') {
    const response = NextResponse.next()
    return response
  }

  // Get IP address for rate limiting
  // Cloudflare sends real IP in cf-connecting-ip header
  const ip = request.headers.get('cf-connecting-ip') ||
              request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
              request.headers.get('x-real-ip') ||
              'unknown';

  // Block requests with no user agent (common bot behavior)
  if (!userAgent || userAgent.trim() === '') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ALWAYS allow legitimate search engines (check first, highest priority)
  const isLegitimateBot = ALLOWED_BOTS.some(pattern =>
    userAgent.includes(pattern.toLowerCase())
  )

  if (isLegitimateBot) {
    // Allow search engines - they need to index our content
    const response = NextResponse.next()
    response.headers.set('x-locale', getLocaleFromHost(hostname))
    return response
  }

  // Skip rate limiting for whitelisted IPs
  if (!WHITELISTED_IPS.includes(ip)) {
    // Tiered rate limiting based on path cost
    const pathname = request.nextUrl.pathname;
    const { tier, config } = getTierForPath(pathname);

    // Skip rate limiting for static assets
    if (tier !== 'STATIC') {
      const { allowed, resetIn } = tieredRateLimit(ip, tier, config);

      if (!allowed) {
        const response = new NextResponse('Too Many Requests', { status: 429 });
        if (resetIn) {
          response.headers.set('Retry-After', Math.ceil(resetIn / 1000).toString());
        }
        return response;
      }
    }
  }

  // Block requests with suspicious user agents (only if not a legitimate bot)
  const isSuspiciousBot = BLOCKED_USER_AGENTS.some(pattern =>
    userAgent.includes(pattern.toLowerCase())
  )

  if (isSuspiciousBot) {
    console.log(`[🚫 BOT BLOCKED] IP: ${ip} | UA: ${userAgent.substring(0, 100)} | Path: ${pathname}`)
    // Return 403 Forbidden for scrapers
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Enhanced bot detection: Check for rapid page access without typical user behavior
  // Bots often visit detail pages directly without referrer
  const referer = request.headers.get('referer') || '';
  const isDetailPage = pathname.match(/^\/minifigs\/[^/]+$/) || pathname.match(/^\/sets\/[^/]+$/);

  // AGGRESSIVE: Block direct detail page access with NO referer (likely scraper)
  // Real users come from:
  //   1. Search engines (google.com, bing.com) - have referer
  //   2. Browse pages on our site (figtracker.ericksu.com) - have referer
  //   3. Social media (twitter, reddit) - have referer
  // Scrapers: Direct typed URLs or scripts - NO referer
  //
  // Exception: Allow if user is coming from our own site (internal navigation)
  const isInternalReferer = referer && referer.includes('figtracker.ericksu.com');
  const hasReferer = referer && referer.length > 0;

  // Block: Detail page + no referer at all = scraper
  if (isDetailPage && !hasReferer && !WHITELISTED_IPS.includes(ip)) {
    console.log(`[🚫 SCRAPER BLOCKED] IP: ${ip} | No referer on detail page | UA: ${userAgent.substring(0, 100)} | Path: ${pathname}`)
    return new NextResponse('Forbidden - Direct access not allowed', { status: 403 })
  }

  // Get locale from subdomain
  const locale = getLocaleFromHost(hostname)

  // Set locale in response headers for server components to read
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)

  return response
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (catalog, avatars, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|catalog|avatars|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
