import 'server-only';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Issuing and consuming email-verification tokens.
 *
 * Deliberately the same shape as the password reset flow in
 * app/api/auth/forgot-password — random bytes, stored in VerificationToken,
 * checked for expiry, deleted on use. One pattern, not two.
 *
 * ## Why the identifier is namespaced
 *
 * VerificationToken's primary key is [identifier, token], and password reset
 * uses the bare email as the identifier. It also runs
 * `deleteMany({ identifier: email })` before issuing, to clear stale tokens.
 *
 * If verification used the bare email too, those two flows would share a key
 * space: requesting a password reset would silently destroy a pending
 * verification token, and verifying would destroy a pending reset. Both would
 * fail later, at the point of use, with "invalid or expired" and no clue why.
 *
 * Prefixing with `verify:` keeps them in separate namespaces while still
 * letting each clear its own stale tokens.
 */

const VERIFY_PREFIX = 'verify:';

/**
 * 24 hours, against password reset's 1 hour.
 *
 * A reset link is acted on immediately -- the person is locked out and waiting.
 * A verification link competes with the rest of someone's inbox, and an
 * expired one costs us the signup we just earned.
 */
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function verificationIdentifier(email: string): string {
  return `${VERIFY_PREFIX}${email.trim().toLowerCase()}`;
}

/**
 * Replace any pending token for this address and return a fresh one.
 *
 * Replacing rather than adding means a resend invalidates the previous link.
 * That is the behaviour people expect -- the newest mail in the inbox is the
 * one that works -- and it stops an old link resurfacing months later.
 */
export async function issueVerificationToken(email: string): Promise<string> {
  const identifier = verificationIdentifier(email);
  const token = crypto.randomBytes(32).toString('hex');

  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  return token;
}

export type VerificationResult =
  | { status: 'verified'; email: string }
  | { status: 'already_verified'; email: string }
  | { status: 'expired'; email: string }
  | { status: 'invalid' };

/**
 * Consume a token and mark the address verified.
 *
 * `already_verified` is a distinct outcome on purpose. People click the link in
 * the email twice, or open it on their phone after their laptop -- and being
 * told "invalid token" for having already succeeded is alarming for no reason.
 */
export async function consumeVerificationToken(
  token: string
): Promise<VerificationResult> {
  if (!token) return { status: 'invalid' };

  const row = await prisma.verificationToken.findFirst({ where: { token } });

  if (!row || !row.identifier.startsWith(VERIFY_PREFIX)) {
    // Either nothing matched, or it is a password-reset token being replayed
    // against the wrong endpoint. Neither should verify an address.
    return { status: 'invalid' };
  }

  const email = row.identifier.slice(VERIFY_PREFIX.length);

  if (row.expires < new Date()) {
    await prisma.verificationToken
      .delete({ where: { identifier_token: { identifier: row.identifier, token: row.token } } })
      .catch(() => {});
    return { status: 'expired', email };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  });

  // The token is valid but the account is gone. Clean up and say nothing
  // useful -- this endpoint is unauthenticated and must not confirm which
  // addresses have accounts.
  if (!user) {
    await prisma.verificationToken
      .delete({ where: { identifier_token: { identifier: row.identifier, token: row.token } } })
      .catch(() => {});
    return { status: 'invalid' };
  }

  await prisma.verificationToken
    .delete({ where: { identifier_token: { identifier: row.identifier, token: row.token } } })
    .catch(() => {});

  if (user.emailVerified) {
    return { status: 'already_verified', email };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  return { status: 'verified', email };
}
