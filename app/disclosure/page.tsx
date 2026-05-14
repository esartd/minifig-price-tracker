import type { Metadata } from 'next';
import DisclosurePageClient from '@/components/disclosure-page-client';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

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

  const localeMap = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
  };

  return {
    title: t.disclosure.meta.title,
    description: t.disclosure.meta.description,
    keywords: t.disclosure.meta.keywords,
    openGraph: {
      title: t.disclosure.meta.title,
      description: t.disclosure.meta.description,
      url: `${domains[locale as keyof typeof domains]}/disclosure`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/disclosure`,
      languages: {
        'en': `${domains.en}/disclosure`,
        'de': `${domains.de}/disclosure`,
        'fr': `${domains.fr}/disclosure`,
        'es': `${domains.es}/disclosure`,
        'x-default': `${domains.en}/disclosure`,
      },
    },
  };
}

export default function DisclosurePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return <DisclosurePageClient lastUpdated={lastUpdated} />;
}
