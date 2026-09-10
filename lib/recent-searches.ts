/**
 * The last few things this person searched for, kept in their own browser.
 *
 * Deliberately localStorage and not the database: it is a convenience, it is
 * per-device, and it should work for someone who has never signed in -- which
 * is most people who land on /search.
 *
 * Written from components/HeaderSearch.tsx so it captures every route into a
 * search: pressing Enter, and picking a suggestion from the dropdown. Read by
 * the /search empty state.
 */
const KEY = 'intobrick:recent-searches';
const MAX = 6;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(t => typeof t === 'string').slice(0, MAX) : [];
  } catch {
    // Private mode, disabled storage, or someone else's JSON in our key.
    return [];
  }
}

export function addRecentSearch(term: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = term.trim();
  if (trimmed.length < 2) return;

  try {
    // Case-insensitive dedupe, most recent first -- searching "Darth" twice
    // should move it to the top, not add a second entry.
    const existing = getRecentSearches().filter(
      t => t.toLowerCase() !== trimmed.toLowerCase()
    );
    window.localStorage.setItem(KEY, JSON.stringify([trimmed, ...existing].slice(0, MAX)));
  } catch {
    // Storage full or unavailable. A missing history is not worth an error.
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
