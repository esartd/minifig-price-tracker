import { NextResponse } from 'next/server';
import { getLiveExchangeRates } from '@/lib/live-exchange-rates';

// Live currency-conversion rates, refreshed from an external provider once
// every 24h and cached server-side in between (see lib/live-exchange-rates.ts).
// No auth required -- this is non-sensitive, read-only reference data used
// purely for display-side price conversion.
export async function GET() {
  const { rates, source, updatedAt } = await getLiveExchangeRates();

  return NextResponse.json(
    { rates, source, updatedAt },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  );
}
