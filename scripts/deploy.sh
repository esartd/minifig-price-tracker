#!/bin/bash

# Deploy script - commits, pushes to GitHub, and deploys to VPS
# Usage: npm run deploy "Your commit message"

echo "🔄 Preparing for deployment..."

# 1. Check schema provider (should be MySQL for production)
echo "📋 Checking production schema..."
if grep -q 'provider = "mysql"' prisma/schema.prisma; then
  echo "✅ Schema is MySQL (production)"
else
  echo "⚠️  Warning: Schema is not MySQL"
  echo "   Current provider: $(grep 'provider =' prisma/schema.prisma)"
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

# 6. Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🚀 Now deploying to VPS..."
echo "   (You'll be prompted for the VPS password)"
echo ""

# 7. Deploy to VPS
ssh root@187.77.202.14 << 'ENDSSH'
  cd /var/www/figtracker

  echo "📥 Pulling latest changes from GitHub..."
  git pull

  echo "📦 Installing dependencies..."
  npm install

  echo "🗄️  Applying database migrations..."
  npx prisma migrate deploy

  echo "🔧 Regenerating Prisma Client..."
  npx prisma generate

  echo "🔨 Building production bundle..."
  npm run build

  echo "♻️  Restarting application..."
  pm2 restart figtracker

  echo "✅ Deployment complete!"
  echo ""
  pm2 status
ENDSSH

echo ""
echo "✅ Full deployment complete!"
