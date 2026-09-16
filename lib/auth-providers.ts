import 'server-only';

/**
 * Which sign-in methods are actually usable right now.
 *
 * auth.ts only registers a provider when its credentials are present, because
 * a provider without keys still renders a button and that button leads to an
 * error page. This mirrors those same conditions so the sign-in and signup
 * pages show exactly the buttons that will work.
 *
 * The two must be kept in step. If you add a provider to auth.ts, add it here
 * as well, or it exists and nobody can see it.
 */

export type AuthProviderId = 'google' | 'resend' | 'facebook' | 'discord' | 'apple';

export type AvailableProvider = {
  id: AuthProviderId;
  /** Shown on the button. Not translated: these are product names. */
  label: string;
  /** Brand colour, for the button border/accent. */
  color: string;
};

export function getAvailableProviders(): AvailableProvider[] {
  const providers: AvailableProvider[] = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push({ id: 'google', label: 'Google', color: '#4285F4' });
  }
  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.push({ id: 'facebook', label: 'Facebook', color: '#1877F2' });
  }
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    providers.push({ id: 'discord', label: 'Discord', color: '#5865F2' });
  }
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
    providers.push({ id: 'apple', label: 'Apple', color: '#000000' });
  }

  return providers;
}

/**
 * Whether passwordless email sign-in is available.
 *
 * Separate from the list above because it is not a button in a row of logos --
 * it takes an email address, so it gets its own form.
 */
export function hasMagicLink(): boolean {
  return !!process.env.RESEND_API_KEY;
}
