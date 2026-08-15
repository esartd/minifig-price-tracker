import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocaleFromHost } from '@/lib/i18n-subdomain'
import { tieredRateLimit, getTierForPath } from '@/lib/tiered-rate-limit'

// Whitelisted IPs — bypass all rate limiting (owner + localhost)
const WHITELISTED_IPS = [
  '73.52.155.221', // Erick
  '127.0.0.1',
  '::1',
];

// Verified crawlers — always allowed through, no rate limiting
// Cloudflare validates these via reverse-DNS, so user-agent matching is safe here
const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'linkedinbot',
  'discordbot',
  'slackbot',
  'chatgpt-user',
  'gptbot',
  'anthropic-ai',
  'claudebot',
  'perplexity',
  'amzn-searchbot',
  'sleepbot',
  'figtracker-cron',
]

// Tool-based user agents — no real browser sends these
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
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'petalbot',
  'bytespider',
  'crawler',
  'spider',
  'scraper',
  'bot',
]

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // Always pass health checks, robots.txt, and the Stripe webhook (auth is
  // via signature verification inside the route, not UA/IP -- Stripe's
  // webhook senders share an IP pool across all merchants and would
  // otherwise trip rate limiting or a bot-detection rule below)
  if (pathname === '/api/health' || pathname === '/robots.txt' || pathname === '/api/stripe/webhook') {
    return NextResponse.next()
  }

  // Block empty user agents — no real browser omits this
  if (!userAgent || userAgent.trim() === '') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Always allow verified crawlers (SEO, social previews, AI indexers)
  const isLegitimateBot = ALLOWED_BOTS.some(p => userAgent.includes(p))
  if (isLegitimateBot) {
    const response = NextResponse.next()
    response.headers.set('x-locale', getLocaleFromHost(hostname))
    return response
  }

  // Block known scraping tools by user agent string
  // These are reliable signals — no real browser identifies itself this way
  const isSuspiciousBot = BLOCKED_USER_AGENTS.some(p => userAgent.includes(p))
  if (isSuspiciousBot) {
    console.log(`[🚫 BOT UA] IP: ${request.headers.get('cf-connecting-ip') || 'unknown'} | UA: ${userAgent.substring(0, 100)} | Path: ${pathname}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  const ip = request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Rate limiting — last-resort backstop only
  // Cloudflare Bot Fight Mode handles the real bot traffic before it reaches here
  if (!WHITELISTED_IPS.includes(ip)) {
    const { tier, config } = getTierForPath(pathname)
    if (tier !== 'STATIC') {
      const { allowed, resetIn } = tieredRateLimit(ip, tier, config)
      if (!allowed) {
        console.log(`[⚠️ RATE LIMITED] IP: ${ip} | Path: ${pathname}`)
        const response = new NextResponse('Too Many Requests', { status: 429 })
        if (resetIn) response.headers.set('Retry-After', Math.ceil(resetIn / 1000).toString())
        return response
      }
    }
  }

  // Set locale for server components
  const locale = getLocaleFromHost(hostname)
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|catalog|avatars|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
