import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Walmart prices for a set of box numbers, in one request.
 *
 *   GET /api/walmart-deals/lookup?boxNos=41446-1,75192-1
 *   -> { deals: { "41446-1": { currentPrice, listPrice, discountPercent, productUrl } } }
 *
 * Built for the wishlist, which knows its box numbers only on the client and
 * would otherwise need one request per card. Box numbers that have no Walmart
 * row, or whose row is out of stock, are simply absent from the response --
 * the caller shows no Walmart button for those rather than a dead link.
 *
 * No auth: this is the same public catalogue data /deals already serves, keyed
 * by a box number the caller already has. It reveals nothing about whose
 * wishlist the numbers came from.
 */

export const dynamic = 'force-dynamic';

// Enough for a large wishlist in one call, low enough that a hand-made request
// cannot ask for the whole table.
const MAX_BOX_NOS = 200;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('boxNos') || '';

    const boxNos = Array.from(
      new Set(
        raw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      )
    ).slice(0, MAX_BOX_NOS);

    if (boxNos.length === 0) {
      return NextResponse.json({ deals: {} });
    }

    const rows = await prisma.walmartDeal.findMany({
      where: { boxNo: { in: boxNos }, inStock: true },
      select: {
        boxNo: true,
        currentPrice: true,
        listPrice: true,
        discountPercent: true,
        productUrl: true,
      },
    });

    const deals: Record<string, unknown> = {};
    for (const r of rows) {
      deals[r.boxNo] = {
        currentPrice: r.currentPrice,
        listPrice: r.listPrice,
        discountPercent: r.discountPercent,
        productUrl: r.productUrl,
      };
    }

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('[Walmart lookup] Failed:', error);
    // An empty map, not a 500: the wishlist renders perfectly well with no
    // Walmart buttons, and a failed price lookup should never take the page
    // down with it.
    return NextResponse.json({ deals: {} });
  }
}
