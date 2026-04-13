import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { downloadBricklinkCatalog, parseCatalogData, importCatalogItems } from '@/lib/bricklink-catalog';

/**
 * TEMPORARY PUBLIC ENDPOINT: Trigger Catalog Import
 *
 * Visit this URL in your browser to import the catalog:
 * https://figtracker.ericksu.com/api/admin/import-now
 *
 * ⚠️ DELETE THIS FILE after first successful import (it's public!)
 */

export async function GET(request: NextRequest) {
  try {
    // Check if catalog already has data
    const existingCount = await prisma.minifigCatalog.count();

    if (existingCount > 1000) {
      return NextResponse.json({
        success: false,
        message: `Catalog already has ${existingCount} items. Delete this endpoint or clear the catalog first.`,
        hint: 'This endpoint is for initial import only.'
      });
    }

    console.log('🔄 Starting catalog import...');

    // Attempt to download catalog from Bricklink
    const downloadResult = await downloadBricklinkCatalog();

    if (!downloadResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to download catalog from Bricklink',
        details: downloadResult.error,
        hint: 'Set CATALOG_URL environment variable as a fallback'
      }, { status: 500 });
    }

    console.log(`✅ Downloaded catalog from: ${downloadResult.source}`);

    // Parse the catalog data
    const items = parseCatalogData(downloadResult.data!);
    console.log(`✅ Parsed ${items.length} items`);

    // Import into database
    console.log('💾 Importing into database...');
    const { created, updated } = await importCatalogItems(items, prisma);

    console.log('📊 Import complete:', { created, updated, total: created + updated });

    return NextResponse.json({
      success: true,
      message: '🎉 Catalog imported successfully!',
      source: downloadResult.source,
      stats: {
        created,
        updated,
        total: created + updated
      },
      next_step: '✅ Now try searching for "Snow White" or "Luke Skywalker" on your site!',
      security_note: '⚠️ DELETE this file (app/api/admin/import-now/route.ts) now that import is complete!'
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Import failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Provide instructions if someone visits via browser
export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to trigger import',
    instructions: 'Visit https://figtracker.ericksu.com/api/admin/import-now in your browser'
  });
}
