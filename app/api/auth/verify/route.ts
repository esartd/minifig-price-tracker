import { NextRequest, NextResponse } from 'next/server';
import { consumeVerificationToken } from '@/lib/email-verification';

/**
 * Consumes an email-verification token.
 *
 * GET rather than POST because this is reached by clicking a link in an email,
 * and the page at /auth/verify calls it. Unauthenticated on purpose: people
 * click these links on a phone where they are not signed in, and requiring a
 * session would strand exactly the accounts we want to confirm.
 *
 * Dynamic, and it must be: the response depends entirely on the token, and
 * cache-handler.js stores rendered routes in MySQL. A cached "verified" is a
 * lie told to the next person.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';

  try {
    const result = await consumeVerificationToken(token);

    // Always 200. The status lives in the body so the page can render a
    // different message for each outcome; an HTTP error here just produces a
    // browser error page for someone who did nothing wrong.
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[verify] failed:', error);
    return NextResponse.json(
      { success: false, status: 'invalid' },
      { status: 500 }
    );
  }
}
