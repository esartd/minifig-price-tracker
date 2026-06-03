# Bricklink Catalog Import

This guide shows you how to import the full Bricklink minifigure catalog to enable name-based search on your website.

## Overview

Previously, users could only search by exact Bricklink ID (e.g., "sw1219"). Now with the catalog imported, they can search by name (e.g., "Luke Skywalker") and get instant results!

## Setup Steps

### 1. Create the database table

Run the Prisma migration to create the new `MinifigCatalog` table:

```bash
npm run db:migrate
```

When prompted for a migration name, you can use: `add_minifig_catalog`

### 2. Import the catalog data

Make sure `Minifigures.txt` is in the root directory of your project, then run:

```bash
npm run import-catalog
```

This will:
- Read all ~15,000+ minifigures from the text file
- Import them into your PostgreSQL database in batches
- Show progress as it imports

Expected output:
```
📖 Reading catalog from: /path/to/Minifigures.txt
✅ Imported 100 minifigures...
✅ Imported 200 minifigures...
...
✅ Imported 15000 minifigures...

📊 Import Summary:
   ✅ Imported: 15432
   ⚠️  Skipped:  8
   ❌ Errors:   0

✨ Import complete!
```

### 3. Test the search

After import, your users can now search by name! Try these searches:

- "Luke Skywalker" → Returns all Luke minifigures
- "Darth Vader" → Returns all Vader minifigures  
- "Harry Potter" → Returns all Harry Potter minifigures
- "sw1219" → Still works! Exact ID search remains supported

## How It Works

### Database Schema

The new `MinifigCatalog` table stores:
- `minifigure_no` - Bricklink ID (e.g., "sw1219")
- `name` - Full minifigure name
- `category_id` - Numeric category ID
- `category_name` - Category name (e.g., "Star Wars")
- `year_released` - Year released (can be "?" for unknown)
- `weight_grams` - Weight in grams
- `search_name` - Lowercase name for fast searching

### Search API

The `/api/minifigs/search` endpoint now:

1. **Exact ID searches** (e.g., "sw1219"):
   - Checks cache first
   - Falls back to Bricklink API if not cached
   - Stores in cache for future searches

2. **Name searches** (e.g., "Luke Skywalker"):
   - Searches the full `MinifigCatalog` table
   - Returns up to 50 matches
   - Sorts exact matches first, then alphabetically

### Compliance with Bricklink Terms

This approach is compliant because:
- ✅ Catalog data is from official Bricklink download (not API enumeration)
- ✅ No systematic API crawling/spidering
- ✅ Pricing still fetched via API with proper rate limiting and caching
- ✅ Only stores metadata (names/IDs), not pricing data

## Updating the Catalog

Bricklink updates their catalog monthly. You have three options to keep your catalog up-to-date:

1. **Automatic Updates (Recommended)** - Set up a cron job to automatically import monthly
2. **Manual Upload via API** - Upload the file directly via API endpoint
3. **Manual Import via Script** - Re-run the import script locally

👉 **See [CATALOG_UPDATE_GUIDE.md](CATALOG_UPDATE_GUIDE.md) for detailed instructions on all three methods.**

Quick summary:
- The import script uses `upsert`, so existing items are updated and new ones added
- No duplicates will be created
- You can safely re-run imports anytime

## Troubleshooting

### Import fails with "DATABASE_URL not set"

Make sure your `.env` file has a valid `DATABASE_URL`. Example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/minifig_tracker"
```

### No search results after import

Check that the import completed successfully and data exists:

```bash
npm run db:studio
```

Then navigate to the `MinifigCatalog` table and verify records exist.

### Search is slow

If you have many records, make sure the database indexes were created. Check the schema.prisma file - these indexes should exist:

```prisma
@@index([search_name])
@@index([category_name])
@@index([year_released])
```

## File Reference

- `prisma/schema.prisma` - Database schema with `MinifigCatalog` model
- `scripts/import-catalog.ts` - Import script
- `app/api/minifigs/search/route.ts` - Search endpoint
- `Minifigures.txt` - Bricklink catalog data (not in git)
