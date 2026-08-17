'use client';

import { BoltIcon, CameraIcon } from '@heroicons/react/24/outline';
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
          <h1>{t('premium.page.hero.title') || 'Two tools. One subscription.'}</h1>
          <p>{t('premium.page.hero.subtitle') || 'List anything instantly, and identify any minifigure from a photo.'}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* Simple pricing card: price + the two things it includes + CTA */}
      <section className="about-section">
        <div className="about-page-container">
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              padding: '32px 28px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '40px', fontWeight: '800', color: '#171717', letterSpacing: '-0.02em' }}>
                {t('premium.page.price') || '$4.99'}
                <span style={{ fontSize: 'var(--text-base)', fontWeight: '500', color: '#737373' }}>
                  {t('premium.page.priceSuffix') || '/month'}
                </span>
              </p>
              <p style={{ margin: '0 0 28px', fontSize: 'var(--text-sm)', color: '#737373' }}>
                {t('premium.page.cancelAnytime') || 'Cancel anytime'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <BoltIcon style={{ width: '22px', height: '22px', color: '#171717', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717' }}>
                      {t('premium.page.features.skipStep.title') || 'Instant listings, no collection step'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: '#737373' }}>
                      {t('premium.page.features.skipStep.description') || 'Generate an eBay, BrickLink, Facebook, or Vinted listing for any minifig or set the moment you find it.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CameraIcon style={{ width: '22px', height: '22px', color: '#171717', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717' }}>
                      {t('premium.page.features.identify.title') || 'Unlimited AI minifigure identifier'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: '#737373' }}>
                      {t('premium.page.features.identify.description') || "Snap or drag in a photo — AI finds the BrickLink ID and current value. No scan limit."}
                    </p>
                  </div>
                </div>
              </div>

              <a href="/account#premium" className="cta-button" style={{ display: 'block', marginTop: '28px' }}>
                {t('premium.page.cta.button') || 'Upgrade to Premium'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
