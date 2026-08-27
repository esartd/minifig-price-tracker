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

  const title = t.priceAlerts?.meta?.title || 'LEGO Price Alerts';
  const description = t.priceAlerts?.meta?.description || 'Get notified the moment a LEGO minifigure or set you want drops to your target price. Free, no spam.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/price-alerts`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/price-alerts`,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${domains[l]}/price-alerts`])),
        'x-default': `${domains.en}/price-alerts`,
      },
    },
  };
}

export default async function PriceAlertsPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale];
  const p = t.priceAlerts || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: p.meta?.title || 'LEGO Price Alerts',
    description: p.meta?.description || 'Get notified when a LEGO minifigure or set drops to your target price.',
    provider: { '@type': 'Organization', name: 'FigTracker' },
    url: `${baseUrl}/price-alerts`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {p.hero?.title || 'Never Miss a Price Drop'}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: '#525252', marginBottom: '40px', lineHeight: '1.6' }}>
          {p.hero?.subtitle || "Set a target price on any LEGO minifigure or set, and we'll let you know the moment it gets there."}
        </p>

        <section style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { title: p.steps?.step1?.title || 'Search any minifigure or set', body: p.steps?.step1?.body || 'Find the item you want on FigTracker — 18,000+ minifigures and 20,000+ sets.' },
            { title: p.steps?.step2?.title || 'Set your target price', body: p.steps?.step2?.body || "Tell us the price you'd buy at." },
            { title: p.steps?.step3?.title || "We'll email you when it hits your price", body: p.steps?.step3?.body || 'Prices refresh automatically in the background, so you find out as soon as it drops.' },
          ].map((step, i) => (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px 24px' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                {i + 1}. {step.title}
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.6', margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </section>

        <section style={{ textAlign: 'center', padding: '32px', background: '#fafafa', borderRadius: '12px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: '#525252', marginBottom: '16px' }}>
            {p.cta?.subtitle || "It's free, and takes about 10 seconds to set up."}
          </p>
          <Link
            href="/account/alerts"
            style={{ display: 'inline-block', padding: '12px 24px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}
          >
            {p.cta?.button || 'Set up a price alert'}
          </Link>
        </section>
      </div>
    </>
  );
}
