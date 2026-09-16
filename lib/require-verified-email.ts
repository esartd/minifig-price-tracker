import 'server-only';
import { prisma } from '@/lib/prisma';

/**
 * Whether this account has confirmed its email address.
 *
 * Read from the database, not the session. The session's `emailConfirmed` is
 * baked into a JWT at sign-in and stays stale until the token refreshes, so
 * someone who verifies in another tab would keep being refused for as long as
 * their old token lives. That is the kind of bug people report as "I verified
 * and it still says I haven't".
 *
 * Used to gate the two features that send mail to the address in question --
 * price alerts and the deals digest. Everything else on the site works
 * unverified, on purpose: the point is not to punish people, it is to avoid
 * sending mail somewhere nobody has confirmed.
 */
export async function hasVerifiedEmail(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });
  return !!user?.emailVerified;
}
