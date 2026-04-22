import { NextRequest, NextResponse } from 'next/server';
import { put, head } from '@vercel/blob';

/**
 * Image proxy API that:
 * 1. Checks if image exists in Vercel Blob
 * 2. If not, downloads from Bricklink and caches to Blob
 * 3. Returns the Blob URL
 *
 * Usage: /api/images/minifig/sw0001 or /api/images/set/10255-1
 */

const BRICKLINK_BASE = 'https://img.bricklink.com/ItemImage';

async function downloadFromBricklink(type: 'minifig' | 'set', itemNo: string): Promise<Buffer | null> {
  const imageType = type === 'minifig' ? 'MN' : 'ON';
  const fallbackType = type === 'minifig' ? 'SN' : 'SN';

  const urls = [
    `${BRICKLINK_BASE}/${imageType}/0/${itemNo}.png`,
    `${BRICKLINK_BASE}/${fallbackType}/0/${itemNo}.png`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }
    } catch (err) {
      continue;
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; itemNo: string }> }
) {
  try {
    const { type, itemNo } = await params;

    if (type !== 'minifig' && type !== 'set') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const blobPath = `${type}s/${itemNo}.png`;

    // Check if already in Blob storage
    try {
      const blobInfo = await head(blobPath);
      if (blobInfo) {
        return NextResponse.json({ url: blobInfo.url });
      }
    } catch (err) {
      // Blob doesn't exist, continue to download
    }

    // Download from Bricklink
    const imageBuffer = await downloadFromBricklink(type, itemNo);

    if (!imageBuffer) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Upload to Vercel Blob
    const blob = await put(blobPath, imageBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
