import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterConfirmationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      // If already confirmed, return error
      if (existing.confirmed) {
        return NextResponse.json(
          { success: false, error: 'Email already subscribed' },
          { status: 400 }
        );
      }

      // If not confirmed, resend confirmation email
      if (existing.confirmationToken) {
        await sendNewsletterConfirmationEmail(existing.email, existing.confirmationToken);
        return NextResponse.json({
          success: true,
          message: 'Confirmation email resent. Please check your inbox.',
        });
      }
    }

    // Generate confirmation token
    const confirmationToken = randomBytes(32).toString('hex');

    // Create subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        subscribedAt: new Date(),
        confirmed: false,
        confirmationToken,
      },
    });

    // Send confirmation email
    await sendNewsletterConfirmationEmail(subscriber.email, confirmationToken);

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm subscription',
    });
  } catch (error) {
    console.error('[NEWSLETTER] Subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
