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

      // Set verification cookie (24 hours)
      response.cookies.set('captcha_verified', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
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
