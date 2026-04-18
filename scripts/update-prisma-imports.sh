#!/bin/bash

# Update imports to include prismaPublic
echo "Updating Prisma imports..."

# Files that need updating
files=(
  "lib/bricklink-catalog.ts"
  "lib/bricklink.ts"
  "lib/database-safeguards.ts"
  "lib/database.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."

    # Update import statements to include prismaPublic
    sed -i.bak "s/import { prisma } from '\.\/prisma'/import { prisma, prismaPublic } from '.\/prisma'/g" "$file"

    # Replace prisma.minifigCache with prismaPublic.minifigCache
    sed -i.bak 's/prisma\.minifigCache/prismaPublic.minifigCache/g' "$file"

    # Replace prisma.minifigCatalog with prismaPublic.minifigCatalog
    sed -i.bak 's/prisma\.minifigCatalog/prismaPublic.minifigCatalog/g' "$file"

    # Replace prisma.priceCache with prismaPublic.priceCache
    sed -i.bak 's/prisma\.priceCache/prismaPublic.priceCache/g' "$file"

    # Replace prisma.apiCallTracker with prismaPublic.apiCallTracker
    sed -i.bak 's/prisma\.apiCallTracker/prismaPublic.apiCallTracker/g' "$file"

    rm -f "$file.bak"
    echo "  ✅ Updated $file"
  fi
done

echo "✅ All files updated!"
