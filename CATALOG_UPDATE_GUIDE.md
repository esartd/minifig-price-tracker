# BrickLink Catalog Update Guide

This guide explains how to update the BrickLink catalog data **twice per month** when BrickLink releases new downloads.

---

## 📅 When to Update

BrickLink typically updates their catalog files **twice per month**. Check: https://www.bricklink.com/catalogDownload.asp

Set a reminder for the **1st and 15th of each month** to check for updates.

---

## 🔄 Step-by-Step Update Process

### 1. Download Latest BrickLink Catalog Files

1. Go to https://www.bricklink.com/catalogDownload.asp
2. Download these files (all free, no API key needed):
   - ✅ **Minifigures.txt** (Required)
   - ✅ **Catalogs.txt** (Sets)
   - ✅ **Parts.txt** (Optional, for future features)
   - ✅ **Original Boxes.txt** (Optional)
   - ✅ **categories.txt** (Required)

3. Save them to: `/Users/erickkosysu/Code Projects/FigTracker/Bricklink Catalog txt/2026/4/`
   - Create a new folder for each month if needed (e.g., `2026/5` for May)
   - Update the path in `scripts/update-bricklink-catalog.ts` if you change folders

### 2. Run the Automated Update Script

```bash
cd "/Users/erickkosysu/Code Projects/FigTracker"

# Set your Hostinger FTP password (first time only)
export HOSTINGER_FTP_PASSWORD="your_hostinger_password_here"

# Run the update script
npx tsx scripts/update-bricklink-catalog.ts
```

The script will:
- ✅ Convert all TXT files to JSON
- ✅ Upload JSON files to Hostinger CDN
- ✅ Update metadata with counts and timestamp

### 3. Verify the Update

Visit these URLs to confirm files are live:
- https://figtracker.ericksu.com/catalog/minifigs.json
- https://figtracker.ericksu.com/catalog/metadata.json

Check the `lastUpdated` timestamp in metadata.json.

---

## 🎯 Quick Reference

```bash
# 1. Download TXT files from BrickLink
# 2. Save to: Bricklink Catalog txt/2026/4/
# 3. Run update:
cd "/Users/erickkosysu/Code Projects/FigTracker"
npx tsx scripts/update-bricklink-catalog.ts

# 4. Verify:
curl https://figtracker.ericksu.com/catalog/metadata.json
```

**Update Frequency:** Twice per month (1st and 15th)  
**Automation:** Semi-automated (manual download, automated conversion & upload)
