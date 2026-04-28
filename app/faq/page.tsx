import type { Metadata } from 'next';
import Link from 'next/link';
import FAQList from '@/components/faq-list';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | FigTracker',
  description: 'Common questions about FigTracker LEGO minifigure and set price tracker. Learn how to price items, track inventory in 15+ currencies, and use Bricklink data effectively.',
  keywords: ['LEGO pricing FAQ', 'Bricklink help', 'minifigure pricing guide', 'FigTracker help', 'how to price LEGO', 'LEGO set tracker'],
  openGraph: {
    title: 'Frequently Asked Questions | FigTracker',
    description: 'Get answers about pricing LEGO minifigures and sets with FigTracker. 15+ currencies, 18,000+ minifigs, 20,000+ sets.',
    url: 'https://figtracker.ericksu.com/faq',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/faq',
  },
};

const faqs = [
  {
    question: 'How does FigTracker calculate suggested prices?',
    answer: 'FigTracker averages three Bricklink data points: quantity-weighted average of sold prices (6-month history), quantity-weighted average of current listings, and lowest current price. The formula is: (sold avg + stock avg + lowest) / 3. This balanced approach adapts faster to market changes than using sold prices alone.',
  },
  {
    question: 'Is FigTracker free to use?',
    answer: 'Yes! FigTracker is completely free to use. Search 18,000+ minifigures, browse 20,000+ LEGO sets, get real-time pricing in 15+ currencies, and track your inventory without any payment required.',
  },
  {
    question: 'Where does the pricing data come from?',
    answer: 'All pricing data comes directly from the official Bricklink API. We fetch global marketplace listings (6-month history) and convert them to your preferred currency using real-time exchange rates. You can refresh prices anytime to get the latest data.',
  },
  {
    question: 'What currencies are supported?',
    answer: 'FigTracker supports 15+ currencies including USD, EUR, GBP, CAD, AUD, JPY, MXN, and more. Pricing data is fetched from global sellers and automatically converted to your selected currency using current exchange rates.',
  },
  {
    question: 'Can I browse and track LEGO sets?',
    answer: 'Yes! FigTracker includes 20,000+ LEGO sets from the complete Bricklink catalog. Browse sets by theme, view included minifigures, and see direct buy links to LEGO.com, Amazon, and BrickLink for both new and retired sets.',
  },
  {
    question: 'How many LEGO minifigures are in the database?',
    answer: 'FigTracker includes over 18,000 LEGO minifigures from the complete Bricklink catalog, covering Star Wars, Harry Potter, Marvel, DC, Ninjago, and 50+ other themes.',
  },
  {
    question: 'Can I track my inventory?',
    answer: 'Yes! Create a free account to track your minifigure inventory. You can maintain separate collections for items you\'re selling and your personal collection. Track quantities, conditions (New/Used), see total portfolio value, and refresh all prices with one click.',
  },
  {
    question: 'How do I search for minifigures or sets?',
    answer: 'Search by exact Bricklink item number (e.g., "sw1219", "75192-1") or by name. Browse visually by theme to see minifigures and sets. Search supports partial matches and shows results with images and current pricing.',
  },
  {
    question: 'What condition factors affect pricing?',
    answer: 'FigTracker shows prices for both New and Used conditions. New minifigs typically command higher prices, while Used condition prices reflect market values for previously owned items. You can toggle between conditions on each detail page.',
  },
  {
    question: 'How often is pricing data updated?',
    answer: 'Pricing data is cached for 24 hours for performance. You can manually refresh prices anytime by clicking the refresh button on any minifig page or using the "Refresh All Prices" button in your inventory to update your entire collection at once.',
  },
  {
    question: 'Can I export my inventory?',
    answer: 'Currently, inventory data is viewable through your FigTracker dashboard. Export functionality is planned for a future update.',
  },
  {
    question: 'What if I find something that\'s not in the database?',
    answer: 'FigTracker syncs with the complete Bricklink catalog. If a minifig or set exists on Bricklink, it should be in our database. Contact us if you find a legitimate Bricklink item that\'s missing.',
  },
  {
    question: 'Is my inventory data private?',
    answer: 'Yes, your inventory is completely private and only visible to you when logged in. We never share or sell your data.',
  },
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[#fafafa]">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '32px',
              marginBottom: '40px',
              lineHeight: '1',
              height: '44px',
              minHeight: '44px',
              maxHeight: '44px',
              boxSizing: 'border-box'
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '600',
                color: '#ffffff',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}>HELP CENTER</span>
            </div>
            <h1>Frequently Asked Questions</h1>
            <p>Everything you need to know about pricing and tracking LEGO minifigures</p>
          </div>
          <div className="hero-decoration hero-decoration-1"></div>
          <div className="hero-decoration hero-decoration-2"></div>
        </header>

        {/* FAQ Content */}
        <section className="about-section bg-white">
          <div className="about-page-container">
            <div className="max-w-[800px] mx-auto">
              <FAQList faqs={faqs} />
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="about-section about-personas-section">
          <div className="about-page-container">
            <div className="section-content-narrow">
              <h2>Still have questions?</h2>
              <p style={{ marginBottom: '32px' }}>Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.</p>

              <div style={{
                background: '#fafafa',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '8px'
                }}>
                  Contact Support
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  marginBottom: '20px'
                }}>
                  Email us with any questions or feedback
                </p>
                <a
                  href="mailto:hello@ericksu.com"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  hello@ericksu.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-section about-cta-section">
          <div className="about-page-container">
            <div className="section-content-narrow">
              <h2>Ready to get started?</h2>
              <p>Start pricing your LEGO minifigures with real Bricklink data</p>
              <Link href="/search" className="cta-button">
                Start Pricing Now →
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
