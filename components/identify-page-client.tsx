'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';
import MinifigIdentifierWidget from '@/components/MinifigIdentifierWidget';
import UpgradeTeaser from '@/components/UpgradeTeaser';

export default function IdentifyPageClient() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Same premiumChecked pattern as components/minifig-detail-client.tsx --
  // avoid flashing the upgrade teaser at a real premium subscriber before
  // their status has loaded.
  const [isPremium, setIsPremium] = useState(false);
  const [premiumChecked, setPremiumChecked] = useState(!session?.user);
  useEffect(() => {
    if (!session?.user) {
      setPremiumChecked(true);
      return;
    }
    setPremiumChecked(false);
    fetch('/api/user/subscription')
      .then((res) => res.json())
      .then((data) => setIsPremium(!!data?.data?.isPremium))
      .catch(() => {})
      .finally(() => setPremiumChecked(true));
  }, [session?.user]);

  return (
    <article className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Compact hero -- this page's job is to get people to the upload
          widget fast, not to sell Premium (that's /premium's job), so it
          overrides .hero-section's default min-height/padding to take up
          much less vertical space than the marketing pages sharing that class. */}
      <header className="hero-section" style={{ minHeight: 'auto', padding: '32px 24px' }}>
        <div className="hero-content">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '32px',
            marginBottom: '16px',
            lineHeight: '1',
            height: '44px',
            minHeight: '44px',
            maxHeight: '44px',
            boxSizing: 'border-box',
          }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              color: '#ffffff',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              lineHeight: '1',
              whiteSpace: 'nowrap',
            }}>{t('premium.page.badge') || 'Premium'}</span>
          </div>
          <h1 style={{ marginBottom: '12px' }}>{t('identify.hero.title') || 'Identify a Minifigure'}</h1>
          <p style={{ margin: 0 }}>{t('identify.hero.subtitle') || 'Snap or drag in a photo — AI finds the BrickLink ID and current value.'}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* .about-section's 80px vertical padding is sized for long marketing
          pages; here it left the single upload widget (or the upgrade card)
          stranded far below the hero. */}
      <section className="about-section" style={{ padding: '32px 0 64px' }}>
        <div className="about-page-container">
          <div className="section-content-narrow" style={{ maxWidth: '520px', margin: '0 auto' }}>
            {premiumChecked && (
              isPremium ? <MinifigIdentifierWidget /> : <UpgradeTeaser />
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
