#!/bin/bash

# Remove all "export const runtime = 'edge';" lines from TypeScript files
find app -name "*.ts" -o -name "*.tsx" | while read file; do
  # Remove the edge runtime export and the blank lines around it
  sed -i '' '/^export const runtime = .edge.;$/d' "$file"
  sed -i '' '/^$/N;/^\n$/d' "$file"
done

echo "✅ Removed edge runtime from all files"
