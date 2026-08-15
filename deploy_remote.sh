#!/usr/bin/env bash
set -euo pipefail

ssh root@187.77.202.14 << 'ENDSSH'
cd /var/www/figtracker

# Pull latest code
git pull origin main

# Rebuild
npm install
npx prisma migrate deploy
npm run build

# Restart
pm2 restart figtracker

echo "✅ Deployment complete!"
ENDSSH
