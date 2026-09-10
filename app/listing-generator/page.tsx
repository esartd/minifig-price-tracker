import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { DOMAINS } from '@/lib/i18n-alternates';
import {
  MagnifyingGlassIcon,
  InboxArrowDownIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

/** One per step, in order. Tints match the card set on the homepage. */
const STEP_ICONS = [
  { Icon: MagnifyingGlassIcon,   tint: '#eff6ff', color: '#3b82f6' },
  { Icon: InboxArrowDownIcon,    tint: '#ecfdf5', color: '#059669' },
  { Icon: SparklesIcon,          tint: '#eef2ff', color: '#4f46e5' },
  { Icon: ClipboardDocumentIcon, tint: '#fff7ed', color: '#ea580c' },
];

const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'] as const;
// Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

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
    name: lg.meta?.title || 'IntoBrick Listing Generator',
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
      {/* A guide to a feature that lives somewhere else, so it goes stale
          silently. The steps below describe components/listing-generator-form.tsx
          as rendered by minifig-detail-client.tsx and set-detail-client.tsx:
          the "Generate Listing" label, the fact that the form only appears once
          the item is on one of your lists, and the Premium bypass that skips
          that requirement (non-Premium visitors see PremiumListingNote there).
          Change any of those and the steps here are wrong, with no build
          failure to warn you. */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {lg.hero?.title || 'Write Your Listing in Seconds'}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: '#525252', marginBottom: '24px', lineHeight: '1.6' }}>
          {lg.hero?.subtitle || 'Any item you own, turned into a ready-to-post listing — title, description, price.'}
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
          <p style={{ fontSize: 'var(--text-base)', color: '#404040', lineHeight: '1.7', marginBottom: '24px' }}>
            {lg.howItWorks?.paragraph1 || "It writes from the item's own data and today's price, so it needs to know exactly what you're selling. That is why it lives on each item's page, not here."}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { title: lg.steps?.step1?.title || 'Find the item and open its page', body: lg.steps?.step1?.body || 'Search by name or BrickLink ID — sw0001 and 75192-1 both work — then open the result.' },
              { title: lg.steps?.step2?.title || 'Add it to your items for sale', body: lg.steps?.step2?.body || 'The generator appears once the item is on one of your lists. This is the free route: add it to your inventory and the button shows up on that page. Premium members can skip this step and generate straight from any item page.' },
              { title: lg.steps?.step3?.title || 'Press "Generate Listing"', body: lg.steps?.step3?.body || 'You get a title, a suggested price and a full description, each with its own copy button. The settings icon beside it sets your platform and condition, and it remembers them for next time.' },
              { title: lg.steps?.step4?.title || 'Paste it into eBay, BrickLink, Facebook or Vinted', body: lg.steps?.step4?.body || 'Each platform gets wording written the way that platform expects, so the same item reads correctly wherever you list it.' },
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '20px 24px',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  flexShrink: 0,
                  borderRadius: '10px',
                  background: STEP_ICONS[i].tint,
                }}>
                  {(() => {
                    const { Icon, color } = STEP_ICONS[i];
                    return <Icon aria-hidden="true" style={{ width: 'var(--icon-lg)', height: 'var(--icon-lg)', color }} />;
                  })()}
                </span>
                <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                  {i + 1}. {step.title}
                </h3>
                <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.6', margin: 0 }}>
                  {step.body}
                </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ textAlign: 'center', padding: '32px', background: '#fafafa', borderRadius: '12px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: '#525252', marginBottom: '16px' }}>
            {lg.cta?.subtitle || 'Find the item you want to list.'}
          </p>
          <Link
            /* /search, not /. This button said "Search a minifigure or set" and
               pointed at the homepage, which was correct while the homepage WAS
               the search page. It is a promotional page now, so this landed
               people somewhere with no search results and no explanation. */
            href="/search"
            style={{ display: 'inline-block', padding: '12px 24px', background: '#3b82f6', color: '#ffffff', borderRadius: '999px', textDecoration: 'none', fontWeight: '600' }}
          >
            {lg.cta?.button || 'Search a minifigure or set'}
          </Link>
        </section>
      </div>
    </>
  );
}
