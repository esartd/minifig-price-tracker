import type { Metadata } from 'next';
import { prisma, prismaPublic } from '@/lib/prisma';
import AboutPageClient from '@/components/about-page-client';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

export const runtime = 'edge';


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
function formatCatalogCount(count: number): string {
  if (count === 0) {
    return 'thousands of';
  } else if (count >= 10000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `over ${rounded.toLocaleString()}`;
  } else if (count >= 1000) {
    const rounded = Math.ceil(count / 1000) * 1000;
    return `nearly ${rounded.toLocaleString()}`;
  } else {
    return `${count.toLocaleString()}`;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const catalogCount = await getSearchableCatalogCount();
  const catalogCountText = formatCatalogCount(catalogCount);

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
    title: t.about.meta.title,
    description: t.about.meta.description,
    keywords: t.about.meta.keywords,
    openGraph: {
      title: t.about.meta.title,
      description: t.about.meta.description,
      url: `${domains[locale as keyof typeof domains]}/about`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/about`,
      languages: {
        'en': `${domains.en}/about`,
        'de': `${domains.de}/about`,
        'fr': `${domains.fr}/about`,
        'es': `${domains.es}/about`,
        'x-default': `${domains.en}/about`,
      },
    },
  };
}

export default async function AboutPage() {
  const catalogCount = await getSearchableCatalogCount();
  const catalogCountText = formatCatalogCount(catalogCount);

  return <AboutPageClient catalogCountText={catalogCountText} />;
}
