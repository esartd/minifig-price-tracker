import type { Metadata } from 'next';
import PremiumPageClient from '@/components/premium-page-client';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

// Detect locale from the request host, matching the pattern used across the app
async function getRequestLocale(): Promise<Locale> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  return (host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en') as Locale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations(locale);

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

  const title = t.premium?.page?.meta?.title || 'Premium';
  const description = t.premium?.page?.meta?.description || 'Generate a marketplace listing for any LEGO minifig or set without adding it to your collection first.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${domains[locale as keyof typeof domains]}/premium`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/premium`,
      languages: {
        'en': `${domains.en}/premium`,
        'de': `${domains.de}/premium`,
        'fr': `${domains.fr}/premium`,
        'es': `${domains.es}/premium`,
        'x-default': `${domains.en}/premium`,
      },
    },
  };
}

export default function PremiumPage() {
  return <PremiumPageClient />;
}
