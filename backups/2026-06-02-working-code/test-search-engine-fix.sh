#!/bin/bash

# Test script to verify search engine bots are allowed while scrapers are blocked
# Created: 2026-06-01
# Purpose: Verify fix for Google Search Console indexing issues

echo "🧪 Testing Bot Protection Fix"
echo "================================"
echo ""

TEST_URL="https://pl.figtracker.ericksu.com/minifigs/col068"

echo "Testing URL: $TEST_URL"
echo ""

# Test 1: Googlebot (SHOULD BE ALLOWED)
echo "1. Testing Googlebot (should return 200)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "$TEST_URL")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS - Googlebot allowed (200)"
else
    echo "   ❌ FAIL - Googlebot blocked ($RESPONSE)"
fi
echo ""

# Test 2: Bingbot (SHOULD BE ALLOWED)
echo "2. Testing Bingbot (should return 200)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "$TEST_URL")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS - Bingbot allowed (200)"
else
    echo "   ❌ FAIL - Bingbot blocked ($RESPONSE)"
fi
echo ""

# Test 3: DuckDuckBot (SHOULD BE ALLOWED)
echo "3. Testing DuckDuckBot (should return 200)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)" "$TEST_URL")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS - DuckDuckBot allowed (200)"
else
    echo "   ❌ FAIL - DuckDuckBot blocked ($RESPONSE)"
fi
echo ""

# Test 4: Regular browser (SHOULD BE ALLOWED)
echo "4. Testing regular browser (should return 200)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$TEST_URL")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS - Browser allowed (200)"
else
    echo "   ❌ FAIL - Browser blocked ($RESPONSE)"
fi
echo ""

# Test 5: Python scraper (SHOULD BE BLOCKED)
echo "5. Testing python-requests (should return 403)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "python-requests/2.28.0" "$TEST_URL")
if [ "$RESPONSE" = "403" ]; then
    echo "   ✅ PASS - Python scraper blocked (403)"
else
    echo "   ❌ FAIL - Python scraper allowed ($RESPONSE)"
fi
echo ""

# Test 6: Curl (SHOULD BE BLOCKED)
echo "6. Testing curl default (should return 403)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL")
if [ "$RESPONSE" = "403" ]; then
    echo "   ✅ PASS - Curl blocked (403)"
else
    echo "   ❌ FAIL - Curl allowed ($RESPONSE)"
fi
echo ""

# Test 7: Scrapy (SHOULD BE BLOCKED)
echo "7. Testing Scrapy (should return 403)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "Scrapy/2.7.1 (+https://scrapy.org)" "$TEST_URL")
if [ "$RESPONSE" = "403" ]; then
    echo "   ✅ PASS - Scrapy blocked (403)"
else
    echo "   ❌ FAIL - Scrapy allowed ($RESPONSE)"
fi
echo ""

# Test 8: Headless Chrome (SHOULD BE BLOCKED)
echo "8. Testing Headless Chrome (should return 403)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.114 Safari/537.36" "$TEST_URL")
if [ "$RESPONSE" = "403" ]; then
    echo "   ✅ PASS - Headless Chrome blocked (403)"
else
    echo "   ❌ FAIL - Headless Chrome allowed ($RESPONSE)"
fi
echo ""

echo "================================"
echo "✅ Test Complete"
echo ""
echo "Expected results:"
echo "  - Search engines (Google, Bing, DuckDuckGo): Allowed (200)"
echo "  - Regular browsers: Allowed (200)"
echo "  - Scrapers (Python, Curl, Scrapy, Headless): Blocked (403)"
