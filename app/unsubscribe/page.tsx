import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { getLocaleFromHost, getTranslations, type Locale } from '@/lib/i18n-subdomain';
import type { Metadata } from 'next';

/**
 * One-click unsubscribe, reached from a link in an announcement email.
 *
 * Deliberately does the work on GET with no confirmation button. That is
 * unusual — normally a state change on GET is a bug — but here the alternative
 * is worse: a recipient who clicks "unsubscribe" and lands on a page asking
 * them to click again, or to sign in, will mark the message as spam instead.
 * Spam complaints damage the sending domain for everyone; a stray prefetch
 * costs one person an email they can re-enable in their account settings.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '') as Locale;
  const t = await getTranslations(locale);
  const copy = t.unsubscribe || {};

  let state: 'done' | 'already' | 'invalid' = 'invalid';

  if (token) {
    const user = await prisma.user.findUnique({
      where: { unsubscribeToken: token },
      select: { id: true, emailSubscribed: true },
    });

    if (user) {
      if (user.emailSubscribed) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailSubscribed: false },
        });
        state = 'done';
      } else {
        state = 'already';
      }
    }
  }

  const heading =
    state === 'invalid'
      ? copy.invalidTitle || 'That link did not work'
      : copy.doneTitle || "You're unsubscribed";

  const body =
    state === 'invalid'
      ? copy.invalidBody ||
        'This unsubscribe link is not valid. It may have already been used, or the address may have been changed.'
      : state === 'already'
        ? copy.alreadyBody || 'You had already unsubscribed. Nothing more to do.'
        : copy.doneBody ||
          'You will not receive any more announcement emails from IntoBrick. Emails about your own account — password resets and price alerts you set up — still work as before.';

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#171717',
          margin: '0 0 12px',
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h1>

      <p style={{ fontSize: '16px', color: '#525252', lineHeight: '1.6', margin: '0 0 28px' }}>
        {body}
      </p>

      {state !== 'invalid' && (
        <p style={{ fontSize: '14px', color: '#737373', lineHeight: '1.6', margin: '0 0 28px' }}>
          {copy.resubscribeHint ||
            'Changed your mind? You can turn announcements back on in your account settings.'}
        </p>
      )}

      <a
        href="/"
        style={{
          display: 'inline-block',
          background: '#3b82f6',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '11px 20px',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: '500',
        }}
      >
        {copy.backHome || 'Back to IntoBrick'}
      </a>
    </div>
  );
}
