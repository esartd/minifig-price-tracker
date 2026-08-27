import { Metadata } from 'next';
import SubcategoryPageClient from '@/components/subcategory-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';

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
  params: Promise<{ theme: string; subcategory: string }>
}): Promise<Metadata> {
  const { theme, subcategory } = await params;
  const decodedTheme = decodeURIComponent(theme);
  const decodedSubcategory = decodeURIComponent(subcategory);

  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);

  const t = await getTranslations(locale as Locale);

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

  const nameLegoMinifigures = t.themeMeta?.nameLegoMinifigures || '{name} LEGO Minifigures';
  const subTitleNoCount = t.themeMeta?.subTitleNoCount || '{name} LEGO Minifigures | FigTracker';

  const title = minifigCount > 0
    ? interpolate(t.themeMeta?.subTitleWithCount || '{name} LEGO Minifigures ({count}) | FigTracker', { name: displayName, count: minifigCount.toLocaleString() })
    : interpolate(subTitleNoCount, { name: displayName });
  const description = minifigCount > 0
    ? interpolate(t.themeMeta?.subDescriptionWithCount || 'Browse all {count} {fullName} LEGO minifigures with smart market pricing. Track prices, manage your collection, and discover rare variants.', { count: minifigCount.toLocaleString(), fullName })
    : interpolate(t.themeMeta?.subDescriptionNoCount || 'Browse {fullName} LEGO minifigures with smart market pricing. Track prices and manage your collection.', { fullName });

  return {
    title,
    description,
    keywords: [
      interpolate(t.themeMeta?.keywordFullNameMinifigures || '{fullName} LEGO minifigures', { fullName }),
      interpolate(t.themeMeta?.keywordNameLego || '{name} LEGO', { name: displayName }),
      interpolate(t.themeMeta?.keywordNameMinifigPrice || '{name} minifig price', { name: displayName }),
      `${decodedTheme} ${decodedSubcategory}`,
      t.themeMeta?.keywordBricklinkPrices || 'BrickLink prices',
      t.themeMeta?.keywordLegoPriceGuide || 'LEGO price guide',
      t.themeMeta?.keywordMinifigureCollection || 'minifigure collection'
    ],
    openGraph: {
      title: interpolate(subTitleNoCount, { name: displayName }),
      description,
      url: `${baseUrl}/themes/${theme}/${subcategory}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: interpolate(nameLegoMinifigures, { name: displayName })
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: interpolate(nameLegoMinifigures, { name: displayName }),
      description,
    },
    alternates: {
      canonical: `${baseUrl}/themes/${theme}/${subcategory}`,
      languages: {
        'en': `${domains.en}/themes/${theme}/${subcategory}`,
        'de': `${domains.de}/themes/${theme}/${subcategory}`,
        'fr': `${domains.fr}/themes/${theme}/${subcategory}`,
        'es': `${domains.es}/themes/${theme}/${subcategory}`,
        'it': `${domains.it}/themes/${theme}/${subcategory}`,
        'nl': `${domains.nl}/themes/${theme}/${subcategory}`,
        'pl': `${domains.pl}/themes/${theme}/${subcategory}`,
        'pt': `${domains.pt}/themes/${theme}/${subcategory}`,
        'sv': `${domains.sv}/themes/${theme}/${subcategory}`,
        'ja': `${domains.ja}/themes/${theme}/${subcategory}`,
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
