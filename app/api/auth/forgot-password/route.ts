import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { success: true, message: 'If an account exists, you will receive a password reset email.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token in VerificationToken table
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires
      }
    });

    // TODO: Send email with reset link
    // For now, we'll just return success
    // In production, you would use a service like Resend, SendGrid, or Nodemailer
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendEmail(email, resetUrl);

    console.log(`Password reset requested for: ${email}`);
    console.log(`Reset token (dev only): ${resetToken}`);
    console.log(`Reset URL: http://localhost:3000/auth/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { success: true, message: 'If an account exists, you will receive a password reset email.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
