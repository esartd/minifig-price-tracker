/**
 * Authentication utility functions
 */
import { SITE_DOMAIN } from '@/lib/site-domain';

/**
 * Validates callback URL to prevent open redirect attacks
 * Only allows relative URLs starting with / or same-origin absolute URLs
 *
 * @param url - URL to validate
 * @returns true if URL is safe to redirect to
 */
export function isValidCallbackUrl(url: string): boolean {
  if (!url) return false;

  try {
    // Allow relative URLs starting with /
    if (url.startsWith('/')) {
      // Prevent protocol-relative URLs (//evil.com)
      if (url.startsWith('//')) return false;
      return true;
    }

    // For absolute URLs, verify same origin or same domain (allow subdomains)
    const parsedUrl = new URL(url);
    const currentOrigin = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || '';

    // Allow exact origin match
    if (parsedUrl.origin === currentOrigin) return true;

    // Allow the site's own subdomains (the nine language sites), plus the
    // retired host, whose links are still live in email and forum posts and
    // still 301 here. SITE_DOMAIN was missing from this list entirely, so a
    // callbackUrl aimed at de.intobrick.com from another locale was refused
    // and silently fell back.
    const allowedDomains = [SITE_DOMAIN, 'figtracker.ericksu.com'];
    if (allowedDomains.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith(`.${d}`))) {
      return parsedUrl.protocol === 'https:';
    }

    return false;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Safely extracts and validates callback URL from window location
 *
 * @param fallback - Fallback URL if invalid or missing (default: current origin)
 * @returns Validated callback URL
 */
export function getSafeCallbackUrl(fallback?: string): string {
  if (typeof window === 'undefined') return fallback || '/';

  const searchParams = new URLSearchParams(window.location.search);
  const rawUrl = searchParams.get('callbackUrl');

  // If no callback specified, return current origin to preserve subdomain
  if (!rawUrl) {
    return fallback || window.location.origin;
  }

  // Validate the provided callback URL
  if (!isValidCallbackUrl(rawUrl)) {
    return fallback || window.location.origin;
  }

  // If valid but relative, make it absolute to preserve subdomain
  if (rawUrl.startsWith('/')) {
    return window.location.origin + rawUrl;
  }

  return rawUrl;
}
