#!/bin/bash

# Add Google OAuth credentials to VPS
# This script adds the environment variables to your production .env file

echo "🔐 Adding Google OAuth credentials to VPS..."
echo ""

ssh root@187.77.202.14 << 'ENDSSH'
  cd /var/www/figtracker

  echo "📝 Backing up current .env file..."
  cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

  echo "✏️  Adding Google OAuth credentials..."

  # Check if credentials already exist
  if grep -q "GOOGLE_CLIENT_ID" .env; then
    echo "⚠️  Google OAuth credentials already exist in .env"
    echo "   Current values:"
    grep "GOOGLE_CLIENT" .env
    echo ""
    read -p "   Replace them? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "❌ Cancelled"
      exit 1
    fi

    # Remove existing credentials
    sed -i '/GOOGLE_CLIENT_ID/d' .env
    sed -i '/GOOGLE_CLIENT_SECRET/d' .env
  fi

  # Add new credentials
  echo "" >> .env
  echo "# Google OAuth (Added $(date +%Y-%m-%d))" >> .env
  echo 'GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE"' >> .env
  echo 'GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"' >> .env

  echo "✅ Google OAuth credentials added!"
  echo ""
  echo "📋 Verifying .env file..."
  grep "GOOGLE_CLIENT" .env
  echo ""

  echo "♻️  Restarting application..."
  pm2 restart figtracker

  echo ""
  echo "✅ Complete! Google OAuth is now configured."
  echo ""
  pm2 status
ENDSSH

echo ""
echo "✅ Google OAuth credentials successfully added to production VPS!"
echo ""
echo "🔍 Next steps:"
echo "   1. Test Google sign-in on https://figtracker.ericksu.com/auth/signin"
echo "   2. Test on language subdomains (de, fr, es, etc.)"
echo "   3. Monitor logs: ssh root@187.77.202.14 'pm2 logs figtracker'"
