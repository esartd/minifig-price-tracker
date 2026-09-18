/**
 * URLs for catalogue item images.
 *
 * Points at this site's own proxy (app/api/images/[type]/[itemNo]) rather than
 * at img.bricklink.com, which is where the catalogue JSON's `image_url` field
 * sends you. Three reasons, in order of how much they matter:
 *
 * 1. **Size.** The proxy converts once to WebP and caches it. The 75192-1 set
 *    image is a 618 KB PNG hotlinked at native size; it is the largest thing
 *    on that page by an order of magnitude and therefore its LCP element.
 * 2. **Cacheability.** Same-origin and `immutable`, so Cloudflare caches it.
 *    A third-party hotlink is fetched by every visitor's browser from
 *    BrickLink, every time, and never touches our edge cache at all.
 * 3. **Dependency.** BrickLink can stop serving hotlinks whenever it likes,
 *    and the request already needs a spoofed Referer to work. If that breaks,
 *    it breaks every image on the site at once. Through the proxy, the images
 *    we have already served are on our own disk.
 *
 * The proxy also tries the SN variant when the primary image 404s, which is
 * the same fallback the set detail page used to implement client-side with an
 * onError handler.
 */

export type ItemImageType = 'minifig' | 'set';

export function proxiedImage(type: ItemImageType, itemNo: string): string {
  return `/api/images/${type}/${encodeURIComponent(itemNo)}`;
}
