import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocaleFromHost } from '@/lib/i18n-subdomain'
import { rateLimit } from '@/lib/rate-limit'

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

  // Rate limiting (before bot check to catch aggressive scrapers)
  const { allowed } = rateLimit(ip, 100, 60 * 1000); // 100 requests per minute

  if (!allowed) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Block requests with suspicious user agents (only if not a legitimate bot)
  const isSuspiciousBot = BLOCKED_USER_AGENTS.some(pattern =>
    userAgent.includes(pattern.toLowerCase())
  )

  if (isSuspiciousBot) {
    // Return 403 Forbidden for scrapers
    return new NextResponse('Forbidden', { status: 403 })
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
