'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * Passwordless sign-in: type an address, get a link, click it.
 *
 * Its own form rather than a button in the row of provider logos, because it
 * needs an input. Placed above the password fields on purpose — it is the path
 * we would rather people took, and the one that removes the reset flow, the
 * forgotten password and the separate confirm-your-email step all at once.
 *
 * `redirect: false` so the "check your inbox" message renders here instead of
 * bouncing to NextAuth's own unstyled verify-request page.
 */
export function MagicLinkForm({ callbackUrl = '/' }: { callbackUrl?: string }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === 'sending') return;
    setState('sending');
    try {
      const result = await signIn('resend', { email, redirect: false, callbackUrl });
      setState(result?.error ? 'error' : 'sent');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div style={{
        padding: '16px',
        background: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: '8px',
        fontSize: 'var(--text-sm)',
        color: '#065f46',
        lineHeight: 1.6,
      }}>
        <strong>{t('auth.magicLink.sentTitle') || 'Check your inbox'}</strong>
        <div style={{ marginTop: '4px' }}>
          {(t('auth.magicLink.sentBody') || 'We sent a sign-in link to {email}. It expires in 24 hours.')
            .replace('{email}', email)}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label
        htmlFor="magic-email"
        style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: '#171717',
          marginBottom: '6px',
        }}
      >
        {t('auth.magicLink.label') || 'Sign in with just your email'}
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          id="magic-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.magicLink.placeholder') || 'you@example.com'}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '12px 14px',
            fontSize: 'var(--text-base)',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          style={{
            padding: '12px 20px',
            background: '#171717',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            cursor: state === 'sending' ? 'default' : 'pointer',
            opacity: state === 'sending' ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {state === 'sending'
            ? t('auth.magicLink.sending') || 'Sending…'
            : t('auth.magicLink.send') || 'Email me a link'}
        </button>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 'var(--text-xs)', color: '#737373' }}>
        {t('auth.magicLink.hint') || 'No password needed. We email you a link that signs you in.'}
      </p>
      {state === 'error' && (
        <p style={{ margin: '8px 0 0', fontSize: 'var(--text-xs)', color: '#b91c1c' }}>
          {t('auth.magicLink.failed') || 'Could not send the link. Try again shortly.'}
        </p>
      )}
    </form>
  );
}
