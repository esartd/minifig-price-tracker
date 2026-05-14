import { Metadata } from 'next';
import ThemePageClient from '@/components/theme-page-client';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ theme: string }>
}): Promise<Metadata> {
  const { theme } = await params;
  const decodedTheme = decodeURIComponent(theme);

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

  // Fetch subcategories to get count
  const baseUrl = domains[locale as keyof typeof domains];
  let totalMinifigs = 0;
  let seriesCount = 0;

  try {
    const response = await fetch(`${baseUrl}/api/subcategories?theme=${encodeURIComponent(decodedTheme)}`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.success) {
      const subs = data.data;
      totalMinifigs = subs.reduce((sum: number, sub: any) => sum + sub.count, 0);
      seriesCount = subs.filter((sub: any) => sub.subTheme !== 'Uncategorized' && sub.subTheme !== '(Other)').length;
    }
  } catch (error) {
    console.error('Failed to fetch metadata for theme:', error);
  }

  const title = `Browse ${decodedTheme} LEGO Minifigures${totalMinifigs > 0 ? ` (${totalMinifigs.toLocaleString()} minifigs)` : ''} | FigTracker`;
  const description = `Explore ${totalMinifigs > 0 ? totalMinifigs.toLocaleString() : 'all'} ${decodedTheme} LEGO minifigures with real-time BrickLink pricing. Track prices, manage your collection, and discover rare figures${seriesCount > 0 ? ` across ${seriesCount} series` : ''}.`;

  return {
    title,
    description,
    keywords: [
      `${decodedTheme} LEGO minifigures`,
      `${decodedTheme} LEGO`,
      `${decodedTheme} minifig price`,
      `${decodedTheme} price tracker`,
      `${decodedTheme} collection`,
      'BrickLink prices',
      'LEGO price guide'
    ],
    openGraph: {
      title: `${decodedTheme} LEGO Minifigures | FigTracker`,
      description,
      url: `${domains[locale as keyof typeof domains]}/themes/${theme}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${decodedTheme} LEGO Minifigures`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedTheme} LEGO Minifigures`,
      description,
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/themes/${theme}`,
      languages: {
        'en': `${domains.en}/themes/${theme}`,
        'de': `${domains.de}/themes/${theme}`,
        'fr': `${domains.fr}/themes/${theme}`,
        'es': `${domains.es}/themes/${theme}`,
        'x-default': `${domains.en}/themes/${theme}`,
      },
    },
  };
}

export default async function ThemePage({
  params
}: {
  params: Promise<{ theme: string }>
}) {
  const { theme } = await params;

  return <ThemePageClient params={Promise.resolve({ theme })} />;
}
