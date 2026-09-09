import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import SearchPageClient from './search-page-client';
import { DOMAINS } from '@/lib/i18n-alternates';

// Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }
): Promise<Metadata> {
  const params = await searchParams;
  const hasQuery = typeof params.q === 'string' && params.q.trim().length > 0;

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale] || domains.en;

  const title = t.search?.meta?.title || 'Search LEGO Minifigures & Sets';
  const description = t.search?.meta?.description || 'Search any LEGO minifigure or set to see its current suggested price, blended from BrickLink and eBay data.';

  return {
    title,
    description,
    /**
     * The empty page is noindex.
     *
     * /search with no ?q= has no content of its own -- a heading, a search
     * box, and the same sections that appear elsewhere. It was index,follow,
     * so Google could index a page that says nothing and competes with
     * /themes and the homepage for the same terms. Google treats internal
     * search results as thin content regardless.
     *
     * `follow` is kept so the links on it still pass through, and result
     * pages (?q=...) are untouched.
     */
    robots: hasQuery ? undefined : { index: false, follow: true },
    openGraph: { title, description, url: `${baseUrl}/search` },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/search`,
      languages: {
        ...Object.fromEntries(Object.entries(domains).map(([loc, d]) => [loc, `${d}/search`])),
        'x-default': `${domains.en}/search`,
      },
    },
  };
}

export default function SearchPage() {
  return <SearchPageClient />;
}
