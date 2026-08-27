import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';

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

  const title = t.howWeCalculatePrices?.meta?.title || 'How We Calculate LEGO Prices';
  const description = t.howWeCalculatePrices?.meta?.description || 'How FigTracker computes a single suggested price for LEGO minifigures and sets, and how it compares to BrickEconomy.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/how-we-calculate-prices`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/how-we-calculate-prices`,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${domains[l]}/how-we-calculate-prices`])),
        'x-default': `${domains.en}/how-we-calculate-prices`,
      },
    },
  };
}

export default async function HowWeCalculatePricesPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale: Locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale];
  const h = t.howWeCalculatePrices || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: h.meta?.title || 'How We Calculate LEGO Prices',
    description: h.meta?.description || 'How FigTracker computes a single suggested price for LEGO minifigures and sets.',
    url: `${baseUrl}/how-we-calculate-prices`,
  };

  const differentiators = [
    {
      title: h.differentiators?.blend?.title || 'One blended number, not one signal',
      body: h.differentiators?.blend?.body || 'Your suggested price combines recent sold history, current BrickLink listings, the current lowest price, and an eBay cross-check — not just one data point that could be an outlier.',
    },
    {
      title: h.differentiators?.soldData?.title || 'Includes real sold history',
      body: h.differentiators?.soldData?.body || 'Unlike a price built only from what sellers are asking, our formula includes actual recent sold transactions as one of its inputs.',
    },
    {
      title: h.differentiators?.free?.title || 'Free, no account required',
      body: h.differentiators?.free?.body || 'Check any suggested price without signing up or paying for a subscription.',
    },
    {
      title: h.differentiators?.fresh?.title || 'Kept fresh automatically',
      body: h.differentiators?.fresh?.body || 'Prices refresh automatically in the background on a regular schedule, so you don’t have to manually look them up to get a current number.',
    },
    {
      title: h.differentiators?.simple?.title || 'One number instead of raw data to sort through',
      body: h.differentiators?.simple?.body || 'Rather than cross-referencing multiple raw listings and sold prices yourself, you get a single, clear number.',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>
          {h.hero?.title || 'How We Calculate Your Suggested Price'}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: '#525252', marginBottom: '40px', lineHeight: '1.6' }}>
          {h.hero?.subtitle || 'A plain-language look at the formula behind every FigTracker price — and how it compares to other LEGO pricing tools like BrickEconomy.'}
        </p>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717', marginBottom: '16px' }}>
            {h.howItWorks?.title || 'How the formula works'}
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: '#404040', lineHeight: '1.7', marginBottom: '16px' }}>
            {h.howItWorks?.paragraph1 || 'FigTracker’s suggested price is mostly built from BrickLink signals — a mix of recent sold transactions, current listing prices, and the current lowest price — with a small eBay cross-check added in when there’s enough clean data to use it.'}
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: '#404040', lineHeight: '1.7' }}>
            {h.howItWorks?.paragraph2 || 'We never show you raw BrickLink or eBay numbers directly — only the single computed result, refreshed automatically so it stays current without you having to look it up yourself.'}
          </p>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717', marginBottom: '24px' }}>
            {h.comparison?.title || 'How this compares to BrickEconomy'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {differentiators.map((d, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '20px 24px',
              }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.6', margin: 0 }}>
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{
          textAlign: 'center',
          padding: '32px',
          background: '#fafafa',
          borderRadius: '12px',
        }}>
          <p style={{ fontSize: 'var(--text-base)', color: '#525252', marginBottom: '16px' }}>
            {h.cta?.subtitle || 'See it in action on any minifigure or set page.'}
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            {h.cta?.button || 'Search a minifigure or set'}
          </Link>
        </section>
      </div>
    </>
  );
}
