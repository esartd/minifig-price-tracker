import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';

const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'] as const;
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale];

  const title = t.listingGenerator?.meta?.title || 'LEGO Listing Generator';
  const description = t.listingGenerator?.meta?.description || 'Generate ready-to-post marketplace listings for your LEGO minifigures and sets — eBay, BrickLink, Facebook Marketplace, and Vinted.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/listing-generator`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/listing-generator`,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${domains[l]}/listing-generator`])),
        'x-default': `${domains.en}/listing-generator`,
      },
    },
  };
}

export default async function ListingGeneratorPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale];
  const lg = t.listingGenerator || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: lg.meta?.title || 'FigTracker Listing Generator',
    applicationCategory: 'BusinessApplication',
    description: lg.meta?.description || 'Generate ready-to-post marketplace listings for LEGO minifigures and sets.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `${baseUrl}/listing-generator`,
  };

  const marketplaces = ['eBay', 'BrickLink', 'Facebook Marketplace', 'Vinted'];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {lg.hero?.title || 'Write Your Listing in Seconds'}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: '#525252', marginBottom: '24px', lineHeight: '1.6' }}>
          {lg.hero?.subtitle || 'Turn any item in your collection into a ready-to-post listing — title, description, and suggested price included.'}
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {marketplaces.map((m) => (
            <span key={m} style={{
              padding: '6px 14px',
              background: '#eff6ff',
              color: '#3b82f6',
              borderRadius: '999px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
            }}>
              {m}
            </span>
          ))}
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717', marginBottom: '16px' }}>
            {lg.howItWorks?.title || 'How it works'}
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: '#404040', lineHeight: '1.7', marginBottom: '16px' }}>
            {lg.howItWorks?.paragraph1 || "Because it's built from your item's own catalog data and current suggested price, the listing generator lives on each minifigure and set page — it needs to know exactly which item you're selling."}
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: '#404040', lineHeight: '1.7' }}>
            {lg.howItWorks?.paragraph2 || 'Search for your item below, open its page, and look for the "Generate Listing" option once you\'ve added it to your inventory.'}
          </p>
        </section>

        <section style={{ textAlign: 'center', padding: '32px', background: '#fafafa', borderRadius: '12px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: '#525252', marginBottom: '16px' }}>
            {lg.cta?.subtitle || 'Find the item you want to list.'}
          </p>
          <Link
            href="/"
            style={{ display: 'inline-block', padding: '12px 24px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}
          >
            {lg.cta?.button || 'Search a minifigure or set'}
          </Link>
        </section>
      </div>
    </>
  );
}
