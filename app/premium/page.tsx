import type { Metadata } from 'next';
import PremiumPageClient from '@/components/premium-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';
import { DOMAINS } from '@/lib/i18n-alternates';

// Detect locale from the request host, matching the pattern used across the app
async function getRequestLocale(): Promise<Locale> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  return (getLocaleFromHost(host)) as Locale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations(locale);

  // Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

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

  const title = t.premium?.page?.meta?.title || 'Premium';
  const description = t.premium?.page?.meta?.description || 'Instant listings without the collection step, plus an unlimited AI minifigure identifier — $4.99/month.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${domains[locale as keyof typeof domains]}/premium`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/premium`,
      languages: {
        'en': `${domains.en}/premium`,
        'de': `${domains.de}/premium`,
        'fr': `${domains.fr}/premium`,
        'es': `${domains.es}/premium`,
        'it': `${domains.it}/premium`,
        'nl': `${domains.nl}/premium`,
        'pl': `${domains.pl}/premium`,
        'pt': `${domains.pt}/premium`,
        'sv': `${domains.sv}/premium`,
        'ja': `${domains.ja}/premium`,
        'x-default': `${domains.en}/premium`,
      },
    },
  };
}

export default function PremiumPage() {
  return <PremiumPageClient />;
}
