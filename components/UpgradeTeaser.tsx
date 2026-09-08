'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * Shown in place of a Premium feature (the listing generator on minifig/set
 * detail pages, or the AI identifier on /identify) when the viewer isn't a
 * premium subscriber (or isn't logged in) -- keeps Premium discoverable
 * without duplicating the Checkout flow on every page. Copy describes both
 * Premium perks generically rather than whichever one triggered it, since
 * this same component renders on pages for either feature.
 */
export default function UpgradeTeaser() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        marginTop: '24px',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e5e5e5',
        backgroundColor: '#fafafa',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: '0 0 4px', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#171717' }}>
        {t('premium.upgradeTeaser.title') || 'This is a Premium feature'}
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 'var(--text-sm)', color: '#737373' }}>
        {t('premium.upgradeTeaser.body') || 'Premium gets you instant listings with no collection step, plus an unlimited AI minifigure identifier.'}
      </p>
      <Link
        href="/premium"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          // Secondary, not primary. This sits directly under "+ To sell" and
          // "+ To keep", which are the actions the page is FOR -- three solid
          // blue buttons in a stack means none of them is primary, and the one
          // that wins by position is the upsell rather than the task. Same
          // shape and size, quieter fill.
          color: '#3b82f6',
          backgroundColor: '#ffffff',
          border: '1px solid #3b82f6',
          borderRadius: '999px',
          textDecoration: 'none',
          lineHeight: 1.2,
        }}
      >
        {t('premium.upgradeTeaser.cta') || 'Upgrade to Premium'}
      </Link>
    </div>
  );
}
