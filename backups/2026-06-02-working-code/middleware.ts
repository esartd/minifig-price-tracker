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

// Singapore IP ranges (major blocks - common bot/scraper sources)
// Source: APNIC registry for Singapore
const SINGAPORE_IP_RANGES = [
  { start: '1.32.0.0', end: '1.47.255.255' },          // SingNet
  { start: '14.0.0.0', end: '14.127.255.255' },        // Various ISPs
  { start: '27.50.0.0', end: '27.63.255.255' },        // StarHub
  { start: '42.60.0.0', end: '42.63.255.255' },        // AWS Singapore
  { start: '43.224.0.0', end: '43.255.255.255' },      // Various cloud providers
  { start: '45.64.0.0', end: '45.127.255.255' },       // Cloud/datacenter ranges
  { start: '49.128.0.0', end: '49.159.255.255' },      // Various ISPs
  { start: '54.169.0.0', end: '54.169.255.255' },      // AWS Singapore
  { start: '58.185.0.0', end: '58.191.255.255' },      // Various ISPs
  { start: '103.0.0.0', end: '103.255.255.255' },      // Singapore cloud/datacenter
  { start: '116.0.0.0', end: '116.31.255.255' },       // Various ISPs
  { start: '122.10.0.0', end: '122.11.255.255' },      // M1
  { start: '124.158.0.0', end: '124.158.255.255' },    // NUS
  { start: '128.199.0.0', end: '128.199.255.255' },    // DigitalOcean Singapore
  { start: '137.132.0.0', end: '137.132.255.255' },    // NTU
  { start: '139.180.128.0', end: '139.180.255.255' },  // Vultr Singapore
  { start: '156.146.32.0', end: '156.146.63.255' },    // Singtel
  { start: '172.104.160.0', end: '172.104.191.255' },  // Linode Singapore
  { start: '175.156.0.0', end: '175.159.255.255' },    // Various ISPs
  { start: '182.160.0.0', end: '182.191.255.255' },    // Various ISPs
  { start: '202.156.0.0', end: '202.159.255.255' },    // Various ISPs
  { start: '203.116.0.0', end: '203.127.255.255' },    // Various ISPs
  { start: '223.25.0.0', end: '223.27.255.255' },      // StarHub
]

// Convert IP string to number for range checking
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
}

// Check if IP is in Singapore ranges
function isSingaporeIP(ip: string): boolean {
  const ipNum = ipToNumber(ip)
  return SINGAPORE_IP_RANGES.some(range => {
    const startNum = ipToNumber(range.start)
    const endNum = ipToNumber(range.end)
    return ipNum >= startNum && ipNum <= endNum
  })
}

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

  // Get IP address for geographic blocking
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
              request.headers.get('x-real-ip') ||
              'unknown';

  // Block Singapore traffic (before user-agent checks)
  // Note: Legitimate search engines are allowed later in the flow
  if (ip !== 'unknown' && isSingaporeIP(ip)) {
    return new NextResponse('Forbidden - Geographic Restriction', { status: 403 })
  }

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
