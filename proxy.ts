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

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Always allow all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Strip locale prefix for path matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de|fr|es)/, '') || '/';

  const isAuthPage = pathname.startsWith('/auth');
  const isPublicPage = pathnameWithoutLocale === '/' ||
                       pathnameWithoutLocale.startsWith('/search') ||
                       pathnameWithoutLocale.startsWith('/minifig') ||
                       pathnameWithoutLocale.startsWith('/themes') ||
                       pathnameWithoutLocale === '/sitemap.xml' ||
                       pathnameWithoutLocale === '/robots.txt' ||
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

  // Allow public access to home, search, minifig detail, and about pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Protected pages require login
  if (isProtectedPage && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  // If not logged in and not on auth page or public page, redirect to sign-in
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  // If logged in and on auth page, redirect to locale home
  if (isLoggedIn && isAuthPage) {
    // Extract locale from pathname if present
    const localeMatch = pathname.match(/^\/(en|de|fr|es)/);
    const locale = localeMatch ? localeMatch[1] : defaultLocale;
    const homeUrl = new URL(`/${locale}`, req.nextUrl.origin);
    return NextResponse.redirect(homeUrl);
  }

  // Apply i18n middleware last (after auth checks)
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|avatars|sitemap.xml|robots.txt).*)'],
};
