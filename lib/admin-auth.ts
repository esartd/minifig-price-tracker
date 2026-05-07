import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return { authorized: false, error: 'Unauthorized', userId: null };
  }

  // Check if user is admin by email
  const isAdminEmail = session.user.email === 'erickkosysu@gmail.com';

  if (isAdminEmail) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    return { authorized: true, userId: user?.id || null, error: null };
  }

  return { authorized: false, error: 'Forbidden - Admin access required', userId: null };
}
