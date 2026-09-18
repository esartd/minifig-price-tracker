import { getAllMinifigs } from '@/lib/catalog-static';

/**
 * Grouping a theme's minifigs by sub-theme.
 *
 * Extracted from app/api/subcategories/route.ts so that
 * app/themes/[theme]/page.tsx can get the same counts without an HTTP request.
 *
 * Its `generateMetadata` used to `fetch()` that API over the *public* origin
 * with `cache: 'no-store'` -- so rendering a theme page meant a round trip out
 * through Cloudflare and back into the same process, on every request, purely
 * to put a number in the title. The data it was asking for is
 * `getAllMinifigs()`, an in-process read of the static catalogue with no
 * database or third-party call in it.
 *
 * Both callers share this function rather than counting separately, because a
 * second implementation of the same grouping is how the theme *slug* ended up
 * with two incompatible versions and every punctuated theme got two indexable
 * URLs.
 */

export interface ThemeSubcategory {
  id: number;
  fullName: string;
  subTheme: string;
  count: number;
}

/** Matches the API's fuzzy pass: case-insensitive, punctuation removed. */
function normalizeTheme(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Exact match first, then the same fuzzy fallback the API uses.
 *
 * The fallback matters: a theme whose name carries punctuation or an accent can
 * arrive here in a form that does not match `category_name` byte-for-byte.
 */
export async function getThemeSubcategories(theme: string): Promise<ThemeSubcategory[]> {
  const allMinifigs = await getAllMinifigs();
  const categoryMap = new Map<string, { id: number; count: number }>();

  const add = (name: string, id: number) => {
    const existing = categoryMap.get(name);
    if (existing) existing.count++;
    else categoryMap.set(name, { id, count: 1 });
  };

  for (const m of allMinifigs) {
    if (m.category_name === theme || m.category_name.startsWith(`${theme} / `)) {
      add(m.category_name, m.category_id);
    }
  }

  if (categoryMap.size === 0) {
    const normalizedQuery = normalizeTheme(theme);
    for (const m of allMinifigs) {
      const parentTheme = m.category_name.split(' / ')[0];
      if (normalizeTheme(parentTheme) === normalizedQuery) {
        add(m.category_name, m.category_id);
      }
    }
  }

  return Array.from(categoryMap.entries())
    .map(([categoryName, data]) => ({
      id: data.id,
      fullName: categoryName,
      subTheme: categoryName.split(' / ').slice(1).join(' / ') || 'Uncategorized',
      count: data.count,
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

/**
 * The two numbers the theme page's title and description need.
 *
 * `seriesCount` excludes the two bucket names that are not really series, which
 * is what the page was already doing with the API's response.
 */
export async function getThemeCounts(
  theme: string
): Promise<{ totalMinifigs: number; seriesCount: number }> {
  const subs = await getThemeSubcategories(theme);
  return {
    totalMinifigs: subs.reduce((sum, s) => sum + s.count, 0),
    seriesCount: subs.filter(
      (s) => s.subTheme !== 'Uncategorized' && s.subTheme !== '(Other)'
    ).length,
  };
}

/**
 * Resolve a URL slug back to the catalogue's own spelling of the theme.
 *
 * "star-wars" -> "Star Wars", "lego-ideas-(cuusoo)" -> "LEGO Ideas (CUUSOO)".
 *
 * Title-casing the slug is right often enough to look correct and wrong
 * wherever the real name is not simple title case -- "dc-comics-super-heroes"
 * renders as "Dc Comics Super Heroes" -- so the catalogue is consulted first
 * and the title-case pass is only the fallback for a slug that matches nothing.
 *
 * Lives here so the server page and its generateMetadata share one
 * implementation; they had two, and a second copy of theme-slug logic is
 * exactly how every punctuated theme ended up with two indexable URLs.
 */
export async function resolveThemeName(slug: string): Promise<string> {
  const { getAllCategories } = await import('@/lib/catalog-static');
  const { normalizeThemeSlug } = await import('@/lib/theme-slug');

  const decoded = decodeURIComponent(slug);

  try {
    const categories = await getAllCategories();
    const wanted = normalizeThemeSlug(decoded);
    for (const category of categories) {
      const parent = category.name.split(' / ')[0].trim();
      if (normalizeThemeSlug(parent) === wanted) return parent;
    }
  } catch (error) {
    console.error('Failed to resolve theme display name:', error);
  }

  return decoded
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
