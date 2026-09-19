import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { themeSlug } from '@/lib/theme-slug'
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
//
// Search engines and social preview fetchers only.
//
// The AI crawlers used to be listed here -- gptbot, claudebot, anthropic-ai,
// perplexity, chatgpt-user -- which put this file in direct contradiction with
// app/robots.ts, where all of them sit in a 22-agent group with
// `disallow: ['/']`. So robots.txt asked them not to crawl and the middleware
// handed the same agents an unmetered fast path if they ignored it. Whichever
// policy is right, running both at once means the stricter one does nothing.
//
// robots.ts is the stated policy, so this now matches it. They are not blocked
// outright: they fall through to the normal tiered rate limit below, which is
// what catches an agent that disregards robots.txt.
//
// One judgement call left open deliberately: `chatgpt-user` is not a training
// crawler, it is the fetch made when a person asks ChatGPT to open a link, so
// it represents a real reader and possible referral traffic. It is disallowed
// in robots.ts along with the training crawlers. Worth revisiting as a policy
// question rather than quietly re-adding here.
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

/**
 * The canonical path for a theme URL, or null when it is already canonical.
 *
 * Only the theme segment is rewritten; the subcategory segment and anything
 * else in the path are left alone (see the note inside). themeSlug() is
 * idempotent, so a redirect can only fire once and cannot loop.
 */
/**
 * Theme slugs that app/themes/themes-client.tsx used to emit, mapped to the
 * canonical spelling.
 *
 * That component built its own slug by deleting every character outside
 * [a-z0-9-], which diverges from normalizeThemeSlug (lowercase + hyphenate
 * only) for exactly these thirteen themes. The index linked to the stripped
 * form while lib/sitemap-data.ts submitted the canonical one, and because the
 * route title-cases whatever segment it receives, BOTH returned 200 with the
 * same items and a self-referencing canonical -- two indexable URLs per theme,
 * one titled "Browse Pokmon LEGO Minifigures".
 *
 * The client uses the shared helper now, so nothing new points at the stripped
 * form. These exist for what Google has already indexed.
 *
 * Kept here rather than in next.config.js: four of the destinations contain
 * parentheses, and Next parses those in a redirect `destination` as a
 * path-to-regexp capture group, which fails the build outright.
 *
 * Values are the *decoded* names. themeSlug() percent-encodes them below, so
 * this table stays readable and there is one encoder rather than two.
 */
const STRIPPED_THEME_SLUGS: Record<string, string> = {
  'other': '(Other)',
  'botanicals-botanical-collection': 'Botanicals (Botanical Collection)',
  'despicable-me--minions': 'Despicable Me & Minions',
  'educational--dacta': 'Educational & Dacta',
  'gabbys-dollhouse': "Gabby's Dollhouse",
  'holiday--event': 'Holiday & Event',
  'icons-creator-expert--advanced-models': 'Icons (Creator Expert & Advanced Models)',
  'lego-ideas-cuusoo': 'LEGO Ideas (CUUSOO)',
  'pharaohs-quest': "Pharaoh's Quest",
  'pokmon': 'Pokémon',
  'the-hobbit--the-lord-of-the-rings': 'The Hobbit & The Lord of the Rings',
  'time-cruisers--time-twisters': 'Time Cruisers & Time Twisters',
  'unikitty': 'Unikitty!',
}

function canonicalThemePath(pathname: string): string | null {
  const parts = pathname.split('/')
  // ['', 'themes', '<theme>'] or ['', 'themes', '<theme>', '<sub>']
  const isThemes = parts[1] === 'themes' && parts.length >= 3 && parts.length <= 4
  const isSetsThemes = parts[1] === 'sets-themes' && parts.length === 3
  if (!isThemes && !isSetsThemes) return null

  // ONLY the theme segment (parts[2]). The subcategory segment is left
  // exactly as requested, for two reasons found by checking rather than
  // guessing:
  //
  // 1. app/themes/[theme]/[subcategory] renders its segment verbatim as the
  //    display name, so forcing it through a slug retitled the page
  //    "episode-1 LEGO Minifigures". The parent theme page title-cases its
  //    own slug, which is why it survives the same treatment.
  // 2. lib/sitemap-data.ts submits no subcategory URLs at all, so unlike the
  //    theme pages there is no split ranking credit to recover there.
  //
  // Slugs are not losslessly reversible for display anyway -- "dc-comics"
  // title-cases back to "Dc Comics" -- so this is not a transform to apply
  // to a segment the page shows to a reader.
  const segment = parts[2]
  if (!segment) return null

  let canonical: string
  try {
    const decoded = decodeURIComponent(segment)
    // A stripped slug cannot be recovered by re-slugging -- themeSlug('pokmon')
    // is 'pokmon', so the equality check below would call it canonical and
    // leave the duplicate in place. The table is the only way back to the real
    // name. Checked on the decoded value so both 'pokmon' and an encoded
    // variant resolve.
    const restored = STRIPPED_THEME_SLUGS[decoded.toLowerCase()]
    canonical = themeSlug(restored ?? decoded)
  } catch {
    // Malformed percent-encoding. Leave it and let the route 404 rather than
    // redirecting somewhere invented.
    return null
  }
  if (canonical === segment) return null

  parts[2] = canonical
  return parts.join('/')
}

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

  // Collapse theme pages onto one address.
  //
  // /themes/star-wars and /themes/Star%20Wars both returned 200 with byte-for
  // -byte identical content, as did the /sets-themes pair, so every theme page
  // existed at two URLs and split whatever ranking credit it earned. Verified
  // on production before this shipped: both spellings resolve the same counts
  // for Star Wars, Harry Potter, Bionicle, Super Mario and Gabby's Dollhouse,
  // so nobody sees different content after the redirect.
  //
  // The slug form wins because lib/sitemap-data.ts has always submitted it.
  //
  // THIS MUST STAY ABOVE THE BOT CHECKS BELOW. Verified crawlers get an early
  // NextResponse.next(), so a redirect placed after that block would be
  // invisible to Googlebot -- which is the only visitor this is for.
  const canonicalPath = canonicalThemePath(pathname)
  if (canonicalPath) {
    const url = request.nextUrl.clone()
    url.pathname = canonicalPath
    return NextResponse.redirect(url, 301)
  }

  // Block empty user agents — no real browser omits this
  if (!userAgent || userAgent.trim() === '') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // A user agent is a CLAIM, not proof. Anyone can send
  // "Mozilla/5.0 (compatible; Googlebot/2.1)".
  //
  // This used to be an early `return`, which handed anything matching a name
  // in ALLOWED_BOTS two things at once: a pass on the scraping-tool check
  // below, AND complete exemption from rate limiting. One line in a header
  // bought unlimited requests.
  //
  // Verifying a crawler properly means forward-confirmed reverse DNS -- PTR
  // the IP to a hostname, then resolve that hostname back and check it
  // matches. A PTR record alone is forgeable; only the round trip is not.
  // That cannot happen here: middleware runs on the Edge runtime, which has
  // no DNS, and a lookup per request would be far too slow regardless.
  //
  // So the claim is still honoured for the one thing it is needed for --
  // legitimate crawler names can contain substrings that trip the tool
  // blocklist -- but it no longer skips the rate limit. The PAGES tier is 300
  // requests a minute per IP, which real Googlebot never approaches from a
  // single address (it crawls from many), while a spoofer is capped instead
  // of unlimited.
  //
  // The proper fix, if this needs to be tighter: a Cloudflare Transform Rule
  // that sets a request header from `cf.client.bot`, which IS verified, and
  // trust that header here instead of the string. That requires the origin to
  // be unreachable except through Cloudflare, or the header is forgeable too.
  const claimsToBeCrawler = ALLOWED_BOTS.some(p => userAgent.includes(p))

  if (!claimsToBeCrawler) {
    // Block known scraping tools by user agent string
    // These are reliable signals — no real browser identifies itself this way
    const isSuspiciousBot = BLOCKED_USER_AGENTS.some(p => userAgent.includes(p))
    if (isSuspiciousBot) {
      console.log(`[🚫 BOT UA] IP: ${request.headers.get('cf-connecting-ip') || 'unknown'} | UA: ${userAgent.substring(0, 100)} | Path: ${pathname}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
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
