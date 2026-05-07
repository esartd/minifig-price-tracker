import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return { authorized: false, error: 'Unauthorized', userId: null };
  }

  // Check if user is admin by email (for now) or role field (after migration)
  const isAdminEmail = session.user.email === 'erickk osysu@gmail.com';

  // Try to check role field if it exists
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (user?.role === 'admin' || isAdminEmail) {
      return { authorized: true, userId: user.id, error: null };
    }
  } catch (error) {
    // Role field might not exist yet, fall back to email check
    if (isAdminEmail) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      return { authorized: true, userId: user?.id || null, error: null };
    }
  }

  return { authorized: false, error: 'Forbidden - Admin access required', userId: null };
}
