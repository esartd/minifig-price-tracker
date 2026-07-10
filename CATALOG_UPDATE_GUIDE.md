# BrickLink Catalog Update Guide

This guide explains how to update the BrickLink catalog data (minifigure and set names, categories, years, weights) when BrickLink releases new downloads.

There is **no automatic cron job** for this anymore — it's a manual process you run when you want fresh data. (Older docs in this repo describe a fully-automated FTP pipeline; that pipeline is not wired up to anything running in production. This guide reflects what the live app actually reads.)

---

## 📅 When to Update

BrickLink typically refreshes their catalog files a couple times a month. Check: https://www.bricklink.com/catalogDownload.asp

There's no enforced schedule — update whenever you notice stale names/categories or want the latest items.

---

## 🔄 Step-by-Step Update Process

### 1. Download 2 files from BrickLink

Go to https://www.bricklink.com/catalogDownload.asp and download:

- ✅ **Minifigures.txt**
- ✅ **Sets.txt**

That's all the live site reads. (`categories.txt` is optional — the converter script will process it if present, but nothing in the app currently uses `categories.json`. Files like `Catalogs.txt`, `Parts.txt`, and `Original Boxes.txt` belong to an old, unused pipeline — skip them.)

Save both files into **`Bricklink Catalog txt/`** at the project root — that's the one standing folder for this now (no more dated subfolders). Just overwrite `Sets.txt` there and add `Minifigures.txt` alongside it.

### 2. Convert to JSON

```bash
npx tsx scripts/update-catalogs-simple.ts "Bricklink Catalog txt"
```

This reads the `.txt` files and writes directly into `public/catalog/`:
- `minifigs.json`
- `boxes.json` (this is the **Sets** catalog, despite the name — `lib/boxes-data.ts` reads it for LEGO sets)

It only updates item names, categories, years, and weights. **It never touches minifig/set descriptions** — those live in the `MinifigCatalog`/`SetsCatalog` database tables, which this script doesn't go near (see [CATALOG_DESCRIPTIONS_SYSTEM.md](CATALOG_DESCRIPTIONS_SYSTEM.md)).

Check the item counts it prints — a sudden large drop usually means a bad/partial download from BrickLink.

### 3. Commit and push

```bash
git add public/catalog/minifigs.json public/catalog/boxes.json
git commit -m "Update BrickLink catalog data"
git push origin main
```

### 4. Deploy

This is a data-only change — no code changed, so you can skip the rebuild:

```bash
ssh -i ~/.ssh/figtracker_vps root@187.77.202.14 'cd /var/www/figtracker && git pull && pm2 restart figtracker'
```

The restart matters: `minifigs.json` is cached in memory for 24 hours (`lib/catalog-static.ts`) and `boxes.json` for 15 minutes (`lib/boxes-data.ts`). Without restarting, the running server keeps serving the old data until those caches expire on their own.

### 5. Verify

Search for a minifig/set you know was recently added on BrickLink, or spot-check an existing item's category/year on the live site.

---

## 🔍 Troubleshooting

### "Minifigures.txt not found" / "Sets.txt not found"
The converter looks for those exact filenames (case-sensitive) in the folder you pass it. Make sure you didn't rename them on download.

### Item counts look way too low
Usually means BrickLink's download was truncated or the wrong file got saved. Re-download and re-run.

---

**Last updated:** 2026-07-10
**Update frequency:** As needed, manual
**Automation:** None currently — fully manual (see note at top about the old automated pipeline)
