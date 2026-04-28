import { auth } from '@/auth';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default auth((req) => {
  // Skip auth pages and API routes
  if (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Apply i18n middleware first
  const intlResponse = intlMiddleware(req);

  // Check authentication for protected routes
  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(de|fr|es)/, '');

  const isProtectedPage =
    pathnameWithoutLocale.startsWith('/inventory') ||
    pathnameWithoutLocale.startsWith('/collection') ||
    pathnameWithoutLocale.startsWith('/account') ||
    pathnameWithoutLocale.startsWith('/wishlist');

  if (isProtectedPage && !req.auth) {
    return NextResponse.redirect(new URL('/auth/signin', req.nextUrl.origin));
  }

  return intlResponse;
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
