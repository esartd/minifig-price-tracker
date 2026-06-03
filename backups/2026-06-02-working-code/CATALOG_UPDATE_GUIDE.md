# BrickLink Catalog Update Guide

This guide explains how to update the BrickLink catalog data **twice per month** when BrickLink releases new downloads.

---

## 📅 When to Update

BrickLink typically updates their catalog files **twice per month**. Check: https://www.bricklink.com/catalogDownload.asp

Set a reminder for the **1st and 15th of each month** to check for updates.

---

## 🔄 Step-by-Step Update Process

### 1. Run the Update Script (First Time)

The script will **automatically create the correct date folder**:

```bash
cd "/Users/erickkosysu/Code Projects/FigTracker"
./update-catalog.sh
```

The script will:
- ✅ Create folder: `Bricklink Catalog txt/2026/4/` (or current year/month)
- ✅ Tell you where to download files

Example output:
```
📁 Creating directory: /Users/erickkosysu/Code Projects/FigTracker/Bricklink Catalog txt/2026/4
✅ Directory created

📥 Now download BrickLink catalog files to this directory:
   /Users/erickkosysu/Code Projects/FigTracker/Bricklink Catalog txt/2026/4
```

### 2. Download BrickLink Catalog Files

1. Go to https://www.bricklink.com/catalogDownload.asp
2. Download these 5 files:
   - ✅ **Minifigures.txt** (Required)
   - ✅ **Catalogs.txt** (Sets)
   - ✅ **Parts.txt** 
   - ✅ **Original Boxes.txt**
   - ✅ **categories.txt** (Required)

3. Save them to the folder shown by the script:
   - **2026 April:** `Bricklink Catalog txt/2026/4/`
   - **2026 May:** `Bricklink Catalog txt/2026/5/`
   - **2026 June:** `Bricklink Catalog txt/2026/6/`
   - *(Script automatically uses current year/month)*

### 3. Run the Script Again

After downloading files:

```bash
cd "/Users/erickkosysu/Code Projects/FigTracker"
./update-catalog.sh
```

The script will:
- ✅ Verify all 5 files are present
- ✅ Convert TXT files to JSON
- ✅ Upload JSON files to Hostinger CDN
- ✅ Update metadata with timestamp

### 4. Verify the Update

Visit these URLs to confirm:
```bash
curl https://figtracker.ericksu.com/catalog/metadata.json
```

Check the `lastUpdated` timestamp.

---

## 📂 Folder Structure (Automatically Created)

```
Bricklink Catalog txt/
├── 2026/
│   ├── 4/          ← April 2026
│   │   ├── Minifigures.txt
│   │   ├── Catalogs.txt
│   │   ├── Parts.txt
│   │   ├── Original Boxes.txt
│   │   └── categories.txt
│   ├── 5/          ← May 2026 (created automatically)
│   │   └── (download files here)
│   └── 6/          ← June 2026 (created automatically)
│       └── (download files here)
└── 2027/
    └── 1/          ← January 2027 (created automatically)
        └── (download files here)
```

**The script automatically creates folders based on current date!**

---

## 🎯 Quick Reference

```bash
# Run TWICE per month (1st and 15th):

cd "/Users/erickkosysu/Code Projects/FigTracker"

# 1. First run - creates folder and shows path
./update-catalog.sh

# 2. Download TXT files to the shown path
# (Go to https://www.bricklink.com/catalogDownload.asp)

# 3. Second run - converts and uploads
./update-catalog.sh

# 4. Verify
curl https://figtracker.ericksu.com/catalog/metadata.json
```

---

## 🔧 Advanced Usage

### Specify Custom Date Folder

If you want to use a different date:

```bash
# Use specific year/month
npx tsx scripts/update-bricklink-catalog.ts "2026/5"

# Use specific date folder
npx tsx scripts/update-bricklink-catalog.ts "2027/1"
```

### One-Time Setup

First time only, set your Hostinger FTP password:

```bash
nano .env.catalog
# Change: HOSTINGER_FTP_PASSWORD=your_actual_password
# Save: Ctrl+O, Enter, Ctrl+X
```

---

## 🔍 Troubleshooting

### "Missing required files"
Download all 5 files from BrickLink to the correct folder.

### "HOSTINGER_FTP_PASSWORD not set"
Edit `.env.catalog` and add your password:
```bash
nano .env.catalog
```

### "Directory not found"
The script creates it automatically on first run. Just run it again after downloading files.

---

## 📊 What Gets Updated

Each update uploads:
- **minifigs.json** (18,732 items, ~8 MB)
- **sets.json** (5,076 items, ~1.5 MB)
- **parts.json** (93,973 items, ~31 MB)
- **boxes.json** (21,340 items, ~6.6 MB)
- **categories.json** (1,179 items, ~134 KB)
- **metadata.json** (timestamp, ~1 KB)

**Total:** ~47 MB per update

---

## 📅 Monthly Checklist

- [ ] **1st of month:** Run `./update-catalog.sh`
- [ ] Download 5 TXT files from BrickLink
- [ ] Run `./update-catalog.sh` again
- [ ] Verify: `curl https://figtracker.ericksu.com/catalog/metadata.json`

- [ ] **15th of month:** Run `./update-catalog.sh`
- [ ] Download 5 TXT files from BrickLink
- [ ] Run `./update-catalog.sh` again
- [ ] Verify: `curl https://figtracker.ericksu.com/catalog/metadata.json`

---

**Last Updated:** April 2026  
**Update Frequency:** Twice per month (1st and 15th)  
**Automation:** Semi-automated (manual download, auto folder creation, auto conversion & upload)
