import { NextResponse } from 'next/server';
import { auth, signOut } from '@/auth';
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

    const userEmail = session.user.email;

    // Delete the user account (cascade delete will handle related records)
    await prisma.user.delete({
      where: { email: userEmail }
    });

    // Sign out the user
    await signOut({ redirect: false });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      redirect: '/auth/signin'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting account' },
      { status: 500 }
    );
  }
}
