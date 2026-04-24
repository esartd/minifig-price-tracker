import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenIcon, CurrencyDollarIcon, ChartBarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'LEGO Minifigure Pricing Guides & Tips | FigTracker',
  description: 'Expert guides on pricing LEGO minifigures, selling on Bricklink, inventory management, and maximizing resale value. Free resources for sellers and collectors.',
  keywords: ['LEGO pricing guide', 'how to price minifigures', 'Bricklink selling tips', 'LEGO resale guide', 'minifigure value guide'],
  openGraph: {
    title: 'LEGO Pricing Guides & Tips | FigTracker',
    description: 'Learn how to price, sell, and manage your LEGO minifigure inventory effectively',
    url: 'https://figtracker.ericksu.com/guides',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/guides',
  },
};

const guides = [
  {
    icon: BookOpenIcon,
    title: 'Most Valuable LEGO Minifigures in 2026',
    description: 'Discover which LEGO minifigures command the highest prices. Learn what makes certain minifigs valuable and how to identify hidden gems.',
    slug: 'most-valuable-lego-minifigures-2026',
    status: 'published',
    topics: [
      'Top 50 most valuable minifigs analyzed',
      'Star Wars, Harry Potter, Marvel rarities',
      'Investment potential and appreciation rates',
      'Authentication and condition grading',
      'Where to buy and sell valuable pieces',
    ],
  },
  {
    icon: ChartBarIcon,
    title: 'FigTracker vs Bricklink: Which Should You Use?',
    description: 'Compare FigTracker and Bricklink for LEGO pricing. Learn when to use each platform and how they complement each other.',
    slug: 'figtracker-vs-bricklink',
    status: 'published',
    topics: [
      'Side-by-side feature comparison',
      'When to use each platform',
      'Pricing philosophy differences',
      'Best workflow: using both together',
      'Time-saving strategies for sellers',
    ],
  },
  {
    icon: CurrencyDollarIcon,
    title: 'How to Price LEGO Minifigures',
    description: 'Learn the fundamentals of pricing LEGO minifigures using Bricklink marketplace data. Understand quantity-weighted averages, simple averages, and how to factor in condition.',
    slug: null,
    status: 'coming-soon',
    topics: [
      'Understanding Bricklink pricing metrics',
      'New vs Used condition pricing',
      'Accounting for rarity and demand',
      'When to price above or below market average',
      'Seasonal pricing trends',
    ],
  },
  {
    icon: ShoppingBagIcon,
    title: 'Selling LEGO on Bricklink',
    description: 'Complete guide to becoming a successful Bricklink seller. From creating your store to shipping best practices and customer service tips.',
    slug: null,
    status: 'coming-soon',
    topics: [
      'Setting up your Bricklink store',
      'Competitive pricing strategies',
      'Writing effective item descriptions',
      'Packaging and shipping minifigures safely',
      'Building seller reputation',
    ],
  },
];

export default function GuidesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LEGO Minifigure Pricing Guides',
    description: 'Expert guides and resources for pricing and selling LEGO minifigures',
    url: 'https://figtracker.ericksu.com/guides',
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
                GUIDES & RESOURCES
              </span>
            </div>
            <h1>Master LEGO<br />Minifigure Pricing</h1>
            <p>Expert guides to help you price, sell, and manage your minifigure inventory like a pro</p>
          </div>
          <div className="hero-decoration hero-decoration-1"></div>
          <div className="hero-decoration hero-decoration-2"></div>
        </header>

        {/* Guides Grid */}
        <section className="about-section bg-white">
          <div className="about-page-container">
            <div className="max-w-[1000px] mx-auto">
              <div className="flex flex-col gap-12">
                {guides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <article
                      key={index}
                      className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl p-6 md:p-10"
                    >
                      <div className="flex gap-6 items-start flex-wrap">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                          <Icon className="w-8 h-8 text-[#3b82f6]" />
                        </div>

                        <div className="flex-1 min-w-[280px]">
                          <h2 className="text-[length:var(--text-2xl)] font-bold text-[#171717] mb-3">
                            {guide.title}
                          </h2>
                          <p className="text-[length:var(--text-base)] text-[#525252] leading-[1.7] mb-6">
                            {guide.description}
                          </p>

                          <div className="mb-6">
                            <h3 className="text-[length:var(--text-sm)] font-semibold text-[#171717] mb-3 uppercase tracking-wide">
                              Topics Covered:
                            </h3>
                            <ul className="list-none p-0 m-0 flex flex-col gap-2">
                              {guide.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  className="text-[length:var(--text-sm)] text-[#525252] pl-6 relative"
                                >
                                  <span className="absolute left-0 text-[#3b82f6] font-semibold">✓</span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {guide.status === 'published' ? (
                            <Link
                              href={`/guides/${guide.slug}`}
                              className="inline-block px-6 py-3 bg-[#3b82f6] text-white font-semibold rounded-lg no-underline transition-all duration-200 hover:bg-[#2563eb]"
                            >
                              Read Guide →
                            </Link>
                          ) : (
                            <div className="px-6 py-4 bg-[#fff3cd] border border-[#ffd966] rounded-lg text-[length:var(--text-sm)] text-[#856404] font-medium">
                              📝 Guide coming soon - check back later
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="about-section about-personas-section">
          <div className="about-page-container">
            <div className="section-content-medium">
              <h2>Quick Pricing Tips</h2>
              <p className="mb-10">Essential knowledge every LEGO seller should know</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e5e5e5] rounded-xl p-6">
                  <div className="text-[32px] mb-3">💡</div>
                  <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717] mb-2">
                    Refresh Prices Regularly
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-[#525252] leading-[1.6]">
                    Marketplace prices change frequently. Refresh pricing data before listing to ensure competitive pricing.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-xl p-6">
                  <div className="text-[32px] mb-3">🎯</div>
                  <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717] mb-2">
                    Condition Matters
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-[#525252] leading-[1.6]">
                    New minifigures command 20-50% higher prices than used. Grade condition honestly to build buyer trust.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-xl p-6">
                  <div className="text-[32px] mb-3">📊</div>
                  <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717] mb-2">
                    Use Multiple Data Points
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-[#525252] leading-[1.6]">
                    Don&apos;t rely on just one metric. FigTracker&apos;s suggested price balances quantity-weighted average, simple average, and lowest price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-section about-cta-section">
          <div className="about-page-container">
            <div className="section-content-narrow">
              <h2>Ready to price like a pro?</h2>
              <p>Start using FigTracker's pricing tools with real Bricklink data</p>
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
