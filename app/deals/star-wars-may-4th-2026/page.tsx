import type { Metadata } from 'next';
import { headers } from 'next/headers';
import May4thDealsClient from './client';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';

export const runtime = 'edge';


export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = await getTranslations(locale as Locale);

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  const baseUrl = domains[locale as keyof typeof domains];
  const path = '/deals/star-wars-may-4th-2026';

  return {
    title: `${t.may4thDeals.meta.title} | FigTracker`,
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
        es: `${domains.es}${path}`,
        de: `${domains.de}${path}`,
        fr: `${domains.fr}${path}`,
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
