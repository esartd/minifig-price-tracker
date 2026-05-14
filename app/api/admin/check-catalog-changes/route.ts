import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prisma, prismaPublic } from '@/lib/prisma';

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

    // Static catalog from BrickLink download (2026-04-18)
    const totalItems = 18732;
    const catalogDate = new Date('2026-04-18');
    const changesDetected: any[] = [];

    return NextResponse.json({
      success: true,
      catalog_stats: {
        total_items: totalItems,
        last_update: catalogDate,
        source: 'Static JSON from BrickLink download'
      },
      sample_check: {
        items_checked: 0,
        changes_detected: 0,
        changes: []
      },
      recommendation: 'Using static catalog. Download new Minifigures.txt from BrickLink and run conversion script to update.',
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
