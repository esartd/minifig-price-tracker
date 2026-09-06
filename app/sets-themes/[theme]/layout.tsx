import { Metadata } from 'next';
import { headers } from 'next/headers';
import { loadAllBoxes } from '@/lib/boxes-data';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { buildAlternates } from '@/lib/i18n-alternates';

/**
 * Metadata for /sets-themes/<theme>.
 *
 * This layout exists solely to carry generateMetadata. The page beside it is a
 * client component ('use client'), and a client component cannot export
 * generateMetadata -- so these ~1,700 URLs silently inherited the root layout's
 * metadata instead. That meant every one of them shipped the homepage's title,
 * the homepage's description, and a canonical pointing at the homepage, while
 * being index,follow and listed in the sitemap. app/themes/[theme] solves the
 * same problem the same way.
 */

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, key) =>
    vars[key] !== undefined ? String(vars[key]) : _m
  );
}

/** Mirrors themeSlug() in lib/sitemap-data.ts, so the canonical matches the sitemap. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme: slug } = await params;
  const decoded = decodeURIComponent(slug);

  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '') as Locale;
  const t = await getTranslations(locale);
  const meta = t.setsThemeMeta || {};

  // The path has to be byte-identical to what the sitemap emits, or the
  // canonical and the sitemap entry disagree and the page drops out anyway.
  const pathname = `/sets-themes/${encodeURIComponent(normalize(decoded))}`;
  const alternates = buildAlternates(locale, pathname);

  let themeName = '';
  let count = 0;
  try {
    const boxes = loadAllBoxes();
    for (const box of boxes) {
      const parent = box.category_name.split(' / ')[0].trim();
      if (normalize(parent) === normalize(decoded)) {
        if (!themeName) themeName = parent;
        count++;
      }
    }
  } catch {
    // A theme page with a plain title still beats one claiming to be the
    // homepage, so fall through rather than bailing out.
  }

  if (!themeName) {
    return {
      title: meta.notFoundTitle || 'Theme Not Found',
      robots: { index: false, follow: true },
      alternates,
    };
  }

  const title = count
    ? interpolate(meta.title || '{theme} LEGO Sets — Prices and Values ({count} sets)', {
        theme: themeName,
        count: count.toLocaleString('en-US'),
      })
    : interpolate(meta.titleNoCount || '{theme} LEGO Sets — Prices and Values', {
        theme: themeName,
      });

  const description = interpolate(
    meta.description ||
      'Browse all {count} {theme} LEGO sets with current market prices. Track values, see what is retiring, and decide what to buy or sell.',
    { theme: themeName, count: count.toLocaleString('en-US') }
  );

  return {
    title,
    description,
    openGraph: { title, description, url: `${alternates?.canonical}`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates,
  };
}

export default function SetsThemeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
