'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * "Send me another link."
 *
 * The endpoint behind it is signed-in only, deliberately — it can then only
 * ever mail the session owner, rather than being an open way to send mail from
 * this domain to any address. So a signed-out visitor is pointed at sign-in
 * instead of being given a button that would only fail.
 */
export default function ResendVerificationButton() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (status === 'loading') return null;

  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
          textDecoration: 'none',
        }}
      >
        {t('verifyEmail.signInToResend') || 'Sign in to get a new link'}
      </Link>
    );
  }

  const send = async () => {
    if (state === 'sending') return;
    setState('sending');
    setMessage('');
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setState('sent');
        setMessage(
          data.alreadyVerified
            ? t('verifyEmail.alreadyBody') || 'This address was already confirmed.'
            : t('verifyEmail.sent') || 'Sent. Check your inbox.'
        );
        return;
      }

      setState('error');
      // The cooldown returns how long is left; saying so beats "try again
      // later" when the answer is a specific number of seconds.
      setMessage(
        data.waitSeconds
          ? (t('verifyEmail.waitSeconds') || 'Please wait {seconds}s before asking again.').replace(
              '{seconds}',
              String(data.waitSeconds)
            )
          : data.error || t('verifyEmail.sendFailed') || 'Could not send. Try again shortly.'
      );
    } catch {
      setState('error');
      setMessage(t('verifyEmail.sendFailed') || 'Could not send. Try again shortly.');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={state === 'sending' || state === 'sent'}
        style={{
          padding: '12px 24px',
          background: state === 'sent' ? '#10b981' : '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
          cursor: state === 'sending' || state === 'sent' ? 'default' : 'pointer',
          opacity: state === 'sending' ? 0.7 : 1,
        }}
      >
        {state === 'sending'
          ? t('verifyEmail.sending') || 'Sending…'
          : state === 'sent'
            ? t('verifyEmail.sentShort') || 'Sent'
            : t('verifyEmail.resend') || 'Send a new link'}
      </button>
      {message && (
        <p style={{
          marginTop: '12px',
          fontSize: 'var(--text-xs)',
          color: state === 'error' ? '#b91c1c' : '#525252',
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
