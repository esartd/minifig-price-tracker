#!/bin/bash
# One-time fix for deployment sync issue

ssh root@187.77.202.14 << 'ENDSSH'
  cd /var/www/figtracker

  echo "📥 Fetching latest from GitHub..."
  git fetch origin

  echo "🔄 Syncing with GitHub main branch..."
  git reset --hard origin/main

  echo "🔨 Building with latest code..."
  npm run build

  echo "♻️  Restarting application..."
  pm2 restart figtracker

  echo "✅ Deployment fixed!"
  echo ""
  git log --oneline | head -1
  pm2 status
ENDSSH
