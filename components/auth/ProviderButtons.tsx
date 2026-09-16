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
            aria-hidden="true"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: BRAND_COLORS[p.id] || '#737373',
              flexShrink: 0,
            }}
          />
          {pending === p.id ? '…' : `${prefix} ${p.name}`}
        </button>
      ))}
    </div>
  );
}
