import { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n-subdomain';

/**
 * Metadata for the bulk-export landing pages.
 *
 * The locale→domain map is duplicated across most pages in this app; this at
 * least keeps the three export pages sharing one copy of it.
 */

export const DOMAINS: Record<Locale, string> = {
  en: 'https://figtracker.ericksu.com',
  de: 'https://de.figtracker.ericksu.com',
  fr: 'https://fr.figtracker.ericksu.com',
  es: 'https://es.figtracker.ericksu.com',
  it: 'https://it.figtracker.ericksu.com',
  nl: 'https://nl.figtracker.ericksu.com',
  pl: 'https://pl.figtracker.ericksu.com',
  sv: 'https://sv.figtracker.ericksu.com',
  pt: 'https://pt.figtracker.ericksu.com',
  ja: 'https://ja.figtracker.ericksu.com',
};

export function buildExportMetadata(
  locale: Locale,
  pathname: string,
  title: string,
  description: string
): Metadata {
  const baseUrl = DOMAINS[locale];

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}${pathname}`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}${pathname}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${DOMAINS[l]}${pathname}`])),
        'x-default': `${DOMAINS.en}${pathname}`,
      },
    },
  };
}
