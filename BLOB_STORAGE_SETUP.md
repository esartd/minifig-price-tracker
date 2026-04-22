# Blob Storage Setup Guide

## Problem
All images currently load from Bricklink on every page view, making browsing slow. We need to:
1. Upload all ~18,732 minifig and ~21,340 set images to Vercel Blob
2. Update catalog JSON files to use Blob URLs
3. Make pages load instantly

## Current Status
- ✅ 173 minifig images already uploaded to blob storage
- ❌ Blob store is configured as **Private** (needs to be Public)
- ❌ Catalog JSON files still have Bricklink URLs
- ❌ Remaining ~39,899 images need to be uploaded

## Step 1: Change Blob Store to Public Access

**You must do this manually via Vercel Dashboard:**

1. Go to: https://vercel.com/es-art-d-llc/~/stores/blob/store_MYfdAzItDm3dwfMR
2. Look for "Access" or "Visibility" settings
3. Change from **Private** to **Public**
4. Save changes

After this change, all blob URLs will work publicly without authentication.

## Step 2: Run Image Migration

Once the store is public, run:

```bash
# Migrate minifig images (18,732 images, ~30-60 minutes)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MYfdAzItDm3dwfMR_Ownl5Tms9MuRN9TqniBYc59S2R2rU0" \
npx tsx scripts/migrate-images-to-blob.ts minifigs

# Migrate set images (21,340 images, ~30-60 minutes)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MYfdAzItDm3dwfMR_Ownl5Tms9MuRN9TqniBYc59S2R2rU0" \
npx tsx scripts/migrate-images-to-blob.ts sets

# Migrate theme images (170 themes, ~5 minutes)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MYfdAzItDm3dwfMR_Ownl5Tms9MuRN9TqniBYc59S2R2rU0" \
npx tsx scripts/migrate-images-to-blob.ts themes

# Or run all at once (90-120 minutes total)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MYfdAzItDm3dwfMR_Ownl5Tms9MuRN9TqniBYc59S2R2rU0" \
npx tsx scripts/migrate-images-to-blob.ts
```

The script will:
- Skip images already uploaded (173 minifigs done)
- Download from Bricklink (tries MN/ON first, falls back to SN)
- Upload to Vercel Blob
- Update catalog JSON files with blob URLs
- Show progress every 50 uploads

## Step 3: Deploy to Production

Once migration is complete:

```bash
# Commit updated catalog files
git add public/catalog/*.json lib/theme-images-cache.json
git commit -m "Migrate all images to Vercel Blob storage

- Upload 18,732 minifig images to blob storage
- Upload 21,340 set images to blob storage  
- Update catalog JSON files with blob URLs
- Update theme cache with blob URLs
- Images now load instantly from CDN

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to production
git push origin main
```

## Expected Results

**Before:**
- Images load from Bricklink (slow, ~500-2000ms per image)
- Every page view fetches from origin
- Browse pages take 5-10 seconds to load

**After:**
- Images load from Vercel Blob CDN (fast, ~50-200ms)
- Images cached globally on CDN
- Browse pages load in 1-2 seconds

## Verification

After deployment, check:

```bash
# Check blob storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MYfdAzItDm3dwfMR_Ownl5Tms9MuRN9TqniBYc59S2R2rU0" \
npx tsx scripts/check-blob-storage.ts

# Expected output:
# Total blobs: ~40,000
# minifigs/: ~18,732 files
# sets/: ~21,340 files
```

Check production site:
- Visit https://figtracker.ericksu.com/themes
- Open DevTools Network tab
- Images should load from `myfdazitdm3dwfmr.blob.vercel-storage.com` (not bricklink.com)
- Load times should be <200ms per image

## Troubleshooting

**If images still load from Bricklink:**
- Check that catalog JSON files were updated (should contain `blob.vercel-storage.com` URLs)
- Ensure changes were committed and deployed
- Clear browser cache

**If you get "403 Forbidden" on images:**
- Blob store is still Private - repeat Step 1

**If migration fails:**
- Script will show specific errors
- Can be re-run safely (skips existing uploads)
- Check BLOB_READ_WRITE_TOKEN is correct
