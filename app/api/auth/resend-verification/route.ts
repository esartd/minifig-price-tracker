import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { issueVerificationToken } from '@/lib/email-verification';
import { sendVerificationEmail } from '@/lib/email';

/**
 * Sends the verification email again.
 *
 * ## Signed-in only, deliberately
 *
 * The obvious design takes an email address in the body so someone can resend
 * from the sign-in page. That is a free, unauthenticated way to send mail from
 * this domain to any address on the internet -- a spam cannon wearing our
 * reputation. This domain is already disputing a Cisco phishing classification;
 * it does not need an open relay on top.
 *
 * Requiring a session means the only address anyone can mail is their own.
 * Someone locked out entirely uses password reset, which has the same
 * protection by being tied to an existing account.
 */

export const dynamic = 'force-dynamic';

/**
 * One resend per five minutes per user.
 *
 * In-memory, so a restart clears it and each process keeps its own count. That
 * is weak, and it is still the right trade here: the endpoint already requires
 * a session and can only mail the session owner, so the worst case is someone
 * mailing themselves. This exists to stop a stuck retry loop, not an attacker.
 */
const RESEND_COOLDOWN_MS = 5 * 60 * 1000;
const lastSent = new Map<string, number>();

export async function POST() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, emailVerified: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Nothing to do, and worth saying so rather than sending a pointless email.
  if (user.emailVerified) {
    return NextResponse.json({ success: true, alreadyVerified: true });
  }

  const now = Date.now();
  const previous = lastSent.get(session.user.id);
  if (previous && now - previous < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - previous)) / 1000);
    return NextResponse.json(
      { error: 'Please wait before requesting another email', waitSeconds },
      { status: 429 }
    );
  }
  lastSent.set(session.user.id, now);

  try {
    const token = await issueVerificationToken(user.email);
    const result = await sendVerificationEmail(user.email, token, user.name || undefined);

    if (!result.success) {
      // Let them try again straight away if the send itself failed -- the
      // cooldown is there to stop loops, not to punish our own outage.
      lastSent.delete(session.user.id);
      return NextResponse.json(
        { error: 'Could not send the email. Try again shortly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    lastSent.delete(session.user.id);
    console.error('[resend-verification] failed:', error);
    return NextResponse.json({ error: 'Could not send the email' }, { status: 500 });
  }
}
