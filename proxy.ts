import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Create i18n middleware
const handleI18nRouting = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif)$/)
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const isAuthPage = pathname.startsWith('/auth');

  // For auth pages
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${defaultLocale}`, req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // For all other pages, handle i18n routing
  const response = handleI18nRouting(req);

  // Check auth after i18n routing
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de|fr|es)/, '') || '/';
  const isProtectedPage =
    pathnameWithoutLocale.startsWith('/inventory') ||
    pathnameWithoutLocale.startsWith('/collection') ||
    pathnameWithoutLocale.startsWith('/sets-inventory') ||
    pathnameWithoutLocale.startsWith('/sets-collection') ||
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
