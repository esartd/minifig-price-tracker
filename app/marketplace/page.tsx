import type { Metadata } from 'next';
import MarketplacePageClient from '@/components/marketplace-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale as Locale);

  const title = t.marketplace?.meta?.title || 'LEGO Marketplace on Whatnot | FigTracker';
  const description =
    t.marketplace?.meta?.description ||
    'Browse 18,000 LEGO minifigures and 20,000 sets, then jump straight to live Whatnot listings.';

  const path = '/marketplace';
  const canonical = `${domains[locale as keyof typeof domains]}${path}`;

  return {
    title,
    description,
    keywords:
      t.marketplace?.meta?.keywords ||
      ['LEGO Whatnot', 'buy LEGO minifigures', 'Whatnot LEGO listings', 'LEGO marketplace'],
    openGraph: {
      title,
      description,
      url: canonical,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: Object.values(localeMap).filter(
        (l) => l !== localeMap[locale as keyof typeof localeMap]
      ),
    },
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          Object.entries(domains).map(([code, domain]) => [code, `${domain}${path}`])
        ),
        'x-default': `${domains.en}${path}`,
      },
    },
  };
}

export default function MarketplacePage() {
  return <MarketplacePageClient />;
}
