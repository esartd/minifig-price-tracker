import type { Metadata } from 'next';
import { BookOpenIcon, CurrencyDollarIcon, ChartBarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import GuidesPageClient from '@/components/guides-page-client';
import { headers } from 'next/headers';

async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/translations-backup/${locale}.json`);
    return translations.default || translations;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    // Fallback to English
    const fallback = await import('@/translations-backup/en.json');
    return fallback.default || fallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = await getTranslations(locale);

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  // Validate that guides.meta exists
  if (!t.guides?.meta) {
    console.error(`Missing guides.meta for locale: ${locale}`);
    // Fallback to English
    const fallback = await getTranslations('en');
    return {
      title: `${fallback.guides.meta.title} | FigTracker`,
      description: fallback.guides.meta.description,
      keywords: fallback.guides.meta.keywords,
      openGraph: {
        title: `${fallback.guides.meta.ogTitle} | FigTracker`,
        description: fallback.guides.meta.ogDescription,
        url: `${domains.en}/guides`,
      },
      alternates: {
        canonical: `${domains[locale as keyof typeof domains]}/guides`,
      },
    };
  }

  return {
    title: `${t.guides.meta.title} | FigTracker`,
    description: t.guides.meta.description,
    keywords: t.guides.meta.keywords,
    openGraph: {
      title: `${t.guides.meta.ogTitle} | FigTracker`,
      description: t.guides.meta.ogDescription,
      url: `${domains[locale as keyof typeof domains]}/guides`,
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/guides`,
      languages: {
        'en': `${domains.en}/guides`,
        'de': `${domains.de}/guides`,
        'fr': `${domains.fr}/guides`,
        'es': `${domains.es}/guides`,
        'x-default': `${domains.en}/guides`,
      },
    },
  };
}

export default async function GuidesPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = await getTranslations(locale);

  // Validate guides structure with detailed logging
  console.log('[Guides Page] Locale:', locale);
  console.log('[Guides Page] Has guides:', !!t.guides);
  console.log('[Guides Page] Has guides.items:', !!t.guides?.items);
  console.log('[Guides Page] Is array:', Array.isArray(t.guides?.items));

  if (!t.guides || !t.guides.items || !Array.isArray(t.guides.items)) {
    console.error(`[Guides Page] Invalid guides structure for locale: ${locale}`);
    console.error('[Guides Page] Translation object keys:', Object.keys(t));
    console.error('[Guides Page] guides value:', t.guides);

    // Fallback to English
    const fallback = await getTranslations('en');
    if (!fallback.guides?.items || !Array.isArray(fallback.guides.items)) {
      throw new Error(`Critical: Even English guides data is missing`);
    }

    const fallbackGuidesData = fallback.guides.items as Array<{
      title: string;
      description: string;
      slug: string | null;
      status: 'published' | 'coming-soon';
      topics: string[];
    }>;

    const guides = fallbackGuidesData.map((guide, index) => ({
      ...guide,
      icon: [BookOpenIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingBagIcon][index],
    }));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'LEGO Minifigure Pricing Guides',
      description: 'Expert guides and resources for pricing and selling LEGO minifigures',
      url: 'https://figtracker.ericksu.com/guides',
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GuidesPageClient guides={guides} />
      </>
    );
  }

  const guidesData = t.guides.items as Array<{
    title: string;
    description: string;
    slug: string | null;
    status: 'published' | 'coming-soon';
    topics: string[];
  }>;

  const guides = guidesData.map((guide, index) => ({
    ...guide,
    icon: [BookOpenIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingBagIcon][index],
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LEGO Minifigure Pricing Guides',
    description: 'Expert guides and resources for pricing and selling LEGO minifigures',
    url: 'https://figtracker.ericksu.com/guides',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuidesPageClient guides={guides} />
    </>
  );
}
