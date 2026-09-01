import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isPremiumUser } from '@/lib/premium';
import { findMinifigByNumber } from '@/lib/catalog-static';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS, LOGGED_OUT_TTL_HOURS } from '@/lib/pricing-orchestrator';
import { generateListing } from '@/lib/listing-templates';
import { sanitizePreferences } from '@/lib/cross-promo';

/**
 * POST /api/minifigs/[itemNo]/generate-listing
 *
 * Premium-only: generate a listing for a minifigure WITHOUT it being in the
 * user's collection/inventory first. Mirrors the response shape of
 * app/api/inventory/[id]/generate-listing/route.ts so the frontend's
 * success-handling code doesn't need to branch, but looks up identity/theme
 * from the catalog and fetches pricing live (via the same pricingOrchestrator
 * path /api/inventory/temp-pricing uses) instead of reading a cached
 * CollectionItem row, since no such row exists for this flow.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ itemNo: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isPremiumUser(session.user.id))) {
      return NextResponse.json(
        { error: 'Premium subscription required', code: 'PREMIUM_REQUIRED' },
        { status: 403 }
      );
    }

    const { itemNo } = await params;

    const body = await request.json();
    const { platform, condition, condition_detail, accessories, known_flaws, quantity, preferences } = body;

    if (!platform || !condition_detail) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, condition_detail' },
        { status: 400 }
      );
    }

    if (!['facebook', 'ebay', 'bricklink', 'vinted'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be facebook, ebay, bricklink, or vinted' },
        { status: 400 }
      );
    }

    const pricingCondition = condition === 'used' ? 'used' : 'new';

    const catalogEntry = await findMinifigByNumber(itemNo);
    if (!catalogEntry) {
      return NextResponse.json({ error: 'Minifigure not found' }, { status: 404 });
    }

    let theme = 'LEGO';
    if (catalogEntry.category_name) {
      theme = catalogEntry.category_name.split(' / ')[0];
    }

    const countryCode = session.user.preferredCountryCode || 'US';
    const region = session.user.preferredRegion || 'north_america';
    const pricingData = await pricingOrchestrator.getMinifigPrice(
      itemNo,
      pricingCondition,
      countryCode,
      region,
      session.user.id,
      'api-endpoint',
      false,
      catalogEntry.name,
      LOGGED_IN_TTL_HOURS,
    );

    const result = generateListing(platform, {
      minifigName: catalogEntry.name,
      minifigNo: itemNo,
      theme,
      suggestedPrice: pricingData?.suggestedPrice || 0,
      currentAvg: pricingData?.currentAverage || 0,
      currentLowest: pricingData?.currentLowest || 0,
      condition: condition_detail,
      accessories,
      knownFlaws: known_flaws,
      quantity: quantity || 1,
      preferences: sanitizePreferences(preferences),
    });

    return NextResponse.json({
      success: true,
      listing: result,
    });
  } catch (error) {
    console.error('[Premium Listing Generation] Minifig error:', error);
    return NextResponse.json({ error: 'Failed to generate listing' }, { status: 500 });
  }
}
