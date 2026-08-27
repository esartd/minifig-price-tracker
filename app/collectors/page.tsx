import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import CollectorsPageClient from './collectors-page-client';

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

  const title = t.collectorsDirectory?.meta?.title || 'Browse LEGO Collectors';
  const description = t.collectorsDirectory?.meta?.description || 'Browse LEGO collector leaderboards and public collections shared by the FigTracker community.';

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

export default function CollectorsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LEGO Collectors on FigTracker',
    description: 'Browse LEGO collector leaderboards and public collections shared by the FigTracker community.',
    url: 'https://figtracker.ericksu.com/collectors',
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
