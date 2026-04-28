import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Create i18n middleware with 'as-needed' - English has no prefix
const handleI18nRouting = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // English at root, de/fr/es with prefixes
  localeDetection: true
});

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif)$/)
  ) {
    return NextResponse.next();
  }

  // Apply i18n routing for all other requests
  const response = handleI18nRouting(req);

  // Check auth after i18n (strip any locale prefix for auth checks)
  const pathnameWithoutLocale = pathname.replace(/^\/(de|fr|es)/, '');
  const isLoggedIn = !!req.auth;

  const isProtectedPage =
    pathnameWithoutLocale.startsWith('/inventory') ||
    pathnameWithoutLocale.startsWith('/collection') ||
    pathnameWithoutLocale.startsWith('/account') ||
    pathnameWithoutLocale.startsWith('/wishlist');

  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.nextUrl.origin));
  }

  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
