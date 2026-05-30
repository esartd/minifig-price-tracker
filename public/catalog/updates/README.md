# Catalog Update Files

Place downloaded BrickLink catalog files here:

## Required Files

1. **Minifigures.txt**
   - Download from: https://www.bricklink.com/catalogDownload.asp
   - Select: "Minifigures" from the dropdown
   - Click download

2. **Sets.txt**
   - Download from: https://www.bricklink.com/catalogDownload.asp
   - Select: "Sets" from the dropdown
   - Click download

## Usage

After placing the files here, run:

```bash
npm run update-catalog
```

The script will:
- Convert TXT files to JSON
- Detect item number changes
- Migrate database automatically
- Update `public/catalog/minifigs.json` and `public/catalog/sets.json`

## Notes

- You need to be logged into BrickLink to download catalogs
- Files are tab-separated (TSV format)
- After running the script, commit and push the updated JSON files
- These TXT files are not tracked by git (safe to leave here)
