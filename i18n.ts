import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Supported locales
export const locales = ['en', 'de', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español'
};

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate locale
  const validLocale = locale as Locale;
  if (!locales.includes(validLocale)) notFound();

  return {
    locale: validLocale,
    messages: (await import(`./locales/${validLocale}.json`)).default
  };
});
