import { NextRequest, NextResponse } from 'next/server';
import { downloadAllCatalogs } from '@/lib/bricklink-download-manager';
import { saveCatalogFile } from '@/lib/storage/blob-storage';

/**
 * Cron job to download all BrickLink catalog files
 * Runs twice monthly (1st and 15th at 2:30 AM)
 *
 * Downloads all 8 catalog types:
 * - Minifigures, Sets, Parts, Books, Gear, Catalogs, Instructions, Original Boxes
 *
 * Includes all checkboxes:
 * - Include Year, Include Weight, Include Dimensions
 *
 * Saves files to Vercel Blob Storage for later import
 */

export async function GET(request: NextRequest) {
  try {
    // Verify authorization (Vercel Cron or manual with ADMIN_SECRET)
    const authHeader = request.headers.get('authorization');
    const cronHeader = request.headers.get('x-vercel-cron');
    const adminSecret = process.env.ADMIN_SECRET;

    const isValidCron = cronHeader === '1';
    const isValidAdmin = adminSecret && authHeader === `Bearer ${adminSecret}`;

    if (!isValidCron && !isValidAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if browser automation is enabled
    const useBrowserAutomation = process.env.USE_BROWSER_AUTOMATION === 'true';
    if (!useBrowserAutomation) {
      console.log('Browser automation is disabled, skipping catalog downloads');
      return NextResponse.json({
        success: false,
        message: 'Browser automation is disabled. Set USE_BROWSER_AUTOMATION=true',
      });
    }

    console.log('=== Starting Catalog Download Job ===');
    console.log(`Triggered by: ${isValidCron ? 'Vercel Cron' : 'Manual Request'}`);

    const startTime = Date.now();

    // Download all catalogs
    const results = await downloadAllCatalogs({
      includeYear: true,
      includeWeight: true,
      includeDimensions: true,
      includeOptional: true, // Download all 8 catalog types
      maxRetries: 3,
    });

    // Save successful downloads to Vercel Blob
    const savedFiles: string[] = [];
    const failedSaves: string[] = [];

    for (const result of results) {
      if (result.success && result.content) {
        try {
          await saveCatalogFile(result.filename, result.content);
          savedFiles.push(result.filename);
        } catch (error) {
          console.error(`Failed to save ${result.filename} to Blob:`, error);
          failedSaves.push(result.filename);
        }
      }
    }

    const totalDuration = Date.now() - startTime;

    // Generate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalSize = results
      .filter(r => r.success && r.size)
      .reduce((sum, r) => sum + (r.size || 0), 0);

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      catalogs: {
        total: results.length,
        successful,
        failed,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      },
      blobStorage: {
        saved: savedFiles.length,
        failed: failedSaves.length,
      },
      results: results.map(r => ({
        type: r.type,
        filename: r.filename,
        success: r.success,
        sizeKB: r.size ? (r.size / 1024).toFixed(2) : null,
        duration: r.duration,
        error: r.error,
      })),
    };

    console.log('=== Catalog Download Job Complete ===');
    console.log(`Total duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`Downloaded: ${successful}/${results.length} catalogs`);
    console.log(`Saved to Blob: ${savedFiles.length}/${successful} files`);

    return NextResponse.json(summary);

  } catch (error) {
    console.error('Catalog download job failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Job failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Export runtime config for Vercel
export const maxDuration = 300; // 5 minutes for all downloads
export const dynamic = 'force-dynamic';
