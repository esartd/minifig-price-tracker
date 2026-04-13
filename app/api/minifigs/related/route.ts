import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * COMPLIANT RELATED MINIFIGS
 *
 * Shows related minifigs from the user-driven cache only.
 * No systematic enumeration - only items users have searched for.
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

    // Find current minifig in cache
    const currentMinifig = await prisma.minifigCache.findUnique({
      where: { minifigure_no: itemNo.toLowerCase() }
    });

    if (!currentMinifig) {
      // No cached data - return empty results
      return NextResponse.json({
        success: true,
        variants: [],
        themeMinifigs: [],
        message: 'Related minifigs will appear as more items are searched'
      });
    }

    // Extract character name (text before first comma or dash)
    const characterName = currentMinifig.name
      .split(/[,\-()]/)[0]
      .trim()
      .replace(/\s+\b(with|without|printed|legs|torso|arms|dual|sided|face)\b.*$/i, '')
      .toLowerCase();

    // Extract theme prefix
    const themePrefix = itemNo.match(/^[a-z]+/i)?.[0]?.toLowerCase() || '';

    // Extract numeric part from current item number
    const currentNum = parseInt(itemNo.match(/\d+/)?.[0] || '0');
    const idRange = 50; // Look for minifigs within ±50 IDs

    // Get all cached minifigs from same theme
    const cachedMinifigs = await prisma.minifigCache.findMany({
      where: {
        expires_at: { gt: new Date() },
        minifigure_no: {
          not: itemNo.toLowerCase(),
          startsWith: themePrefix
        }
      },
      orderBy: { last_searched_at: 'desc' },
      take: 50
    });

    // Find variants (same character) and theme minifigs (same theme, nearby ID)
    const variants: any[] = [];
    const themeMinifigs: any[] = [];

    cachedMinifigs.forEach(minifig => {
      // Extract character name from this minifig
      const mCharName = minifig.name
        .split(/[,\-()]/)[0]
        .trim()
        .toLowerCase();

      // Check if it's the same character
      if (mCharName === characterName) {
        variants.push({
          no: minifig.minifigure_no,
          name: minifig.name,
          image_url: minifig.image_url
        });
      } else {
        // For theme minifigs, only include if within ID range
        const mNum = parseInt(minifig.minifigure_no.match(/\d+/)?.[0] || '0');
        const distance = Math.abs(mNum - currentNum);

        if (distance <= idRange) {
          themeMinifigs.push({
            no: minifig.minifigure_no,
            name: minifig.name,
            image_url: minifig.image_url,
            distance: distance
          });
        }
      }
    });

    // Sort theme minifigs by proximity to current ID (closest first)
    themeMinifigs.sort((a, b) => a.distance - b.distance);

    // Limit results
    const limitedVariants = variants.slice(0, 6);
    const limitedTheme = themeMinifigs.slice(0, 6);

    return NextResponse.json({
      success: true,
      variants: limitedVariants,
      themeMinifigs: limitedTheme
    });
  } catch (error) {
    console.error('Error fetching related minifigs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related minifigs' },
      { status: 500 }
    );
  }
}
