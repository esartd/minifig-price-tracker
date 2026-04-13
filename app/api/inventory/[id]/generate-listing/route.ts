import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateListing, extractTheme } from '@/lib/listing-templates';

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
    const item = await prisma.collectionItem.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!item || item.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { platform, condition_detail, accessories, known_flaws, quantity, preferences } = body;

    // Validate required fields
    if (!platform || !condition_detail) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, condition_detail' },
        { status: 400 }
      );
    }

    // Validate platform
    if (!['facebook', 'ebay', 'bricklink'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be facebook, ebay, or bricklink' },
        { status: 400 }
      );
    }

    // Extract theme from minifig name
    const theme = extractTheme(item.minifigure_name);

    // Generate listing using template
    const result = generateListing(platform, {
      minifigName: item.minifigure_name,
      minifigNo: item.minifigure_no,
      theme,
      suggestedPrice: item.pricing_suggested_price || 0,
      currentAvg: item.pricing_current_avg || 0,
      currentLowest: item.pricing_current_lowest || 0,
      condition: condition_detail,
      accessories,
      knownFlaws: known_flaws,
      quantity: quantity || 1,
      preferences: preferences || {}
    });

    return NextResponse.json({
      success: true,
      listing: result
    });

  } catch (error) {
    console.error('Listing generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate listing' },
      { status: 500 }
    );
  }
}
