# Data Terminology Guide

## Important: "Categories" vs "Themes"

### BrickLink Data Files
BrickLink's official terminology uses **"Category"**:
- Column: `Category ID`
- Column: `Category Name`
- Examples: "Star Wars", "Harry Potter", "City"

### Database Schema
Database columns match BrickLink's naming for consistency:
- `category_id` (integer)
- `category_name` (string)

**⚠️ DO NOT rename these columns to "theme" - keep them as "category" to match BrickLink!**

### Application UI
The app displays these as **"Themes"** for better user experience:
- URL: `/themes` (not `/categories`)
- Navigation: "Themes" menu item
- Page titles: "Browse by Theme"

## Why This Matters

When importing new BrickLink catalog files:
1. ✅ Keep database field names as `category_id` and `category_name`
2. ✅ The import script (`scripts/import-catalog.ts`) handles this correctly
3. ✅ The UI automatically displays "categories" as "themes"

## Data Flow

```
BrickLink File          Database                 App UI
─────────────────────   ──────────────────────   ────────────────
Category ID       →     category_id        →     Theme
Category Name     →     category_name      →     Theme Name
"Star Wars"       →     "Star Wars"        →     "Star Wars" (at /themes/Star Wars)
```

## API Endpoints

The API still uses "categories" internally:
- `/api/categories` - Returns theme data (groupBy category_name)
- `/api/subcategories` - Returns subcategories within a theme

This is fine - the internal naming doesn't affect SEO or user experience.

## When Updating Catalog Data

1. Download new `Minifigures.txt` from BrickLink
2. Run `npx tsx scripts/import-catalog.ts`
3. Script will import "Category" columns into `category_*` database fields
4. UI will automatically display them as "Themes"
5. No code changes needed!

## Summary

| Layer | Terminology | Example |
|-------|-------------|---------|
| BrickLink Files | "Category" | Category Name: "Star Wars" |
| Database | `category_name` | category_name: "Star Wars" |
| App UI | "Theme" | Browse Themes → Star Wars |
| URLs | `/themes` | /themes/Star Wars |
