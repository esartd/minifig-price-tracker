import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import SearchPageClient from './search-page-client';

const domains: Record<string, string> = {
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale] || domains.en;

  const title = t.search?.meta?.title || 'Search LEGO Minifigures & Sets';
  const description = t.search?.meta?.description || 'Search any LEGO minifigure or set to see its current suggested price, blended from BrickLink and eBay data.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/search` },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/search`,
      languages: {
        ...Object.fromEntries(Object.entries(domains).map(([loc, d]) => [loc, `${d}/search`])),
        'x-default': `${domains.en}/search`,
      },
    },
  };
}

export default function SearchPage() {
  return <SearchPageClient />;
}
