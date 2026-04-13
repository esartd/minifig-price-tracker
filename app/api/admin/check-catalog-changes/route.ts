import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prisma } from '@/lib/prisma';

/**
 * ADMIN ENDPOINT: Check Catalog Changes
 *
 * Fetches recent changes from Bricklink's changelog and reports what needs updating.
 *
 * Bricklink Changelog URLs:
 * - Name changes: https://www.bricklink.com/catalogReqList.asp?viewYear=&viewMonth=&viewGeDate=&q=&viewStatus=1&itemType=M&viewAction=N
 * - Item number changes: https://www.bricklink.com/catalogReqList.asp?viewYear=&viewMonth=&viewGeDate=&q=&viewStatus=1&itemType=M&viewAction=I
 *
 * Since Bricklink doesn't provide an API for the changelog, this endpoint
 * provides a manual way to check for changes.
 */

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    // Simple auth check
    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get catalog stats
    const totalItems = await prisma.minifigCatalog.count();
    const oldestUpdate = await prisma.minifigCatalog.findFirst({
      orderBy: { updated_at: 'asc' },
      select: { updated_at: true }
    });
    const newestUpdate = await prisma.minifigCatalog.findFirst({
      orderBy: { updated_at: 'desc' },
      select: { updated_at: true }
    });

    // Check a few random items from our catalog against Bricklink API
    // to see if names have changed
    const sampleItems = await prisma.minifigCatalog.findMany({
      take: 10,
      orderBy: { updated_at: 'asc' }, // Check oldest first
      select: { minifigure_no: true, name: true, updated_at: true }
    });

    const changesDetected: any[] = [];

    for (const item of sampleItems) {
      try {
        // Fetch current data from Bricklink
        const current = await bricklinkAPI.getMinifigureByNumber(item.minifigure_no);

        if (current && current.name !== item.name) {
          changesDetected.push({
            minifigure_no: item.minifigure_no,
            old_name: item.name,
            new_name: current.name,
            last_updated: item.updated_at
          });
        }

        // Respect rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Error checking ${item.minifigure_no}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      catalog_stats: {
        total_items: totalItems,
        oldest_update: oldestUpdate?.updated_at,
        newest_update: newestUpdate?.updated_at,
      },
      sample_check: {
        items_checked: sampleItems.length,
        changes_detected: changesDetected.length,
        changes: changesDetected
      },
      recommendation: changesDetected.length > 0
        ? 'Changes detected! Consider running a full catalog update.'
        : 'No changes in sample. Catalog appears up to date.',
      manual_check_urls: {
        name_changes: 'https://www.bricklink.com/catalogReqList.asp?viewYear=&viewMonth=&viewGeDate=&q=&viewStatus=1&itemType=M&viewAction=N',
        item_number_changes: 'https://www.bricklink.com/catalogReqList.asp?viewYear=&viewMonth=&viewGeDate=&q=&viewStatus=1&itemType=M&viewAction=I',
        download_catalog: 'https://www.bricklink.com/catalogDownload.asp'
      }
    });

  } catch (error) {
    console.error('Error checking catalog changes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check catalog changes' },
      { status: 500 }
    );
  }
}
