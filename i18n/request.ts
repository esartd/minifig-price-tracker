import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['en', 'de', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({locale}) => {
  const validLocale = locale as Locale;

  if (!locales.includes(validLocale)) {
    notFound();
  }

  return {
    locale: validLocale,
    messages: (await import(`../translations-backup/${validLocale}.json`)).default
  };
});
