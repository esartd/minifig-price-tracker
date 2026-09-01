import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isPremiumUser } from '@/lib/premium';
import { getBoxByNumber } from '@/lib/boxes-data';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS } from '@/lib/pricing-orchestrator';
import { generateListing } from '@/lib/listing-templates';
import { sanitizePreferences } from '@/lib/cross-promo';

/**
 * POST /api/sets/[boxNo]/generate-listing
 *
 * Premium-only: generate a listing for a set WITHOUT it being in the user's
 * collection/inventory first. See the minifig equivalent
 * (app/api/minifigs/[itemNo]/generate-listing/route.ts) for the full
 * rationale -- this mirrors it for sets.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boxNo: string }> }
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

    const { boxNo } = await params;

    const body = await request.json();
    const {
      platform,
      condition,
      condition_detail,
      box_condition,
      completeness,
      building_status,
      instructions_included,
      minifigures_included,
      set_notes,
      quantity,
      preferences,
    } = body;

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

    const box = getBoxByNumber(boxNo);
    if (!box) {
      return NextResponse.json({ error: 'Set not found' }, { status: 404 });
    }

    let theme = 'LEGO';
    if (box.category_name) {
      theme = box.category_name.split(' / ')[0];
    }

    // Strip -1, -2, -3 suffix from box number for consumer-facing listings
    const cleanBoxNo = box.box_no.replace(/-\d+$/, '');

    const countryCode = session.user.preferredCountryCode || 'US';
    const region = session.user.preferredRegion || 'north_america';
    const pricingData = await pricingOrchestrator.getSetPrice(
      boxNo,
      pricingCondition,
      countryCode,
      region,
      session.user.id,
      false,
      box.name,
      LOGGED_IN_TTL_HOURS,
    );

    const result = generateListing(platform, {
      setName: box.name,
      setNo: cleanBoxNo,
      categoryName: box.category_name,
      theme,
      suggestedPrice: pricingData?.suggestedPrice || 0,
      currentAvg: pricingData?.currentAverage || 0,
      currentLowest: pricingData?.currentLowest || 0,
      condition: condition_detail,
      boxCondition: box_condition,
      completeness,
      buildingStatus: building_status,
      instructionsIncluded: instructions_included,
      minifigsIncluded: minifigures_included,
      setNotes: set_notes,
      quantity: quantity || 1,
      preferences: sanitizePreferences(preferences),
      itemType: 'set',
    });

    return NextResponse.json({
      success: true,
      listing: result,
    });
  } catch (error) {
    console.error('[Premium Listing Generation] Set error:', error);
    return NextResponse.json({ error: 'Failed to generate listing' }, { status: 500 });
  }
}
