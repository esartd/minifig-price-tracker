import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations } from '@/lib/i18n-subdomain';
import { loadAllBoxes } from '@/lib/boxes-data';
import { getRetiringSoonSets } from '@/lib/retiring-soon-algorithm';
import RetiringSoonClient from '@/components/retiring-soon-client';
import type { Locale } from '@/lib/i18n-subdomain';

// Domain configuration for all languages
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

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ theme?: string }> }): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale: Locale = host.startsWith('de.') ? 'de' :
                        host.startsWith('fr.') ? 'fr' :
                        host.startsWith('es.') ? 'es' :
                        host.startsWith('it.') ? 'it' :
                        host.startsWith('nl.') ? 'nl' :
                        host.startsWith('pl.') ? 'pl' :
                        host.startsWith('pt.') ? 'pt' :
                        host.startsWith('sv.') ? 'sv' :
                        host.startsWith('ja.') ? 'ja' : 'en';
  const t = await getTranslations(locale);
  const params = await searchParams;
  const theme = params?.theme;

  const title = theme
    ? `${theme} ${t.retiringSoon?.pageTitle || 'LEGO Sets Retiring Soon 2026'} | FigTracker`
    : `${t.retiringSoon?.pageTitle || 'LEGO Sets Retiring Soon 2026'} | FigTracker`;

  return {
    title,
    description: t.retiringSoon?.metaDescription || 'Track LEGO sets retiring in 2026',
    alternates: {
      canonical: `${domains[locale]}/retiring-soon`,
      languages: Object.fromEntries(
        locales.map(l => [l, `${domains[l]}/retiring-soon`])
      )
    },
    openGraph: {
      title,
      description: t.retiringSoon?.metaDescription || 'Track LEGO sets retiring in 2026',
      url: `${domains[locale]}/retiring-soon`,
      siteName: 'FigTracker',
      type: 'website',
      images: [{
        url: `${domains[locale]}/og-image.png`,
        width: 1200,
        height: 630,
        alt: t.retiringSoon?.pageTitle || 'LEGO Sets Retiring Soon 2026'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t.retiringSoon?.metaDescription || 'Track LEGO sets retiring in 2026'
    }
  };
}

export default async function RetiringSoonPage({
  searchParams
}: {
  searchParams?: Promise<{ theme?: string; timeline?: string }>
}) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale: Locale = host.startsWith('de.') ? 'de' :
                        host.startsWith('fr.') ? 'fr' :
                        host.startsWith('es.') ? 'es' :
                        host.startsWith('it.') ? 'it' :
                        host.startsWith('nl.') ? 'nl' :
                        host.startsWith('pl.') ? 'pl' :
                        host.startsWith('pt.') ? 'pt' :
                        host.startsWith('sv.') ? 'sv' :
                        host.startsWith('ja.') ? 'ja' : 'en';
  const t = await getTranslations(locale);

  // Get all themes from catalog for filter dropdown
  const boxes = loadAllBoxes();
  const themeSet = new Set<string>();
  boxes.forEach(box => {
    const parentTheme = box.category_name.split(' / ')[0].trim();
    themeSet.add(parentTheme);
  });
  const themes = Array.from(themeSet).sort();

  // Fetch initial data server-side for SEO
  const params = await searchParams;
  const theme = params?.theme;
  const timeline = params?.timeline || 'all';
  const initialData = await getRetiringSoonSets({
    theme,
    timeline,
    limit: 50
  });

  const baseUrl = domains[locale];
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'LEGO Sets Predicted to Retire Soon',
    itemListElement: initialData.slice(0, 50).map((set, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: set.name,
      url: `${baseUrl}/sets/${set.boxNo}`,
    })),
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t.retiringSoon?.faq?.howPredictQ || 'How do we predict retirements?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.retiringSoon?.faq?.howPredictA || 'We analyze set age, theme patterns, price trends, and community reports. UCS sets typically retire after 4-5 years, while licensed themes retire after 2-3 years.',
        },
      },
      {
        '@type': 'Question',
        name: t.retiringSoon?.faq?.whyRetireQ || 'Why do LEGO sets retire?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.retiringSoon?.faq?.whyRetireA || 'LEGO retires sets to make room for new releases, due to licensing agreements ending, or when sales decline.',
        },
      },
      {
        '@type': 'Question',
        name: t.retiringSoon?.faq?.shouldInvestQ || 'Should I buy retiring sets as investments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.retiringSoon?.faq?.shouldInvestA || 'Retiring sets can appreciate in value, but not all do. Always buy sets you enjoy building, not just for investment.',
        },
      },
      {
        '@type': 'Question',
        name: t.retiringSoon?.faq?.accuracyQ || 'How accurate are these predictions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.retiringSoon?.faq?.accuracyA || 'Our predictions are estimates based on historical patterns. High confidence predictions are typically accurate within 3-6 months.',
        },
      },
    ],
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Hero section */}
      <section style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem 0'
      }}>
        <h1 style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '1rem'
        }}>
          {t.retiringSoon?.hero?.title || 'Don\'t Miss Out on These Sets'}
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: '#525252',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          {t.retiringSoon?.hero?.subtitle || 'Our algorithm predicts which LEGO sets are likely to retire based on age, price trends, and historical data'}
        </p>
      </section>

      {/* Client component for filters + dynamic updates */}
      <RetiringSoonClient
        initialData={initialData}
        themes={themes}
        initialTheme={theme || 'all'}
        initialTimeline={timeline}
        translations={t.retiringSoon}
      />

      {/* FAQ section */}
      <section style={{
        marginTop: '4rem',
        padding: '2rem',
        background: '#fafafa',
        borderRadius: '12px'
      }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          marginBottom: '2rem',
          color: '#171717'
        }}>
          {t.retiringSoon?.faq?.title || 'Frequently Asked Questions'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* FAQ Item 1 */}
          <div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#171717'
            }}>
              {t.retiringSoon?.faq?.howPredictQ || 'How do we predict retirements?'}
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#525252',
              lineHeight: '1.6'
            }}>
              {t.retiringSoon?.faq?.howPredictA || 'We analyze set age, theme patterns, price trends, and community reports. UCS sets typically retire after 4-5 years, while licensed themes retire after 2-3 years.'}
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#171717'
            }}>
              {t.retiringSoon?.faq?.whyRetireQ || 'Why do LEGO sets retire?'}
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#525252',
              lineHeight: '1.6'
            }}>
              {t.retiringSoon?.faq?.whyRetireA || 'LEGO retires sets to make room for new releases, due to licensing agreements ending, or when sales decline.'}
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#171717'
            }}>
              {t.retiringSoon?.faq?.shouldInvestQ || 'Should I buy retiring sets as investments?'}
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#525252',
              lineHeight: '1.6'
            }}>
              {t.retiringSoon?.faq?.shouldInvestA || 'Retiring sets can appreciate in value, but not all do. Always buy sets you enjoy building, not just for investment.'}
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#171717'
            }}>
              {t.retiringSoon?.faq?.accuracyQ || 'How accurate are these predictions?'}
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#525252',
              lineHeight: '1.6'
            }}>
              {t.retiringSoon?.faq?.accuracyA || 'Our predictions are estimates based on historical patterns. High confidence predictions are typically accurate within 3-6 months.'}
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
