#!/bin/bash

# Bot Traffic Monitoring Script
# Purpose: Monitor effectiveness of enhanced bot protection
# Run daily to track bot reduction

echo "==================================="
echo "FigTracker Bot Traffic Monitor"
echo "Date: $(date)"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server details
SERVER="root@187.77.202.14"
LOG_FILE="/root/.pm2/logs/figtracker-out.log"

echo "📊 Bot Blocking Summary (Last 24 Hours)"
echo "---------------------------------------"

# Count different types of blocks
echo -n "🚫 ASN Blocks (Tencent Cloud, etc.): "
ssh $SERVER "grep -E '\[🚫 ASN BLOCKED\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null

echo -n "🚫 Tencent Cloud IP Range Blocks: "
ssh $SERVER "grep -E '\[🚫 TENCENT CLOUD BLOCKED\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null

echo -n "🚫 Historical Bot Blocks: "
ssh $SERVER "grep -E '\[🚫 HISTORICAL BOT\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null

echo -n "🤖 Smart Auto-Blocked: "
ssh $SERVER "grep -E '\[🤖 AUTO-BLOCKED\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null

echo -n "🛡️  CAPTCHA Challenges: "
ssh $SERVER "grep -E '\[🛡️  CAPTCHA REQUIRED\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null

echo ""
echo "🌍 High-Risk Country Traffic (Last 24 Hours)"
echo "---------------------------------------------"

# Count traffic from high-risk countries
for country in BD PK AR HK VN SG CN RU; do
  count=$(ssh $SERVER "grep -E 'Country: $country' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null)
  if [ "$count" -gt 0 ]; then
    echo -n "   $country: $count requests "

    # Check if most are blocked or challenged
    blocked=$(ssh $SERVER "grep -E 'Country: $country' $LOG_FILE | grep -E '(BLOCKED|CAPTCHA REQUIRED)' | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null)

    if [ "$blocked" -gt 0 ]; then
      percentage=$((blocked * 100 / count))
      echo -e "${GREEN}($blocked blocked - $percentage%)${NC}"
    else
      echo -e "${RED}(0 blocked - Check Cloudflare WAF!)${NC}"
    fi
  fi
done

echo ""
echo "⚠️  High Bot Scores (Suspicious but not blocked yet)"
echo "----------------------------------------------------"
ssh $SERVER "grep -E '\[⚠️  HIGH BOT SCORE\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | tail -10" 2>/dev/null

echo ""
echo "🔍 Recent Auto-Blocked IPs (Last 10)"
echo "------------------------------------"
ssh $SERVER "grep -E '\[🤖 AUTO-BLOCKED\]' $LOG_FILE | tail -10 | awk '{print \$3, \$5, \$7, \$9}'" 2>/dev/null

echo ""
echo "📈 Rate Limiting Activity"
echo "-------------------------"
echo -n "Rate limited requests (429): "
ssh $SERVER "grep -E '\[⚠️  RATE LIMITED\]' $LOG_FILE | grep -E '$(date -d '24 hours ago' '+%Y-%m-%d')' | wc -l" 2>/dev/null

echo ""
echo "==================================="
echo "Next Steps:"
echo "==================================="
echo "1. Check Cloudflare Analytics: https://dash.cloudflare.com"
echo "   → Security > Events (should show Managed Challenges)"
echo ""
echo "2. Check Google Analytics: https://analytics.google.com"
echo "   → Audience > Geo > Location (verify bot countries dropped)"
echo ""
echo "3. If seeing many HIGH BOT SCORE warnings, lower threshold further"
echo "   → Edit lib/smart-bot-detector.ts: BOT_THRESHOLD from 40 to 30"
echo ""
echo "4. Run this script daily to track improvement"
echo "   → Add to cron: 0 9 * * * /path/to/monitor-bot-traffic.sh"
echo "==================================="
