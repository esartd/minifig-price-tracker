# Bricklink Catalog Sync

This document explains how FigTracker automatically downloads and updates Bricklink catalog files monthly.

## Files Downloaded Monthly

| File | Purpose | Required | Size |
|------|---------|----------|------|
| **Minifigures.txt** | Minifigure catalog for search, pricing, and database | ✅ Yes | ~1.8MB |
| **Sets.txt** | LEGO sets catalog for Amazon affiliate ads | ✅ Yes | ~1.9MB |
| **categories.txt** | Theme/category hierarchy data | ⚪ Optional | ~23KB |

## Automatic Monthly Schedule

The cron job runs on the **1st of every month at 3:00 AM UTC**.

### What Happens During Sync:

1. **Download Files** (3:00 AM)
   - Downloads Minifigures.txt, Sets.txt, categories.txt from Bricklink
   - Tries multiple URL patterns automatically
   - Falls back to environment variables if direct download fails

2. **Import Minifigures** (3:05 AM)
   - Parses Minifigures.txt
   - Imports/updates minifig catalog in database
   - Updates search index

3. **Update Ads** (Automatic)
   - Sets.txt is now available with latest LEGO sets
   - Amazon ads automatically show current theme sets
   - Non-current themes auto-hide ads

### Vercel Cron Configuration

```json
{
  "crons": [
    {
      "path": "/api/cron/update-catalog",
      "schedule": "0 3 1 * *"
    }
  ]
}
```

## Manual Trigger

You can manually trigger the catalog update:

```bash
# With authentication
curl -X GET https://figtracker.ericksu.com/api/cron/update-catalog \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Environment Variables

### Required
- `CRON_SECRET` - Authentication for cron endpoints

### Optional Fallbacks
If automatic download fails, set these as fallbacks:

- `BRICKLINK_MINIFIGURES_URL` - Direct URL to Minifigures.txt
- `BRICKLINK_SETS_URL` - Direct URL to Sets.txt
- `BRICKLINK_CATEGORIES_URL` - Direct URL to categories.txt

Example:
```env
BRICKLINK_MINIFIGURES_URL=https://yourdomain.com/backup/Minifigures.txt
BRICKLINK_SETS_URL=https://yourdomain.com/backup/Sets.txt
```

## Download Sources

The system tries multiple Bricklink URLs automatically:

1. `https://img.bricklink.com/library/catalogDownload/{file}`
2. `https://static.bricklink.com/library/{file}`
3. `https://www.bricklink.com/catalogDownload.asp?itemType={type}`
4. Environment variable fallback

## What Gets Updated

### Minifigures.txt → Database
- **minifig_catalog** table updated with:
  - New minifigs added
  - Existing minifigs updated (name, category, year)
  - Enables search functionality
  - Powers pricing lookups

### Sets.txt → File System
- Saved to project root as `Sets.txt`
- Used by `lib/sets-data.ts` for Amazon ads
- Determines which themes are "current"
- Powers affiliate monetization

### categories.txt → File System
- Saved to project root as `categories.txt`
- Available for future theme organization features

## Future-Proof Design

The system is designed to automatically adapt:

- **Year rolls over** → `currentYear - 2` auto-adjusts
- **New sets released** → Themes become "current" automatically
- **Sets discontinued** → Old themes auto-hide ads
- **No manual updates needed** → Everything updates monthly

## Monitoring

Check cron job logs in Vercel dashboard:
- Project → Deployments → Functions → Logs
- Search for "Monthly catalog update"

Successful run shows:
```
✅ All catalog files downloaded successfully
✅ Parsed N minifigures
📊 Monthly catalog update complete!
```

## Troubleshooting

### No ads showing after update
- Check if Sets.txt exists in project root
- Verify Sets.txt has current year data
- Clear any caching (restart dev server)

### Download fails
- Set fallback environment variables
- Check Bricklink is accessible
- Verify URLs haven't changed

### Database not updating
- Check database connection
- Verify Minifigures.txt is valid TSV format
- Check cron job authentication

## Architecture

```
Monthly Cron (1st @ 3 AM)
    ↓
Download All Files
    ├─ Minifigures.txt → Database (search/pricing)
    ├─ Sets.txt → Disk (Amazon ads)
    └─ categories.txt → Disk (themes)
    ↓
Theme Pages Auto-Update
    ├─ Current themes (2024-2026) → Show ads
    └─ Non-current themes → Hide ads
```
