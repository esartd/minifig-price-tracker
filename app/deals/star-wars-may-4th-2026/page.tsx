import type { Metadata } from 'next';
import { headers } from 'next/headers';
import May4thDealsClient from './client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { DOMAINS } from '@/lib/i18n-alternates';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);

  const t = await getTranslations(locale as Locale);

  // Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

  const baseUrl = domains[locale as keyof typeof domains];
  const path = '/deals/star-wars-may-4th-2026';

  return {
    title: t.may4thDeals.meta.title,
    description: t.may4thDeals.meta.description,
    keywords: t.may4thDeals.meta.keywords.split(', '),
    openGraph: {
      title: t.may4thDeals.meta.title,
      description: t.may4thDeals.meta.description,
      url: `${baseUrl}${path}`,
      type: 'article',
    },
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        en: `${domains.en}${path}`,
        de: `${domains.de}${path}`,
        fr: `${domains.fr}${path}`,
        es: `${domains.es}${path}`,
        it: `${domains.it}${path}`,
        nl: `${domains.nl}${path}`,
        pl: `${domains.pl}${path}`,
        pt: `${domains.pt}${path}`,
        sv: `${domains.sv}${path}`,
        ja: `${domains.ja}${path}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function May4thDeals2026() {
  return <May4thDealsClient />;
}
