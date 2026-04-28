import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Always allow all API routes and static files
  if (pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/avatars') ||
      pathname === '/sitemap.xml' ||
      pathname === '/robots.txt' ||
      pathname.match(/\.(svg|png|jpg|jpeg|gif|ico)$/)) {
    return NextResponse.next();
  }

  // Auth pages don't need locale prefix
  const isAuthPage = pathname.startsWith('/auth');
  if (isAuthPage) {
    if (isLoggedIn) {
      // Redirect logged-in users away from auth pages
      const homeUrl = new URL(`/${defaultLocale}`, req.nextUrl.origin);
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // For all other pages, apply i18n middleware first
  const response = intlMiddleware(req);

  // Get the pathname after i18n processing
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de|fr|es)/, '') || '/';

  // Define public and protected pages
  const isPublicPage = pathnameWithoutLocale === '/' ||
                       pathnameWithoutLocale.startsWith('/search') ||
                       pathnameWithoutLocale.startsWith('/minifig') ||
                       pathnameWithoutLocale.startsWith('/themes') ||
                       pathnameWithoutLocale.startsWith('/privacy') ||
                       pathnameWithoutLocale.startsWith('/disclosure') ||
                       pathnameWithoutLocale.startsWith('/about') ||
                       pathnameWithoutLocale.startsWith('/faq') ||
                       pathnameWithoutLocale.startsWith('/guides') ||
                       pathnameWithoutLocale.startsWith('/sets-themes') ||
                       pathnameWithoutLocale.startsWith('/sets');

  const isProtectedPage = pathnameWithoutLocale.startsWith('/inventory') ||
                          pathnameWithoutLocale.startsWith('/personal-collection') ||
                          pathnameWithoutLocale.startsWith('/collection') ||
                          pathnameWithoutLocale.startsWith('/sets-inventory') ||
                          pathnameWithoutLocale.startsWith('/sets-collection') ||
                          pathnameWithoutLocale.startsWith('/account') ||
                          pathnameWithoutLocale.startsWith('/wishlist');

  // Block protected pages if not logged in
  if (isProtectedPage && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)', '/(api|trpc)(.*)'],
};
