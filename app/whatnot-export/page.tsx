import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import WhatnotExportClient from '@/components/whatnot-export-client';

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

  const title = t.whatnotExport?.meta?.title || 'Whatnot CSV Export for LEGO Sellers';
  const description =
    t.whatnotExport?.meta?.description ||
    'Turn your LEGO collection into a Whatnot bulk-import CSV in one click. Prices, conditions, shipping profiles and photos filled in for you. Free.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/whatnot-export`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/whatnot-export`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${domains[l]}/whatnot-export`])),
        'x-default': `${domains.en}/whatnot-export`,
      },
    },
  };
}

export default async function WhatnotExportPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale];
  const { source } = await searchParams;

  const w = t.whatnotExport || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: w.meta?.title || 'Whatnot CSV Export for LEGO Sellers',
    description:
      w.meta?.description ||
      'Turn your LEGO collection into a Whatnot bulk-import CSV in one click.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${baseUrl}/whatnot-export`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'FigTracker' },
  };

  const steps = [
    {
      title: w.steps?.step1?.title || 'Pick what you want to sell',
      body:
        w.steps?.step1?.body ||
        'Choose any of your four collections and tick the items you want to list.',
    },
    {
      title: w.steps?.step2?.title || 'Set your prices and conditions once',
      body:
        w.steps?.step2?.body ||
        'Start from FigTracker’s suggested price, add a markup if you want, and choose how your conditions map to Whatnot’s.',
    },
    {
      title: w.steps?.step3?.title || 'Download and upload',
      body:
        w.steps?.step3?.body ||
        'You get a CSV that matches Whatnot’s template exactly. Upload it to your Whatnot Inventory and your drafts are ready.',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: '#171717',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          {w.hero?.title || 'List on Whatnot in One Upload'}
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: '#525252',
            marginBottom: '40px',
            lineHeight: 1.6,
          }}
        >
          {w.hero?.subtitle ||
            'Whatnot lets you bulk-import listings from a CSV. FigTracker already knows your items, their prices and their weights — so it can write that file for you.'}
        </p>

        <div style={{ marginBottom: '48px' }}>
          <WhatnotExportClient initialSource={source} />
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '20px',
            }}
          >
            {w.howItWorks || 'How it works'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '20px 24px',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: '#171717',
                    marginBottom: '8px',
                  }}
                >
                  {i + 1}. {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-base)',
                    color: '#525252',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: '24px',
            background: '#fafafa',
            borderRadius: '12px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '12px',
            }}
          >
            {w.notes?.title || 'Before you upload'}
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: 'var(--text-base)',
              color: '#525252',
              lineHeight: 1.7,
            }}
          >
            <li>
              {w.notes?.photos ||
                'Photos come from the LEGO catalog. For used items, replacing them with your own pictures will sell better.'}
            </li>
            <li>
              {w.notes?.shipping ||
                'Shipping profiles are estimated from catalog weight plus your packaging allowance. Weigh anything unusual before listing it.'}
            </li>
            <li>
              {w.notes?.region ||
                'This file matches Whatnot’s United States template. Sellers in other regions use a different one.'}
            </li>
          </ul>
        </section>

        <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: 1.6 }}>
          {w.pricingLink?.text || 'Curious where the suggested prices come from?'}{' '}
          <Link href="/how-we-calculate-prices" style={{ color: '#3b82f6' }}>
            {w.pricingLink?.linkText || 'See how we calculate prices'}
          </Link>
        </p>
      </div>
    </>
  );
}
