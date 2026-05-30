# Automatic Catalog Updates - Setup Complete! ✨

Your site is now configured to **automatically download and import** the Bricklink catalog every month. Zero maintenance required!

## How It Works

### Automatic Monthly Updates

A cron job runs on the **1st of every month at 3 AM** and:

1. **Automatically downloads** the latest Bricklink catalog
   - Tries multiple Bricklink URL patterns
   - Parses the download page if needed
   - Falls back to `CATALOG_URL` if set

2. **Imports into your database**
   - Updates changed minifigures
   - Adds new minifigures
   - No duplicates created

3. **Logs the results**
   - Check Vercel logs to see import stats
   - Shows how many items were created/updated

### Smart Download Strategy

The system tries multiple approaches to download from Bricklink:

```
Priority 1: Custom CATALOG_URL (if set)
  ↓ (if not set or fails)
Priority 2: Common Bricklink download URLs
  ↓ (if fails)
Priority 3: Parse Bricklink download page to find the link
  ↓ (if fails)
Fallback: Log error and skip until next month
```

## Files Created

### Core Library
- **[lib/bricklink-catalog.ts](lib/bricklink-catalog.ts)** - Automatic download logic
  - `downloadBricklinkCatalog()` - Tries multiple download strategies
  - `parseCatalogData()` - Parses the tab-separated file
  - `importCatalogItems()` - Imports into database

### API Endpoints
- **[app/api/cron/update-catalog/route.ts](app/api/cron/update-catalog/route.ts)** - Monthly cron job
- **[app/api/admin/test-catalog-download/route.ts](app/api/admin/test-catalog-download/route.ts)** - Test download
- **[app/api/admin/upload-catalog/route.ts](app/api/admin/upload-catalog/route.ts)** - Manual upload fallback
- **[app/api/admin/check-catalog-changes/route.ts](app/api/admin/check-catalog-changes/route.ts)** - Check for updates

### Configuration
- **[vercel.json](vercel.json)** - Cron schedule: `"schedule": "0 3 1 * *"`
- **[package.json](package.json)** - npm scripts for testing and manual operations

### Documentation
- **[AUTO_CATALOG_SETUP.md](AUTO_CATALOG_SETUP.md)** - This file (quick start)
- **[CATALOG_UPDATE_GUIDE.md](CATALOG_UPDATE_GUIDE.md)** - Detailed guide with all options
- **[CATALOG_IMPORT_README.md](CATALOG_IMPORT_README.md)** - Initial import instructions

## Testing Before Deploy

### 1. Test Automatic Download

```bash
# Set admin secret (if not already set)
export ADMIN_SECRET=your-secure-random-string

# Test if automatic download works
npm run test-catalog-download
```

**Expected Output:**
```json
{
  "success": true,
  "message": "Successfully downloaded catalog from Bricklink!",
  "source": "https://www.bricklink.com/...",
  "stats": {
    "total_lines": 15432,
    "file_size_kb": 1842.5,
    "first_10_lines": "..."
  },
  "next_step": "The automatic download works! The cron job will run monthly..."
}
```

### 2. Initial Import

If you haven't imported the catalog yet:

```bash
# Option A: Use the local script (requires Minifigures.txt in project root)
npm run import-catalog

# Option B: Let the cron job download and import automatically
# Just deploy and the cron will run on the 1st of next month
```

### 3. Manual Test of Full Process

Trigger the cron job manually to test the full flow:

```bash
curl https://figtracker.ericksu.com/api/cron/update-catalog \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Deployment

### 1. Set Environment Variables in Vercel

Required:
```bash
CRON_SECRET=your-cron-secret          # Already set
ADMIN_SECRET=your-admin-secret        # For admin endpoints
```

Optional:
```bash
CATALOG_URL=https://...               # Only if automatic download fails
```

### 2. Deploy to Vercel

```bash
git add .
git commit -m "Add automatic Bricklink catalog updates"
git push origin main
```

Vercel will automatically:
- Deploy the new code
- Register the cron job
- Run it on the 1st of each month at 3 AM

### 3. Verify Deployment

Check the cron is registered:
1. Go to Vercel Dashboard
2. Your Project → Settings → Crons
3. You should see: `/api/cron/update-catalog` with schedule `0 3 1 * *`

## Monitoring

### Check Cron Logs

In Vercel Dashboard:
1. Go to your project
2. Click "Logs"
3. Filter by `/api/cron/update-catalog`

Look for:
```
🔄 Starting automatic catalog update...
✅ Downloaded catalog from: https://...
📖 Parsing catalog data...
✅ Parsed 15432 items
💾 Importing into database...
📊 Catalog update complete: { created: 150, updated: 15280, total: 15430 }
```

### Check Database

View imported items:
```bash
npm run db:studio
```

Navigate to `MinifigCatalog` table and verify data exists.

### Manual Check

```bash
# Check for catalog changes
npm run check-catalog

# Test download capability
npm run test-catalog-download
```

## What Happens Each Month

**Automatically on the 1st at 3 AM:**

```
1. Cron triggers /api/cron/update-catalog
2. System downloads latest catalog from Bricklink
3. Parses ~15,000+ minifigures
4. Updates database (upsert = update existing, add new)
5. Logs results to Vercel
6. Your users can now search by name for any minifigure!
```

**You do:** Nothing! ✨

**Optional:** Check Vercel logs once a month to verify it ran successfully.

## Fallback Options

### If Automatic Download Fails

The cron will log an error. You have two options:

**Option 1: Set CATALOG_URL**
1. Download `Minifigures.txt` from Bricklink
2. Upload to a public URL (S3, Vercel Blob, etc.)
3. Set `CATALOG_URL` in Vercel environment variables
4. Re-upload the file monthly (cron will fetch from this URL)

**Option 2: Manual Upload**
1. Download `Minifigures.txt` monthly from Bricklink
2. Run: `npm run upload-catalog`

## Bricklink Links

- **Download Catalog:** https://www.bricklink.com/catalogDownload.asp
- **View Changes:** https://www.bricklink.com/catalogLogs.asp
- **Name Changes:** https://www.bricklink.com/catalogReqList.asp?viewStatus=1&itemType=M&viewAction=N
- **Item Number Changes:** https://www.bricklink.com/catalogReqList.asp?viewStatus=1&itemType=M&viewAction=I

## npm Scripts Reference

```bash
# Initial setup
npm run db:migrate              # Create database tables
npm run import-catalog          # Import catalog locally (initial)

# Monthly automation (runs automatically via cron)
npm run test-catalog-download   # Test if auto-download works

# Manual operations (if needed)
npm run upload-catalog          # Upload catalog via API
npm run check-catalog           # Check for changes

# Database
npm run db:studio               # View database in browser
```

## Troubleshooting

### "Failed to download catalog"

The automatic download couldn't reach Bricklink. Solutions:
1. Check if Bricklink changed their download page structure
2. Set `CATALOG_URL` as a fallback (see above)
3. Use manual upload via `/api/admin/upload-catalog`

### Cron not running

1. Check Vercel Dashboard → Logs for errors
2. Verify `CRON_SECRET` is set
3. Check cron is registered in Vercel Dashboard → Settings → Crons

### Import succeeds but search doesn't work

1. Check database: `npm run db:studio`
2. Verify `MinifigCatalog` table has data
3. Check search API: Try searching for "Luke Skywalker"

### Database connection errors

1. Verify `DATABASE_URL` is set in Vercel
2. Check database is accessible from Vercel
3. Try connecting via Prisma Studio locally

## Success Checklist

- ✅ Database schema created (`npm run db:migrate`)
- ✅ Initial catalog imported (15,000+ items)
- ✅ Search works (try "Luke Skywalker")
- ✅ Automatic download tested (`npm run test-catalog-download`)
- ✅ Environment variables set in Vercel
- ✅ Code deployed to Vercel
- ✅ Cron registered in Vercel dashboard
- ✅ First cron run verified (check logs on the 2nd of the month)

## What You Get

### Before:
- ❌ Users search "Luke Skywalker" → No results
- ✅ Users search "sw1219" → Works

### After:
- ✅ Users search "Luke Skywalker" → Shows all Luke minifigs
- ✅ Users search "Darth Vader" → Shows all Vader minifigs
- ✅ Users search "sw1219" → Still works!
- ✅ Catalog automatically updates monthly → Zero maintenance!

---

## Next Steps

1. **Now:** Run initial import
   ```bash
   npm run import-catalog
   ```

2. **Test:** Verify search works on your site

3. **Deploy:** Push to Vercel
   ```bash
   git push origin main
   ```

4. **Relax:** The system handles the rest automatically! ✨

---

**Questions?** Check [CATALOG_UPDATE_GUIDE.md](CATALOG_UPDATE_GUIDE.md) for detailed documentation.
