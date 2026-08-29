/**
 * Publicly-fetchable catalog images for marketplace CSV exports.
 *
 * Whatnot's importer downloads each Image URL with its own crawler, which rules
 * out both of the image sources the app already uses:
 *
 *  - img.bricklink.com is hotlink-protected (it needs a spoofed Referer), and
 *  - /api/images/... is behind middleware.ts's user-agent blocklist.
 *
 * So we mirror the image onto our own domain under public/listing-images/ and
 * hand Whatnot that URL instead. nginx serves everything under public/ directly,
 * which also keeps these requests clear of the middleware.
 *
 * Note we deliberately do NOT reuse public/cache/images/ — Cloudflare blocks the
 * whole /cache/* path (a request for a file that doesn't exist there returns 403,
 * not 404), so nothing under it is reachable from outside.
 */

import { promises as fs } from 'fs';
import path from 'path';

export type CatalogItemType = 'minifig' | 'set';

const BRICKLINK_BASE = 'https://img.bricklink.com/ItemImage';

/** Public URL prefix. Must stay outside /cache/ — see the note above. */
export const LISTING_IMAGE_URL_PREFIX = '/listing-images';

const SUBDIR: Record<CatalogItemType, string> = {
  minifig: 'minifigs',
  set: 'sets',
};

/**
 * Item numbers are interpolated into a filesystem path, so anything that isn't a
 * plain catalog identifier is rejected rather than escaped. Real values look like
 * "sw0001a", "75192-1", "47394pb342".
 */
const SAFE_ITEM_NO = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function isSafeItemNo(itemNo: string): boolean {
  return SAFE_ITEM_NO.test(itemNo) && !itemNo.includes('..');
}

function localPathFor(type: CatalogItemType, itemNo: string): string {
  return path.join(process.cwd(), 'public', 'listing-images', SUBDIR[type], `${itemNo}.png`);
}

/** Site-relative URL, e.g. "/listing-images/minifigs/sw0001a.png". */
export function listingImageUrlPath(type: CatalogItemType, itemNo: string): string {
  return `${LISTING_IMAGE_URL_PREFIX}/${SUBDIR[type]}/${itemNo}.png`;
}

/**
 * Fetch the image from BrickLink.
 *
 * Same spoofed headers as app/api/images/[type]/[itemNo]/route.ts — without the
 * Referer, BrickLink's hotlink protection refuses the request. Tries the normal
 * image first, then the "SN" variant that some items use instead.
 */
async function downloadFromBricklink(
  type: CatalogItemType,
  itemNo: string
): Promise<Buffer | null> {
  const primary = type === 'minifig' ? 'MN' : 'ON';
  const urls = [
    `${BRICKLINK_BASE}/${primary}/0/${itemNo}.png`,
    `${BRICKLINK_BASE}/SN/0/${itemNo}.png`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Referer: 'https://www.bricklink.com/',
          Accept: 'image/avif,image/webp,image/apng,image/png,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) continue;

      const buffer = Buffer.from(await response.arrayBuffer());
      // BrickLink answers a missing image with a tiny placeholder rather than a 404.
      if (buffer.byteLength < 512) continue;

      return buffer;
    } catch {
      continue;
    }
  }

  return null;
}

export interface EnsureImageResult {
  itemNo: string;
  type: CatalogItemType;
  /** Site-relative path, or null when no image could be obtained. */
  urlPath: string | null;
  /** True when the file was already on disk and no BrickLink request was made. */
  fromCache: boolean;
}

/**
 * Make sure a mirrored copy exists on disk, downloading it once if not.
 *
 * Idempotent: once an item is mirrored, later exports of the same item cost
 * nothing and hit BrickLink zero times.
 */
export async function ensureListingImage(
  type: CatalogItemType,
  itemNo: string
): Promise<EnsureImageResult> {
  if (!isSafeItemNo(itemNo)) {
    return { itemNo, type, urlPath: null, fromCache: false };
  }

  const filePath = localPathFor(type, itemNo);

  try {
    const stat = await fs.stat(filePath);
    if (stat.size > 0) {
      return { itemNo, type, urlPath: listingImageUrlPath(type, itemNo), fromCache: true };
    }
  } catch {
    // Not mirrored yet — fall through and fetch it.
  }

  const buffer = await downloadFromBricklink(type, itemNo);
  if (!buffer) {
    return { itemNo, type, urlPath: null, fromCache: false };
  }

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Write to a temp file then rename, so a concurrent export never reads a
    // half-written PNG and hands Whatnot a corrupt image.
    const tmpPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tmpPath, buffer);
    await fs.rename(tmpPath, filePath);
  } catch (error) {
    console.warn(`[listing-images] failed to write ${type}/${itemNo}:`, error);
    return { itemNo, type, urlPath: null, fromCache: false };
  }

  return { itemNo, type, urlPath: listingImageUrlPath(type, itemNo), fromCache: false };
}

export interface WarmOptions {
  /**
   * Pause between consecutive BrickLink downloads. Cache hits are free and are
   * not delayed. BrickLink's image CDN is not the rate-limited pricing API, but
   * this project's standing rule is to stay unmistakably polite to BrickLink.
   */
  delayMs?: number;
  /** Upper bound on downloads in one call, so a huge export can't stall forever. */
  maxDownloads?: number;
  onProgress?: (done: number, total: number) => void;
}

/**
 * Mirror a batch of images, one at a time.
 *
 * Sequential on purpose: parallel fetching is exactly the kind of burst the
 * project's BrickLink rules exist to prevent.
 */
export async function warmListingImages(
  items: ReadonlyArray<{ type: CatalogItemType; itemNo: string }>,
  options: WarmOptions = {}
): Promise<Map<string, EnsureImageResult>> {
  const { delayMs = 250, maxDownloads = Infinity, onProgress } = options;

  const results = new Map<string, EnsureImageResult>();
  let downloads = 0;
  let done = 0;

  for (const item of items) {
    const key = `${item.type}:${item.itemNo}`;

    if (results.has(key)) {
      done++;
      continue;
    }

    if (downloads >= maxDownloads) {
      results.set(key, { ...item, urlPath: null, fromCache: false });
      done++;
      continue;
    }

    const result = await ensureListingImage(item.type, item.itemNo);
    results.set(key, result);
    done++;
    onProgress?.(done, items.length);

    if (!result.fromCache) {
      downloads++;
      if (delayMs > 0 && downloads < maxDownloads) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return results;
}

/**
 * Absolute base URL to prefix onto image paths.
 *
 * Whatnot fetches these from its own servers, so a relative path or a localhost
 * URL is useless — it has to be the real public origin. Locale subdomains are
 * folded back to the apex so every export emits the same canonical URL.
 *
 * Returns null when it can only determine a localhost origin, which lets the
 * caller tell the user their locally-exported CSV won't have working images
 * instead of silently emitting dead links.
 */
export function resolvePublicBaseUrl(requestHost?: string | null): string | null {
  const candidates = [requestHost, process.env.NEXT_PUBLIC_BASE_URL];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const withProtocol = candidate.startsWith('http') ? candidate : `https://${candidate}`;

    let url: URL;
    try {
      url = new URL(withProtocol);
    } catch {
      continue;
    }

    const hostname = url.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      continue;
    }

    // de.figtracker... / fr.figtracker... all serve the same files; canonicalise.
    const apex = hostname.replace(
      /^(de|fr|es|it|nl|pl|sv|pt|ja)\./,
      ''
    );

    return `https://${apex}`;
  }

  return null;
}
