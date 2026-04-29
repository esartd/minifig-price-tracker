import type { Metadata } from 'next';
import { BookOpenIcon, CurrencyDollarIcon, ChartBarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import GuidesPageClient from '@/components/guides-page-client';
import { headers } from 'next/headers';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

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

  return {
    title: 'LEGO Minifigure Pricing Guides & Tips | FigTracker',
    description: 'Expert guides on pricing LEGO minifigures, selling on Bricklink, inventory management, and maximizing resale value. Free resources for sellers and collectors.',
    keywords: ['LEGO pricing guide', 'how to price minifigures', 'Bricklink selling tips', 'LEGO resale guide', 'minifigure value guide'],
    openGraph: {
      title: 'LEGO Pricing Guides & Tips | FigTracker',
      description: 'Learn how to price, sell, and manage your LEGO minifigure inventory effectively',
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

  const t = getTranslations(locale);

  // Validate guides structure
  if (!t.guides || !t.guides.items || !Array.isArray(t.guides.items)) {
    console.error(`Invalid guides structure for locale: ${locale}`);
    throw new Error(`Missing guides data for locale: ${locale}`);
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
