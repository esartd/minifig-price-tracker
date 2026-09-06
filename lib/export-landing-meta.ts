import { Metadata } from 'next';
import { type Locale } from '@/lib/i18n-subdomain';
import { DOMAINS, buildAlternates } from '@/lib/i18n-alternates';

export { DOMAINS };

/**
 * Metadata for the bulk-export landing pages.
 *
 * The locale→domain map and the canonical/hreflang shape now live in
 * lib/i18n-alternates.ts; this re-exports DOMAINS so existing callers keep
 * working.
 */


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
    alternates: buildAlternates(locale, pathname),
  };
}
