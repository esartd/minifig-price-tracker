import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, productType, productId, productName, redirectUrl } = body;

    // Validate required fields
    if (!platform || !productType || !productId || !redirectUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID if logged in (optional)
    const session = await auth();
    const userId = session?.user?.email || null;

    // Track the click
    await prisma.affiliateClick.create({
      data: {
        platform,
        productType,
        productId,
        productName: productName || null,
        userId,
      }
    });

    // Return the redirect URL for client-side redirect
    return NextResponse.json({ redirectUrl });

  } catch (error) {
    console.error('Error tracking click:', error);
    // Don't block the redirect even if tracking fails
    return NextResponse.json(
      { error: 'Failed to track click', redirectUrl: request.nextUrl.searchParams.get('redirectUrl') },
      { status: 500 }
    );
  }
}
