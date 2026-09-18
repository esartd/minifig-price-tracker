'use client';

import { useEffect, useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';

/**
 * Sign-in buttons for whichever OAuth providers are actually configured.
 *
 * The list comes from NextAuth's own getProviders(), which reports what auth.ts
 * registered at runtime. That matters: auth.ts only registers a provider whose
 * credentials are present, so a half-configured provider renders no button
 * rather than a button that leads to an error page.
 *
 * An earlier version of this duplicated those environment checks in a separate
 * module. That worked but created a second list to keep in step, and the
 * failure mode was silent — add a provider, forget the mirror, and it exists
 * with no way to reach it. getProviders() cannot drift.
 *
 * Google and the magic link are rendered by their own components: Google has
 * brand rules about its mark, and the magic link needs an email input rather
 * than a button.
 */

const BRAND_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  discord: '#5865F2',
};

/**
 * The real brand marks.
 *
 * These buttons previously rendered a 10px coloured circle as a stand-in,
 * which sat directly under a Google button carrying its actual "G" and looked
 * unfinished by comparison -- the dot reads as a bullet point, not a logo.
 *
 * Drawn in currentColor so each is tinted by the brand colour above, and sized
 * to match GoogleButton's 20px mark so the row lines up.
 */
const BRAND_MARKS: Record<string, React.ReactNode> = {
  discord: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.198.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

/** Rendered elsewhere, or not a button at all. */
const RENDERED_SEPARATELY = new Set(['google', 'credentials', 'resend']);

export function ProviderButtons({
  callbackUrl = '/',
  prefix = 'Continue with',
}: {
  callbackUrl?: string;
  prefix?: string;
}) {
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProviders()
      .then((all) => {
        if (cancelled || !all) return;
        setProviders(
          Object.values(all)
            .filter((p) => !RENDERED_SEPARATELY.has(p.id))
            .map((p) => ({ id: p.id, name: p.name }))
        );
      })
      .catch(() => {
        // Showing no extra buttons is the safe failure: the password form and
        // Google are rendered by the page regardless.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (providers.length === 0) return null;

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled={pending !== null}
          onClick={() => {
            setPending(p.id);
            // OAuth navigates away; failures return as ?error= on the way back.
            signIn(p.id, { callbackUrl }).catch(() => setPending(null));
          }}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: '#171717',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            cursor: pending ? 'default' : 'pointer',
            opacity: pending && pending !== p.id ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: BRAND_COLORS[p.id] || '#737373',
              flexShrink: 0,
            }}
          >
            {BRAND_MARKS[p.id] ?? (
              // An unknown provider still gets something, rather than a gap.
              <span
                aria-hidden="true"
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'currentColor',
                  display: 'block',
                }}
              />
            )}
          </span>
          {pending === p.id ? '…' : `${prefix} ${p.name}`}
        </button>
      ))}
    </div>
  );
}
