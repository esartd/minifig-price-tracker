import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { downloadBricklinkCatalog, parseCatalogData, importCatalogItems } from '@/lib/bricklink-catalog';

/**
 * CRON JOB: Update Minifigure Catalog
 *
 * Runs monthly (1st of each month at 3 AM) to automatically fetch and import
 * the latest Bricklink catalog.
 *
 * This job attempts to:
 * 1. Download catalog directly from Bricklink (tries multiple URL patterns)
 * 2. Fall back to CATALOG_URL if direct download fails
 * 3. Parse and import all minifigures into the database
 *
 * Setup:
 * - No setup required! It attempts automatic download from Bricklink
 * - Optional: Set CATALOG_URL as a fallback if auto-download fails
 * - Set CRON_SECRET for authentication
 */

export async function GET(request: Request) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting automatic catalog update...');

    // Attempt to download catalog from Bricklink
    const downloadResult = await downloadBricklinkCatalog();

    if (!downloadResult.success) {
      console.error('❌ Failed to download catalog:', downloadResult.error);
      return NextResponse.json({
        success: false,
        error: downloadResult.error,
        hint: 'Set CATALOG_URL environment variable as a fallback, or use manual upload via /api/admin/upload-catalog'
      }, { status: 500 });
    }

    console.log(`✅ Downloaded catalog from: ${downloadResult.source}`);

    const catalogText = downloadResult.data!;

    // Parse the catalog data
    console.log('📖 Parsing catalog data...');
    const items = parseCatalogData(catalogText);
    console.log(`✅ Parsed ${items.length} items`);

    // Import into database
    console.log('💾 Importing into database...');
    const { created, updated } = await importCatalogItems(items, prisma);

    console.log('📊 Catalog update complete:', { created, updated, total: created + updated });

    return NextResponse.json({
      success: true,
      message: 'Catalog updated successfully',
      source: downloadResult.source,
      stats: {
        created,
        updated,
        total: created + updated
      }
    });

  } catch (error) {
    console.error('Catalog update cron error:', error);
    return NextResponse.json(
      { success: false, error: 'Catalog update failed', details: String(error) },
      { status: 500 }
    );
  }
}
