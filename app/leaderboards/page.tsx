import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import LeaderboardsSection from '@/components/LeaderboardsSection';

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

  const title = t.leaderboardsPage?.meta?.title || 'LEGO Collector Leaderboards';
  const description = t.leaderboardsPage?.meta?.description || 'See the top LEGO minifigure and set collectors on FigTracker, ranked by collection size.';

  return {
    title,
    description,
    openGraph: { title, description, url: `${baseUrl}/leaderboards`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `${baseUrl}/leaderboards`,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${domains[l]}/leaderboards`])),
        'x-default': `${domains.en}/leaderboards`,
      },
    },
  };
}

export default async function LeaderboardsPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  const baseUrl = domains[locale];
  const lb = t.leaderboardsPage || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: lb.meta?.title || 'LEGO Collector Leaderboards',
    description: lb.meta?.description || 'See the top LEGO minifigure and set collectors on FigTracker.',
    url: `${baseUrl}/leaderboards`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px', letterSpacing: '-0.02em', textAlign: 'center' }}>
          {lb.hero?.title || 'LEGO Collector Leaderboards'}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: '#525252', marginBottom: '16px', lineHeight: '1.6', textAlign: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          {lb.hero?.subtitle || 'See who has the biggest minifigure and set collections on FigTracker, updated each quarter.'}
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: '#737373', marginBottom: '40px', lineHeight: '1.6', textAlign: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          {lb.hero?.howToJoin || 'Rankings are based on the items in your inventory. Set a username and turn on leaderboard visibility in your account settings to appear here — it\'s opt-in.'}
        </p>

        <LeaderboardsSection />
      </div>
    </>
  );
}
