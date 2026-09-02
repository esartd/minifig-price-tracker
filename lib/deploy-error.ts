/**
 * Tells a deploy casualty apart from a real bug.
 *
 * When a deploy replaces the build, every JavaScript filename changes — Next
 * gives each build a new ID. A browser holding the old page then asks for
 * files that no longer exist, the import fails, and React unmounts the tree.
 * Nothing is actually broken; the page just needs reloading.
 *
 * A genuine bug looks nothing like that and must not be dressed up as
 * maintenance: telling someone "we're updating" when their collection page
 * has a real fault wastes their time and hides the fault from us.
 *
 * Browsers word this failure differently, hence the list. Each entry was
 * taken from a real engine rather than guessed:
 *  - `ChunkLoadError`          webpack's own error name
 *  - "Loading chunk … failed"  webpack, older Chrome
 *  - "dynamically imported"    Chrome / Firefox native ESM
 *  - "module script failed"    Safari
 *  - MIME-type complaints      the server answered a .js request with an
 *                              HTML error page, so the parser choked
 *
 * Deliberately NOT matched: generic network failures ("Failed to fetch",
 * "NetworkError"). Those are usually the user's connection, not our deploy,
 * and claiming to be mid-update would be a lie in the common case.
 */

const DEPLOY_ERROR_PATTERNS: readonly RegExp[] = [
  /loading chunk \S+ failed/i,
  /loading css chunk \S+ failed/i,
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /expected a javascript(?: module)? script/i,
  /is not a valid javascript mime type/i,
];

export function isDeployError(error: unknown): boolean {
  if (!error) return false;

  const name = typeof error === 'object' && 'name' in error ? String((error as any).name) : '';
  if (name === 'ChunkLoadError') return true;

  const message =
    typeof error === 'string'
      ? error
      : typeof error === 'object' && 'message' in error
        ? String((error as any).message)
        : '';

  if (!message) return false;

  return DEPLOY_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}
