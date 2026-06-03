import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateListing } from '@/lib/listing-templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params (Next.js 15+ requirement)
    const { id } = await params;

    // Verify ownership
    const item = await prisma.setInventoryItem.findUnique({
      where: { id },
      include: { User: true }
    });

    if (!item || item.User.email !== session.user.email) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const {
      platform,
      condition_detail,
      box_condition,
      completeness,
      building_status,
      instructions_included,
      minifigures_included,
      set_notes,
      quantity,
      preferences
    } = body;

    // Validate required fields
    if (!platform || !condition_detail) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, condition_detail' },
        { status: 400 }
      );
    }

    // Validate platform
    if (!['facebook', 'ebay', 'bricklink', 'vinted'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be facebook, ebay, bricklink, or vinted' },
        { status: 400 }
      );
    }

    // Extract parent theme from category
    let theme = 'LEGO';
    if (item.category_name) {
      const parts = item.category_name.split(' / ');
      theme = parts[0];
    }

    // Strip -1, -2, -3 suffix from box number for consumer-facing listings
    const cleanBoxNo = item.box_no.replace(/-\d+$/, '');

    // Generate listing using template
    const result = generateListing(platform, {
      // Set-specific fields
      setName: item.set_name,
      setNo: cleanBoxNo,
      theme,
      suggestedPrice: item.pricing_suggested_price || 0,
      currentAvg: item.pricing_current_avg || 0,
      currentLowest: item.pricing_current_lowest || 0,
      condition: condition_detail,
      boxCondition: box_condition,
      completeness,
      buildingStatus: building_status,
      instructionsIncluded: instructions_included,
      minifigsIncluded: minifigures_included,
      setNotes: set_notes,
      quantity: quantity || 1,
      preferences: preferences || {},
      itemType: 'set'
    });

    return NextResponse.json({
      success: true,
      listing: result
    });

  } catch (error) {
    console.error('Set listing generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate listing' },
      { status: 500 }
    );
  }
}
