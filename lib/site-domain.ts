/**
 * The single source of truth for this site's hostnames.
 *
 * Deliberately a leaf module: it imports nothing, so both lib/i18n-subdomain.ts
 * and lib/i18n-alternates.ts can depend on it without a circular import. Before
 * this, 33 files each carried their own hand-written copy of the same ten-entry
 * locale→domain map, which is a lot of places for one of them to drift out of
 * sync — or to be missed entirely during a domain move.
 *
 * All ten hosts derive from one string. English is the bare apex; every other
 * locale is a subdomain of it. Changing domain is therefore a single env var,
 * not a find-and-replace across the app.
 */

export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_DOMAIN?.trim() || 'figtracker.ericksu.com';

/** Bare hostname for a locale. English is the apex; the rest are subdomains. */
export function hostFor(locale: string): string {
  return locale === 'en' ? SITE_DOMAIN : `${locale}.${SITE_DOMAIN}`;
}

/** Full https origin for a locale, no trailing slash. */
export function originFor(locale: string): string {
  return `https://${hostFor(locale)}`;
}
