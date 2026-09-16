import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email';
import { issueVerificationToken } from '@/lib/email-verification';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      }
    });

    /**
     * Welcome and verification mail, both non-blocking.
     *
     * Non-blocking is the existing behaviour and it is the right one: a Resend
     * outage must not stop people registering. The cost is that a failed
     * verification mail leaves an account unverified with no signal, which is
     * what the resend endpoint and the banner exist for.
     */
    sendWelcomeEmail(email, name || 'there').catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    issueVerificationToken(email)
      .then((token) => sendVerificationEmail(email, token, name || undefined))
      .catch(err => {
        console.error('Failed to send verification email:', err);
      });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
