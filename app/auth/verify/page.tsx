import { Metadata } from 'next';
import { consumeVerificationToken } from '@/lib/email-verification';
import { headers } from 'next/headers';
import { getLocaleFromHost, getTranslations } from '@/lib/i18n-subdomain';
import Link from 'next/link';
import ResendVerificationButton from '@/components/ResendVerificationButton';

export const metadata: Metadata = {
  title: 'Confirm your email | IntoBrick',
  // Nothing here is worth indexing, and the URL carries a token.
  robots: { index: false, follow: false },
};

/**
 * Where the link in the verification email lands.
 *
 * The token is consumed here, server-side, rather than by the page calling its
 * own API from the browser. One round trip instead of two, and it works with
 * JavaScript disabled -- which matters for a link people open from a mail
 * client on a phone.
 *
 * Dynamic because the outcome depends entirely on a token in the query string,
 * and cache-handler.js keeps rendered routes in MySQL. A cached "verified"
 * would be a lie told to whoever loads it next.
 */
export const dynamic = 'force-dynamic';

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);

  const result = await consumeVerificationToken(token || '');

  const copy = {
    verified: {
      title: t.verifyEmail?.verifiedTitle || 'Email confirmed',
      body:
        t.verifyEmail?.verifiedBody ||
        'Thanks — your address is confirmed. Price alerts and the daily deals email are available now.',
    },
    already_verified: {
      title: t.verifyEmail?.alreadyTitle || 'Already confirmed',
      body:
        t.verifyEmail?.alreadyBody ||
        'This address was already confirmed. Nothing else to do.',
    },
    expired: {
      title: t.verifyEmail?.expiredTitle || 'This link has expired',
      body:
        t.verifyEmail?.expiredBody ||
        'Confirmation links last 24 hours. Sign in and we will send you a fresh one.',
    },
    invalid: {
      title: t.verifyEmail?.invalidTitle || 'This link is not valid',
      body:
        t.verifyEmail?.invalidBody ||
        'It may have already been used. Sign in and we will send you a new one.',
    },
  }[result.status];

  const ok = result.status === 'verified' || result.status === 'already_verified';

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '16px' }} aria-hidden="true">
          {ok ? '✅' : '⚠️'}
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#171717', margin: '0 0 12px' }}>
          {copy.title}
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: '#525252', lineHeight: 1.6, margin: '0 0 24px' }}>
          {copy.body}
        </p>

        {ok ? (
          <Link
            href="/"
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
            {t.verifyEmail?.continue || 'Continue to IntoBrick'}
          </Link>
        ) : (
          // Only useful to someone already signed in; the button says so
          // itself rather than this page guessing at their session.
          <ResendVerificationButton />
        )}
      </div>
    </div>
  );
}
