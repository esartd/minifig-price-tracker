import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocaleFromHost } from '@/lib/i18n-subdomain'

// Common scraper/bot user agents to block
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
  'crawler',
  'spider',
  'scraper',
  'bot',
  'selenium',
  'puppeteer',
  'playwright',
  'phantom',
]

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // Always allow robots.txt (bots need to read it to know they're blocked)
  if (pathname === '/robots.txt') {
    const response = NextResponse.next()
    return response
  }

  // Block requests with suspicious user agents
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
