// Subdomain-based i18n configuration
export const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'sv', 'pt', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  sv: 'Svenska',
  pt: 'Português',
  ja: '日本語'
};

export const subdomains: Record<Locale, string> = {
  en: 'figtracker.ericksu.com',
  de: 'de.figtracker.ericksu.com',
  fr: 'fr.figtracker.ericksu.com',
  es: 'es.figtracker.ericksu.com',
  it: 'it.figtracker.ericksu.com',
  nl: 'nl.figtracker.ericksu.com',
  pl: 'pl.figtracker.ericksu.com',
  sv: 'sv.figtracker.ericksu.com',
  pt: 'pt.figtracker.ericksu.com',
  ja: 'ja.figtracker.ericksu.com'
};

/**
 * Extract locale from subdomain
 * Examples:
 *   figtracker.ericksu.com → 'en'
 *   de.figtracker.ericksu.com → 'de'
 *   fr.figtracker.ericksu.com → 'fr'
 *   localhost → 'en'
 */
export function getLocaleFromHost(host: string | null): Locale {
  if (!host) return defaultLocale;

  // Check for locale subdomains
  if (host.startsWith('de.')) return 'de';
  if (host.startsWith('fr.')) return 'fr';
  if (host.startsWith('es.')) return 'es';
  if (host.startsWith('it.')) return 'it';
  if (host.startsWith('nl.')) return 'nl';
  if (host.startsWith('pl.')) return 'pl';
  if (host.startsWith('sv.')) return 'sv';
  if (host.startsWith('pt.')) return 'pt';
  if (host.startsWith('ja.')) return 'ja';

  // Default to English for main domain or localhost
  return defaultLocale;
}

/**
 * Get the full URL for a given locale
 */
export function getLocaleUrl(locale: Locale, pathname: string = '/'): string {
  return `https://${subdomains[locale]}${pathname}`;
}

/**
 * Load translations for a given locale
 */
export async function getTranslations(locale: Locale): Promise<Record<string, any>> {
  try {
    const translations = await import(`@/translations-backup/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to English
    if (locale !== 'en') {
      const fallback = await import(`@/translations-backup/en.json`);
      return fallback.default;
    }
    return {};
  }
}
