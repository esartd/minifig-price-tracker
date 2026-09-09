import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * The admin account, in one place.
 *
 * It was written out by hand in twelve files, and two of them had drifted to a
 * different address entirely -- ericksu0c@ rather than erickkosysu@. The result
 * was that /admin/visitor-analytics redirected the actual admin away from his
 * own analytics page, and /api/admin/diagnose-cache answered him 401, while the
 * other ten places let him straight in. Nothing reported this; the page simply
 * behaved as though he were a stranger.
 *
 * Import this instead of typing an address. ADMIN_EMAIL in the environment
 * overrides it, so the account can move without a code change.
 */
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.trim() || 'erickkosysu@gmail.com';

/** True when this session belongs to the admin. */
export function isAdminEmail(email?: string | null): boolean {
  return !!email && email === ADMIN_EMAIL;
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return { authorized: false, error: 'Unauthorized', userId: null };
  }

  if (isAdminEmail(session.user.email)) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    return { authorized: true, userId: user?.id || null, error: null };
  }

  return { authorized: false, error: 'Forbidden - Admin access required', userId: null };
}
