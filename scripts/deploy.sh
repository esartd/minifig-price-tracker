#!/bin/bash

# Deploy script - automatically restores production schema and pushes
# Usage: npm run deploy "Your commit message"

echo "🔄 Preparing for deployment..."

# 1. Restore production PostgreSQL schema
echo "📋 Restoring production schema..."
git restore prisma/schema.prisma

# 2. Check if schema was restored successfully
if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
  echo "✅ Schema restored to PostgreSQL"
else
  echo "❌ Failed to restore schema!"
  exit 1
fi

# 3. Stage all changes
echo "📦 Staging changes..."
git add .

# 4. Test build locally before pushing
echo "🏗️  Testing build locally..."
npm run build || {
  echo ""
  echo "❌ Build failed! Fix errors before deploying."
  echo "   Restoring working tree..."
  git restore --staged .
  exit 1
}
echo "✅ Build successful"

# 5. Commit with message (use argument or prompt)
if [ -z "$1" ]; then
  echo ""
  read -p "💬 Commit message: " COMMIT_MSG
else
  COMMIT_MSG="$1"
fi

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG" || {
  echo "⚠️  Nothing to commit or commit failed"
  exit 1
}

# 6. Push to main (pre-push hook will validate)
echo "🚀 Pushing to main..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Vercel will build with production schema"
