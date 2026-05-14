import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * Clear SET price cache entries
 * This is needed after the fix to use full set numbers with variant suffixes
 */
async function clearCache() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all SET cache entries
    const result = await prisma.priceCache.deleteMany({
      where: {
        item_type: 'SET'
      }
    });

    console.log(`✅ Cleared ${result.count} SET price cache entries`);

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} SET price cache entries`,
      count: result.count
    });
  } catch (error) {
    console.error('Error clearing SET cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return clearCache();
}

export async function POST(request: NextRequest) {
  return clearCache();
}
