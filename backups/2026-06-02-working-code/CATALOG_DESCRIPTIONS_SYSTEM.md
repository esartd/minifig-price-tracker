# Catalog Descriptions System

**Last Updated:** 2026-05-16

## 🚨 CRITICAL: How Descriptions Are Stored

### Minifigs
- **Storage:** `MinifigCatalog` database table (Hostinger MySQL)
- **NOT** stored in `public/catalog/minifigs.json`
- Safe from catalog updates

### Sets
- **Storage:** `SetsCatalog` database table (Hostinger MySQL)
- **NOT** stored in `public/catalog/boxes.json`
- Safe from catalog updates

## Why Database Storage?

**Problem:** Catalog JSON files (`minifigs.json`, `boxes.json`) are updated twice per month from BrickLink .txt exports. If descriptions were stored in these JSON files, they would be **completely wiped out** on every update.

**Solution:** Store descriptions in separate database tables that are **never touched** by catalog updates.

## Database Schema

Both tables have identical structure for descriptions:

```sql
-- MinifigCatalog table
minifigure_no          VARCHAR(191) PRIMARY KEY
name                   VARCHAR(191)
category_id            INT
category_name          VARCHAR(191)
year_released          VARCHAR(191) NULL
weight_grams           FLOAT NULL (minifigs) / weight VARCHAR(191) NULL (sets)
search_name            VARCHAR(191)

-- SEO description fields (4 languages)
description_en         TEXT NULL
description_de         TEXT NULL
description_fr         TEXT NULL
description_es         TEXT NULL
description_generated_at DATETIME NULL
description_status     VARCHAR(191) DEFAULT 'pending'

created_at             DATETIME DEFAULT NOW()
updated_at             DATETIME (auto-updated)

-- Indexes
INDEX (category_name)
INDEX (search_name)
INDEX (year_released)
INDEX (description_status)
```

## How Catalog Updates Work

### When running `update-catalogs-simple.ts`:

1. **Read BrickLink .txt files** (Minifigures.txt, Catalogs.txt)
2. **Convert to JSON format**
3. **Overwrite** `public/catalog/minifigs.json` and `public/catalog/boxes.json`
4. **Descriptions are NOT affected** - they live in database tables

### JSON files contain:
- Item numbers (minifigure_no, box_no)
- Names
- Categories
- Years
- Weights
- Image URLs

### Database tables contain:
- All the above PLUS
- SEO descriptions in 4 languages
- Description metadata (generated_at, status)

## Generating Descriptions

### Script: `scripts/generate-all-descriptions-batch.ts`

**What it does:**
1. Reads all items from JSON files (minifigs.json, boxes.json)
2. Checks database for existing descriptions
3. Skips items that already have descriptions
4. Generates descriptions for items without them
5. Writes to database tables (MinifigCatalog, SetsCatalog)

**How to run:**
```bash
cd /Users/erickkosysu/Code\ Projects/_Personal/FigTracker
npx ts-node scripts/generate-all-descriptions-batch.ts
```

**Features:**
- Theme-specific context (Star Wars, Harry Potter, Marvel, DC, etc.)
- Feature extraction from names (colors, clothing, accessories)
- 4-language support (English, German, French, Spanish)
- Intelligent descriptions matching existing quality
- Preserves hand-written descriptions

**Time estimate:** 30-60 minutes for all 23,853 items

## Description Quality

**Context-aware generation based on:**
- Theme (Star Wars: "galaxy far, far away", Harry Potter: "wizarding world")
- Character names (Darth Vader: "dark lord of the Sith")
- Features (colors, armor, weapons extracted from name)
- Year released
- Set features (castles have "towers", vehicles have "authentic details")

**Example minifig description:**
```
Darth Vader minifigure from the Star Wars theme features black armor, 
red lightsaber, and cape. This iconic minifigure represents the dark 
lord of the Sith in detailed form. Released in 2015, this minifigure 
is perfect for collectors and fans of Star Wars.
```

**Example set description:**
```
Millennium Falcon (Set 75192-1) from the Star Wars collection features 
7,541 pieces with authentic details and play features. This iconic set 
brings the galaxy far, far away to life. Released in 2017, perfect for 
building, display, and play.
```

## How Frontend Accesses Descriptions

**API endpoints fetch from database:**
- `/api/minifigs/[minifigure_no]` - reads from MinifigCatalog table
- `/api/sets/[box_no]` - reads from SetsCatalog table

**NOT from JSON files** - JSON files only used for:
- Initial catalog data (names, categories, years)
- Search/filter operations
- List views

**Detail pages fetch from database to get descriptions**

## Schema Files

**Production (Hostinger MySQL):**
- File: `prisma/schema-hostinger.prisma`
- Client: `@prisma/client-hostinger`
- Provider: `mysql`
- Used by: all production code

**Local (PostgreSQL):**
- File: `prisma/schema.prisma`
- Client: `@prisma/client`
- Provider: `postgresql`
- Used by: local development only

## Migrations

**Created:** 2026-05-16
**File:** `migrations/add_sets_catalog_table.sql`
**Applied by:** `scripts/apply-sets-catalog-migration.ts`

To apply migration (already done):
```bash
npx ts-node scripts/apply-sets-catalog-migration.ts
```

## Git Workflow for Schema Changes

**ALWAYS use feature branch for schema changes** (see CLAUDE.md):

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make schema changes
# Test thoroughly

# Merge to main after confirmation
git checkout main
git merge feature/your-feature-name
git push
```

**Never modify schema directly on main branch** - causes production 500 errors

## Summary

✅ **Descriptions stored in database** - safe from catalog updates
✅ **JSON files updated monthly** - only contain basic catalog data
✅ **Database never touched by catalog updates** - descriptions preserved
✅ **Intelligent generation** - theme-aware, feature-rich descriptions
✅ **4 languages supported** - EN, DE, FR, ES
✅ **Hand-written descriptions preserved** - script skips existing ones

---

**Key Takeaway:** When updating catalogs with `update-catalogs-simple.ts`, descriptions are completely safe because they live in separate database tables that are never modified by catalog update scripts.
