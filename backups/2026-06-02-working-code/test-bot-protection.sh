#!/bin/bash

# Test Bot Protection System
# Run this after starting your dev server: npm run dev

echo "🧪 Testing Bot Protection System"
echo "================================"
echo ""

# Get the server URL (default to localhost:3000)
SERVER="${1:-http://localhost:3000}"

echo "Testing against: $SERVER"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Normal browser (should work - 200)
echo "📱 TEST 1: Normal Browser"
echo "   User-Agent: Chrome/Safari"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36" \
  "$SERVER/")

if [ "$STATUS" = "200" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (allowed)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 200)"
fi
echo ""

# Test 2: Python scraper (should block - 403)
echo "🐍 TEST 2: Python Requests Scraper"
echo "   User-Agent: python-requests/2.31.0"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "python-requests/2.31.0" \
  "$SERVER/")

if [ "$STATUS" = "403" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (blocked)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 403)"
fi
echo ""

# Test 3: Headless browser (should block - 403)
echo "🤖 TEST 3: Headless Chrome"
echo "   User-Agent: HeadlessChrome"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "HeadlessChrome/125.0.6422.60" \
  "$SERVER/")

if [ "$STATUS" = "403" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (blocked)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 403)"
fi
echo ""

# Test 4: Generic curl (should block - 403)
echo "🌐 TEST 4: Generic curl"
echo "   User-Agent: curl/8.5.0"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$SERVER/")

if [ "$STATUS" = "403" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (blocked)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 403)"
fi
echo ""

# Test 5: Axios (should block - 403)
echo "📦 TEST 5: Axios HTTP Client"
echo "   User-Agent: axios/1.6.8"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "axios/1.6.8" \
  "$SERVER/")

if [ "$STATUS" = "403" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (blocked)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 403)"
fi
echo ""

# Test 6: Selenium (should block - 403)
echo "🔧 TEST 6: Selenium WebDriver"
echo "   User-Agent: selenium"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "selenium" \
  "$SERVER/")

if [ "$STATUS" = "403" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (blocked)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 403)"
fi
echo ""

# Test 7: Scrapy (should block - 403)
echo "🕷️  TEST 7: Scrapy Framework"
echo "   User-Agent: Scrapy/2.11.0"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "Scrapy/2.11.0" \
  "$SERVER/")

if [ "$STATUS" = "403" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (blocked)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 403)"
fi
echo ""

# Test 8: Mobile Safari (should work - 200)
echo "📱 TEST 8: Mobile Safari (iPhone)"
echo "   User-Agent: iPhone Safari"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" \
  "$SERVER/")

if [ "$STATUS" = "200" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (allowed)"
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 200)"
fi
echo ""

# Test 9: robots.txt accessibility
echo "🤖 TEST 9: robots.txt File"
echo "   Path: /robots.txt"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -A "Mozilla/5.0 (compatible; Googlebot/2.1)" \
  "$SERVER/robots.txt")

if [ "$STATUS" = "200" ]; then
  echo -e "   ${GREEN}✅ PASS${NC} - HTTP $STATUS (accessible)"

  # Check if it contains our block rules
  CONTENT=$(curl -s \
    -A "Mozilla/5.0 (compatible; Googlebot/2.1)" \
    "$SERVER/robots.txt")
  if echo "$CONTENT" | grep -q "ClaudeBot"; then
    echo -e "   ${GREEN}✅${NC} Contains ClaudeBot block"
  else
    echo -e "   ${YELLOW}⚠️${NC}  Missing ClaudeBot block"
  fi

  if echo "$CONTENT" | grep -q "Google-Extended"; then
    echo -e "   ${GREEN}✅${NC} Contains Google-Extended block"
  else
    echo -e "   ${YELLOW}⚠️${NC}  Missing Google-Extended block"
  fi
else
  echo -e "   ${RED}❌ FAIL${NC} - HTTP $STATUS (should be 200)"
fi
echo ""

echo "================================"
echo "🏁 Testing Complete"
