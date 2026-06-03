import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    // Only allow logged-in users
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - please log in' }, { status: 401 });
    }

    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test 1: Check if priceCache table exists and count entries
    try {
      const count = await prisma.priceCache.count();
      results.tests.tableCounts = {
        priceCache: count,
        status: 'success'
      };
    } catch (error: any) {
      results.tests.tableCounts = {
        status: 'error',
        error: error.message
      };
    }

    // Test 2: Try to write a test entry to priceCache
    try {
      const testEntry = await prisma.priceCache.create({
        data: {
          item_no: 'TEST001',
          item_type: 'MINIFIG',
          condition: 'new',
          country_code: 'US',
          region: '',
          currency_code: 'USD',
          six_month_avg: 10.0,
          current_avg: 12.0,
          current_lowest: 8.0,
          suggested_price: 11.0,
          cached_at: new Date(),
          expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
        }
      });

      results.tests.writeTest = {
        status: 'success',
        testEntryId: testEntry.id,
        cached_at: testEntry.cached_at
      };

      // Clean up test entry
      await prisma.priceCache.delete({
        where: { id: testEntry.id }
      });

    } catch (error: any) {
      results.tests.writeTest = {
        status: 'error',
        error: error.message,
        code: error.code
      };
    }

    // Test 3: Check recent priceCache entries
    try {
      const recent = await prisma.priceCache.findMany({
        where: { item_type: 'MINIFIG' },
        orderBy: { cached_at: 'desc' },
        take: 5
      });

      results.tests.recentEntries = {
        count: recent.length,
        entries: recent.map((e: any) => ({
          item_no: e.item_no,
          cached_at: e.cached_at,
          expires_at: e.expires_at,
          minutes_old: Math.floor((Date.now() - new Date(e.cached_at).getTime()) / (1000 * 60))
        }))
      };
    } catch (error: any) {
      results.tests.recentEntries = {
        status: 'error',
        error: error.message
      };
    }

    // Test 4: Check user's collection items
    try {
      const userItems = await prisma.collectionItem.findMany({
        where: { userId: session.user.id },
        take: 5,
        orderBy: { date_added: 'desc' }
      });

      results.tests.userItems = {
        count: userItems.length,
        sample: userItems.map((item: any) => ({
          minifigure_no: item.minifigure_no,
          has_suggested_price: !!item.pricing_suggested_price
        }))
      };
    } catch (error: any) {
      results.tests.userItems = {
        status: 'error',
        error: error.message
      };
    }

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Test failed',
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
