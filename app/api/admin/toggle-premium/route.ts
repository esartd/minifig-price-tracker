import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Same hardcoded admin email used elsewhere in the codebase (app/admin/stats,
// app/api/admin/popular-themes, the article/articles-page "isAdmin" checks).
const ADMIN_EMAIL = 'erickkosysu@gmail.com';

/**
 * POST /api/admin/toggle-premium
 *
 * Lets the site owner flip their own account between simulated Premium and
 * Free instantly, with zero Stripe involvement and zero charge -- for
 * testing both experiences. Locked to ADMIN_EMAIL only; everyone else gets
 * 403. This writes the same `subscriptionStatus` field the real Stripe
 * webhook writes, so if a genuine billing event ever fires for this account
 * it will simply overwrite this value with the real status, as normal.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true },
  });

  const isCurrentlyPremium = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing';

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      subscriptionStatus: isCurrentlyPremium ? null : 'active',
      subscriptionCancelAtPeriodEnd: false,
    },
    select: { subscriptionStatus: true },
  });

  return NextResponse.json({ isPremium: updated.subscriptionStatus === 'active' });
}
