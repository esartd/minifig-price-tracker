import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { avatar } = await request.json();

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar is required' },
        { status: 400 }
      );
    }

    // Update user avatar in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: avatar },
    });

    return NextResponse.json({
      success: true,
      avatar: avatar,
      message: 'Avatar updated successfully'
    });
  } catch (error) {
    console.error('❌ Avatar update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating avatar' },
      { status: 500 }
    );
  }
}
