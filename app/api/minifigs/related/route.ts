import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * COMPLIANT RELATED MINIFIGS
 *
 * Shows related minifigs from the full catalog.
 * Uses downloaded BrickLink catalog data (not API enumeration).
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('itemNo');

    if (!itemNo) {
      return NextResponse.json(
        { success: false, error: 'Missing itemNo parameter' },
        { status: 400 }
      );
    }

    // Find current minifig in catalog
    const currentMinifig = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: itemNo.toLowerCase() }
    });

    if (!currentMinifig) {
      return NextResponse.json({
        success: true,
        variants: [],
        themeMinifigs: []
      });
    }

    // Extract character name (remove theme prefix, then take text before comma)
    const withoutTheme = currentMinifig.name.replace(/^[^-]+-\s*/, '');
    const characterName = withoutTheme.split(',')[0].trim().toLowerCase();

    // Extract theme prefix
    const themePrefix = itemNo.match(/^[a-z]+/i)?.[0]?.toLowerCase() || '';

    // Extract numeric part from current item number
    const currentNum = parseInt(itemNo.match(/\d+/)?.[0] || '0');
    const idRange = 50; // Look for minifigs within ±50 IDs

    // Get character variants (same character name, same category)
    const variantResults = await prisma.minifigCatalog.findMany({
      where: {
        AND: [
          { minifigure_no: { not: itemNo.toLowerCase() } },
          { search_name: { contains: characterName } },
          { category_id: currentMinifig.category_id }
        ]
      },
      orderBy: { year_released: 'desc' },
      take: 12
    });

    // Get theme minifigs (same theme prefix, nearby ID number)
    const minId = Math.max(1, currentNum - idRange);
    const maxId = currentNum + idRange;

    const themeResults = await prisma.minifigCatalog.findMany({
      where: {
        AND: [
          { minifigure_no: { not: itemNo.toLowerCase() } },
          { minifigure_no: { startsWith: themePrefix } },
          { category_id: currentMinifig.category_id }
        ]
      },
      take: 100
    });

    // Filter by ID range and calculate distance
    const themeMinifigs = themeResults
      .map(minifig => {
        const mNum = parseInt(minifig.minifigure_no.match(/\d+/)?.[0] || '0');
        const distance = Math.abs(mNum - currentNum);
        return {
          no: minifig.minifigure_no,
          name: minifig.name,
          image_url: `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`,
          distance
        };
      })
      .filter(m => m.distance > 0 && m.distance <= idRange)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 12);

    const variants = variantResults.map(m => ({
      no: m.minifigure_no,
      name: m.name,
      image_url: `https://img.bricklink.com/ItemImage/MN/0/${m.minifigure_no}.png`
    }));

    return NextResponse.json({
      success: true,
      variants: variants,
      themeMinifigs: themeMinifigs
    });
  } catch (error) {
    console.error('Error fetching related minifigs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related minifigs' },
      { status: 500 }
    );
  }
}
