import { NextRequest, NextResponse } from 'next/server';
import { minifigCatalog } from '@/lib/minifig-catalog';

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

    // Find current minifig
    const currentMinifig = minifigCatalog.find(m => m.no.toLowerCase() === itemNo.toLowerCase());

    if (!currentMinifig) {
      return NextResponse.json(
        { success: false, error: 'Minifig not found' },
        { status: 404 }
      );
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
    const idRange = 50; // Look for minifigs within ±50 IDs (likely from same era/sets)

    // Find related minifigs
    const variants: any[] = [];
    const themeMinifigs: any[] = [];

    minifigCatalog.forEach(minifig => {
      // Skip current minifig
      if (minifig.no.toLowerCase() === itemNo.toLowerCase()) return;

      // Check theme prefix
      const mPrefix = minifig.no.match(/^[a-z]+/i)?.[0]?.toLowerCase() || '';

      // Only include minifigs from same theme
      if (mPrefix !== themePrefix) return;

      // Extract character name from this minifig
      const mCharName = minifig.name
        .split(/[,\-()]/)[0]
        .trim()
        .toLowerCase();

      // Check if it's the same character
      if (mCharName === characterName) {
        variants.push({
          no: minifig.no,
          name: minifig.name,
          image_url: `https://img.bricklink.com/ItemImage/MN/0/${minifig.no}.png`
        });
      } else {
        // For theme minifigs, only include if within ID range (same era/likely same sets)
        const mNum = parseInt(minifig.no.match(/\d+/)?.[0] || '0');
        const distance = Math.abs(mNum - currentNum);

        if (distance <= idRange) {
          themeMinifigs.push({
            no: minifig.no,
            name: minifig.name,
            image_url: `https://img.bricklink.com/ItemImage/MN/0/${minifig.no}.png`,
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
      themeMinifigs: limitedTheme,
      debug: {
        characterName,
        themePrefix,
        totalVariants: variants.length,
        totalTheme: themeMinifigs.length
      }
    });
  } catch (error) {
    console.error('Error fetching related minifigs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related minifigs' },
      { status: 500 }
    );
  }
}
