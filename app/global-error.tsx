'use client';

/**
 * Root error boundary.
 *
 * Without this file Next falls back to its own bare message — "Application
 * error: a client-side exception has occurred" — which is what visitors saw
 * during every deploy.
 *
 * Two rules shape this file:
 *
 * 1. It must not depend on anything that a deploy can take away. The whole
 *    reason we are here is usually that JavaScript files went missing, so
 *    pulling in the header, the translation provider or an icon package
 *    would risk the error screen failing exactly when it is needed. Hence
 *    inline styles, hand-rolled CSS bricks, and copy loaded from a plain
 *    JSON file rather than the translation runtime.
 *
 * 2. It must not claim to be deploying when it is not. `isDeployError`
 *    decides; anything else gets an honest "something went wrong".
 *
 * Next requires this component to render its own <html> and <body>: it
 * replaces the root layout rather than rendering inside it.
 */

import { useEffect, useState } from 'react';
import { isDeployError } from '@/lib/deploy-error';
import copy from '@/lib/deploy-copy.json';

type Phase = 'deciding' | 'updating' | 'error';

/**
 * Reloading is the actual fix for a missing chunk — fresh HTML points at
 * filenames that exist — so we do that first and most people never see a
 * screen at all. Bounded, because a reload that keeps failing would
 * otherwise loop: at most three tries, then we stop and show the screen
 * with a manual button.
 */
const ATTEMPT_KEY = 'figtracker:deploy-reloads';
const MAX_AUTO_RELOADS = 3;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 3000;
const SLOW_AFTER_MS = 90_000;

interface Attempts {
  count: number;
  first: number;
}

function readAttempts(): Attempts {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_KEY);
    if (!raw) return { count: 0, first: 0 };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.count !== 'number') return { count: 0, first: 0 };
    // A later deploy in the same session deserves a fresh set of tries.
    if (Date.now() - parsed.first > ATTEMPT_WINDOW_MS) return { count: 0, first: 0 };
    return parsed;
  } catch {
    // Private browsing can throw on sessionStorage. Treat as no history:
    // worst case we reload once more than intended.
    return { count: 0, first: 0 };
  }
}

function recordAttempt(previous: Attempts): void {
  try {
    sessionStorage.setItem(
      ATTEMPT_KEY,
      JSON.stringify({ count: previous.count + 1, first: previous.first || Date.now() })
    );
  } catch {
    /* ignore — see readAttempts */
  }
}

/** Locale lives in the subdomain (de.figtracker…), English is the bare host. */
function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const prefix = window.location.hostname.split('.')[0];
  return Object.prototype.hasOwnProperty.call(copy, prefix) ? prefix : 'en';
}

const BRICKS = [
  { color: '#f59e0b', delay: '0.6s' },
  { color: '#22c55e', delay: '0.4s' },
  { color: '#3b82f6', delay: '0.2s' },
  { color: '#ef4444', delay: '0s' },
];

const STYLES = `
  @keyframes ftrise { 0% { transform: translateY(6px); opacity: .2 } 40%, 100% { transform: translateY(0); opacity: 1 } }
  .ft-brick { width: 44px; height: 20px; border-radius: 3px; position: relative; animation: ftrise 1.8s ease-in-out infinite }
  .ft-brick::before, .ft-brick::after { content: ""; position: absolute; top: -5px; width: 10px; height: 6px; border-radius: 2px 2px 0 0; background: inherit }
  .ft-brick::before { left: 8px }
  .ft-brick::after { left: 25px }
  .ft-btn:hover { background: #f5f5f5 }
  @media (prefers-reduced-motion: reduce) { .ft-brick { animation: none } }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const deploy = isDeployError(error);
  // Non-deploy errors render straight away; only the deploy path needs a beat
  // to decide whether to reload instead of painting anything.
  const [phase, setPhase] = useState<Phase>(deploy ? 'deciding' : 'error');
  const [slow, setSlow] = useState(false);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  useEffect(() => {
    if (!deploy) return;

    const attempts = readAttempts();
    if (attempts.count < MAX_AUTO_RELOADS) {
      recordAttempt(attempts);
      window.location.reload();
      return;
    }

    setPhase('updating');
  }, [deploy]);

  useEffect(() => {
    if (phase !== 'updating') return;

    const startedAt = Date.now();

    /**
     * We reload on recovery, which means we have to have seen it broken
     * first. Reloading merely because the server answers would loop: if the
     * server is up the whole time and only the assets are missing, every
     * reload lands on the same error, shows this screen again, polls, gets
     * its 200 and reloads again — a fresh crash every three seconds. So the
     * probe has to observe down-then-up, not just up.
     *
     * When the server never goes down, the screen simply waits and the
     * button below is the way out.
     */
    let sawFailure = false;

    const timer = setInterval(async () => {
      if (Date.now() - startedAt > SLOW_AFTER_MS) setSlow(true);
      try {
        // Cheap liveness check. Deliberately not /api/health — that runs a
        // database query, and Hostinger's connection limits are exactly the
        // thing you do not want a room full of waiting browsers polling.
        const response = await fetch(`/?_probe=${Date.now()}`, {
          method: 'HEAD',
          cache: 'no-store',
        });
        if (!response.ok) {
          sawFailure = true;
        } else if (sawFailure) {
          window.location.reload();
        }
      } catch {
        sawFailure = true;
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [phase]);

  const t = (copy as Record<string, Record<string, string>>)[locale] || copy.en;

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          // Fills the viewport so the area below the message stays white
          // instead of showing the browser's default grey canvas.
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          background: '#ffffff',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />

        {phase === 'deciding' ? null : (
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '96px 16px', textAlign: 'center' }}>
            {phase === 'updating' ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginBottom: '28px' }}
                  role="status"
                  aria-live="polite"
                  aria-label={t.updatingTitle}
                >
                  {BRICKS.map((brick) => (
                    <div
                      key={brick.color}
                      className="ft-brick"
                      style={{ background: brick.color, animationDelay: brick.delay }}
                    />
                  ))}
                </div>

                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#171717', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                  {t.updatingTitle}
                </h1>
                <p style={{ fontSize: '16px', color: '#737373', lineHeight: 1.6, margin: '0 0 32px' }}>
                  {slow ? t.updatingSlow : t.updatingBody}
                </p>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#171717', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                  {t.errorTitle}
                </h1>
                <p style={{ fontSize: '16px', color: '#737373', lineHeight: 1.6, margin: '0 0 32px' }}>
                  {t.errorBody}
                </p>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => (phase === 'updating' ? window.location.reload() : reset())}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {phase === 'updating' ? t.reload : t.retry}
              </button>

              {phase === 'error' && (
                <a
                  href="/"
                  className="ft-btn"
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  {t.home}
                </a>
              )}
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
