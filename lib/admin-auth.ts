import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * The admin accounts, in one place.
 *
 * The address was written out by hand in twelve files, and two of them had
 * drifted to a different one entirely -- ericksu0c@ rather than erickkosysu@.
 * The result was that /admin/visitor-analytics redirected the actual admin away
 * from his own analytics page, and /api/admin/diagnose-cache answered him 401,
 * while the other ten places let him straight in. Nothing reported this; the
 * page simply behaved as though he were a stranger.
 *
 * Import from here instead of typing an address.
 *
 * `ADMIN_EMAILS` in the environment overrides the list -- comma separated --
 * so accounts can be added or moved without a deploy. `ADMIN_EMAIL` (singular)
 * is still honoured for the older single-admin setup.
 */
const FALLBACK_ADMINS = [
  'erickkosysu@gmail.com',
  'livingonthemoment@gmail.com',
];

export const ADMIN_EMAILS: string[] = (() => {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '';
  const parsed = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : FALLBACK_ADMINS;
})();

/**
 * The first admin, for the handful of places that need ONE address rather than
 * the set -- "email the admin", not "is this person an admin".
 *
 * Never use it for an access check: with two admins that silently locks the
 * second one out, which is the exact failure the drift above caused.
 */
export const PRIMARY_ADMIN_EMAIL = ADMIN_EMAILS[0];

/**
 * True when this session belongs to an admin.
 *
 * Compared lower-cased: providers vary on the casing they hand back, and an
 * admin who signs in as Erick@ rather than erick@ is still the admin. The old
 * exact `===` would have refused them.
 */
export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return { authorized: false, error: 'Unauthorized', userId: null };
  }

  if (isAdminEmail(session.user.email)) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    return { authorized: true, userId: user?.id || null, error: null };
  }

  return { authorized: false, error: 'Forbidden - Admin access required', userId: null };
}
