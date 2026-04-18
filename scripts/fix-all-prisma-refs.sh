#!/bin/bash

echo "Fixing all Prisma references in app directory..."

# Find all files in app that use catalog/cache tables
files=$(find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "prisma\.minifigCatalog\|prisma\.priceCache\|prisma\.minifigCache\|prisma\.apiCallTracker" {} \;)

for file in $files; do
  echo "Processing $file..."

  # Update import to include prismaPublic if it imports prisma
  if grep -q "import { prisma } from '@/lib/prisma'" "$file"; then
    sed -i.bak "s/import { prisma } from '@\/lib\/prisma'/import { prisma, prismaPublic } from '@\/lib\/prisma'/g" "$file"
  fi

  # Replace public table references
  sed -i.bak 's/prisma\.minifigCatalog/prismaPublic.minifigCatalog/g' "$file"
  sed -i.bak 's/prisma\.priceCache/prismaPublic.priceCache/g' "$file"
  sed -i.bak 's/prisma\.minifigCache/prismaPublic.minifigCache/g' "$file"
  sed -i.bak 's/prisma\.apiCallTracker/prismaPublic.apiCallTracker/g' "$file"

  rm -f "$file.bak"
  echo "  ✅ Fixed $file"
done

echo "✅ All files updated!"
