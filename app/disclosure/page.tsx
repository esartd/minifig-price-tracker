import type { Metadata } from 'next';
import DisclosurePageClient from '@/components/disclosure-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);

  const t = await getTranslations(locale as Locale);

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

  return {
    title: t.disclosure.meta.title,
    description: t.disclosure.meta.description,
    keywords: t.disclosure.meta.keywords,
    openGraph: {
      title: t.disclosure.meta.title,
      description: t.disclosure.meta.description,
      url: `${domains[locale as keyof typeof domains]}/disclosure`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/disclosure`,
      languages: {
        'en': `${domains.en}/disclosure`,
        'de': `${domains.de}/disclosure`,
        'fr': `${domains.fr}/disclosure`,
        'es': `${domains.es}/disclosure`,
        'it': `${domains.it}/disclosure`,
        'nl': `${domains.nl}/disclosure`,
        'pl': `${domains.pl}/disclosure`,
        'pt': `${domains.pt}/disclosure`,
        'sv': `${domains.sv}/disclosure`,
        'ja': `${domains.ja}/disclosure`,
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
