import { NextRequest, NextResponse } from 'next/server';
import { downloadBricklinkCatalog } from '@/lib/bricklink-catalog';

/**
 * ADMIN ENDPOINT: Test Catalog Download
 *
 * Test if automatic download from Bricklink works.
 * This helps debug the download process without running the full import.
 *
 * Usage:
 * curl https://figtracker.ericksu.com/api/admin/test-catalog-download \
 *   -H "Authorization: Bearer YOUR_ADMIN_SECRET"
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

    console.log('🧪 Testing Bricklink catalog download...');

    const result = await downloadBricklinkCatalog();

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        hint: 'The automatic download failed. You may need to set CATALOG_URL as a fallback.'
      }, { status: 500 });
    }

    const lines = result.data!.split('\n');
    const sampleLines = lines.slice(0, 10).join('\n');

    return NextResponse.json({
      success: true,
      message: 'Successfully downloaded catalog from Bricklink!',
      source: result.source,
      stats: {
        total_lines: lines.length,
        file_size_kb: Math.round((result.data!.length / 1024) * 100) / 100,
        first_10_lines: sampleLines
      },
      next_step: 'The automatic download works! The cron job will run monthly on the 1st at 3 AM to import this data.'
    });

  } catch (error) {
    console.error('Test download error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed', details: String(error) },
      { status: 500 }
    );
  }
}
