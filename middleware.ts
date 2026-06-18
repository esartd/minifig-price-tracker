import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac } from 'crypto'
import { getLocaleFromHost } from '@/lib/i18n-subdomain'
import { tieredRateLimit, getTierForPath } from '@/lib/tiered-rate-limit'
import { trackBehavior, isBlacklisted } from '@/lib/smart-bot-detector'
import { isHistoricalBot } from '@/lib/historical-bot-blocklist'

// Whitelisted IPs (no rate limiting)
const WHITELISTED_IPS = [
  '73.52.155.221', // User's IP (Erick)
  '127.0.0.1',     // localhost dev
  '::1',           // localhost IPv6
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
  'chatgpt-user',        // OpenAI ChatGPT indexing
  'gptbot',              // OpenAI GPT crawler
  'anthropic-ai',        // Anthropic Claude crawler
  'claudebot',           // Anthropic Claude bot
  'perplexity',          // Perplexity AI
  'amzn-searchbot',      // Amazon search bot
  'sleepbot',            // Website monitoring (allow for uptime checks)
  'figtracker-cron',     // Internal cron jobs (price refresh, backups, etc.)
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

  // AGGRESSIVE RATE LIMITING for high-risk regions (Singapore, China, Russia, etc.)
  // These regions have 573 bot users vs 9 from New York - clearly scrapers
  const cloudflareCountry = request.headers.get('cf-ipcountry') || '';
  const HIGH_RISK_COUNTRIES = ['SG', 'CN', 'RU', 'IN', 'VN', 'ID', 'PH'];
  const isHighRisk = HIGH_RISK_COUNTRIES.includes(cloudflareCountry);

  // SMART BLOCKING: Block known hosting providers & data centers (not residential ISPs)
  // These ASNs (Autonomous System Numbers) are used by bot operators, not real users
  // Real Singapore users use: Singtel (AS4657), StarHub (AS4657), M1 (AS9658)
  const cloudflareASN = request.headers.get('cf-asn') || '';

  const BLOCKED_ASNS = [
    // Singapore bot networks (Tencent Cloud + proxies) - 99% of current bot traffic
    'AS132203', // Tencent Cloud (majority of bot traffic from SG)
    'AS212238', // Datacamp Limited (hosting/proxy service)
    'AS139628', // Mega Truenet (VPS provider)
    'AS150436', // Byteplus (TikTok's cloud service)
    '132203',   // Same as above but without 'AS' prefix (Cloudflare format varies)
    '212238',
    '139628',
    '150436',

    // Known proxy/scraping services (not general hosting)
    'AS208843', // Alpha Strike Labs (proxy service)
    'AS206092', // Oxylabs (commercial scraping service)
    'AS212695', // Smartproxy (scraping service)
    '208843',
    '206092',
    '212695',
  ];

  // ASN blocking (if Cloudflare provides ASN header)
  if (cloudflareASN && BLOCKED_ASNS.some(asn => cloudflareASN.includes(asn)) && !WHITELISTED_IPS.includes(ip)) {
    console.log(`[🚫 ASN BLOCKED] ASN: ${cloudflareASN} | Country: ${cloudflareCountry} | IP: ${ip} | Path: ${pathname}`)
    return new NextResponse('Access from hosting providers is not permitted', { status: 403 });
  }

  // BACKUP: IP Range blocking for Tencent Cloud (in case ASN header not available)
  // Tencent Cloud Singapore IP ranges: 43.128.0.0/14, 43.132.0.0/14, 43.152.0.0/14, 43.156.0.0/14
  // 43.163.0.0/16, 43.172.0.0/14, 43.176.0.0/13
  const TENCENT_IP_RANGES = [
    { start: '43.128.0.0', end: '43.131.255.255' },    // 43.128.0.0/14
    { start: '43.132.0.0', end: '43.135.255.255' },    // 43.132.0.0/14
    { start: '43.152.0.0', end: '43.155.255.255' },    // 43.152.0.0/14
    { start: '43.156.0.0', end: '43.159.255.255' },    // 43.156.0.0/14
    { start: '43.163.0.0', end: '43.163.255.255' },    // 43.163.0.0/16
    { start: '43.172.0.0', end: '43.175.255.255' },    // 43.172.0.0/14
    { start: '43.176.0.0', end: '43.183.255.255' },    // 43.176.0.0/13
  ];

  function isInRange(ip: string, start: string, end: string): boolean {
    const ipNum = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    const startNum = start.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    const endNum = end.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    return ipNum >= startNum && ipNum <= endNum;
  }

  if (!WHITELISTED_IPS.includes(ip)) {
    for (const range of TENCENT_IP_RANGES) {
      if (isInRange(ip, range.start, range.end)) {
        console.log(`[🚫 TENCENT CLOUD BLOCKED] IP: ${ip} | Country: ${cloudflareCountry} | Path: ${pathname}`)
        return new NextResponse('Access from Tencent Cloud is not permitted', { status: 403 });
      }
    }
  }

  // HISTORICAL BOT BLOCKLIST: Block known bots from past activity
  // These IPs exhibited bot behavior before (CAPTCHA failures, suspicious patterns)
  if (!WHITELISTED_IPS.includes(ip) && isHistoricalBot(ip)) {
    console.log(`[🚫 HISTORICAL BOT] IP: ${ip} | Known bot from past activity | Path: ${pathname}`)
    return new NextResponse('Access denied: Known bot', { status: 403 });
  }

  // SMART BOT DETECTION: Track behavior and auto-block suspicious IPs
  // This catches bots that bypass ASN blocks (residential proxies, etc.)
  if (!WHITELISTED_IPS.includes(ip)) {
    // Check if already blacklisted
    if (isBlacklisted(ip)) {
      console.log(`[🤖 AUTO-BLOCKED] IP: ${ip} | Previously identified as bot | Path: ${pathname}`)
      return new NextResponse('Automated access detected', { status: 403 });
    }

    // Track this request and check if it looks like a bot
    const isCaptchaPage = pathname === '/verify-human';
    const referer = request.headers.get('referer') || '';
    const botCheck = trackBehavior(ip, pathname, referer, userAgent, isCaptchaPage);

    if (botCheck.isBot) {
      console.log(`[🤖 AUTO-BLOCKED] IP: ${ip} | Score: ${botCheck.score}/100 | Reason: ${botCheck.reason} | Path: ${pathname}`)
      return new NextResponse(`Automated access detected: ${botCheck.reason}`, { status: 403 });
    }

    // Log high-risk IPs (not blocked yet, but suspicious)
    if (botCheck.score > 40) {
      console.log(`[⚠️  HIGH BOT SCORE] IP: ${ip} | Score: ${botCheck.score}/100 | Path: ${pathname}`)
    }
  }

  // Skip rate limiting for whitelisted IPs
  if (!WHITELISTED_IPS.includes(ip)) {
    // Tiered rate limiting based on path cost
    const pathname = request.nextUrl.pathname;
    const { tier, config } = getTierForPath(pathname);

    // Skip rate limiting for static assets
    if (tier !== 'STATIC') {
      // Apply 5x stricter limits for high-risk countries
      const adjustedConfig = isHighRisk ? {
        ...config,
        maxRequests: Math.floor(config.maxRequests / 5), // 5x stricter
        burstMax: config.burstMax ? Math.floor(config.burstMax / 5) : undefined,
      } : config;

      const { allowed, resetIn } = tieredRateLimit(ip, tier, adjustedConfig);

      if (!allowed) {
        console.log(`[⚠️  RATE LIMITED] IP: ${ip} | Country: ${cloudflareCountry} | Path: ${pathname}`)
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
  const hasReferer = referer && referer.length > 0;

  // CAPTCHA VERIFICATION for high-risk countries (Singapore, etc.)
  // Check if user has verified captcha cookie AND it matches their current IP
  const captchaCookie = request.cookies.get('captcha_verified')?.value;
  let captchaVerified = false;

  if (captchaCookie) {
    try {
      // Verify signed JWT cookie (HMAC-SHA256, no IP binding)
      const parts = captchaCookie.split('.');
      if (parts.length === 3) {
        const [header, body, sig] = parts;
        const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
        const expectedSig = createHmac('sha256', secret)
          .update(`${header}.${body}`)
          .digest('base64url');
        if (sig === expectedSig) {
          const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
          const isNotExpired = payload.exp && payload.exp > Math.floor(Date.now() / 1000);
          captchaVerified = !!isNotExpired;
        }
      }
    } catch (e) {
      captchaVerified = false;
    }
  }

  // AGGRESSIVE SCRAPER BLOCKING: Detail pages with no referer
  // Real users come from:
  //   1. Search engines (google.com, bing.com) - have referer
  //   2. Browse pages on our site (figtracker.ericksu.com) - have referer
  //   3. Social media (twitter, reddit) - have referer
  // Scrapers: Direct typed URLs or scripts - NO referer
  //
  // Exceptions:
  // - Whitelisted IPs (your IP, known good IPs)
  // - Legitimate bots (already allowed above via ALLOWED_BOTS)
  // - High-risk countries get EXTRA scrutiny (redirect to CAPTCHA if no referer)

  if (isDetailPage && !hasReferer && !WHITELISTED_IPS.includes(ip)) {
    // Extra strict for high-risk countries - Show CAPTCHA instead of blocking
    if (isHighRisk) {
      if (!captchaVerified) {
        console.log(`[🛡️  CAPTCHA REQUIRED] Country: ${cloudflareCountry} | IP: ${ip} | No referer | Path: ${pathname}`)
        // Redirect to CAPTCHA verification page
        const verifyUrl = new URL('/verify-human', request.url);
        verifyUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(verifyUrl);
      }
      // If captcha verified, allow through
      console.log(`[✅ CAPTCHA VERIFIED] Country: ${cloudflareCountry} | IP: ${ip} | Path: ${pathname}`)
    }

    // For other countries, log as suspicious but allow (might be real user)
    // They'll hit rate limits if they scrape too much
    console.log(`[⚠️  SUSPICIOUS] IP: ${ip} | Country: ${cloudflareCountry} | No referer on detail page | Path: ${pathname}`)
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
