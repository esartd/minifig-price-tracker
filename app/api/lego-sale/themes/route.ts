import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoxByNumber } from '@/lib/boxes-data';

export const runtime = 'edge';


// Feature flag check
const ENABLED = process.env.ENABLE_LEGO_SALE === 'true';

/**
 * GET /api/lego-sale/themes
 *
 * Get list of themes that have active Amazon deals
 * Returns only current themes (sets from last 2 years)
 */
export async function GET(request: NextRequest) {
  // Feature flag check
  if (!ENABLED) {
    return NextResponse.json({ error: 'LEGO Sale feature not enabled' }, { status: 403 });
  }

  try {
    // Fetch all active deals
    const deals = await prisma.amazonDeal.findMany({
      where: {
        isAvailable: true,
        discountPercent: { gte: 20 },
      },
      select: {
        boxNo: true,
      },
    });

    // Extract themes from set data
    const themeCount = new Map<string, number>();
    const currentYear = new Date().getFullYear();

    for (const deal of deals) {
      const setData = getBoxByNumber(deal.boxNo);
      if (!setData) continue;

      // Only include current themes (last 2 years)
      const yearReleased = parseInt(setData.year_released || '0');
      if (yearReleased < currentYear - 2) continue;

      // Extract parent theme
      const parentTheme = setData.category_name.split(' / ')[0].trim();

      themeCount.set(parentTheme, (themeCount.get(parentTheme) || 0) + 1);
    }

    // Convert to array and sort by count (descending), then alphabetically
    const themes = Array.from(themeCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json({
      success: true,
      themes,
      total: themes.length,
    });
  } catch (error: any) {
    console.error('[Themes API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
