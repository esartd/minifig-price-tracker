import { Metadata } from 'next';
import { getAllCategories, getAllMinifigs } from '@/lib/catalog-static';
import { THEME_OVERRIDES } from '@/lib/theme-main-characters';

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
      title: 'Theme Not Found',
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
    title: `${exactThemeName} LEGO Minifigures - Price Guide & Collection (${count} Minifigs) | FigTracker`,
    description: `Browse all ${count} ${exactThemeName} LEGO minifigures with real-time Bricklink prices. Track values, manage inventory, and discover character variants. Complete ${exactThemeName} collection guide.`,
    keywords: [
      `${exactThemeName} LEGO minifigures`,
      `${exactThemeName} minifig prices`,
      `${exactThemeName} Bricklink`,
      `${exactThemeName} LEGO collection`,
      'LEGO price guide',
      'minifigure value tracker',
    ],
    openGraph: {
      title: `${exactThemeName} LEGO Minifigures - ${count} Minifigs`,
      description: `Browse and price ${count} ${exactThemeName} LEGO minifigures with real-time Bricklink marketplace data`,
      url: `${domains[locale as keyof typeof domains]}/themes/${encodeURIComponent(themeName)}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
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
