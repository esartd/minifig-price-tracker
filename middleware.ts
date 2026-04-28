import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL (/en/, /de/, etc.)
  localeDetection: true    // Auto-detect from browser Accept-Language header
});

export const config = {
  // Match all routes except API, static files, images
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
