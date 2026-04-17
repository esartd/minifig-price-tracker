import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow public access to these paths (no auth required)
  const publicPaths = [
    '/',
    '/search',
    '/about',
    '/privacy',
    '/disclosure',
    '/themes',
    '/auth/signin',
    '/auth/signup',
    '/sitemap.xml',
    '/robots.txt',
  ]

  // Allow public access to minifig and theme pages
  if (
    pathname.startsWith('/minifigs/') ||
    pathname.startsWith('/themes/') ||
    pathname.startsWith('/api/minifig/') ||
    pathname.startsWith('/api/themes') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  // Check if current path is public
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // All other paths require authentication
  if (!req.auth) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
