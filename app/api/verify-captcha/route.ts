import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify Cloudflare Turnstile CAPTCHA Token
 *
 * Called after user completes CAPTCHA challenge
 * Validates token with Cloudflare's API
 */

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token' },
        { status: 400 }
      );
    }

    // Get IP address (same logic as middleware)
    const ip = request.headers.get('cf-connecting-ip') ||
                request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                request.headers.get('x-real-ip') ||
                'unknown';

    // Verify token with Cloudflare Turnstile API
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      // CAPTCHA verified — issue a signed JWT cookie (24h)
      // Signed with NEXTAUTH_SECRET so it can't be forged, not IP-bound
      // so it works across mobile/WiFi IP changes
      const payload = {
        verified: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      };
      const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const { createHmac } = await import('crypto');
      const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
      const jwt = `${header}.${body}.${sig}`;

      const response = NextResponse.json({ success: true });
      response.cookies.set('captcha_verified', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      return response;
    } else {
      // CAPTCHA failed
      console.log('[CAPTCHA] Verification failed:', verifyData['error-codes']);
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('[CAPTCHA] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
