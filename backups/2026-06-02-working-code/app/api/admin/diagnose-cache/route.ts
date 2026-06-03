import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    // Only allow admin users
    if (!session?.user?.email || session.user.email !== 'ericksu0c@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Check 1: Does priceCache table exist and have data?
    try {
      const totalCached = await prisma.priceCache.count();
      diagnostics.checks.priceCache = {
        exists: true,
        totalEntries: totalCached
      };

      // Get sample entries
      const samples = await prisma.priceCache.findMany({
        where: { item_type: 'MINIFIG' },
        take: 5,
        orderBy: { cached_at: 'desc' }
      });

      diagnostics.checks.sampleEntries = samples.map((s: any) => ({
        item_no: s.item_no,
        cached_at: s.cached_at,
        expires_at: s.expires_at,
        hours_old: Math.floor((Date.now() - new Date(s.cached_at).getTime()) / (1000 * 60 * 60)),
        has_cached_at: !!s.cached_at
      }));

    } catch (error: any) {
      diagnostics.checks.priceCache = {
        exists: false,
        error: error.message
      };
    }

    // Check 2: Sample from user's collection
    try {
      const userItems = await prisma.collectionItem.findMany({
        where: { userId: session.user.id },
        take: 5,
        orderBy: { date_added: 'desc' }
      });

      diagnostics.checks.userCollectionSample = userItems.map((item: any) => ({
        minifigure_no: item.minifigure_no,
        condition: item.condition,
        has_pricing_fields: !!(item.pricing_six_month_avg || item.pricing_current_avg),
        has_suggested_price: !!item.pricing_suggested_price
      }));

    } catch (error: any) {
      diagnostics.checks.userCollection = {
        error: error.message
      };
    }

    // Check 3: Test a specific item's cache
    try {
      const firstItem = await prisma.collectionItem.findFirst({
        where: { userId: session.user.id }
      });

      if (firstItem) {
        const cacheEntry = await prisma.priceCache.findFirst({
          where: {
            item_no: firstItem.minifigure_no,
            item_type: 'MINIFIG',
            condition: firstItem.condition,
            country_code: 'US',
            region: ''
          }
        });

        diagnostics.checks.cacheMatchTest = {
          item_no: firstItem.minifigure_no,
          condition: firstItem.condition,
          cacheFound: !!cacheEntry,
          cacheDetails: cacheEntry ? {
            cached_at: cacheEntry.cached_at,
            hours_old: Math.floor((Date.now() - new Date(cacheEntry.cached_at).getTime()) / (1000 * 60 * 60)),
            expires_at: cacheEntry.expires_at,
            has_expired: new Date(cacheEntry.expires_at) < new Date()
          } : null
        };
      }
    } catch (error: any) {
      diagnostics.checks.cacheMatchTest = {
        error: error.message
      };
    }

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Diagnostic failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
