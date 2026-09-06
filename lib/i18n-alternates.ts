import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n-subdomain';

/**
 * Canonical and hreflang for a given path, across all ten locale subdomains.
 *
 * Every page needs this and most build it by hand, which is how
 * /sets-themes/[theme] ended up with no alternates at all: its page.tsx is a
 * client component, so it cannot export generateMetadata, and it silently
 * inherited the root layout's alternates -- which point at the domain root.
 * The result was ~1,700 indexable URLs all declaring the homepage as their
 * canonical.
 *
 * A client-component page can still get correct metadata by putting
 * generateMetadata in a sibling layout.tsx, which is what app/themes/[theme]
 * does and what app/sets-themes/[theme] now does too.
 */

export const DOMAINS: Record<Locale, string> = {
  en: 'https://figtracker.ericksu.com',
  de: 'https://de.figtracker.ericksu.com',
  fr: 'https://fr.figtracker.ericksu.com',
  es: 'https://es.figtracker.ericksu.com',
  it: 'https://it.figtracker.ericksu.com',
  nl: 'https://nl.figtracker.ericksu.com',
  pl: 'https://pl.figtracker.ericksu.com',
  pt: 'https://pt.figtracker.ericksu.com',
  sv: 'https://sv.figtracker.ericksu.com',
  ja: 'https://ja.figtracker.ericksu.com',
};

/**
 * @param pathname Leading slash, no trailing slash. Pass '' for the site root.
 *                 Already-encoded segments are used verbatim, so encode any
 *                 dynamic slug before calling.
 */
export function buildAlternates(locale: Locale, pathname: string): Metadata['alternates'] {
  return {
    canonical: `${DOMAINS[locale]}${pathname}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${DOMAINS[l]}${pathname}`])),
      'x-default': `${DOMAINS.en}${pathname}`,
    },
  };
}
