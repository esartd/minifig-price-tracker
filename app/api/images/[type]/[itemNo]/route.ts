import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Image proxy API that:
 * 1. Checks if image exists in VPS cache
 * 2. If not, downloads from BrickLink and caches to VPS
 * 3. Converts to WebP once, caches that too, and serves it to browsers that
 *    accept it
 * 4. Returns the image with aggressive caching headers
 *
 * Usage: /api/images/minifig/sw0001 or /api/images/set/10255-1
 *
 * ## Why the conversion happens here and not in next/image
 *
 * BrickLink PNGs are big -- the 75192-1 set image is 618 KB -- and they were
 * being hotlinked straight from img.bricklink.com at native size, with
 * `images.unoptimized: true` in next.config.js disabling next/image entirely.
 * So no WebP, no resizing, and a hard dependency on BrickLink continuing to
 * allow hotlinks.
 *
 * Turning next/image's optimiser back on would resize on demand, in the Node
 * process, per request. This app has already been taken down once by CPU
 * starvation under crawler load, and it currently serves ~437,000 uncached
 * requests a day. Converting here instead costs sharp exactly once per image,
 * ever: the result is written next to the PNG and every later request is a
 * filesystem read.
 *
 * Both files are kept. `Accept` decides which is served, so a client that does
 * not advertise WebP still gets the PNG, and the URL is identical either way --
 * which is what lets it stay `immutable` for a year. Vary: Accept is set so
 * caches do not hand a WebP to a client that cannot read it.
 */

const BRICKLINK_BASE = 'https://img.bricklink.com/ItemImage';

/** Effort 4 of 0-6: most of the saving, a fraction of the CPU of 6. */
const WEBP_OPTIONS = { quality: 82, effort: 4 } as const;

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

function respond(buffer: Buffer, contentType: string, cacheState: 'HIT' | 'MISS') {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      // One URL serves two formats depending on Accept, so any shared cache
      // has to key on it. Without this, whichever format was fetched first
      // gets handed to everyone.
      'Vary': 'Accept',
      'X-Cache': cacheState,
    },
  });
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

    // itemNo lands in a filesystem path, so it must not be able to climb out
    // of the cache directory. BrickLink ids are alphanumerics with hyphens.
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(itemNo) || itemNo.includes('..')) {
      return NextResponse.json({ error: 'Invalid item number' }, { status: 400 });
    }

    const wantsWebp = (request.headers.get('accept') || '').includes('image/webp');

    const cacheDir = path.join(process.cwd(), 'public/cache/images', type === 'minifig' ? 'minifigs' : 'sets');
    const cachePath = path.join(cacheDir, `${itemNo}.png`);
    const webpPath = path.join(cacheDir, `${itemNo}.webp`);

    // Cached WebP is the best case: smallest bytes, no conversion.
    if (wantsWebp) {
      try {
        return respond(await fs.readFile(webpPath), 'image/webp', 'HIT');
      } catch {
        // No WebP yet. Fall through -- it gets written below.
      }
    }

    // Cached PNG. If the client wants WebP and we have only the PNG, convert
    // now and keep it, so this branch runs at most once per image.
    try {
      const cachedImage = await fs.readFile(cachePath);

      if (wantsWebp) {
        try {
          const webp = await sharp(cachedImage).webp(WEBP_OPTIONS).toBuffer();
          await fs.writeFile(webpPath, webp).catch(() => {});
          return respond(webp, 'image/webp', 'HIT');
        } catch (conversionError) {
          // A PNG sharp cannot read is not a reason to serve nothing.
          console.warn('WebP conversion failed, serving PNG:', itemNo, conversionError);
        }
      }

      return respond(cachedImage, 'image/png', 'HIT');
    } catch {
      // Not cached, download from BrickLink
    }

    // Download from Bricklink with proper headers to bypass hotlinking protection
    const imageBuffer = await downloadFromBricklink(type, itemNo);

    if (!imageBuffer) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Save to cache for future requests
    try {
      await fs.mkdir(cacheDir, { recursive: true });
      await fs.writeFile(cachePath, imageBuffer);
    } catch (cacheError) {
      console.warn('Failed to cache image:', cacheError);
      // Continue even if caching fails
    }

    if (wantsWebp) {
      try {
        const webp = await sharp(imageBuffer).webp(WEBP_OPTIONS).toBuffer();
        await fs.writeFile(webpPath, webp).catch(() => {});
        return respond(webp, 'image/webp', 'MISS');
      } catch (conversionError) {
        console.warn('WebP conversion failed, serving PNG:', itemNo, conversionError);
      }
    }

    return respond(imageBuffer, 'image/png', 'MISS');

  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
