# Catalog Update Guide

This guide explains how to keep your Bricklink minifigure catalog up-to-date as Bricklink releases new minifigures and updates existing ones.

## Update Frequency

According to Bricklink:
- **Monthly updates** are typical
- Track changes at: https://www.bricklink.com/catalogLogs.asp
- Minifigure name changes: https://www.bricklink.com/catalogReqList.asp?viewStatus=1&itemType=M&viewAction=N
- Item number changes: https://www.bricklink.com/catalogReqList.asp?viewStatus=1&itemType=M&viewAction=I

## Three Update Methods

### Method 1: Fully Automatic Updates via Cron (Recommended) ✨

A cron job runs monthly to **automatically download from Bricklink** and import the latest catalog.

**Setup:**

**Zero setup required!** The cron job attempts to automatically download the catalog directly from Bricklink using multiple strategies:
- Tries common Bricklink URL patterns
- Parses the download page to find the file link
- Falls back to custom `CATALOG_URL` if set

**How it works:**
- Cron: `0 3 1 * *` (1st of month, 3 AM)
- Endpoint: `/api/cron/update-catalog`
- Automatically downloads from Bricklink
- Updates existing items and adds new ones
- No duplicates created

**Testing:**
```bash
# Test if automatic download works
curl https://figtracker.ericksu.com/api/admin/test-catalog-download \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

**Fallback Option:**
If automatic download doesn't work, set `CATALOG_URL` as a fallback:
1. Download `Minifigures.txt` from Bricklink: https://www.bricklink.com/catalogDownload.asp
2. Upload to a public URL (S3, Vercel Blob, etc.)
3. Set environment variable: `CATALOG_URL=https://yourdomain.com/Minifigures.txt`

**Maintenance:**
- **Zero maintenance** if automatic download works!
- If using fallback: Upload new catalog to your URL monthly

---

### Method 2: Manual Upload via API

Upload the catalog file directly via API whenever you want to update.

**Setup:**

1. Set `ADMIN_SECRET` in your environment variables:
   ```bash
   ADMIN_SECRET=your-secure-random-string
   ```

2. Download `Minifigures.txt` from Bricklink

3. Upload via curl:
   ```bash
   curl -X POST https://figtracker.ericksu.com/api/admin/upload-catalog \
     -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
     -H "Content-Type: text/plain" \
     --data-binary @Minifigures.txt
   ```

**Response:**
```json
{
  "success": true,
  "message": "Catalog uploaded and processed successfully",
  "stats": {
    "created": 150,
    "updated": 15280,
    "skipped": 2,
    "errors": 0,
    "total": 15430
  }
}
```

**When to use:**
- You want full control over when updates happen
- You don't want to host the file publicly
- You prefer manual updates

---

### Method 3: Manual Import via Script

Run the import script locally when needed.

**Setup:**

1. Download `Minifigures.txt` from Bricklink

2. Place it in your project root

3. Run the import script:
   ```bash
   npm run import-catalog
   ```

**Output:**
```
📖 Reading catalog from: /path/to/Minifigures.txt
✅ Imported 100 minifigures...
✅ Imported 200 minifigures...
...
✨ Import complete!
```

**When to use:**
- During initial setup
- For testing/development
- When you have direct database access

---

## Checking for Changes

Use the admin endpoint to check if your catalog needs updating:

```bash
curl https://figtracker.ericksu.com/api/admin/check-catalog-changes \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

This will:
- Show catalog stats (total items, last update date)
- Sample 10 items and check if their names changed on Bricklink
- Suggest whether a full update is needed

**Response:**
```json
{
  "success": true,
  "catalog_stats": {
    "total_items": 15432,
    "oldest_update": "2026-03-15T08:00:00.000Z",
    "newest_update": "2026-04-01T03:00:00.000Z"
  },
  "sample_check": {
    "items_checked": 10,
    "changes_detected": 2,
    "changes": [
      {
        "minifigure_no": "sw1234",
        "old_name": "Luke Skywalker",
        "new_name": "Luke Skywalker (Jedi Knight)",
        "last_updated": "2026-03-15T08:00:00.000Z"
      }
    ]
  },
  "recommendation": "Changes detected! Consider running a full catalog update.",
  "manual_check_urls": {
    "name_changes": "https://www.bricklink.com/catalogReqList.asp?...",
    "download_catalog": "https://www.bricklink.com/catalogDownload.asp"
  }
}
```

---

## Recommended Workflow

### Initial Setup (Now)

1. Run the migration:
   ```bash
   npm run db:migrate
   ```

2. Import the catalog:
   ```bash
   npm run import-catalog
   ```

3. Deploy to Vercel

### Monthly Maintenance (Choose One)

**Option A: Zero Maintenance (Recommended!)** ✨
1. **That's it!** The cron job automatically downloads from Bricklink monthly
2. Optional: Run test to verify: `curl .../api/admin/test-catalog-download`
3. Optional: Check logs in Vercel dashboard

**Option B: Manual Control**
1. Monthly: Download `Minifigures.txt` from Bricklink
2. Monthly: Run upload command (see Method 2 above)

**Option C: When Needed**
1. Periodically: Check `/api/admin/check-catalog-changes`
2. If changes detected: Run manual import

---

## Environment Variables

Add these to your Vercel environment:

```bash
# Required for cron authentication
CRON_SECRET=your-cron-secret

# Required for admin endpoints
ADMIN_SECRET=your-admin-secret

# Optional: For automatic catalog updates (Method 1)
CATALOG_URL=https://yourdomain.com/Minifigures.txt
```

---

## Monitoring

### Check Last Update

Visit your database (Prisma Studio):
```bash
npm run db:studio
```

Navigate to `MinifigCatalog` table and check the `updated_at` field.

### Check Cron Logs

In Vercel dashboard:
1. Go to your project
2. Click "Logs"
3. Filter for `/api/cron/update-catalog`

### Test Cron Manually

Trigger the cron job manually:
```bash
curl https://figtracker.ericksu.com/api/cron/update-catalog \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Troubleshooting

### Cron job not running

- Check Vercel cron logs
- Verify `CRON_SECRET` is set
- Check if `CATALOG_URL` is set and accessible

### Import fails with "Invalid catalog data"

- Verify the file is tab-separated
- Check file size (should be ~1-2 MB)
- Ensure first line is the header row

### Duplicate items

Not possible - the import uses `upsert` with `minifigure_no` as the unique key.

### Some items not updating

- Check the logs for errors
- Verify the source file has the latest data
- Try re-importing

---

## Files Reference

- `/api/cron/update-catalog/route.ts` - Automatic cron job
- `/api/admin/upload-catalog/route.ts` - Manual upload endpoint
- `/api/admin/check-catalog-changes/route.ts` - Check for changes
- `scripts/import-catalog.ts` - Local import script
- `vercel.json` - Cron schedule configuration
- `prisma/schema.prisma` - MinifigCatalog model

---

## Next Steps

1. ✅ Initial import completed
2. ⬜ Choose your preferred update method
3. ⬜ Set up environment variables
4. ⬜ Test the update process
5. ⬜ Set calendar reminder for monthly check (if not using auto-updates)
