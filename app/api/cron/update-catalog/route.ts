import { NextResponse } from 'next/server';
import { prismaPublic } from '@/lib/prisma';
import { downloadBricklinkCatalog, parseCatalogData, importCatalogItems } from '@/lib/bricklink-catalog';
import { downloadAllBricklinkFiles } from '@/lib/bricklink-files';

/**
 * CRON JOB: Update Bricklink Catalogs
 *
 * Runs monthly (1st of each month at 3 AM) to automatically fetch and import
 * the latest Bricklink catalog files.
 *
 * This job:
 * 1. Downloads Minifigures.txt → imports to database for search/pricing
 * 2. Downloads Sets.txt → saves to disk for Amazon affiliate ads
 * 3. Downloads categories.txt → saves to disk for theme organization
 *
 * Setup:
 * - No setup required! Attempts automatic download from Bricklink
 * - Optional fallback environment variables:
 *   - BRICKLINK_MINIFIGURES_URL
 *   - BRICKLINK_SETS_URL
 *   - BRICKLINK_CATEGORIES_URL
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

    console.log('🔄 Starting monthly Bricklink catalog update...\n');

    // STEP 1: Download all catalog files (Minifigures.txt, Sets.txt, categories.txt)
    console.log('📥 Step 1: Downloading all catalog files...');
    const downloadResults = await downloadAllBricklinkFiles();

    if (!downloadResults.success) {
      console.error('❌ Failed to download required catalog files');
      return NextResponse.json({
        success: false,
        error: 'Failed to download required catalog files',
        results: downloadResults.results,
        hint: 'Set BRICKLINK_*_URL environment variables as fallbacks'
      }, { status: 500 });
    }

    console.log('✅ All catalog files downloaded successfully\n');

    // STEP 2: Import Minifigures.txt into database
    console.log('📥 Step 2: Importing minifigures into database...');
    const minifigsDownload = await downloadBricklinkCatalog();

    if (!minifigsDownload.success) {
      console.error('❌ Failed to process minifigures');
      return NextResponse.json({
        success: false,
        error: 'Catalog files downloaded but minifig import failed',
        filesDownloaded: downloadResults.results
      }, { status: 500 });
    }

    const catalogText = minifigsDownload.data!;

    // Parse the catalog data
    console.log('📖 Parsing minifigure data...');
    const items = parseCatalogData(catalogText);
    console.log(`✅ Parsed ${items.length} minifigures`);

    // Import into database
    console.log('💾 Importing into database...');
    const { created, updated } = await importCatalogItems(items, prismaPublic);

    console.log('\n📊 Monthly catalog update complete!');
    console.log(`  Minifigures: ${created} created, ${updated} updated`);
    console.log(`  Files downloaded: ${Object.keys(downloadResults.results).length}`);

    return NextResponse.json({
      success: true,
      message: 'Monthly catalog update completed successfully',
      files: downloadResults.results,
      minifigs: {
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
