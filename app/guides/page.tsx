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

      <article className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
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
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '600',
                color: '#ffffff',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}>GUIDES & RESOURCES</span>
            </div>
            <h1>Master LEGO<br />Minifigure Pricing</h1>
            <p>Expert guides to help you price, sell, and manage your minifigure inventory like a pro</p>
          </div>
          <div className="hero-decoration hero-decoration-1"></div>
          <div className="hero-decoration hero-decoration-2"></div>
        </header>

        {/* Guides Grid */}
        <section className="about-section" style={{ background: '#ffffff' }}>
          <div className="about-page-container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {guides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <article
                      key={index}
                      style={{
                        background: '#fafafa',
                        border: '1px solid #e5e5e5',
                        borderRadius: '16px',
                        padding: '40px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'start', flexWrap: 'wrap' }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          background: '#dbeafe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: '280px' }}>
                          <h2 style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: '700',
                            color: '#171717',
                            marginBottom: '12px',
                          }}>
                            {guide.title}
                          </h2>
                          <p style={{
                            fontSize: 'var(--text-base)',
                            color: '#525252',
                            lineHeight: '1.7',
                            marginBottom: '24px',
                          }}>
                            {guide.description}
                          </p>

                          <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: '600',
                              color: '#171717',
                              marginBottom: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}>
                              Topics Covered:
                            </h3>
                            <ul style={{
                              listStyle: 'none',
                              padding: 0,
                              margin: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}>
                              {guide.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  style={{
                                    fontSize: 'var(--text-sm)',
                                    color: '#525252',
                                    paddingLeft: '24px',
                                    position: 'relative',
                                  }}
                                >
                                  <span style={{
                                    position: 'absolute',
                                    left: '0',
                                    color: '#3b82f6',
                                    fontWeight: '600',
                                  }}>✓</span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {guide.status === 'published' ? (
                            <Link
                              href={`/guides/${guide.slug}`}
                              style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: '#ffffff',
                                fontWeight: '600',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                transition: 'background 0.2s',
                              }}
                            >
                              Read Guide →
                            </Link>
                          ) : (
                            <div style={{
                              padding: '16px 24px',
                              background: '#fff3cd',
                              border: '1px solid #ffd966',
                              borderRadius: '8px',
                              fontSize: 'var(--text-sm)',
                              color: '#856404',
                              fontWeight: '500',
                            }}>
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
              <p style={{ marginBottom: '40px' }}>Essential knowledge every LEGO seller should know</p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                  }}>Refresh Prices Regularly</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: '#525252', lineHeight: '1.6' }}>
                    Marketplace prices change frequently. Refresh pricing data before listing to ensure competitive pricing.
                  </p>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                  }}>Condition Matters</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: '#525252', lineHeight: '1.6' }}>
                    New minifigures command 20-50% higher prices than used. Grade condition honestly to build buyer trust.
                  </p>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                  }}>Use Multiple Data Points</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: '#525252', lineHeight: '1.6' }}>
                    Don't rely on just one metric. FigTracker's suggested price balances quantity-weighted average, simple average, and lowest price.
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
