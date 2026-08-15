#!/bin/bash

# FigTracker VPS Deployment Script
# Run this script after committing and pushing changes to GitHub
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting FigTracker deployment..."
echo ""

# Check if we're on main branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're on branch '$BRANCH', not 'main'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Check if we're up to date with remote
echo "🔍 Checking remote status..."
git fetch origin main --quiet
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL != $REMOTE ]; then
    echo "⚠️  Warning: Your local branch is not in sync with remote"
    echo "   Run 'git pull' first or push your changes"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Deploy to VPS
echo ""
echo "🔧 Deploying to production VPS (187.77.202.14)..."
echo ""

ssh root@187.77.202.14 << 'ENDSSH'
set -e
cd /var/www/figtracker

echo "📥 Pulling latest code from GitHub..."
git pull

echo "📦 Installing dependencies..."
npm install --production

echo "🗄️  Applying database migrations..."
npx prisma migrate deploy

echo "🔨 Building application (this may take 1-2 minutes)..."
npm run build

echo "♻️  Restarting PM2..."
pm2 restart figtracker

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 PM2 Status:"
pm2 status
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Production deployment successful!"
echo "🌐 Site: https://figtracker.ericksu.com"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
