import { Metadata } from 'next';
import ThemePageClient from '@/components/theme-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { DOMAINS } from '@/lib/i18n-alternates';
import { themeSlug, normalizeThemeSlug } from '@/lib/theme-slug';

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

  // Every self-referencing URL below used `theme` -- the segment exactly as
  // requested -- so /themes/star-wars and /themes/Star%20Wars each declared
  // ITSELF canonical. Two addresses, identical content, and no signal to
  // Google about which one counts. The sitemap has always submitted the slug
  // form, so that is the canonical one and these now say so regardless of
  // which spelling was asked for.
  const canonicalSlug = themeSlug(decodedTheme);

  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);

  const t = await getTranslations(locale as Locale);

  // Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

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

  // Resolve the slug back to the catalogue's own spelling of the theme.
  //
  // This used to title-case the slug -- "star-wars" -> "Star Wars" -- which
  // is right often enough to look correct and wrong wherever the real name is
  // not simple title case: "dc-comics-super-heroes" rendered as "Dc Comics
  // Super Heroes". That has always been live, because lib/sitemap-data.ts has
  // always submitted the slug form, and it is now the only form (the
  // middleware redirects the rest). So it is worth resolving properly.
  //
  // Same approach as app/sets-themes/[theme]/layout.tsx, which matches on the
  // normalised form and then displays the parent name it found. Falls back to
  // title-casing when nothing matches, so an unknown slug still renders a
  // readable heading rather than a slug.
  //
  // No brand suffix here -- the root layout's title template appends
  // "| IntoBrick", and baking it in as well is how these pages rendered it
  // twice.
  let displayTheme = '';
  try {
    const { getAllCategories } = await import('@/lib/catalog-static');
    const categories = await getAllCategories();
    const wanted = normalizeThemeSlug(decodedTheme);
    for (const category of categories) {
      const parent = category.name.split(' / ')[0].trim();
      if (normalizeThemeSlug(parent) === wanted) {
        displayTheme = parent;
        break;
      }
    }
  } catch (error) {
    console.error('Failed to resolve theme display name:', error);
  }
  if (!displayTheme) {
    displayTheme = decodedTheme
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Fetch subcategories to get count
  const baseUrl = domains[locale as keyof typeof domains];
  let totalMinifigs = 0;
  let seriesCount = 0;

  try {
    const response = await fetch(`${baseUrl}/api/subcategories?theme=${encodeURIComponent(displayTheme)}`, {
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
    ? interpolate(t.themeMeta?.titleWithCount || 'Browse {theme} LEGO Minifigures & Sets ({count} minifigs)', { theme: displayTheme, count: totalMinifigs.toLocaleString() })
    : interpolate(t.themeMeta?.titleNoCount || 'Browse {theme} LEGO Minifigures & Sets', { theme: displayTheme });

  const description = totalMinifigs > 0
    ? interpolate(t.themeMeta?.descriptionWithCount || 'Explore {count} {theme} LEGO minifigures and sets with smart market pricing. Track current market values, manage your collection, and organize items to sell and keep{seriesSuffix}.', { count: totalMinifigs.toLocaleString(), theme: displayTheme, seriesSuffix })
    : interpolate(t.themeMeta?.descriptionAllNoCount || 'Explore all {theme} LEGO minifigures and sets with smart market pricing. Track current market values, manage your collection, and organize items to sell and keep{seriesSuffix}.', { theme: displayTheme, seriesSuffix });

  return {
    title,
    description,
    keywords: [
      interpolate(t.themeMeta?.keywordThemeMinifigures || '{theme} LEGO minifigures', { theme: displayTheme }),
      interpolate(t.themeMeta?.keywordThemeSets || '{theme} LEGO sets', { theme: displayTheme }),
      interpolate(t.themeMeta?.keywordThemeMinifigPrice || '{theme} minifig price', { theme: displayTheme }),
      interpolate(t.themeMeta?.keywordThemeSetPrice || '{theme} set price', { theme: displayTheme }),
      interpolate(t.themeMeta?.keywordThemePriceTracker || '{theme} price tracker', { theme: displayTheme }),
      interpolate(t.themeMeta?.keywordThemeCollectionManager || '{theme} collection manager', { theme: displayTheme }),
      t.themeMeta?.keywordBricklinkPrices || 'BrickLink prices',
      t.themeMeta?.keywordLegoPriceGuide || 'LEGO price guide',
      t.themeMeta?.keywordTrackLegoPrices || 'track LEGO prices'
    ],
    openGraph: {
      title: interpolate(t.themeMeta?.ogTitleThemeSets || '{theme} LEGO Minifigures & Sets | IntoBrick', { theme: displayTheme }),
      description,
      url: `${domains[locale as keyof typeof domains]}/themes/${canonicalSlug}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: interpolate(nameLegoMinifigures, { name: displayTheme })
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: interpolate(nameLegoMinifigures, { name: displayTheme }),
      description,
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/themes/${canonicalSlug}`,
      languages: {
        'en': `${domains.en}/themes/${canonicalSlug}`,
        'de': `${domains.de}/themes/${canonicalSlug}`,
        'fr': `${domains.fr}/themes/${canonicalSlug}`,
        'es': `${domains.es}/themes/${canonicalSlug}`,
        'it': `${domains.it}/themes/${canonicalSlug}`,
        'nl': `${domains.nl}/themes/${canonicalSlug}`,
        'pl': `${domains.pl}/themes/${canonicalSlug}`,
        'pt': `${domains.pt}/themes/${canonicalSlug}`,
        'sv': `${domains.sv}/themes/${canonicalSlug}`,
        'ja': `${domains.ja}/themes/${canonicalSlug}`,
        'x-default': `${domains.en}/themes/${canonicalSlug}`,
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
