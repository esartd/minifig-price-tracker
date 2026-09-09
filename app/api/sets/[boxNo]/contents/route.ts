import { NextResponse } from 'next/server';
import { fetchSetContents } from '@/lib/set-contents';
import { findMinifigByNumber } from '@/lib/catalog-static';

/**
 * GET /api/sets/[boxNo]/contents
 *
 * Returns minifigs in a set. Fetches from BrickLink if this set has never been
 * fetched, otherwise serves the stored rows.
 *
 * This is now on the critical path for a set page whose contents are not yet
 * stored: app/sets/[boxNo]/page.tsx used to await fetchSetContents() itself,
 * which put a BrickLink call and its mandatory 3-second rate-limit delay in
 * front of the render -- cold set pages measured 4-9s before anything
 * appeared. The page reads the database only now and SetDetailClient calls
 * this after mount, so the wait happens with the page already on screen.
 *
 * Each minifig is enriched with its catalogue name and image here. Without it
 * the cards this feeds render as untitled grey boxes, because the server does
 * the same enrichment and the component expects that shape.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ boxNo: string }> }
) {
  try {
    const { boxNo } = await params;

    if (!boxNo) {
      return NextResponse.json(
        { error: 'Set number is required' },
        { status: 400 }
      );
    }

    const result = await fetchSetContents(boxNo, 'user_view');

    const minifigs = await Promise.all(
      result.minifigs.map(async (m) => {
        const minifig = await findMinifigByNumber(m.minifig_no);
        return {
          ...m,
          name: minifig?.name,
          image_url: minifig
            ? `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`
            : undefined,
        };
      })
    );

    return NextResponse.json({
      set_no: boxNo,
      minifigs,
      cached: result.cached,
      count: minifigs.length
    });
  } catch (error) {
    console.error('[SET CONTENTS API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch set contents' },
      { status: 500 }
    );
  }
}
