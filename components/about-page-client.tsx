'use client';

import { CurrencyDollarIcon, BriefcaseIcon, MagnifyingGlassIcon, ShieldCheckIcon, BuildingStorefrontIcon, SparklesIcon, UserGroupIcon, LockClosedIcon, BoltIcon, CreditCardIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

export default function AboutPageClient({ catalogCountText }: { catalogCountText: string }) {
  const { t } = useTranslation();

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
            }}>{t('about.badge')}</span>
          </div>
          <h1>{t('about.hero.title')}</h1>
          <p>{t('about.hero.subtitle')}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* The Problem Section */}
      <section className="about-section about-problem-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('about.problem.title')}</h2>
            <p>{t('about.problem.paragraph1')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('about.problem.paragraph2') }} />

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">{t('about.stats.pricePoints')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1</div>
                <div className="stat-label">{t('about.stats.suggestedPrice')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">{t('about.stats.mentalMath')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-section about-features-section">
        <div className="about-page-container">
          <div className="section-header">
            <h2>{t('about.features.title')}</h2>
            <p>{t('about.features.subtitle')}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <CurrencyDollarIcon />
              </div>
              <h3>{t('about.features.pricing.title')}</h3>
              <p>{t('about.features.pricing.description')}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BriefcaseIcon />
              </div>
              <h3>{t('about.features.inventory.title')}</h3>
              <p>{t('about.features.inventory.description')}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MagnifyingGlassIcon />
              </div>
              <h3>{t('about.features.search.title')}</h3>
              <p>{t('about.features.search.description', { catalogCountText })}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheckIcon />
              </div>
              <h3>{t('about.features.privacy.title')}</h3>
              <p>{t('about.features.privacy.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="about-section about-personas-section">
        <div className="about-page-container">
          <div className="section-content-medium">
            <h2>{t('about.personas.title')}<br />{t('about.personas.subtitle')}</h2>

            <div className="personas-grid">
              <div className="persona-card">
                <div className="persona-icon">
                  <BuildingStorefrontIcon />
                </div>
                <h3>{t('about.personas.resellers.title')}</h3>
                <p>{t('about.personas.resellers.description')}</p>
              </div>

              <div className="persona-card">
                <div className="persona-icon">
                  <SparklesIcon />
                </div>
                <h3>{t('about.personas.partTime.title')}</h3>
                <p>{t('about.personas.partTime.description')}</p>
              </div>

              <div className="persona-card">
                <div className="persona-icon">
                  <UserGroupIcon />
                </div>
                <h3>{t('about.personas.casual.title')}</h3>
                <p>{t('about.personas.casual.description')}</p>
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
                color: '#2563eb',
                flexShrink: '0'
              }}>
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '600',
                color: '#2563eb',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}>{t('about.trust.badge')}</span>
            </div>

            <h2>{t('about.trust.title')}</h2>
            <p className="trust-description">{t('about.trust.description')}</p>

            <div className="trust-features">
              <div className="trust-item">
                <div className="trust-icon">
                  <LockClosedIcon />
                </div>
                <div className="trust-label">{t('about.trust.secure')}</div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">
                  <BoltIcon />
                </div>
                <div className="trust-label">{t('about.trust.fast')}</div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">
                  <CreditCardIcon />
                </div>
                <div className="trust-label">{t('about.trust.free')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="about-section about-personas-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('about.support.title')}</h2>
            <p style={{ marginBottom: '32px' }}>{t('about.support.subtitle')}</p>

            <div style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eff6ff',
                borderRadius: '12px',
                color: '#3b82f6'
              }}>
                <EnvelopeIcon style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '8px'
              }}>{t('about.support.contactTitle')}</h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: '#737373',
                marginBottom: '20px'
              }}>
                {t('about.support.contactDescription')}
              </p>
              <a
                href="mailto:hello@ericksu.com"
                className="email-button"
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

      {/* CTA Section */}
      <section className="about-section about-cta-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('about.cta.title')}</h2>
            <p>{t('about.cta.subtitle')}</p>
            <a href="/search" className="cta-button">
              {t('about.cta.button')}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
