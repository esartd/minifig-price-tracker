import Link from 'next/link';
import type { Metadata } from 'next';
import { MagnifyingGlassIcon, CurrencyDollarIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'FigTracker - LEGO Minifigure Price Tracker & Inventory Management',
  description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data. Get instant suggested prices, track your inventory, and manage your collection with 18,000+ minifigs.',
  keywords: ['LEGO minifigure prices', 'Bricklink price tracker', 'LEGO inventory', 'minifig value', 'LEGO reseller tool', 'Bricklink marketplace', 'LEGO price guide', 'minifigure collection tracker'],
  openGraph: {
    title: 'FigTracker - LEGO Minifigure Price Tracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink data. Track your inventory and get instant pricing suggestions.',
    url: 'https://figtracker.ericksu.com',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FigTracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data',
    url: 'https://figtracker.ericksu.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        {/* Hero Section */}
        <section className="hero-section">
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
              }}>FREE PRICE TRACKER</span>
            </div>
            <h1>Price Your LEGO<br />Minifigures in Seconds</h1>
            <p>Real-time Bricklink marketplace data. 18,000+ minifigures. Zero guesswork.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/search" className="cta-button" style={{
                padding: '16px 32px',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#ffffff',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}>
                Start Pricing Now →
              </Link>
              <Link href="/about" style={{
                padding: '16px 32px',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#3b82f6',
                background: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}>
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-decoration hero-decoration-1"></div>
          <div className="hero-decoration hero-decoration-2"></div>
        </section>

        {/* Features Grid */}
        <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px' }}>
              Everything You Need to Price LEGO Minifigures
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: '#737373', maxWidth: '600px', margin: '0 auto' }}>
              Built for sellers and collectors who want accurate pricing fast
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <CurrencyDollarIcon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: '#171717', marginBottom: '12px' }}>
                Instant Price Suggestions
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', lineHeight: '1.6' }}>
                Smart pricing algorithm combines Bricklink quantity-weighted average, simple average, and lowest price into one suggested value.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <MagnifyingGlassIcon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: '#171717', marginBottom: '12px' }}>
                18,000+ Minifigures
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', lineHeight: '1.6' }}>
                Search by exact Bricklink ID or name. Browse by theme including Star Wars, Harry Potter, Marvel, and 50+ more collections.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ChartBarIcon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: '#171717', marginBottom: '12px' }}>
                Inventory Management
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', lineHeight: '1.6' }}>
                Track quantities, conditions, and total value. Separate your selling inventory from personal collection.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldCheckIcon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: '#171717', marginBottom: '12px' }}>
                Real Bricklink Data
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', lineHeight: '1.6' }}>
                Official Bricklink API integration ensures accurate US marketplace prices. Refresh anytime for latest values.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Themes */}
        <section style={{ padding: '80px 24px', background: '#ffffff', borderTop: '1px solid #e5e5e5' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px' }}>
                Browse by Popular Theme
              </h2>
              <p style={{ fontSize: 'var(--text-lg)', color: '#737373' }}>
                Explore minifigures from your favorite LEGO collections
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
              {['Star Wars', 'Harry Potter', 'Marvel Super Heroes', 'The Lord of the Rings', 'DC Super Heroes', 'Ninjago'].map(theme => (
                <Link
                  key={theme}
                  href={`/themes/${theme.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    padding: '24px',
                    background: '#fafafa',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    color: '#171717',
                    fontWeight: '600',
                  }}
                >
                  {theme}
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/themes" style={{
                display: 'inline-block',
                padding: '12px 24px',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                color: '#3b82f6',
                textDecoration: 'none',
              }}>
                View All Themes →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: '#171717', marginBottom: '16px' }}>
              Ready to Stop Guessing?
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: '#737373', marginBottom: '32px' }}>
              Join sellers and collectors using FigTracker to price LEGO minifigures accurately
            </p>
            <Link href="/search" className="cta-button" style={{
              padding: '16px 32px',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block',
            }}>
              Start Pricing Now →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
