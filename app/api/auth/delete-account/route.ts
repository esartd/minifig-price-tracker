import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all user's collection items first
    await prisma.collectionItem.deleteMany({
      where: {
        user: {
          email: session.user.email
        }
      }
    });

    // Delete the user account
    await prisma.user.delete({
      where: { email: session.user.email }
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting account' },
      { status: 500 }
    );
  }
}
