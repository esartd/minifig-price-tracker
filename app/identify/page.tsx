import type { Metadata } from 'next';
import IdentifyPageClient from '@/components/identify-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

// Detect locale from the request host, matching the pattern used across the app
async function getRequestLocale(): Promise<Locale> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  return (getLocaleFromHost(host)) as Locale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations(locale);

  const domains = {
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

  const localeMap = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
    it: 'it_IT',
    nl: 'nl_NL',
    pl: 'pl_PL',
    pt: 'pt_PT',
    sv: 'sv_SE',
    ja: 'ja_JP',
  };

  const title = t.identify?.meta?.title || 'Identify a Minifigure';
  const description = t.identify?.meta?.description || 'Snap or drag in a photo and let AI identify your LEGO minifigure\'s BrickLink ID and current value.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${domains[locale as keyof typeof domains]}/identify`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/identify`,
      languages: {
        'en': `${domains.en}/identify`,
        'de': `${domains.de}/identify`,
        'fr': `${domains.fr}/identify`,
        'es': `${domains.es}/identify`,
        'it': `${domains.it}/identify`,
        'nl': `${domains.nl}/identify`,
        'pl': `${domains.pl}/identify`,
        'pt': `${domains.pt}/identify`,
        'sv': `${domains.sv}/identify`,
        'ja': `${domains.ja}/identify`,
        'x-default': `${domains.en}/identify`,
      },
    },
  };
}

export default function IdentifyPage() {
  return <IdentifyPageClient />;
}
