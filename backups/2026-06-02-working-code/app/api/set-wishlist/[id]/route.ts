import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// DELETE a set from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership before deletion
    const item = await prisma.setWishlistItem.findUnique({
      where: { id }
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Set not found in wishlist' },
        { status: 404 }
      );
    }

    if (item.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.setWishlistItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing set from wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove set from wishlist' },
      { status: 500 }
    );
  }
}
