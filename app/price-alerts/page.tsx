import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { DOMAINS } from '@/lib/i18n-alternates';

const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'] as const;
// Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

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
    provider: { '@type': 'Organization', name: 'IntoBrick' },
    url: `${baseUrl}/price-alerts`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* This page is a guide to a feature that lives somewhere else, so it
          goes stale silently. The behaviour described below comes from
          components/PriceAlertButton.tsx -- specifically the "Price Alert"
          label, the `if (!session) return null` that hides the button from
          signed-out visitors, and the check that refuses a target at or above
          the current price. If any of those three change, the steps here are
          wrong and nothing will fail a build to tell you. */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {p.hero?.title || 'Never Miss a Price Drop'}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: '#525252', marginBottom: '40px', lineHeight: '1.6' }}>
          {p.hero?.subtitle || "Set a target price on any LEGO minifigure or set, and we'll let you know the moment it gets there."}
        </p>

        <section style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { title: p.steps?.step1?.title || 'Sign in first', body: p.steps?.step1?.body || 'Alerts are tied to your email address, so the button only appears once you are signed in. It is free and takes a moment.' },
            { title: p.steps?.step2?.title || 'Open the minifigure or set you want', body: p.steps?.step2?.body || 'Search by name or BrickLink ID, then open the item page. There are 18,000+ minifigures and 20,000+ sets to choose from.' },
            { title: p.steps?.step3?.title || 'Press "Price Alert" on that page', body: p.steps?.step3?.body || 'You will find it among the buttons beside the price. It opens a small box asking what you want to pay.' },
            { title: p.steps?.step4?.title || 'Enter a price below the current one', body: p.steps?.step4?.body || 'The target has to be lower than what the item costs today — an alert for a price it has already reached would fire instantly, so we ask for a real target.' },
            { title: p.steps?.step5?.title || 'We email you when it drops', body: p.steps?.step5?.body || 'Prices refresh in the background, so you hear from us as soon as the item reaches your number. You can change or delete any alert later from your account.' },
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
            style={{ display: 'inline-block', padding: '12px 24px', background: '#3b82f6', color: '#ffffff', borderRadius: '999px', textDecoration: 'none', fontWeight: '600' }}
          >
            {p.cta?.button || 'Set up a price alert'}
          </Link>
        </section>
      </div>
    </>
  );
}
