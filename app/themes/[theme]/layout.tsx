import { Metadata } from 'next';
import { getAllCategories, getAllMinifigs } from '@/lib/catalog-static';
import { THEME_OVERRIDES } from '@/lib/theme-main-characters';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';

// Replace {placeholder} tokens in a translated template with dynamic values
function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (
    vars[key] !== undefined ? String(vars[key]) : match
  ));
}

// Helper to normalize theme names
function normalizeThemeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function denormalizeSlug(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ theme: string }>
}): Promise<Metadata> {
  const { theme: slug } = await params;
  const themeName = decodeURIComponent(slug);

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

  // Get categories to find exact theme name
  const categories = await getAllCategories();
  const uniqueThemes = new Set<string>();

  categories.forEach(cat => {
    const parts = cat.name.split(' / ');
    uniqueThemes.add(parts[0]);
  });

  const exactThemeName = Array.from(uniqueThemes).find(
    t => normalizeThemeName(t) === themeName || t === themeName
  );

  if (!exactThemeName) {
    return {
      title: t.themeMeta?.notFoundTitle || 'Theme Not Found',
    };
  }

  // Get minifig count for this theme
  const allMinifigs = await getAllMinifigs();
  const themeMinifigs = allMinifigs.filter(m => {
    const parentTheme = m.category_name.split(' / ')[0];
    return parentTheme === exactThemeName;
  });

  const count = themeMinifigs.length;

  return {
    title: interpolate(t.themeMeta?.layoutTitle || '{theme} LEGO Minifigures - Price Guide & Collection ({count} Minifigs) | FigTracker', { theme: exactThemeName, count }),
    description: interpolate(t.themeMeta?.layoutDescription || 'Browse all {count} {theme} LEGO minifigures with smart market pricing. Track values, manage inventory, and discover character variants. Complete {theme} collection guide.', { count, theme: exactThemeName }),
    keywords: [
      interpolate(t.themeMeta?.keywordThemeMinifigures || '{theme} LEGO minifigures', { theme: exactThemeName }),
      interpolate(t.themeMeta?.keywordThemeMinifigPrices || '{theme} minifig prices', { theme: exactThemeName }),
      interpolate(t.themeMeta?.keywordThemeBricklink || '{theme} Bricklink', { theme: exactThemeName }),
      interpolate(t.themeMeta?.keywordThemeLegoCollection || '{theme} LEGO collection', { theme: exactThemeName }),
      t.themeMeta?.keywordLegoPriceGuide || 'LEGO price guide',
      t.themeMeta?.keywordMinifigureValueTracker || 'minifigure value tracker',
    ],
    openGraph: {
      title: interpolate(t.themeMeta?.layoutOgTitle || '{theme} LEGO Minifigures - {count} Minifigs', { theme: exactThemeName, count }),
      description: interpolate(t.themeMeta?.layoutOgDescription || 'Browse and price {count} {theme} LEGO minifigures with smart market pricing from multiple sources', { count, theme: exactThemeName }),
      url: `${domains[locale as keyof typeof domains]}/themes/${encodeURIComponent(themeName)}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: THEME_OVERRIDES[exactThemeName]
        ? [`https://img.bricklink.com/ItemImage/MN/0/${THEME_OVERRIDES[exactThemeName]}.png`]
        : [],
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/themes/${encodeURIComponent(themeName)}`,
      languages: {
        'en': `${domains.en}/themes/${encodeURIComponent(themeName)}`,
        'de': `${domains.de}/themes/${encodeURIComponent(themeName)}`,
        'fr': `${domains.fr}/themes/${encodeURIComponent(themeName)}`,
        'es': `${domains.es}/themes/${encodeURIComponent(themeName)}`,
        'it': `${domains.it}/themes/${encodeURIComponent(themeName)}`,
        'nl': `${domains.nl}/themes/${encodeURIComponent(themeName)}`,
        'pl': `${domains.pl}/themes/${encodeURIComponent(themeName)}`,
        'pt': `${domains.pt}/themes/${encodeURIComponent(themeName)}`,
        'sv': `${domains.sv}/themes/${encodeURIComponent(themeName)}`,
        'ja': `${domains.ja}/themes/${encodeURIComponent(themeName)}`,
        'x-default': `${domains.en}/themes/${encodeURIComponent(themeName)}`,
      },
    },
  };
}

export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
