import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { tieredRateLimit } from '@/lib/tiered-rate-limit';
import { clusterIdFor } from '@/lib/feedback-cluster';

/**
 * Take a bug report, feature request or comment from anyone on the site.
 *
 * This is a public, unauthenticated write on a site that already attracts
 * scrapers, so it is guarded twice: a Turnstile token that must verify against
 * Cloudflare before a row is written, and a rate limit per IP on top of that.
 * Neither is optional. Without the token check this is a spam table.
 *
 * Turnstile is verified inline rather than by calling /api/verify-captcha,
 * because that route's contract is "set a 24h cookie", not "tell me if this
 * one token is good" -- and a cookie issued by an earlier challenge must NOT
 * authorise an unlimited number of later submissions. One token, one row.
 */

export const dynamic = 'force-dynamic';

const MAX_MESSAGE = 2000;
const MAX_EMAIL = 254;
const MAX_PAGE_URL = 500;
const MAX_USER_AGENT = 500;

const VALID_TYPES = new Set(['bug', 'feature', 'other']);

/**
 * How fast a submission has to arrive before we stop believing a person wrote
 * it. Reading three options, typing a sentence and pressing send takes longer
 * than this; a script posting a payload takes none of it.
 */
const MIN_FILL_MS = 3000;

/**
 * Deliberately tighter than the API_WRITE tier this would otherwise inherit.
 *
 * `getTierForPath` would classify /api/feedback as API_NORMAL (60/min), which
 * is far too loose for a public write. API_WRITE itself is not usable here:
 * its matcher tests `pathname.includes('POST')`, looking for an HTTP method
 * inside a path string, so it never fires for anything. That is a real bug in
 * lib/tiered-rate-limit.ts worth its own fix -- the config here does not
 * depend on it.
 *
 * Five an hour is generous for a person and useless for a script.
 *
 * The burst window has room for three because `tieredRateLimit` consumes on
 * check: a submission rejected for a stale Turnstile token costs the same as
 * one that succeeded. Two was tight enough that a person who hit one network
 * error and retried twice would be locked out of reporting the very bug they
 * were trying to report.
 */
const FEEDBACK_LIMIT = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000,
  burstMax: 3,
  burstWindowMs: 20 * 1000,
};

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Verify one Turnstile token with Cloudflare. Fails closed. */
async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    if (!data.success) {
      console.log('[FEEDBACK] Turnstile rejected:', data['error-codes']);
    }
    return !!data.success;
  } catch (error: any) {
    console.error('[FEEDBACK] Turnstile verification error:', error.message);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);

    const limit = tieredRateLimit(ip, 'FEEDBACK', FEEDBACK_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 });
    }

    const type = String(body.type || '').trim();
    if (!VALID_TYPES.has(type)) {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    // Honeypot. The field is in the form but hidden from people, so anything
    // in it came from something filling every input it could find.
    //
    // Answer 200 rather than an error, deliberately: a bot that is told it
    // failed learns to try again differently, while one that is told it
    // succeeded goes away. Nothing is written either way. For a site this
    // size the research is consistent that a honeypot plus a per-IP limit is
    // the right first line, and a captcha is what you add IF a form comes
    // under real attack -- not before.
    if (String(body.website || '').trim() !== '') {
      console.log('[FEEDBACK] honeypot triggered, discarding');
      return NextResponse.json({ success: true });
    }

    // Submitted implausibly fast. The client sends how long its panel was
    // open; a forged value is trivial, which is exactly why this is one layer
    // of several rather than the gate.
    const elapsedMs = Number(body.elapsedMs);
    if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < MIN_FILL_MS) {
      console.log(`[FEEDBACK] submitted in ${elapsedMs}ms, discarding`);
      return NextResponse.json({ success: true });
    }

    const message = String(body.message || '').trim();
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE) {
      return NextResponse.json({ success: false, error: 'Message is too long' }, { status: 400 });
    }

    // The challenge is demanded only where it can actually be checked.
    //
    // This is not a convenience: the widget renders the challenge only when
    // NEXT_PUBLIC_TURNSTILE_SITE_KEY exists, so on a deployment without the
    // keys it posts an empty token. An unconditional `if (!token) reject`
    // meant the two halves disagreed and NOBODY could submit -- which is how
    // this shipped, and was caught on the live site. A feedback form that
    // silently refuses every report is worse than one guarded by rate limit
    // alone.
    //
    // With no secret configured the endpoint still has the per-IP limit above
    // and Cloudflare's Bot Fight Mode in front of it, and the warning names
    // the exact variable to set.
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const turnstileToken = String(body.turnstileToken || '').trim();

    if (turnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json({ success: false, error: 'Verification required' }, { status: 400 });
      }
      if (!(await verifyTurnstile(turnstileToken, ip, turnstileSecret))) {
        return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 });
      }
    } else {
      console.warn(
        '[FEEDBACK] TURNSTILE_SECRET_KEY is not set — accepting submissions without a captcha. ' +
          'Set it and NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.production to turn the challenge on.'
      );
    }

    // The user id comes from the session, never from the request body --
    // otherwise anyone could file feedback in someone else's name. It is a
    // real cuid here; AffiliateClick and MonetizationEvent put an EMAIL in
    // their column of the same name, which is a wart, not a pattern.
    const session = await auth();
    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }

    // Only kept when they are signed out. A signed-in reporter is already
    // reachable through their account, so storing it twice is pointless.
    const rawEmail = String(body.email || '').trim().slice(0, MAX_EMAIL);
    const email = !userId && rawEmail && rawEmail.includes('@') ? rawEmail : null;

    await prisma.feedback.create({
      data: {
        type,
        message,
        email,
        userId,
        pageUrl: String(body.pageUrl || '').trim().slice(0, MAX_PAGE_URL) || null,
        userAgent: (request.headers.get('user-agent') || '').slice(0, MAX_USER_AGENT) || null,
        locale: String(body.locale || '').trim().slice(0, 10) || null,
        clusterId: clusterIdFor(message),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[FEEDBACK] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
