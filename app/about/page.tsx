import type { Metadata } from 'next';
import { prisma, prismaPublic } from '@/lib/prisma';
import AboutPageClient from '@/components/about-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

// Force dynamic rendering to show current searchable catalog count
export const dynamic = 'force-dynamic';

// Get count of searchable minifigs from static catalog
async function getSearchableCatalogCount(): Promise<number> {
  try {
    // Static catalog has all 18,732 minifigs available
    return 18732;
  } catch (error) {
    console.error('Error getting catalog count:', error);
    return 0;
  }
}

// Format catalog count for display
function formatCatalogCount(count: number, t: Record<string, any>): string {
  if (count === 0) {
    return t.about?.catalogCount?.thousandsOf || 'thousands of';
  } else if (count >= 10000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `${t.about?.catalogCount?.overPrefix || 'over'} ${rounded.toLocaleString()}`;
  } else if (count >= 1000) {
    const rounded = Math.ceil(count / 1000) * 1000;
    return `${t.about?.catalogCount?.nearlyPrefix || 'nearly'} ${rounded.toLocaleString()}`;
  } else {
    return `${count.toLocaleString()}`;
  }
}

// Detect locale from the request host, matching the pattern used in generateMetadata()
async function getRequestLocale(): Promise<Locale> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  return (getLocaleFromHost(host)) as Locale;
}

export async function generateMetadata(): Promise<Metadata> {
  const catalogCount = await getSearchableCatalogCount();
  const locale = await getRequestLocale();
  const t = await getTranslations(locale);
  const catalogCountText = formatCatalogCount(catalogCount, t);

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
    title: t.about.meta.title,
    description: t.about.meta.description,
    keywords: t.about.meta.keywords,
    openGraph: {
      title: t.about.meta.title,
      description: t.about.meta.description,
      url: `${domains[locale as keyof typeof domains]}/about`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/about`,
      languages: {
        'en': `${domains.en}/about`,
        'de': `${domains.de}/about`,
        'fr': `${domains.fr}/about`,
        'es': `${domains.es}/about`,
        'it': `${domains.it}/about`,
        'nl': `${domains.nl}/about`,
        'pl': `${domains.pl}/about`,
        'pt': `${domains.pt}/about`,
        'sv': `${domains.sv}/about`,
        'ja': `${domains.ja}/about`,
        'x-default': `${domains.en}/about`,
      },
    },
  };
}

export default async function AboutPage() {
  const catalogCount = await getSearchableCatalogCount();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'FigTracker',
      url: 'https://figtracker.ericksu.com',
      founder: {
        '@type': 'Person',
        name: 'Erick Su',
      },
    },
  };
  const locale = await getRequestLocale();
  const t = await getTranslations(locale);
  const catalogCountText = formatCatalogCount(catalogCount, t);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageClient catalogCountText={catalogCountText} />
    </>
  );
}
