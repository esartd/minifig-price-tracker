import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { buildAlternates } from '@/lib/i18n-alternates';

/**
 * Metadata for /sets/browse.
 *
 * This layout exists solely to carry generateMetadata. The page beside it is a
 * client component ('use client'), and a client component cannot export
 * generateMetadata -- so this URL silently inherited the root layout's
 * metadata. Measured on production before this file existed:
 *
 *   title:     "IntoBrick - One Price for Any LEGO Minifigure or Set"
 *   canonical: "https://intobrick.com"
 *
 * That is the homepage's title and, worse, the homepage's canonical. The page
 * was telling Google "I am the homepage", so it could never rank for anything
 * and every crawl of it was wasted. It is not in the sitemap, but it is linked
 * from six places in app/sets-inventory and app/sets-collection, so it does
 * get crawled.
 *
 * app/sets-themes/[theme]/layout.tsx and app/themes/[theme] solve the same
 * problem the same way; this is the third instance of it.
 *
 * Title and description reuse sets.browse.title / sets.browse.subtitle, which
 * already exist in all ten locales. Inventing new meta strings here would mean
 * ten more translations for no gain -- these already say exactly the right
 * thing.
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '') as Locale;
  const t = await getTranslations(locale);

  const title = t.sets?.browse?.title || 'Browse LEGO Sets';
  const description =
    t.sets?.browse?.subtitle || 'Search and explore LEGO sets from all themes';

  return {
    title,
    description,
    alternates: buildAlternates(locale, '/sets/browse'),
    openGraph: {
      title,
      description,
      url: `${buildAlternates(locale, '/sets/browse')?.canonical}`,
      type: 'website',
    },
  };
}

export default function SetsBrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
