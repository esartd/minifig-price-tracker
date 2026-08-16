'use client';

import { BoltIcon, CubeIcon, ArchiveBoxIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

export default function PremiumPageClient() {
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
            }}>{t('premium.page.badge') || 'Premium'}</span>
          </div>
          <h1>{t('premium.page.hero.title') || 'Skip the busywork. List anything, instantly.'}</h1>
          <p>{t('premium.page.hero.subtitle') || 'Generate a marketplace listing for any minifig or set the moment you find it — no need to add it to your collection first.'}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* Features Section */}
      <section className="about-section about-features-section">
        <div className="about-page-container">
          <div className="section-header">
            <h2>{t('premium.page.features.title') || 'What you get'}</h2>
            <p>{t('premium.page.features.subtitle') || 'One subscription, one less step between finding a set and listing it for sale.'}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <BoltIcon />
              </div>
              <h3>{t('premium.page.features.skipStep.title') || 'No collection step required'}</h3>
              <p>{t('premium.page.features.skipStep.description') || "Normally you'd add an item to your collection or inventory before generating a listing. Premium skips that entirely — go straight from any minifig or set's page to a ready-to-post listing."}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CubeIcon />
              </div>
              <h3>{t('premium.page.features.minifigs.title') || 'Works for minifigs'}</h3>
              <p>{t('premium.page.features.minifigs.description') || 'Generate listings for any minifigure in the catalog, with live pricing pulled the moment you generate.'}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ArchiveBoxIcon />
              </div>
              <h3>{t('premium.page.features.sets.title') || 'Works for sets'}</h3>
              <p>{t('premium.page.features.sets.description') || 'Same instant listing generation for any LEGO set — box condition, completeness, and all the usual details included.'}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <SparklesIcon />
              </div>
              <h3>{t('premium.page.features.sameQuality.title') || 'Same great listings'}</h3>
              <p>{t('premium.page.features.sameQuality.description') || "It's the exact same listing generator you already use — eBay, BrickLink, Facebook, and Vinted templates, just without the extra step."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section about-cta-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('premium.page.cta.title') || 'Ready to skip the busywork?'}</h2>
            <p>{t('premium.page.cta.subtitle') || 'Upgrade in a minute — cancel any time.'}</p>
            <a href="/account#premium" className="cta-button">
              {t('premium.page.cta.button') || 'Upgrade to Premium'}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
