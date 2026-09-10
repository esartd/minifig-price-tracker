'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * The /identify gate: shown in place of the AI minifigure identifier when the
 * viewer isn't a premium subscriber (or isn't logged in) -- keeps Premium
 * discoverable without duplicating the Checkout flow on every page.
 *
 * This used to serve the minifig and set detail pages too, which is why the
 * copy describes Premium's perks generically instead of naming the one that
 * triggered it. Those pages now use PremiumListingNote, because a card reading
 * "This is a Premium feature" sat directly under the collection buttons and
 * made adding to a collection look paid -- and because listing generation is
 * not actually subscriber-only, so the claim was false there. See that
 * component for the full account.
 *
 * The card is right HERE, though: the AI identifier genuinely is
 * subscriber-only, this is the entire content of the page, and there is no
 * neighbouring feature for it to be confused with.
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
          // Secondary, not primary. Kept from when this also rendered on the
          // detail pages, beneath "+ To sell" and "+ To keep" -- three solid
          // blue buttons in a stack meant none of them was primary, and the one
          // winning by position was the upsell rather than the task. It is the
          // only button on /identify now, so it could go solid; leaving it
          // quiet suits a page whose job is to explain before it sells.
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
