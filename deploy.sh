#!/bin/bash

# FigTracker VPS Deployment Script
# Run this script after committing and pushing changes to GitHub

echo "🚀 Deploying FigTracker to VPS..."

ssh root@187.77.202.14 << 'ENDSSH'
  cd /var/www/figtracker

  echo "📥 Pulling latest changes from GitHub..."
  git pull

  echo "📦 Installing dependencies..."
  npm install

  echo "🔨 Building production bundle..."
  npm run build

  echo "♻️  Restarting application..."
  pm2 restart figtracker

  echo "✅ Deployment complete!"
  echo ""
  pm2 status
ENDSSH

echo ""
echo "✅ Deployment finished. Check status above."
