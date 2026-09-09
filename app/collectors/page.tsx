import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import CollectorsPageClient from './collectors-page-client';
import { DOMAINS } from '@/lib/i18n-alternates';

// Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale] || domains.en;

  const title = t.collectorsDirectory?.meta?.title || 'Browse LEGO Collectors';
  const description = t.collectorsDirectory?.meta?.description || 'Browse LEGO collector leaderboards and public collections shared by the IntoBrick community.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/collectors` },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/collectors`,
      languages: {
        ...Object.fromEntries(Object.entries(domains).map(([loc, d]) => [loc, `${d}/collectors`])),
        'x-default': `${domains.en}/collectors`,
      },
    },
  };
}

export default async function CollectorsPage() {
  // The page body needs the origin too, and generateMetadata's locals are not
  // in scope here -- this used to be the hard-coded old hostname instead.
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const baseUrl = domains[locale] || domains.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LEGO Collectors on IntoBrick',
    description: 'Browse LEGO collector leaderboards and public collections shared by the IntoBrick community.',
    url: `${baseUrl}/collectors`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectorsPageClient />
    </>
  );
}
