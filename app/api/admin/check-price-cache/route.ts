import { NextRequest, NextResponse } from 'next/server';
import { prismaHostinger } from '@/lib/prisma-hostinger';

export async function POST(request: NextRequest) {
  try {
    const { secret, itemNo, itemType } = await request.json();

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check priceCache for this item
    const cacheEntries = await prismaHostinger.priceCache.findMany({
      where: {
        item_no: itemNo,
        item_type: itemType
      },
      orderBy: {
        expires_at: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      entries: cacheEntries.map(e => ({
        condition: e.condition,
        country_code: e.country_code,
        region: e.region,
        suggested_price: e.suggested_price,
        currency_code: e.currency_code,
        expires_at: e.expires_at,
        expired: e.expires_at < new Date()
      }))
    });
  } catch (error: any) {
    console.error('Cache check error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
