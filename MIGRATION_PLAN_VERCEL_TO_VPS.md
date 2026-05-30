# Migration Plan: Vercel Blob Storage → VPS File Storage

## Current State
- Images are proxied from BrickLink on-demand (no Vercel Blob caching)
- Catalog files (minifigs.json, boxes.json) are stored in `/public/catalog/`
- Article images use Vercel Blob Storage
- VPS has 41GB free space (plenty for images)

## What Needs Migration

### 1. Article Images (LOW PRIORITY)
**Current:** Stored in Vercel Blob via `app/api/admin/articles/images/route.ts`
**Target:** Store in `/var/www/figtracker/public/uploads/articles/`
**Volume:** Minimal (a few MB)

### 2. Image Caching (OPTIONAL)
**Current:** Images proxied from BrickLink on every request
**Could improve:** Cache images on VPS after first request
**Volume:** ~18,776 minifigs + ~21,000 sets = ~40,000 images × ~50KB = ~2GB

## Migration Steps

### Step 1: Create VPS Storage Directories
```bash
ssh root@187.77.202.14
cd /var/www/figtracker
mkdir -p public/uploads/articles
mkdir -p public/cache/images/minifigs
mkdir -p public/cache/images/sets
chmod -R 755 public/uploads public/cache
```

### Step 2: Update Article Image Upload API
Replace Vercel Blob with local file storage in:
- `app/api/admin/articles/images/route.ts`

**Before:**
```typescript
import { put } from '@vercel/blob';
const blob = await put(`articles/${filename}`, file, { access: 'public' });
return { url: blob.url };
```

**After:**
```typescript
import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/uploads/articles');
const filePath = path.join(uploadDir, filename);
await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
return { url: `/uploads/articles/${filename}` };
```

### Step 3: Add Image Caching to Proxy API (OPTIONAL)
Update `app/api/images/[type]/[itemNo]/route.ts`:

```typescript
// Check if cached
const cacheDir = path.join(process.cwd(), 'public/cache/images', type === 'minifig' ? 'minifigs' : 'sets');
const cachePath = path.join(cacheDir, `${itemNo}.png`);

try {
  const cached = await fs.readFile(cachePath);
  return new NextResponse(cached, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Cache': 'HIT',
    },
  });
} catch {
  // Not cached, download from BrickLink
  const imageBuffer = await downloadFromBricklink(type, itemNo);
  if (imageBuffer) {
    // Save to cache
    await fs.writeFile(cachePath, imageBuffer);
  }
  return new NextResponse(imageBuffer, { ... });
}
```

### Step 4: Remove Vercel Blob Dependencies
```bash
npm uninstall @vercel/blob
rm lib/storage/blob-storage.ts
# Remove BLOB_READ_WRITE_TOKEN from .env files
```

### Step 5: Update .gitignore
```gitignore
# VPS local storage
public/uploads/
public/cache/
```

## Cost Savings
- Vercel Blob Storage: ~$0.15/GB/month
- VPS Storage: Already included (41GB free)
- **Savings:** $0-5/month (depends on usage)

## Performance Impact
- **Pros:** 
  - No external API calls to Vercel
  - Faster image serving (local disk)
  - Full control over caching strategy
  
- **Cons:**
  - VPS bandwidth limits (check Hostinger plan)
  - No CDN edge caching (unless you add Cloudflare)
  - Manual backup responsibility

## Risks & Mitigation
1. **Disk space:** Monitor with `df -h` (41GB available now)
2. **Bandwidth:** Check Hostinger bandwidth limits
3. **Backup:** Add image backup to existing backup script
4. **CDN:** Consider adding Cloudflare in front for caching

## Recommendation
**Phase 1 (Do Now):** Migrate article images (simple, low volume)
**Phase 2 (Optional):** Add image caching if performance becomes an issue
**Skip:** If Vercel Blob costs are negligible (<$1/month), may not be worth the effort

## Decision Point
Before proceeding, check:
1. How much are you paying Vercel Blob monthly?
2. What's your VPS bandwidth limit?
3. Do you want to add Cloudflare CDN?

If Vercel Blob is basically free on their hobby plan, it might be easier to just keep it.
