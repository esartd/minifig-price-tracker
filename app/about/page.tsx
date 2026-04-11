import Link from 'next/link';
import type { Metadata } from 'next';
import { minifigCatalog } from '@/lib/minifig-catalog';

// Force dynamic rendering so catalog count updates without redeploying
export const dynamic = 'force-dynamic';

// Format catalog count for display (e.g., 7,798 → "nearly 8,000", 10,245 → "over 10,000")
function formatCatalogCount(count: number): string {
  if (count >= 10000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `over ${rounded.toLocaleString()}`;
  } else if (count >= 8000) {
    const rounded = Math.ceil(count / 1000) * 1000;
    return `nearly ${rounded.toLocaleString()}`;
  } else {
    const rounded = Math.ceil(count / 1000) * 1000;
    return `nearly ${rounded.toLocaleString()}`;
  }
}

const catalogCount = minifigCatalog.length;
const catalogCountText = formatCatalogCount(catalogCount);

export const metadata: Metadata = {
  title: 'About FigTracker - Free LEGO Minifigure Price Tracker',
  description: `Learn how FigTracker helps LEGO resellers and collectors price minifigures accurately with real-time Bricklink marketplace data. Search ${catalogCountText} minifigs. Free to use, no ads.`,
  openGraph: {
    title: 'About FigTracker - Free LEGO Minifigure Price Tracker',
    description: `Built by sellers, for sellers. Price your LEGO minifigures with confidence using real Bricklink data. ${catalogCountText} minifigs in catalog.`,
    url: 'https://figtracker.com/about',
  },
  alternates: {
    canonical: 'https://figtracker.com/about',
  },
};

export default function AboutPage() {
  const catalogCount = minifigCatalog.length;
  const catalogCountText = formatCatalogCount(catalogCount);
  return (
    <article className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">About FigTracker</div>
          <h1>Stop Guessing.<br />Start Selling.</h1>
          <p>The pricing tool built by sellers, for sellers. Track your LEGO minifigure inventory with real-time Bricklink data.</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* The Problem Section */}
      <section className="about-section about-problem-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>Pricing minifigs shouldn't feel like homework</h2>
            <p>You open Bricklink. You see the quantity-weighted average. The simple average. The lowest price. Three different numbers staring back at you.</p>
            <p>Now you're doing mental math, trying to land on something fair. <strong>Every. Single. Time.</strong></p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">Price points to compare</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1</div>
                <div className="stat-label">Suggested price</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Mental math required</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Full Width White Background */}
      <section className="about-section about-features-section">
        <div className="about-page-container">
          <div className="section-header">
            <h2>Built for sellers, by sellers</h2>
            <p>Everything you need to price and track your inventory. Nothing you don't.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>One Suggested Price</h3>
              <p>We calculate a weighted price from current Bricklink marketplace listings—quantity-weighted average, simple average, and lowest price. One number, ready to use.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Simple Inventory</h3>
              <p>Track quantities, conditions, and total inventory value. Sort by price or ID. Your entire stock in one clean dashboard.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Instant Search</h3>
              <p>Find any minifig by name, ID, or theme from {catalogCountText} entries. Results appear as you type. Zero lag.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Real Bricklink Data</h3>
              <p>Official API integration means accurate, current US marketplace prices. Refresh anytime to get the latest values.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="about-section about-personas-section">
        <div className="about-page-container">
          <div className="section-content-medium">
            <h2>For anyone who's ever asked<br />"What's this minifig worth?"</h2>

            <div className="personas-grid">
              <div className="persona-card">
                <div className="persona-emoji">🧑‍💼</div>
                <h3>Resellers</h3>
                <p>Price your inventory fast and list with confidence</p>
              </div>

              <div className="persona-card">
                <div className="persona-emoji">⭐</div>
                <h3>Part-time Sellers</h3>
                <p>Price your side hustle inventory with confidence</p>
              </div>

              <div className="persona-card">
                <div className="persona-emoji">🔍</div>
                <h3>Casual Sellers</h3>
                <p>Quickly price a few figs before posting them online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Full Width White Background */}
      <section className="about-section about-trust-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <div className="trust-badge">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>FREE TO USE</span>
            </div>

            <h2>Free to use. No hidden fees.</h2>
            <p className="trust-description">Your inventory data is private and secure. Currently free with no ads or payment required.</p>

            <div className="trust-features">
              <div className="trust-item">
                <div className="trust-emoji">🔒</div>
                <div className="trust-label">Secure & Private</div>
              </div>
              <div className="trust-item">
                <div className="trust-emoji">🚫</div>
                <div className="trust-label">No Ads</div>
              </div>
              <div className="trust-item">
                <div className="trust-emoji">💸</div>
                <div className="trust-label">No Payment Required</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section about-cta-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>Ready to stop guessing?</h2>
            <p>Start pricing your inventory and get suggested values in seconds.</p>
            <Link href="/search" className="cta-button">
              Start Pricing Your Inventory →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
