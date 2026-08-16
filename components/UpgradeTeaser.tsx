'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * Shown in place of the listing generator on minifig/set detail pages when
 * the viewer isn't a premium subscriber (or isn't logged in) and hasn't
 * added the item to their collection -- keeps the premium feature
 * discoverable without duplicating the Checkout flow on every detail page.
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
        {t('premium.upgradeTeaser.title') || 'Generate a listing without adding this to your collection'}
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 'var(--text-sm)', color: '#737373' }}>
        {t('premium.upgradeTeaser.body') || 'This is a Premium feature. Upgrade to skip the collection step entirely.'}
      </p>
      <Link
        href="/premium"
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#171717',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        {t('premium.upgradeTeaser.cta') || 'Upgrade to Premium'}
      </Link>
    </div>
  );
}
