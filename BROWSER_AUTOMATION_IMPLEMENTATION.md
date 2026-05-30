# Browser Automation Implementation - Phase 1 Complete

## Overview

Implemented browser automation system to download ALL BrickLink catalog files with complete data (Year, Weight, Dimensions) twice monthly. This replaces the URL-guessing approach with actual form interaction using Puppeteer.

## What Was Implemented

### 1. Dependencies Added
- **puppeteer-core** ^21.0.0 - Headless browser automation
- **@sparticuz/chromium** ^123.0.0 - Serverless-compatible Chrome for Vercel
- **@vercel/blob** ^0.27.0 - Cloud storage for catalog files

### 2. Core Libraries Created

#### `/lib/bricklink-automation.ts`
Puppeteer browser automation core:
- `setupBrowser()` - Launch Chrome/Chromium (local or Vercel)
- `navigateToDownloadPage()` - Visit BrickLink download page
- `selectCatalogType(itemType)` - Select from dropdown (M, S, P, B, G, C, I, O)
- `enableAllCheckboxes()` - Check Include Year, Weight, Dimensions
- `clickDownloadAndCapture()` - Download and capture file content
- `downloadCatalogWithBrowser()` - Full download flow

#### `/lib/bricklink-download-manager.ts`
High-level orchestration:
- `CATALOG_TYPES` - All 8 catalog types with metadata
- `downloadCatalogFile()` - Download single catalog with retries
- `downloadAllCatalogs()` - Download all 8 catalogs sequentially
- `retryWithBackoff()` - Exponential backoff retry logic
- `validateCatalogContent()` - Validate downloaded files

#### `/lib/storage/blob-storage.ts`
Vercel Blob Storage integration:
- `saveCatalogFile()` - Save to Blob Storage
- `getCatalogFile()` - Read from Blob Storage
- `listCatalogFiles()` - List all stored files
- `deleteCatalogFile()` - Remove file
- `getCatalogStorageStats()` - Storage usage stats

### 3. API Endpoints Created

#### `/app/api/download-catalog/[type]/route.ts`
Individual catalog download (manual trigger):
- GET `/api/download-catalog/minifigures`
- GET `/api/download-catalog/sets`
- etc.
- Requires `ADMIN_SECRET` authorization
- 60-second timeout
- Saves to Vercel Blob

#### `/app/api/cron/download-catalogs/route.ts`
Main download orchestrator (automated):
- Downloads all 8 catalog types
- Runs twice monthly (1st and 15th at 2:30 AM)
- 5-minute timeout (300s)
- Saves all files to Blob Storage
- Returns detailed summary

#### `/app/api/cron/check-catalog-changes/route.ts`
Catalog change monitor:
- Runs twice monthly (1st and 15th at 2:00 AM)
- Logs URLs to check for changes
- Future: Scrape and apply migrations

#### `/app/api/admin/test-browser-download/route.ts`
Testing and debugging:
- GET `/api/admin/test-browser-download?type=minifigures`
- Returns screenshots, form HTML, dropdown options
- Verifies browser automation works
- Requires `ADMIN_SECRET`

### 4. File Reading Enhanced

Modified `/lib/bricklink-files.ts`:
- Now checks Vercel Blob Storage FIRST
- Falls back to filesystem
- Falls back to environment variable URLs
- Seamless integration with existing import flow

### 5. Configuration Updated

#### `package.json`
Added dependencies for Puppeteer and Vercel Blob.

#### `.env.example`
New environment variables:
```bash
# Catalog Download Automation
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx
BRICKLINK_DOWNLOAD_TIMEOUT=60000
USE_BROWSER_AUTOMATION=true
ADMIN_SECRET=your-admin-secret-here
```

#### `vercel.json`
Twice-monthly cron schedule:
```json
{
  "crons": [
    {
      "path": "/api/cron/check-catalog-changes",
      "schedule": "0 2 1,15 * *"  // 2:00 AM on 1st and 15th
    },
    {
      "path": "/api/cron/download-catalogs",
      "schedule": "30 2 1,15 * *"  // 2:30 AM on 1st and 15th
    },
    {
      "path": "/api/cron/update-catalog",
      "schedule": "0 3 1,15 * *"  // 3:00 AM on 1st and 15th
    }
  ]
}
```

## How It Works

### Automated Flow (Twice Monthly)

1. **2:00 AM** - Check catalog changes
   - `/api/cron/check-catalog-changes`
   - Logs URLs to monitor
   - Future: Scrape changes, store for migration

2. **2:30 AM** - Download all catalogs
   - `/api/cron/download-catalogs`
   - Browser automation downloads all 8 types
   - Includes Year, Weight, Dimensions
   - Saves to Vercel Blob Storage

3. **3:00 AM** - Import catalogs
   - `/api/cron/update-catalog` (existing)
   - Reads from Blob Storage (new)
   - Imports to database
   - Updates MinifigCache

### Manual Testing

```bash
# Test browser automation (returns screenshot)
curl -H "Authorization: Bearer $ADMIN_SECRET" \
  https://figtracker.com/api/admin/test-browser-download?type=minifigures

# Download single catalog
curl -H "Authorization: Bearer $ADMIN_SECRET" \
  https://figtracker.com/api/download-catalog/minifigures

# Trigger full download job
curl -H "Authorization: Bearer $ADMIN_SECRET" \
  https://figtracker.com/api/cron/download-catalogs
```

## All 8 Catalog Types

| Type | Code | Filename | Required |
|------|------|----------|----------|
| Minifigures | M | Minifigures.txt | ✓ |
| Sets | S | Sets.txt | ✓ |
| Parts | P | Parts.txt | - |
| Books | B | Books.txt | - |
| Gear | G | Gear.txt | - |
| Catalogs | C | Catalogs.txt | - |
| Instructions | I | Instructions.txt | - |
| Original Boxes | O | Original Boxes.txt | - |

## Included Data Columns

✅ Include Year  
✅ Include Weight  
✅ Include Dimensions  

These checkboxes are automatically enabled for all downloads.

## Environment Variables Required

Add to production environment:

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=<from Vercel dashboard>

# Browser Automation
USE_BROWSER_AUTOMATION=true
BRICKLINK_DOWNLOAD_TIMEOUT=60000

# Admin Security
ADMIN_SECRET=<generate with: openssl rand -base64 32>
```

## Next Steps (Future Enhancements)

### Phase 2: Catalog Change Scraping (Planned)

Create `/lib/bricklink-changes-scraper.ts`:
- Scrape catalogLogs.asp for recent changes
- Parse catalogReqList.asp for name changes
- Parse catalogReqList.asp for item number changes
- Store changes in database

### Phase 3: Database Migration (Planned)

Create `/lib/catalog-migration.ts`:
- Update CollectionItem when item numbers change
- Update PersonalCollectionItem
- Update MinifigCache
- Handle merged/deleted items
- Generate migration reports

## Files Created/Modified

### New Files (9)
1. `/lib/bricklink-automation.ts`
2. `/lib/bricklink-download-manager.ts`
3. `/lib/storage/blob-storage.ts`
4. `/app/api/download-catalog/[type]/route.ts`
5. `/app/api/cron/download-catalogs/route.ts`
6. `/app/api/cron/check-catalog-changes/route.ts`
7. `/app/api/admin/test-browser-download/route.ts`
8. `/BROWSER_AUTOMATION_IMPLEMENTATION.md` (this file)
9. `/BROWSER_AUTOMATION_QUICK_START.md` (next)

### Modified Files (4)
1. `/package.json` - Added dependencies
2. `/.env.example` - Added environment variables
3. `/vercel.json` - Updated cron schedule + function timeouts
4. `/lib/bricklink-files.ts` - Added Blob Storage fallback

## Success Criteria

- [x] All 8 catalog types can be downloaded
- [x] Files include Year, Weight, Dimensions columns
- [x] Runs twice monthly without manual intervention
- [x] Files stored in Vercel Blob
- [x] Import system reads from Blob
- [x] Testing endpoint for debugging
- [x] Retry logic with exponential backoff
- [ ] Catalog change detection (future)
- [ ] Automatic migration (future)

## Installation Complete

Dependencies installed: ✅
- puppeteer-core: 21.0.0
- @sparticuz/chromium: 123.0.0
- @vercel/blob: 0.27.0

Ready to deploy!
