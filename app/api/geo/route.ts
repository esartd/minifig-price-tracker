import { NextResponse } from 'next/server';
import { getVisitorCountry, countryHasWalmart } from '@/lib/visitor-country';

/**
 * The visitor's country, for client components that cannot read headers.
 *
 * force-dynamic is load-bearing, not decoration: cache-handler.js stores
 * rendered routes in MySQL, and a cached country would hand one visitor
 * another's location. This route must be computed per request, always.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const country = await getVisitorCountry();
  return NextResponse.json({
    country: country || 'unknown',
    hasWalmart: countryHasWalmart(country),
  });
}
