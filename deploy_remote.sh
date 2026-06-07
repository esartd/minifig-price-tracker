#!/usr/bin/env bash
set -euo pipefail

ssh root@137.184.34.143 << 'ENDSSH'
cd /root/minifig-price-tracker

# Add Turnstile keys
echo 'NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAADgCKY-yTw_0o4H-"' >> .env.production
echo 'TURNSTILE_SECRET_KEY="0x4AAAAAADgCKWV98cJB_fV5y1sOZMm4i0Y"' >> .env.production

# Pull latest code
git pull origin main

# Rebuild
npm install
npm run build

# Restart
pm2 restart figtracker

echo "✅ Deployment complete!"
ENDSSH
