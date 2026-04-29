import { Metadata } from 'next';
import SubcategoryPageClient from '@/components/subcategory-page-client';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ theme: string; subcategory: string }>
}): Promise<Metadata> {
  const { theme, subcategory } = await params;
  const decodedTheme = decodeURIComponent(theme);
  const decodedSubcategory = decodeURIComponent(subcategory);

  const { headers } = await import('next/headers');
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

  // Fetch minifigs count
  const baseUrl = domains[locale as keyof typeof domains];
  let minifigCount = 0;

  try {
    const fullCategoryName = decodedSubcategory === 'Uncategorized'
      ? decodedTheme
      : `${decodedTheme} / ${decodedSubcategory}`;

    const response = await fetch(
      `${baseUrl}/api/minifigs/search?subcategory=${encodeURIComponent(fullCategoryName)}`,
      { cache: 'no-store' }
    );
    const data = await response.json();

    if (data.success && data.data) {
      minifigCount = data.data.length;
    }
  } catch (error) {
    console.error('Failed to fetch metadata for subcategory:', error);
  }

  // Build appropriate title and description
  const isUncategorized = decodedSubcategory === 'Uncategorized';
  const displayName = isUncategorized ? decodedTheme : decodedSubcategory;
  const fullName = isUncategorized ? decodedTheme : `${decodedTheme} ${decodedSubcategory}`;

  const title = `${displayName} LEGO Minifigures${minifigCount > 0 ? ` (${minifigCount.toLocaleString()})` : ''} | FigTracker`;
  const description = minifigCount > 0
    ? `Browse all ${minifigCount.toLocaleString()} ${fullName} LEGO minifigures with real-time BrickLink pricing. Track prices, manage your collection, and discover rare variants.`
    : `Browse ${fullName} LEGO minifigures with real-time BrickLink pricing. Track prices and manage your collection.`;

  return {
    title,
    description,
    keywords: [
      `${fullName} LEGO minifigures`,
      `${displayName} LEGO`,
      `${displayName} minifig price`,
      `${decodedTheme} ${decodedSubcategory}`,
      'BrickLink prices',
      'LEGO price guide',
      'minifigure collection'
    ],
    openGraph: {
      title: `${displayName} LEGO Minifigures | FigTracker`,
      description,
      url: `${baseUrl}/themes/${theme}/${subcategory}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${displayName} LEGO Minifigures`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} LEGO Minifigures`,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/themes/${theme}/${subcategory}`,
      languages: {
        'en': `${domains.en}/themes/${theme}/${subcategory}`,
        'de': `${domains.de}/themes/${theme}/${subcategory}`,
        'fr': `${domains.fr}/themes/${theme}/${subcategory}`,
        'es': `${domains.es}/themes/${theme}/${subcategory}`,
        'x-default': `${domains.en}/themes/${theme}/${subcategory}`,
      },
    },
  };
}

export default async function SubcategoryPage({
  params
}: {
  params: Promise<{ theme: string; subcategory: string }>
}) {
  const resolvedParams = await params;

  return <SubcategoryPageClient params={Promise.resolve(resolvedParams)} />;
}
