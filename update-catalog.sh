#!/bin/bash

# BrickLink Catalog Update Script
# Run this twice per month after downloading latest TXT files from BrickLink

echo "🚀 Starting BrickLink Catalog Update..."
echo ""

# Check if .env.catalog exists
if [ ! -f .env.catalog ]; then
    echo "❌ Error: .env.catalog not found"
    echo "Please create .env.catalog with your Hostinger FTP password"
    exit 1
fi

# Load FTP password from .env.catalog
export $(cat .env.catalog | grep -v '^#' | xargs)

# Check if password is set
if [ -z "$HOSTINGER_FTP_PASSWORD" ]; then
    echo "❌ Error: HOSTINGER_FTP_PASSWORD not set in .env.catalog"
    exit 1
fi

# Get current year and month
YEAR=$(date +%Y)
MONTH=$(date +%-m)  # Remove leading zero
CATALOG_PATH="$YEAR/$MONTH"

echo "📅 Using catalog path: $CATALOG_PATH"
echo ""

# Run the update script with the date path
npx tsx scripts/update-bricklink-catalog.ts "$CATALOG_PATH"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ Update complete!"
    echo "Verify at: https://figtracker.ericksu.com/catalog/metadata.json"
else
    echo ""
    echo "❌ Update failed with exit code $EXIT_CODE"
    exit $EXIT_CODE
fi
