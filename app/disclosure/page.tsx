import type { Metadata } from 'next';
import DisclosurePageClient from '@/components/disclosure-page-client';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

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
    title: 'Affiliate Disclosure - FigTracker',
    description: 'FigTracker participates in the LEGO.com Affiliate Program and Amazon Associates Program. Learn about our affiliate partnerships and how we earn commissions.',
    openGraph: {
      title: 'Affiliate Disclosure - FigTracker',
      description: 'Learn about our affiliate partnerships and advertising practices.',
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
