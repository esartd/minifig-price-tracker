#!/bin/bash

# COMPLETE BRICKLINK CATALOG UPDATE
# Downloads TXT files → Converts to JSON → Uploads to Hostinger
# Run this twice per month (1st and 15th)

echo "🚀 COMPLETE BRICKLINK CATALOG UPDATE"
echo "====================================="
echo ""

# Check if .env.catalog exists
if [ ! -f .env.catalog ]; then
    echo "❌ Error: .env.catalog not found"
    echo "Run this first: nano .env.catalog"
    exit 1
fi

# Load FTP password
export $(cat .env.catalog | grep -v '^#' | xargs)

if [ -z "$HOSTINGER_FTP_PASSWORD" ]; then
    echo "❌ Error: HOSTINGER_FTP_PASSWORD not set"
    exit 1
fi

# Get current date
YEAR=$(date +%Y)
MONTH=$(date +%-m)
CATALOG_PATH="$YEAR/$MONTH"

echo "📅 Catalog date: $CATALOG_PATH"
echo ""

# Step 1: Download catalog files from BrickLink
echo "Step 1: Downloading catalog files from BrickLink"
echo "================================================"
echo ""
npx tsx scripts/download-bricklink-catalogs.ts "$CATALOG_PATH"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Download failed"
    exit 1
fi

echo ""
echo "✅ Downloads complete"
echo ""
read -p "Press Enter to continue with conversion and upload..."
echo ""

# Step 2: Convert TXT to JSON and upload to Hostinger
echo "Step 2: Converting to JSON and uploading to Hostinger"
echo "====================================================="
echo ""
npx tsx scripts/update-bricklink-catalog.ts "$CATALOG_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ CATALOG UPDATE COMPLETE!"
    echo ""
    echo "Verify at: https://figtracker.ericksu.com/catalog/metadata.json"
else
    echo ""
    echo "❌ Update failed"
    exit 1
fi
