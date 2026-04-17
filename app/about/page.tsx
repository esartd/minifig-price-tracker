import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CurrencyDollarIcon, BriefcaseIcon, MagnifyingGlassIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// Force dynamic rendering to show current searchable catalog count
export const dynamic = 'force-dynamic';

// Get count of searchable minifigs (user-driven cache)
async function getSearchableCatalogCount(): Promise<number> {
  try {
    const count = await prisma.minifigCache.count({
      where: {
        expires_at: { gt: new Date() }
      }
    });
    return count;
  } catch (error) {
    console.error('Error getting catalog count:', error);
    return 0;
  }
}

// Format catalog count for display
function formatCatalogCount(count: number): string {
  if (count === 0) {
    return 'thousands of';
  } else if (count >= 10000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `over ${rounded.toLocaleString()}`;
  } else if (count >= 1000) {
    const rounded = Math.ceil(count / 1000) * 1000;
    return `nearly ${rounded.toLocaleString()}`;
  } else {
    return `${count.toLocaleString()}`;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const catalogCount = await getSearchableCatalogCount();
  const catalogCountText = formatCatalogCount(catalogCount);

  return {
    title: 'About FigTracker - Free LEGO Minifigure Price Tracker',
    description: `Learn how FigTracker helps LEGO resellers and collectors price minifigures accurately with real-time Bricklink marketplace data. Search ${catalogCountText} minifigs. Free to use.`,
    openGraph: {
      title: 'About FigTracker - Free LEGO Minifigure Price Tracker',
      description: `Built by sellers, for sellers. Price your LEGO minifigures with confidence using real Bricklink data. ${catalogCountText} minifigs searchable.`,
      url: 'https://figtracker.com/about',
    },
    alternates: {
      canonical: 'https://figtracker.com/about',
    },
  };
}

export default async function AboutPage() {
  const catalogCount = await getSearchableCatalogCount();
  const catalogCountText = formatCatalogCount(catalogCount);

  return (
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
            }}>ABOUT FIGTRACKER</span>
          </div>
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
                <CurrencyDollarIcon />
              </div>
              <h3>One Suggested Price</h3>
              <p>We calculate a weighted price from current Bricklink marketplace listings—quantity-weighted average, simple average, and lowest price. One number, ready to use.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BriefcaseIcon />
              </div>
              <h3>Simple Inventory</h3>
              <p>Track quantities, conditions, and total inventory value. Sort by price or ID. Your entire stock in one clean dashboard.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MagnifyingGlassIcon />
              </div>
              <h3>Smart Search</h3>
              <p>Search any minifig by exact BrickLink ID (e.g., dis134, sw1219). Name search finds items from {catalogCountText} searchable entries that grow as users discover more minifigs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheckIcon />
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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '32px',
              marginBottom: '40px',
              lineHeight: '1',
              height: '44px'
            }}>
              <svg fill="currentColor" viewBox="0 0 20 20" style={{
                width: '22px',
                height: '22px',
                color: '#15803d',
                flexShrink: '0'
              }}>
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '600',
                color: '#15803d',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}>FREE TO USE</span>
            </div>

            <h2>Free to use. No hidden fees.</h2>
            <p className="trust-description">Your inventory data is private and secure. Currently free with no payment required to track your collection.</p>

            <div className="trust-features">
              <div className="trust-item">
                <div className="trust-emoji">🔒</div>
                <div className="trust-label">Secure & Private</div>
              </div>
              <div className="trust-item">
                <div className="trust-emoji">⚡</div>
                <div className="trust-label">Fast & Reliable</div>
              </div>
              <div className="trust-item">
                <div className="trust-emoji">💸</div>
                <div className="trust-label">No Payment Required</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="about-section about-trust-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>Need Help?</h2>
            <p style={{ marginBottom: '32px' }}>Found a bug or have a feature request? We'd love to hear from you.</p>

            <div style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>📧</div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '8px'
              }}>Contact Support</h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: '#737373',
                marginBottom: '20px'
              }}>
                Email us with any issues, questions, or feedback
              </p>
              <a
                href="mailto:support@figtracker.com"
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
                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                support@figtracker.com
              </a>
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
