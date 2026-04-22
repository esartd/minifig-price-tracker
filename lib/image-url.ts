/**
 * Get optimized image URL for minifigs and sets
 * Returns Vercel Blob URL if cached, otherwise returns Bricklink URL with fallback
 */

const BRICKLINK_BASE = 'https://img.bricklink.com/ItemImage';

export function getMinifigImageUrl(itemNo: string): string {
  // Primary: Original New (MN)
  return `${BRICKLINK_BASE}/MN/0/${itemNo}.png`;
}

export function getSetImageUrl(boxNo: string): string {
  // Primary: Original New (ON)
  return `${BRICKLINK_BASE}/ON/0/${boxNo}.png`;
}

export function getMinifigFallbackUrl(itemNo: string): string {
  // Fallback: Standard New (SN)
  return `${BRICKLINK_BASE}/SN/0/${itemNo}.png`;
}

export function getSetFallbackUrl(boxNo: string): string {
  // Fallback: Standard New (SN)
  return `${BRICKLINK_BASE}/SN/0/${boxNo}.png`;
}

/**
 * Get cached image URL from Vercel Blob
 * Returns null if not cached yet
 */
export async function getCachedImageUrl(
  type: 'minifig' | 'set',
  itemNo: string
): Promise<string | null> {
  try {
    const response = await fetch(`/api/images/${type}/${itemNo}`);
    if (response.ok) {
      const data = await response.json();
      return data.url;
    }
  } catch (err) {
    // Not cached yet
  }
  return null;
}
