import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import SearchPageClient from './search-page-client';
import { DOMAINS } from '@/lib/i18n-alternates';

// Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

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
