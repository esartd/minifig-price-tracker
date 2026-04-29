import type { Metadata } from 'next';
import { BookOpenIcon, CurrencyDollarIcon, ChartBarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import GuidesPageClient from '@/components/guides-page-client';
import { headers } from 'next/headers';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

export const metadata: Metadata = {
  title: 'LEGO Minifigure Pricing Guides & Tips | FigTracker',
  description: 'Expert guides on pricing LEGO minifigures, selling on Bricklink, inventory management, and maximizing resale value. Free resources for sellers and collectors.',
  keywords: ['LEGO pricing guide', 'how to price minifigures', 'Bricklink selling tips', 'LEGO resale guide', 'minifigure value guide'],
  openGraph: {
    title: 'LEGO Pricing Guides & Tips | FigTracker',
    description: 'Learn how to price, sell, and manage your LEGO minifigure inventory effectively',
    url: 'https://figtracker.ericksu.com/guides',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/guides',
  },
};

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
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
