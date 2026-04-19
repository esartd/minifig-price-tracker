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

# Run the update script
npx tsx scripts/update-bricklink-catalog.ts

echo ""
echo "✅ Update complete!"
echo "Verify at: https://figtracker.ericksu.com/catalog/metadata.json"
