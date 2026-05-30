/**
 * Authentication utility functions
 */

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

    // For absolute URLs, verify same origin
    const parsedUrl = new URL(url);
    const currentOrigin = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || '';

    return parsedUrl.origin === currentOrigin;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Safely extracts and validates callback URL from window location
 *
 * @param fallback - Fallback URL if invalid or missing (default: '/')
 * @returns Validated callback URL
 */
export function getSafeCallbackUrl(fallback: string = '/'): string {
  if (typeof window === 'undefined') return fallback;

  const searchParams = new URLSearchParams(window.location.search);
  const rawUrl = searchParams.get('callbackUrl');

  if (!rawUrl) return fallback;

  return isValidCallbackUrl(rawUrl) ? rawUrl : fallback;
}
