import { NextRequest, NextResponse } from 'next/server';

/**
 * ADMIN ENDPOINT: Manual Catalog Upload - DEPRECATED
 *
 * This endpoint is no longer used. We now use static JSON catalog files.
 * To update the catalog:
 * 1. Download Minifigures.txt from BrickLink
 * 2. Run: npx tsx scripts/convert-minifigs-to-json.ts
 * 3. Upload public/catalog/minifigs.json to Hostinger CDN
 */

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'This endpoint is deprecated. Use static JSON catalog instead.',
    instructions: {
      step1: 'Download Minifigures.txt from https://www.bricklink.com/catalogDownload.asp',
      step2: 'Run: npx tsx scripts/convert-minifigs-to-json.ts',
      step3: 'Upload public/catalog/minifigs.json to Hostinger CDN'
    }
  }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({
    message: 'Manual Catalog Upload Endpoint - DEPRECATED',
    reason: 'Now using static JSON catalog files for better performance',
    instructions: {
      step1: 'Download Minifigures.txt from https://www.bricklink.com/catalogDownload.asp',
      step2: 'Run: npx tsx scripts/convert-minifigs-to-json.ts',
      step3: 'Upload public/catalog/minifigs.json to Hostinger CDN'
    }
  }, { status: 410 });
}
