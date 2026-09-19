'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';
import {
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
  BugAntIcon,
  SparklesIcon,
  ChatBubbleOvalLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

/**
 * Site-wide feedback: a bug report, a feature request, or anything else.
 *
 * ## Why it is bottom-LEFT
 *
 * Bottom-right is already taken twice over. ScrollToTop sits at bottom 32 /
 * right 32 (z-index 1000) and GuestCollectionBadge at bottom 24 / right 24
 * (z-index 9997), so a signed-out visitor who has scrolled past 300px with
 * items in a guest collection already sees those two stacked on each other.
 * A third would make a bad corner worse. Left is empty on every page.
 *
 * ## Why a floating button rather than a link
 *
 * The whole value is catching someone at the moment the thing annoyed them.
 * Nobody navigates to a contact page to report that a price looks wrong -- and
 * before this there was nowhere to navigate to anyway: /support is a donation
 * page, and "contact" was a mailto: in four separate files.
 *
 * ## Turnstile
 *
 * The script is only fetched when the panel opens. This renders on every page
 * on the site, and a third-party script on every page view to guard a form
 * almost nobody opens is a bad trade. The token is single-use: the API route
 * verifies it per submission rather than trusting the 24h `captcha_verified`
 * cookie, so the widget asks for a fresh one after every send.
 *
 * **On a dev server the challenge will say "Unable to connect to website".**
 * That is not a bug in this component -- the production site key does not list
 * `localhost` among its allowed hostnames, and Turnstile refuses to render
 * rather than explaining why. Either add `localhost` to the widget's hostnames
 * in the Cloudflare dashboard, or put Cloudflare's documented always-pass test
 * pair in a `.env.development.local` (which overrides `.env.local`):
 *
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
 *   TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
 *
 * Delete that file before deploying. It makes the check pass unconditionally,
 * which on a public endpoint is the same as having no check at all.
 */

type FeedbackType = 'bug' | 'feature' | 'other';

const MAX_MESSAGE = 2000;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function FeedbackWidget() {
  const { t, locale } = useTranslation();
  const { data: session } = useSession();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const turnstileHostRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const signedIn = !!session?.user;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // ---------------------------------------------------------------- Turnstile

  /**
   * Render the challenge into the open panel.
   *
   * `remove` before `render` matters: opening, closing and reopening the panel
   * would otherwise leave orphaned widgets behind and `reset()` with no id
   * would act on whichever Cloudflare rendered last, which is not necessarily
   * the one on screen.
   */
  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !turnstileHostRef.current || !siteKey) return;

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        /* already gone */
      }
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(turnstileHostRef.current, {
      sitekey: siteKey,
      callback: (tok: string) => setToken(tok),
      'error-callback': () => setToken(''),
      'expired-callback': () => setToken(''),
      theme: 'light',
      size: 'flexible',
    });
  }, [siteKey]);

  // Load the script the first time the panel opens, never before.
  useEffect(() => {
    if (!open || !siteKey) return;

    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', renderTurnstile, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', renderTurnstile, { once: true });
    document.head.appendChild(script);
  }, [open, siteKey, renderTurnstile]);

  // The Resources dropdown in the header opens this panel. A custom event
  // rather than shared state, because the header and this widget have no
  // common parent short of the root layout, and threading a context through
  // the whole tree to carry one boolean would be the wrong shape.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('intobrick:open-feedback', onOpen);
    return () => window.removeEventListener('intobrick:open-feedback', onOpen);
  }, []);

  // ------------------------------------------------- Escape, focus, scrolling

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }

      // Focus trap. No Modal primitive exists in this codebase -- the three
      // dialogs that do exist trap nothing -- so it is written out here rather
      // than copied from one of them.
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Return focus to the button that opened the panel, so keyboard users are
  // not dropped at the top of the document.
  useEffect(() => {
    if (!open) triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  // --------------------------------------------------------------- Submitting

  const close = () => {
    setOpen(false);
    // Reset only after the closing frame, so the form does not visibly empty
    // itself on the way out.
    setTimeout(() => {
      setSent(false);
      setError('');
      setMessage('');
      setToken('');
      setType('bug');
    }, 200);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError(t('feedback.errors.empty') || 'Please tell us what happened.');
      return;
    }
    if (siteKey && !token) {
      setError(t('feedback.errors.verify') || 'Please complete the verification check.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: signedIn ? '' : email.trim(),
          // The full URL, not just the pathname: the locale subdomain is part
          // of what makes a bug reproducible here.
          pageUrl: typeof window !== 'undefined' ? window.location.href : pathname,
          locale,
          turnstileToken: token,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSent(true);
      } else if (res.status === 429) {
        setError(t('feedback.errors.tooMany') || 'Too many submissions. Please try again later.');
      } else {
        setError(data.error || t('feedback.errors.generic') || 'Something went wrong. Please try again.');
      }
    } catch {
      setError(t('feedback.errors.generic') || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
      // The token is spent whether or not the write succeeded, so a retry
      // needs a fresh challenge.
      setToken('');
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          /* widget gone */
        }
      }
    }
  };

  // ------------------------------------------------------------------ Styling

  const TYPES: { value: FeedbackType; label: string; Icon: typeof BugAntIcon }[] = [
    { value: 'bug', label: t('feedback.types.bug') || 'Something is broken', Icon: BugAntIcon },
    { value: 'feature', label: t('feedback.types.feature') || 'I have an idea', Icon: SparklesIcon },
    { value: 'other', label: t('feedback.types.other') || 'Something else', Icon: ChatBubbleOvalLeftIcon },
  ];

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label={t('feedback.open') || 'Send feedback'}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          width: 'var(--icon-2xl)',
          height: 'var(--icon-2xl)',
          borderRadius: '999px',
          background: '#ffffff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          cursor: 'pointer',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 9996,
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.16)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        }}
      >
        <ChatBubbleLeftEllipsisIcon style={{ width: 'var(--icon-base)', height: 'var(--icon-base)' }} />
      </button>

      {open && (
        <>
          <div
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              // Above the sticky header (10000) and the currency banner
              // (10001). At 9998 the header rendered straight over the top of
              // the panel and hid its title.
              zIndex: 10002,
            }}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              right: '24px',
              // Anchored bottom-left on desktop; the `right` above plus this
              // cap lets it fill the width on a phone without a media query.
              maxWidth: '400px',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              zIndex: 10003,
              padding: '24px',
            }}
          >
            <button
              onClick={close}
              aria-label={t('feedback.close') || 'Close'}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: 0,
              }}
            >
              <XMarkIcon style={{ width: '20px', height: '20px' }} />
            </button>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircleIcon
                  style={{ width: '48px', height: '48px', color: '#16a34a', margin: '0 auto 12px' }}
                />
                <h2 id="feedback-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                  {t('feedback.success.title') || 'Thank you'}
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px', lineHeight: 1.6 }}>
                  {t('feedback.success.body') || 'Your feedback has been recorded. Every message is read.'}
                </p>
                <button
                  onClick={close}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t('feedback.success.done') || 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2 id="feedback-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px', paddingRight: '28px' }}>
                  {t('feedback.title') || 'Send feedback'}
                </h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px', lineHeight: 1.5 }}>
                  {t('feedback.subtitle') || 'Found a bug or want something added? Tell us — it goes straight to the person who builds this.'}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <span style={labelStyle}>{t('feedback.typeLabel') || 'What is this about?'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {TYPES.map(({ value, label, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setType(value)}
                        aria-pressed={type === value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${type === value ? '#3b82f6' : '#e5e7eb'}`,
                          background: type === value ? '#eff6ff' : '#ffffff',
                          color: type === value ? '#1d4ed8' : '#374151',
                          fontSize: '14px',
                          fontWeight: type === value ? 600 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="feedback-message" style={labelStyle}>
                    {t('feedback.messageLabel') || 'Tell us more'}
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                    rows={4}
                    required
                    placeholder={
                      type === 'bug'
                        ? t('feedback.placeholders.bug') || 'What were you doing, and what happened instead?'
                        : t('feedback.placeholders.other') || 'What would you like to see?'
                    }
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      color: '#111827',
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'right', marginTop: '4px' }}>
                    {message.length}/{MAX_MESSAGE}
                  </div>
                </div>

                {!signedIn && (
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="feedback-email" style={labelStyle}>
                      {t('feedback.emailLabel') || 'Your email (optional)'}
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        color: '#111827',
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {t('feedback.emailHelper') || 'Only so we can follow up if we need more detail.'}
                    </p>
                  </div>
                )}

                <div ref={turnstileHostRef} style={{ marginBottom: error ? '12px' : '16px' }} />

                {error && (
                  <p
                    role="alert"
                    style={{
                      fontSize: '13px',
                      color: '#b91c1c',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      margin: '0 0 16px',
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: '100%',
                    background: sending ? '#93c5fd' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: sending ? 'default' : 'pointer',
                  }}
                >
                  {sending
                    ? t('feedback.sending') || 'Sending…'
                    : t('feedback.submit') || 'Send feedback'}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
