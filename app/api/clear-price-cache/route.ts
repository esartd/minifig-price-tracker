import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// POST - Clear price cache for user's current currency
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const countryCode = session.user?.preferredCountryCode || 'US';

    // Delete all cached prices for this country
    const result = await prisma.priceCache.deleteMany({
      where: {
        country_code: countryCode
      }
    });

    console.log(`Cleared ${result.count} cache entries for ${countryCode}`);

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} cached prices for ${countryCode}`,
      count: result.count
    });
  } catch (error) {
    console.error('Error clearing price cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
