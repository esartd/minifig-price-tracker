import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { isPremiumUser } from '@/lib/premium';

/**
 * The daily deals digest opt-in.
 *
 *   GET  -> { enabled, isPremium }
 *   POST -> { enabled: boolean }
 *
 * Premium only, and enforced here rather than in the UI. The toggle on /deals
 * is shown to free users on purpose -- locked, linking to /premium -- so the
 * control being absent is never what stops anyone subscribing.
 *
 * Turning it OFF is deliberately allowed without a subscription. Someone whose
 * Premium has lapsed must still be able to stop the mail; refusing that is how
 * you earn spam complaints instead of unsubscribes.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const [user, premium] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dealsDigest: true },
    }),
    isPremiumUser(session.user.id),
  ]);

  return NextResponse.json({
    success: true,
    data: { enabled: !!user?.dealsDigest, isPremium: premium },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const enabled = body?.enabled === true;

  // Only switching ON requires a subscription. See the note above on why off
  // is always permitted.
  if (enabled && !(await isPremiumUser(session.user.id))) {
    return NextResponse.json(
      { success: false, error: 'The deals digest is a Premium feature', upgradeRequired: true },
      { status: 403 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { dealsDigest: enabled },
  });

  return NextResponse.json({ success: true, data: { enabled } });
}
