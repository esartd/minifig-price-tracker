import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | FigTracker',
  description: 'Common questions about FigTracker LEGO minifigure price tracker. Learn how to price minifigs, track inventory, and use Bricklink data effectively.',
  keywords: ['LEGO pricing FAQ', 'Bricklink help', 'minifigure pricing guide', 'FigTracker help', 'how to price LEGO'],
  openGraph: {
    title: 'Frequently Asked Questions | FigTracker',
    description: 'Get answers to common questions about pricing LEGO minifigures with FigTracker',
    url: 'https://figtracker.ericksu.com/faq',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/faq',
  },
};

const faqs = [
  {
    question: 'How does FigTracker calculate suggested prices?',
    answer: 'FigTracker uses a smart algorithm that combines three Bricklink marketplace data points: quantity-weighted average (accounts for bulk listings), simple average (equal weight per listing), and lowest available price. This gives you a balanced suggested price that reflects current market conditions.',
  },
  {
    question: 'Is FigTracker free to use?',
    answer: 'Yes! FigTracker is completely free to use. Search 18,000+ minifigures, get real-time pricing, and track your inventory without any payment required.',
  },
  {
    question: 'Where does the pricing data come from?',
    answer: 'All pricing data comes directly from the official Bricklink API. We pull current US marketplace listings to ensure accuracy. You can refresh prices anytime to get the latest data.',
  },
  {
    question: 'How many LEGO minifigures are in the database?',
    answer: 'FigTracker includes over 18,000 LEGO minifigures from the complete Bricklink catalog, covering Star Wars, Harry Potter, Marvel, DC, Ninjago, and 50+ other themes.',
  },
  {
    question: 'Can I track my inventory?',
    answer: 'Yes! Create a free account to track your minifigure inventory. You can maintain separate collections for items you\'re selling and your personal collection. Track quantities, conditions (New/Used), and see total portfolio value.',
  },
  {
    question: 'How do I search for a specific minifigure?',
    answer: 'You can search by exact Bricklink item number (e.g., "sw1219", "dis134") or by character/minifig name. The search supports partial matches and shows results sorted by release year.',
  },
  {
    question: 'What condition factors affect pricing?',
    answer: 'FigTracker shows prices for both New and Used conditions. New minifigs typically command higher prices, while Used condition prices reflect market values for previously owned items. You can toggle between conditions on each minifig detail page.',
  },
  {
    question: 'How often is pricing data updated?',
    answer: 'You can refresh pricing data anytime by clicking the refresh button on a minifig page. The system fetches current marketplace listings from Bricklink in real-time.',
  },
  {
    question: 'Can I export my inventory?',
    answer: 'Currently, inventory data is viewable through your FigTracker dashboard. Export functionality is planned for a future update.',
  },
  {
    question: 'What if I find a minifigure that\'s not in the database?',
    answer: 'FigTracker syncs with the complete Bricklink catalog. If a minifig exists on Bricklink, it should be in our database. Contact us if you find a legitimate Bricklink minifig that\'s missing.',
  },
  {
    question: 'Does FigTracker work for international sellers?',
    answer: 'Currently, FigTracker shows US marketplace prices from Bricklink. International currency support and region-specific pricing are planned for future updates.',
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
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 border border-white/25 rounded-full mb-10 h-11">
              <span className="text-[length:var(--text-xs)] font-semibold text-white tracking-wider uppercase leading-none whitespace-nowrap">
                HELP CENTER
              </span>
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
              <div className="flex flex-col gap-6">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl p-6"
                  >
                    <summary className="text-[length:var(--text-lg)] font-semibold text-[#171717] cursor-pointer list-none flex justify-between items-center">
                      {faq.question}
                      <span className="text-[length:var(--text-2xl)] text-[#737373]">+</span>
                    </summary>
                    <p className="mt-4 text-[length:var(--text-base)] text-[#525252] leading-[1.7]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="about-section about-personas-section">
          <div className="about-page-container">
            <div className="section-content-narrow">
              <h2>Still have questions?</h2>
              <p className="mb-8">Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.</p>

              <div className="bg-white border border-[#e5e5e5] rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">📧</div>
                <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717] mb-2">
                  Contact Support
                </h3>
                <p className="text-[length:var(--text-sm)] text-[#737373] mb-5">
                  Email us with any questions or feedback
                </p>
                <a
                  href="mailto:hello@ericksu.com"
                  className="email-button inline-block px-6 py-3 text-[length:var(--text-sm)] font-semibold text-white bg-[#3b82f6] rounded-lg no-underline transition-all duration-200"
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
