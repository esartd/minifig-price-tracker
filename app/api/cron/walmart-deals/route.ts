import { NextResponse } from 'next/server';
import { refreshWalmartDeals } from '@/lib/walmart-deals-refresh';

/**
 * Daily Walmart deal sync.
 *
 * The Impact catalog itself only refreshes once a day, so running this more
 * often buys nothing and just spends API calls.
 *
 *   0 9 * * *  curl -H "Authorization: Bearer $CRON_SECRET" \
 *              https://intobrick.com/api/cron/walmart-deals
 *
 * 9am UTC is 3am Mountain -- well clear of the BrickLink window, which resets
 * at midnight UTC and is the one budget that actually matters here.
 */

export const dynamic = 'force-dynamic';
// Roughly 73 catalog pages plus the chunked bulk upserts. The Next default of
// 10s would abort part-way and leave a half-synced table.
//
// 300 was nearly a disaster: the first implementation used one prisma.upsert
// per set and took 25 MINUTES against the remote database, so this route would
// have timed out every night in production while passing every local test that
// did not watch the clock. The bulk upsert in lib/walmart-deals-refresh.ts is
// what brings it inside this budget -- if that ever reverts to per-row writes,
// this limit is not the thing to raise.
export const maxDuration = 300;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[Walmart Deals] CRON_SECRET not configured');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    const result = await refreshWalmartDeals();
    const seconds = Math.round((Date.now() - startedAt) / 1000);

    console.log(
      `[Walmart Deals] ${result.written} sets stored ` +
      `(${result.withDiscount} discounted) from ${result.itemsSeen} items ` +
      `across ${result.pagesFetched} pages in ${seconds}s`
    );

    return NextResponse.json({ success: true, ...result, seconds });
  } catch (error) {
    console.error('[Walmart Deals] Sync failed:', error);
    // Deliberately not partial-writing on failure: the previous day's rows stay
    // put, so the site keeps showing yesterday's prices rather than nothing.
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    );
  }
}
