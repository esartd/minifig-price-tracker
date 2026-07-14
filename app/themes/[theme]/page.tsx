import { Metadata } from 'next';
import ThemePageClient from '@/components/theme-page-client';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';

// Replace {placeholder} tokens in a translated template with dynamic values
function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (
    vars[key] !== undefined ? String(vars[key]) : match
  ));
}

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

  const nameLegoMinifigures = t.themeMeta?.nameLegoMinifigures || '{name} LEGO Minifigures';
  const seriesSuffix = seriesCount > 0
    ? interpolate(t.themeMeta?.acrossSeriesSuffix || ' across {count} series', { count: seriesCount })
    : '';

  const title = totalMinifigs > 0
    ? interpolate(t.themeMeta?.titleWithCount || 'Browse {theme} LEGO Minifigures & Sets ({count} minifigs) | FigTracker', { theme: decodedTheme, count: totalMinifigs.toLocaleString() })
    : interpolate(t.themeMeta?.titleNoCount || 'Browse {theme} LEGO Minifigures & Sets | FigTracker', { theme: decodedTheme });

  const description = totalMinifigs > 0
    ? interpolate(t.themeMeta?.descriptionWithCount || 'Explore {count} {theme} LEGO minifigures and sets with smart market pricing. Track current market values, manage your collection, and organize items to sell and keep{seriesSuffix}.', { count: totalMinifigs.toLocaleString(), theme: decodedTheme, seriesSuffix })
    : interpolate(t.themeMeta?.descriptionAllNoCount || 'Explore all {theme} LEGO minifigures and sets with smart market pricing. Track current market values, manage your collection, and organize items to sell and keep{seriesSuffix}.', { theme: decodedTheme, seriesSuffix });

  return {
    title,
    description,
    keywords: [
      interpolate(t.themeMeta?.keywordThemeMinifigures || '{theme} LEGO minifigures', { theme: decodedTheme }),
      interpolate(t.themeMeta?.keywordThemeSets || '{theme} LEGO sets', { theme: decodedTheme }),
      interpolate(t.themeMeta?.keywordThemeMinifigPrice || '{theme} minifig price', { theme: decodedTheme }),
      interpolate(t.themeMeta?.keywordThemeSetPrice || '{theme} set price', { theme: decodedTheme }),
      interpolate(t.themeMeta?.keywordThemePriceTracker || '{theme} price tracker', { theme: decodedTheme }),
      interpolate(t.themeMeta?.keywordThemeCollectionManager || '{theme} collection manager', { theme: decodedTheme }),
      t.themeMeta?.keywordBricklinkPrices || 'BrickLink prices',
      t.themeMeta?.keywordLegoPriceGuide || 'LEGO price guide',
      t.themeMeta?.keywordTrackLegoPrices || 'track LEGO prices'
    ],
    openGraph: {
      title: interpolate(t.themeMeta?.ogTitleThemeSets || '{theme} LEGO Minifigures & Sets | FigTracker', { theme: decodedTheme }),
      description,
      url: `${domains[locale as keyof typeof domains]}/themes/${theme}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: interpolate(nameLegoMinifigures, { name: decodedTheme })
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: interpolate(nameLegoMinifigures, { name: decodedTheme }),
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
