/**
 * The one canonical URL form for a theme name.
 *
 * Theme pages answer on more than one path. `/themes/star-wars` and
 * `/themes/Star%20Wars` both return 200 with identical content and identical
 * counts, because the route only ever uses the segment to look the theme up
 * and title-cases it for display. Two addresses for one page splits whatever
 * ranking credit that page earns.
 *
 * The slug form is the canonical one -- it is what lib/sitemap-data.ts has
 * always submitted to Google, and what the server-side breadcrumb on
 * app/sets/[boxNo]/page.tsx already points at.
 *
 * This module exists because that rule was written out by hand in three
 * places: themeSlug() in lib/sitemap-data.ts, and a normalize() copied into
 * app/sets-themes/[theme]/layout.tsx with a comment asking the reader to keep
 * it in step. A canonical that disagrees with the sitemap by one byte drops
 * the page from both, so this is not a rule to keep in three heads.
 *
 * Deliberately dependency-free: it is imported by page metadata, by the
 * sitemap builder and by client components, and lib/sitemap-data.ts pulls in
 * Prisma and the whole catalogue.
 */

/** "Star Wars" -> "star-wars". Not URL-encoded; see themeSlug for that. */
export function normalizeThemeSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-');
}

/** The path segment: normalised, then percent-encoded. */
export function themeSlug(theme: string): string {
  return encodeURIComponent(normalizeThemeSlug(theme));
}

/**
 * True when a requested segment is already the canonical form.
 *
 * Compares the decoded values, so `Star%20Wars` and `star-wars` are judged on
 * "star wars" vs "star-wars" rather than on their encodings.
 */
export function isCanonicalThemeSegment(segment: string): boolean {
  try {
    return decodeURIComponent(segment) === normalizeThemeSlug(decodeURIComponent(segment));
  } catch {
    // A malformed segment cannot be canonical, and decodeURIComponent throws
    // on things like a lone '%'.
    return false;
  }
}
