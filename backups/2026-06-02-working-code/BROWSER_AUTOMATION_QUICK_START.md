# Browser Automation Quick Start

## Setup Checklist

### 1. Environment Variables

Add to your Vercel project environment variables:

```bash
# Get your Blob token from: https://vercel.com/dashboard/stores
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXX

# Enable browser automation
USE_BROWSER_AUTOMATION=true

# Download timeout (60 seconds)
BRICKLINK_DOWNLOAD_TIMEOUT=60000

# Generate admin secret: openssl rand -base64 32
ADMIN_SECRET=your-random-secret-here
```

### 2. Deploy to Vercel

```bash
# Push to main branch
git add .
git commit -m "Add browser automation for catalog downloads"
git push origin main

# Vercel will auto-deploy with new cron jobs
```

### 3. Verify Cron Jobs

Check Vercel dashboard → Your Project → Cron Jobs:

- ✓ `/api/cron/check-catalog-changes` - 2:00 AM on 1st and 15th
- ✓ `/api/cron/download-catalogs` - 2:30 AM on 1st and 15th  
- ✓ `/api/cron/update-catalog` - 3:00 AM on 1st and 15th

## Testing Before First Cron Run

### Test 1: Browser Automation Works

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://figtracker.com/api/admin/test-browser-download?type=minifigures
```

Expected response:
- `success: true`
- Screenshot in base64
- Form HTML
- Dropdown options
- Checkbox states

### Test 2: Download Single Catalog

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://figtracker.com/api/download-catalog/minifigures
```

Expected response:
```json
{
  "success": true,
  "catalog": "Minifigures",
  "filename": "Minifigures.txt",
  "sizeKB": "1234.56",
  "duration": 15000,
  "blobUrl": "https://..."
}
```

### Test 3: Download All Catalogs

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://figtracker.com/api/cron/download-catalogs
```

Expected response:
```json
{
  "success": true,
  "catalogs": {
    "total": 8,
    "successful": 8,
    "failed": 0,
    "totalSizeMB": "45.67"
  },
  "blobStorage": {
    "saved": 8,
    "failed": 0
  },
  "results": [...]
}
```

### Test 4: Verify Blob Storage

```bash
# Check if import can read from Blob
curl https://figtracker.com/api/cron/update-catalog
```

Should see: "Found in Vercel Blob Storage" in logs

## Monitoring

### View Cron Logs

Vercel Dashboard → Logs → Filter by:
- `/api/cron/download-catalogs`
- `/api/cron/check-catalog-changes`
- `/api/cron/update-catalog`

### Check Blob Storage

Vercel Dashboard → Storage → Blob → Browse:
- `catalogs/Minifigures.txt`
- `catalogs/Sets.txt`
- etc.

### Success Indicators

✅ All 8 files in Blob Storage  
✅ Files updated twice monthly  
✅ Import cron reads from Blob  
✅ No timeout errors  
✅ Files contain Year/Weight/Dimensions columns

## Troubleshooting

### Browser fails to launch

**Error**: "Failed to launch browser"

**Fix**: Ensure @sparticuz/chromium is installed:
```bash
npm install @sparticuz/chromium@^123.0.0
```

### Timeout errors

**Error**: "Failed to capture catalog file content within timeout"

**Fix**: Increase timeout in environment:
```bash
BRICKLINK_DOWNLOAD_TIMEOUT=90000  # 90 seconds
```

### Blob Storage fails

**Error**: "BLOB_READ_WRITE_TOKEN environment variable is not set"

**Fix**: Add token to Vercel environment variables:
1. Go to Vercel Dashboard → Storage → Blob
2. Create store if needed
3. Copy read-write token
4. Add as `BLOB_READ_WRITE_TOKEN` environment variable

### Download works but import fails

**Check**: Does import cron see Blob files?

```bash
# Check logs for "Found in Vercel Blob Storage"
# If not found, check BLOB_READ_WRITE_TOKEN is set
```

### Manual trigger for testing

```bash
# Force download now (don't wait for cron)
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://figtracker.com/api/cron/download-catalogs

# Force import now
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://figtracker.com/api/cron/update-catalog
```

## What Gets Downloaded

All 8 catalog types with full data:

1. **Minifigures.txt** (required)
2. **Sets.txt** (required)
3. **Parts.txt**
4. **Books.txt**
5. **Gear.txt**
6. **Catalogs.txt**
7. **Instructions.txt**
8. **Original Boxes.txt**

Each includes:
- ✅ Year column
- ✅ Weight column
- ✅ Dimensions column

## Deployment Size

Browser automation adds ~60MB to deployment:
- puppeteer-core: ~10MB
- @sparticuz/chromium: ~50MB

Vercel limits: 250MB per function ✅

## Cost Estimate

### Vercel Blob Storage
- Free tier: 10GB storage, 100GB bandwidth
- Catalog files: ~50MB per download
- Twice monthly: ~100MB/month
- Well within free tier ✅

### Function Invocations
- Free tier: 100,000 invocations
- Twice monthly: 3 crons × 2 = 6 invocations/month
- Well within free tier ✅

### Function Duration
- Free tier: 100 GB-hours
- Each download job: ~2-3 minutes
- Twice monthly: ~6 minutes total
- Well within free tier ✅

## Schedule

| Time | Cron | What It Does |
|------|------|--------------|
| 2:00 AM | check-catalog-changes | Log change URLs (future: scrape) |
| 2:30 AM | download-catalogs | Download all 8 catalogs with browser |
| 3:00 AM | update-catalog | Import from Blob to database |

Runs on: **1st and 15th of every month**

## Rollback Plan

If browser automation fails:

```bash
# Disable browser automation
USE_BROWSER_AUTOMATION=false

# System falls back to URL guessing (old method)
# Or set direct URLs:
BRICKLINK_MINIFIGURES_URL=https://...
BRICKLINK_SETS_URL=https://...
```

## Support

If issues persist:
1. Check Vercel logs for errors
2. Test with `/api/admin/test-browser-download`
3. Verify environment variables
4. Check Blob Storage dashboard
5. Email hello@ericksu.com with error details

---

**Implementation Date**: April 17, 2026  
**Status**: Phase 1 Complete ✅  
**Next**: Deploy and monitor first cron run
