import { NextRequest, NextResponse } from 'next/server';
import { downloadCatalogFile, getCatalogType } from '@/lib/bricklink-download-manager';
import { saveCatalogFile } from '@/lib/storage/blob-storage';

/**
 * Individual catalog download endpoint
 * GET /api/download-catalog/[type]
 *
 * Example: /api/download-catalog/minifigures
 *
 * Downloads a specific catalog type and saves to Vercel Blob
 * Requires ADMIN_SECRET for authorization
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    // Authorization check
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!adminSecret || !authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if browser automation is enabled
    const useBrowserAutomation = process.env.USE_BROWSER_AUTOMATION === 'true';
    if (!useBrowserAutomation) {
      return NextResponse.json(
        { error: 'Browser automation is disabled. Set USE_BROWSER_AUTOMATION=true' },
        { status: 400 }
      );
    }

    const { type } = await params;

    // Get catalog type
    const catalogType = getCatalogType(type);
    if (!catalogType) {
      return NextResponse.json(
        { error: `Unknown catalog type: ${type}` },
        { status: 400 }
      );
    }

    console.log(`Download request for ${catalogType.displayName}...`);

    // Download the catalog
    const result = await downloadCatalogFile(catalogType, {
      includeYear: true,
      includeWeight: true,
      includeDimensions: true,
      maxRetries: 3,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Download failed',
          details: result.error,
          duration: result.duration,
        },
        { status: 500 }
      );
    }

    // Save to Vercel Blob
    let blobUrl: string | null = null;
    if (result.content) {
      try {
        blobUrl = await saveCatalogFile(result.filename, result.content);
      } catch (blobError) {
        console.error('Failed to save to Blob Storage:', blobError);
        // Continue even if Blob save fails - we still have the file
      }
    }

    return NextResponse.json({
      success: true,
      catalog: catalogType.displayName,
      filename: result.filename,
      size: result.size,
      sizeKB: result.size ? (result.size / 1024).toFixed(2) : null,
      duration: result.duration,
      blobUrl,
    });

  } catch (error) {
    console.error('Catalog download error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Export runtime config for Vercel
export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';
