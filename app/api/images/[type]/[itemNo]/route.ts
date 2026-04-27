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
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.bricklink.com/',
          'Accept': 'image/avif,image/webp,image/apng,image/png,image/*,*/*;q=0.8',
        },
      });
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
    const { type, itemNo} = await params;

    if (type !== 'minifig' && type !== 'set') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Download from Bricklink with proper headers to bypass hotlinking protection
    const imageBuffer = await downloadFromBricklink(type, itemNo);

    if (!imageBuffer) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Return image directly with aggressive caching
    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
