import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, just store in database

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        subscribedAt: new Date(),
        confirmed: false, // TODO: Send confirmation email
      },
    });

    // TODO: Send confirmation email via Resend
    // await resend.emails.send({
    //   from: 'FigTracker <hello@figtracker.ericksu.com>',
    //   to: email,
    //   subject: 'Confirm your FigTracker newsletter subscription',
    //   html: '...',
    // });

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
