'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * "Email me new deals daily" on /deals.
 *
 * Shown to signed-out and free users on purpose, locked, linking to /premium.
 * A perk nobody can see is a perk nobody buys -- and the API refuses the switch
 * regardless, so this control is presentation and never enforcement.
 *
 * The wording promises what the digest actually does: only sets that are new or
 * have dropped further, and no email at all on a quiet day. Promising "every
 * deal, daily" would be a promise to send the same list every morning until
 * people stop opening it.
 */
export default function DealsDigestToggle() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [enabled, setEnabled] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoaded(true);
      return;
    }
    fetch('/api/deals-digest')
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) {
          setEnabled(!!d.data.enabled);
          setIsPremium(!!d.data.isPremium);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [status]);

  const signedIn = status === 'authenticated';
  const canToggle = signedIn && isPremium;

  const toggle = async () => {
    if (!canToggle || saving) return;
    const next = !enabled;
    setSaving(true);
    // Optimistic, then reconciled: the switch should feel instant, but a 403
    // from a lapsed subscription must not leave it showing the wrong state.
    setEnabled(next);
    try {
      const res = await fetch('/api/deals-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) setEnabled(!next);
    } catch {
      setEnabled(!next);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return null;

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
        }}
      >
        <EnvelopeIcon style={{ width: '20px', height: '20px', color: '#525252', flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: '#171717' }}>
            {t('legoSale.digest.title') || 'Email me new deals'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: '#737373' }}>
            {canToggle
              ? t('legoSale.digest.subtitle') ||
                'One email a day, only when something new drops below market value.'
              : t('legoSale.digest.premiumHint') ||
                'A Premium feature. One email a day, only when something new drops below market value.'}
          </p>
          {signedIn && !isPremium && (
            <Link
              href="/premium"
              style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: 'var(--text-xs)',
                color: '#3b82f6',
                fontWeight: 600,
              }}
            >
              {t('legoSale.digest.learnMore') || 'See Premium'}
            </Link>
          )}
          {!signedIn && (
            <Link
              href="/auth/signin"
              style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: 'var(--text-xs)',
                color: '#3b82f6',
                fontWeight: 600,
              }}
            >
              {t('legoSale.digest.signIn') || 'Sign in'}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          role="switch"
          aria-checked={enabled}
          aria-label={t('legoSale.digest.title') || 'Email me new deals'}
          // Not `disabled`: a disabled switch is silent, and this one has
          // something to say to the people who cannot use it yet.
          title={canToggle ? undefined : t('legoSale.digest.premiumHint') || 'Premium feature'}
          style={{
            position: 'relative',
            flexShrink: 0,
            width: '46px',
            height: '26px',
            borderRadius: '999px',
            border: 'none',
            cursor: canToggle ? 'pointer' : 'not-allowed',
            background: enabled && canToggle ? '#3b82f6' : '#e5e5e5',
            opacity: canToggle ? 1 : 0.6,
            transition: 'background 0.2s',
            padding: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '3px',
              left: enabled && canToggle ? '23px' : '3px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              transition: 'left 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!canToggle && (
              <LockClosedIcon style={{ width: '11px', height: '11px', color: '#a3a3a3' }} />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
