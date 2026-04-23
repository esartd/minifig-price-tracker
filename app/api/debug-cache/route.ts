import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo');
    const countryCode = session.user?.preferredCountryCode || 'US';

    // Get all cache entries for this item (to see what's stored)
    const cacheEntries = await prisma.priceCache.findMany({
      where: itemNo ? {
        item_no: itemNo
      } : {
        country_code: countryCode
      },
      take: 10,
      orderBy: { cached_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      userPreferences: {
        countryCode: session.user?.preferredCountryCode,
        region: session.user?.preferredRegion,
        currency: session.user?.preferredCurrency
      },
      cacheEntries: cacheEntries.map(entry => ({
        item_no: entry.item_no,
        item_type: entry.item_type,
        condition: entry.condition,
        country_code: entry.country_code,
        region: entry.region,
        currency_code: entry.currency_code,
        suggested_price: entry.suggested_price,
        cached_at: entry.cached_at,
        expires_at: entry.expires_at
      }))
    });
  } catch (error) {
    console.error('Error fetching cache debug info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cache info' },
      { status: 500 }
    );
  }
}
