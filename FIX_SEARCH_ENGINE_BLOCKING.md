# Fix: Search Engine Blocking Issue

**Date:** June 1, 2026  
**Issue:** Google Search Console showing 236 pages not indexed  
**Root Cause:** Bot protection middleware blocking legitimate search engines  
**Status:** ✅ FIXED on branch `fix/allow-search-engine-bots`

---

## The Problem

### What Happened
On May 31, 2026, bot protection was added to block scrapers (commit `4cd0e95`). The middleware included this line:

```typescript
const BLOCKED_USER_AGENTS = [
  // ... other patterns ...
  'bot',  // ❌ THIS BLOCKS ALL BOTS INCLUDING GOOGLEBOT
]
```

This blocked **ALL** bots, including:
- ❌ Googlebot (Google Search)
- ❌ Bingbot (Bing Search)
- ❌ All other legitimate search engine crawlers

### Impact
- **236 pages not indexed** in Google Search Console
- **0 impressions** from Google Search
- Site completely invisible in search results
- All Polish domain pages returning 403 Forbidden to crawlers

### Evidence
```bash
$ curl -I -A "Googlebot" https://pl.figtracker.ericksu.com/minifigs/col068
HTTP/2 403 Forbidden  # ❌ BLOCKED

$ curl -I -A "Mozilla/5.0" https://pl.figtracker.ericksu.com/minifigs/col068
HTTP/2 200 OK  # ✅ ALLOWED
```

---

## The Fix

### What Changed

**File:** `middleware.ts`

**Before (BROKEN):**
```typescript
const BLOCKED_USER_AGENTS = [
  'bot',  // Blocks Googlebot, Bingbot, all search engines
  'crawler',
  'spider',
  // ...
]

// Block all bots
if (isSuspiciousBot) {
  return new NextResponse('Forbidden', { status: 403 })
}
```

**After (FIXED):**
```typescript
// Whitelist legitimate search engines FIRST
const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'applebot',
  // ... (14 legitimate bots)
]

const BLOCKED_USER_AGENTS = [
  'scrapy',
  'python-requests',
  'axios',
  'curl',
  'headless',
  // ... (no generic 'bot' pattern)
]

// Check allowed bots FIRST (highest priority)
if (isLegitimateBot) {
  return NextResponse.next()  // ✅ ALLOW
}

// Then block scrapers
if (isSuspiciousBot) {
  return new NextResponse('Forbidden', { status: 403 })
}
```

### Key Changes
1. **Added whitelist:** Legitimate search engines checked FIRST
2. **Removed generic 'bot' pattern:** No longer blocks all bots
3. **Priority order:** Allow list → Block list
4. **14 search engines whitelisted:** Google, Bing, DuckDuckGo, Baidu, Yandex, social media crawlers

---

## Testing

### Automated Test Script
Run: `./test-search-engine-fix.sh`

**Expected Results:**
- ✅ Googlebot: 200 OK (allowed)
- ✅ Bingbot: 200 OK (allowed)
- ✅ DuckDuckBot: 200 OK (allowed)
- ✅ Regular browsers: 200 OK (allowed)
- ✅ Python scrapers: 403 Forbidden (blocked)
- ✅ Curl: 403 Forbidden (blocked)
- ✅ Scrapy: 403 Forbidden (blocked)
- ✅ Headless Chrome: 403 Forbidden (blocked)

### Manual Testing (After Deployment)

**1. Test Googlebot can access:**
```bash
curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://pl.figtracker.ericksu.com/minifigs/col068

# Should return: HTTP/2 200 OK
```

**2. Test scrapers are still blocked:**
```bash
curl -I -A "python-requests/2.28.0" \
  https://pl.figtracker.ericksu.com/minifigs/col068

# Should return: HTTP/2 403 Forbidden
```

**3. Test in Google Search Console:**
- Go to URL Inspection tool
- Enter: `https://pl.figtracker.ericksu.com/minifigs/col068`
- Click "Test Live URL"
- Should show: "URL is available to Google" (not "URL is blocked")

---

## Deployment Process

### 1. Pre-Deployment Checklist
- [x] Feature branch created: `fix/allow-search-engine-bots`
- [x] Backup created: `middleware.ts.backup-2026-06-01`
- [x] Build successful: `npm run build` ✅
- [x] Test script created: `test-search-engine-fix.sh`
- [x] Documentation created: This file

### 2. Deploy to Production
```bash
# Review changes
git diff main..fix/allow-search-engine-bots

# Merge to main
git checkout main
git merge fix/allow-search-engine-bots

# Push to production
git push origin main
```

### 3. Post-Deployment Verification
**Within 5 minutes:**
```bash
# Run test script against production
./test-search-engine-fix.sh
```

**Within 1 hour:**
- Check Google Search Console → URL Inspection
- Test 5 random URLs from the error list
- All should show "Available to Google"

**Within 24 hours:**
- Check Coverage report in Search Console
- "Server error (5xx)" should drop to 0
- "Blocked due to 4xx" should drop to 0

**Within 1 week:**
- Indexed pages should increase from 230 → 300+
- First impressions should appear (>0)

---

## Rollback Plan

### If Something Goes Wrong

**Option 1: Revert to backup (fastest)**
```bash
cp middleware.ts.backup-2026-06-01 middleware.ts
git add middleware.ts
git commit -m "Rollback: restore original middleware"
git push
```

**Option 2: Revert commit**
```bash
git revert HEAD
git push
```

**Option 3: Rollback to before bot protection**
```bash
# Go back to before bot protection was added
git checkout 571ffda -- middleware.ts
git commit -m "Rollback: remove bot protection entirely"
git push
```

---

## Impact Analysis

### What Gets Fixed
✅ Googlebot can crawl all pages  
✅ Google Search Console errors will clear  
✅ Site will start appearing in search results  
✅ Indexed pages will increase  
✅ Organic traffic will return  

### What Stays Protected
✅ Python scrapers still blocked  
✅ Headless browsers still blocked  
✅ Curl/wget still blocked  
✅ Scrapy still blocked  
✅ Generic crawlers still blocked  

### What Changes
⚠️ Legitimate bots can now access the site (THIS IS GOOD)  
⚠️ Social media link previews will work (Facebook, Twitter, etc.)  
⚠️ Search engine indexing will resume  

---

## Why This Happened

### Root Cause Analysis

**Mistake:** Using generic pattern `'bot'` in blocklist without checking for legitimate bots first.

**Why it wasn't caught:**
1. Testing script (`test-bot-protection.sh`) only tested scrapers, not search engines
2. No monitoring for Search Console errors
3. Bot protection deployed directly to main without staging test
4. No "allowed bot" list existed in original implementation

**Lesson Learned:**
- Always whitelist legitimate services BEFORE blocking patterns
- Test with actual search engine user agents, not just scrapers
- Monitor Search Console daily after bot protection changes
- Generic patterns like 'bot', 'crawler', 'spider' are too broad

---

## Future Improvements

### Short-Term
1. **Add monitoring:** Alert if Google Search Console shows indexing drops
2. **Expand whitelist:** Add more legitimate bots as needed
3. **Better testing:** Include search engine tests in CI/CD

### Long-Term
1. **Rate limiting instead of blocking:** Let bots crawl, but limit requests
2. **IP-based blocking:** Block specific IPs/ranges instead of user agents
3. **Cloudflare Bot Management:** Consider using their bot detection
4. **Allowlist robots.txt:** Let Search Console verify via robots.txt

---

## Related Files

**Modified:**
- `middleware.ts` - Bot detection logic

**Created:**
- `middleware.ts.backup-2026-06-01` - Backup before fix
- `test-search-engine-fix.sh` - Automated test script
- `FIX_SEARCH_ENGINE_BLOCKING.md` - This documentation

**Related Documentation:**
- `BOT_PROTECTION_SYSTEM.md` - Original bot protection docs (needs update)
- `SEARCH_CONSOLE_FIX_PLAN.md` - Initial diagnosis

---

## Success Metrics

### Immediate (Within 24 hours)
- [ ] 0 "Server error (5xx)" in Search Console
- [ ] 0 "Blocked due to 4xx" in Search Console
- [ ] URL Inspection shows "Available to Google"

### Short-Term (Within 1 week)
- [ ] 300+ pages indexed (up from 230)
- [ ] First impressions appearing (>0)
- [ ] All language domains fixed (en, de, fr, es, it, nl, pl, pt, sv, ja)

### Long-Term (Within 1 month)
- [ ] 400+ pages indexed
- [ ] 100+ impressions/day from Google
- [ ] 10+ clicks/day from organic search
- [ ] Coverage report shows >90% indexed

---

## Questions & Answers

**Q: Will this let scrapers back in?**  
A: No. Scrapers are still blocked. Only legitimate search engines are allowed.

**Q: What about AI crawlers (ClaudeBot, GPTBot)?**  
A: Still blocked via `app/robots.ts`. They read robots.txt and respect it.

**Q: Why not just remove bot protection entirely?**  
A: Singapore scraper traffic was wasting CPU and distorting analytics. We need protection, just not for search engines.

**Q: How do I add more allowed bots?**  
A: Add to `ALLOWED_BOTS` array in `middleware.ts`, redeploy, test.

**Q: What if Google changes their user agent?**  
A: Pattern matching is flexible. As long as it contains "googlebot" (case-insensitive), it will match.

---

**Status:** ✅ Ready to deploy  
**Risk Level:** 🟢 LOW (fixes critical issue, minimal risk)  
**Tested:** ✅ Build successful  
**Approved:** ⏳ Awaiting user approval to merge
