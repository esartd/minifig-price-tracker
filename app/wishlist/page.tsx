import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import WishlistPageClient from './wishlist-page-client';

const domains: Record<string, string> = {
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale] || domains.en;

  // Generic, non-personalized copy — this page's real content is per-user
  // and auth-gated, so crawlers only ever see this static description.
  const title = t.wishlist?.meta?.title || 'LEGO Wishlist Tracker';
  const description = t.wishlist?.meta?.description || 'Track LEGO minifigures and sets you want to buy, with live suggested prices so you know when to grab them.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/wishlist` },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/wishlist`,
      languages: {
        ...Object.fromEntries(Object.entries(domains).map(([loc, d]) => [loc, `${d}/wishlist`])),
        'x-default': `${domains.en}/wishlist`,
      },
    },
  };
}

export default function WishlistPage() {
  return <WishlistPageClient />;
}
