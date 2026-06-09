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
      // CAPTCHA verified successfully
      const response = NextResponse.json({ success: true });

      // Create IP-bound cookie value (prevents cookie theft/sharing between IPs)
      // Format: IP_ADDRESS:timestamp
      const cookieValue = `${ip}:${Date.now()}`;
      const encodedValue = Buffer.from(cookieValue).toString('base64');

      // Set verification cookie (1 hour - force re-verification more frequently)
      response.cookies.set('captcha_verified', encodedValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour (not 24 - too easy for bots to persist)
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
