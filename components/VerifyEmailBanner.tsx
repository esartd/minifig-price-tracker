'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * Asks a signed-in, unconfirmed account to confirm its address.
 *
 * Shown rather than enforced. Everything on the site works without confirming
 * except the two features that send mail, so this is an invitation, not a
 * gate — and it is dismissible, because a banner that cannot be closed becomes
 * furniture people stop reading.
 *
 * Dismissal is per browser in localStorage and keyed by user id, so signing in
 * as someone else on a shared machine does not inherit the other person's
 * dismissal. It deliberately does not persist server-side: the next browser
 * should ask again, since the address is still unconfirmed.
 */
export default function VerifyEmailBanner() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(true); // assume hidden until checked
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const userId = session?.user?.id;
  const confirmed = session?.user?.emailConfirmed;

  useEffect(() => {
    if (!userId) return;
    try {
      setDismissed(localStorage.getItem(`ib_verify_dismissed_${userId}`) === '1');
    } catch {
      // Private browsing throws on access; showing the banner is the safe side.
      setDismissed(false);
    }
  }, [userId]);

  if (status !== 'authenticated' || confirmed !== false || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(`ib_verify_dismissed_${userId}`, '1');
    } catch {
      // Nothing to do — it will simply ask again next visit.
    }
  };

  const resend = async () => {
    if (sending || sent) return;
    setSending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      if (res.ok) setSent(true);
    } catch {
      // Silent: the verify page has the fuller version of this flow with
      // proper error messages. A banner is not the place for a failure essay.
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      background: '#fffbeb',
      borderBottom: '1px solid #fde68a',
      padding: '10px 16px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '220px', fontSize: 'var(--text-sm)', color: '#78350f', lineHeight: 1.5 }}>
          <strong>{t('verifyEmail.bannerTitle') || 'Confirm your email'}</strong>{' '}
          {t('verifyEmail.bannerBody') ||
            'Price alerts and the daily deals email need a confirmed address.'}
        </div>

        <button
          type="button"
          onClick={resend}
          disabled={sending || sent}
          style={{
            padding: '7px 14px',
            background: sent ? '#10b981' : '#f59e0b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: sending || sent ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {sending
            ? t('verifyEmail.sending') || 'Sending…'
            : sent
              ? t('verifyEmail.sentShort') || 'Sent'
              : t('verifyEmail.resend') || 'Send a new link'}
        </button>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#92400e',
            fontSize: '18px',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '4px 6px',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
