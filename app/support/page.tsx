import type { Metadata } from 'next';
import SupportPageClient from '@/components/support-page-client';
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
    title: t.supportPage.meta.title,
    description: t.supportPage.meta.description,
    keywords: t.supportPage.meta.keywords,
    openGraph: {
      title: t.supportPage.meta.title,
      description: t.supportPage.meta.description,
      url: `${domains[locale as keyof typeof domains]}/support`,
      type: 'website',
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/support`,
      languages: {
        'en': `${domains.en}/support`,
        'de': `${domains.de}/support`,
        'fr': `${domains.fr}/support`,
        'es': `${domains.es}/support`,
        'x-default': `${domains.en}/support`,
      },
    },
  };
}

export default function SupportPage() {
  return <SupportPageClient />;
}
