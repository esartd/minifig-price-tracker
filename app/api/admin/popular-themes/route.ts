import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma, prismaPublic } from '@/lib/prisma';

const ADMIN_EMAIL = 'erickkosysu@gmail.com';

export async function GET() {
  const session = await auth();

  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Top themes by collection items (excluding admin)
    const collectionMinifigs = await prisma.collectionItem.findMany({
      where: { User: { email: { not: ADMIN_EMAIL } } },
      select: { minifigure_no: true },
      distinct: ['minifigure_no']
    });

    const collectionItems = await prismaPublic.minifigCatalog.findMany({
      where: { minifigure_no: { in: collectionMinifigs.map(item => item.minifigure_no) } },
      select: { category_name: true }
    });

    const collectionThemeCounts = collectionItems.reduce((acc, item) => {
      const theme = item.category_name.split('/')[0].trim();
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThemesByCollection = Object.entries(collectionThemeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top themes by wishlist items (excluding admin)
    const wishlistMinifigs = await prisma.wishlistItem.findMany({
      where: { User: { email: { not: ADMIN_EMAIL } } },
      select: { minifigure_no: true },
      distinct: ['minifigure_no']
    });

    const wishlistItems = await prismaPublic.minifigCatalog.findMany({
      where: { minifigure_no: { in: wishlistMinifigs.map(item => item.minifigure_no) } },
      select: { category_name: true }
    });

    const wishlistThemeCounts = wishlistItems.reduce((acc, item) => {
      const theme = item.category_name.split('/')[0].trim();
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThemesByWishlist = Object.entries(wishlistThemeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        topThemesByCollection,
        topThemesByWishlist
      }
    });
  } catch (error) {
    console.error('Error fetching popular themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular themes' },
      { status: 500 }
    );
  }
}
