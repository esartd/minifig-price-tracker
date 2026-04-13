# BrickLink API Compliance Review

**Date:** 2026-04-13  
**Status:** ✅ FULLY COMPLIANT - All Issues Resolved

---

## ✅ Compliance Summary

All previously identified issues have been resolved. This application is now fully compliant with BrickLink's API Terms of Service.

---

## Issue Resolutions

### 1. ✅ RATE LIMITING (Fixed: March 2026)

**Previous Issue:** API key was blocked after ~10,780 requests due to insufficient delays (100ms between requests).

**Solution Implemented:**
- ✅ 3-second minimum delay between all API requests
- ✅ Hard limit of 5,000 calls/day with automatic stopping
- ✅ Database tracking prevents accidental overages
- ✅ Exponential backoff for errors
- ✅ Request queuing system

**Current Usage:**
- Daily catalog updates: ~400 calls/day
- **8% of daily limit** - well within safe range
- Scripts automatically stop if approaching limit

**Documentation:** See [API_RATE_LIMITING.md](API_RATE_LIMITING.md) for full details.

---

### 2. ✅ WEB SCRAPING (Removed: April 2026)

**Previous Issue:** Application used Puppeteer to scrape BrickLink web pages alongside API calls, which potentially violated Terms of Service.

**Solution Implemented:**
- ✅ Deleted `lib/bricklink-scraper.ts`
- ✅ Deleted `scripts/scrape-bricklink-catalog.ts`
- ✅ Deleted `scripts/debug-sets-page.ts`
- ✅ Removed `app/api/test-scraper/` debug routes
- ✅ Removed `app/api/debug/pricing/` routes
- ✅ Removed Puppeteer dependency from package.json
- ✅ Removed Cheerio dependency from package.json
- ✅ Removed `scrape-catalog` npm script

**Result:** Application is now **100% API-only**. No web scraping, no stealth techniques, no ToS concerns.

---

### 3. ✅ BULK ENUMERATION (Optimized: March 2026)

**Previous Issue:** Brute-force checking of 10,000+ sequential IDs in short timeframe appeared excessive.

**Solution Implemented:**
- ✅ Incremental updates (check only recent ID ranges)
- ✅ Aggressive caching to avoid re-checking known items
- ✅ Spaced out over 24+ hours with 3-second delays
- ✅ Rate limiter prevents excessive requests
- ✅ Progress saving every 10 items

**Result:** Daily catalog updates stay well under the 5,000 call limit (uses ~400 calls).

---

### 4. ✅ ATTRIBUTION (Added: March 2026)

**Previous Issue:** No visible attribution in web UI.

**Solution Implemented:**
- ✅ Footer displays required BrickLink trademark notice
- ✅ Links back to Bricklink.com
- ✅ LEGO trademark acknowledgment
- ✅ Located at [app/layout.tsx:117-128](app/layout.tsx#L117-L128)

**Attribution Text:**
> "The term 'BrickLink' is a trademark of the LEGO Group BrickLink. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc."
> 
> "Minifigure data provided by [Bricklink.com](https://www.bricklink.com). LEGO® is a trademark of the LEGO Group."

---

### 5. ✅ COMMERCIAL USE (Verified: Compliant)

**Status:** This application qualifies as acceptable commercial use under BrickLink's terms.

**Compliance Points:**
- ✅ Personal collection management tool for legitimate sellers
- ✅ Uses official API access for inventory tracking
- ✅ Not reselling API access
- ✅ Not creating competing marketplace or checkout system
- ✅ Not caching excessively (follows data freshness rules)
- ✅ Attribution properly displayed
- ✅ Usage patterns within acceptable limits (8% of daily limit)
- ✅ 3-second delays between requests (exceeds 1-second minimum)

---

## Current API Usage Patterns

| Activity | API Calls | Daily Limit | Usage % |
|----------|-----------|-------------|---------|
| Daily catalog update | ~400 | 5,000 | 8% ✅ |
| User searches | 10-50 | 5,000 | <1% ✅ |
| Price refreshes | 20-40 | 5,000 | <1% ✅ |

**Monitoring:** Run `npm run check-api-usage` anytime to see current usage.

---

## Compliance Checklist (All Complete)

- [x] **Increase API delays to minimum 2-3 seconds** ✅
- [x] **Implement proper rate limiter class** ✅
- [x] **Add exponential backoff for errors** ✅
- [x] **Review web scraping - verify if allowed** ✅ (REMOVED entirely)
- [x] **Add robots.txt compliance check** ✅ (N/A - no scraping)
- [x] **Add visible attribution to UI** ✅
- [x] **Add BrickLink copyright notices** ✅
- [x] **Reduce bulk enumeration frequency** ✅
- [x] **Implement 24-hour cache for pricing data** ✅
- [x] **Review commercial use restrictions** ✅
- [x] **Document API usage patterns** ✅
- [x] **Add request logging/monitoring** ✅

---

## Key BrickLink API Terms (Verified Compliance)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| 5,000 calls/day max | ✅ | Hard limit enforced, currently 8% usage |
| Minimum delay between requests | ✅ | 3 seconds (exceeds 1-second minimum) |
| Attribution required | ✅ | Footer on all pages |
| No excessive caching | ✅ | 24-hour cache for pricing data |
| No web scraping | ✅ | All scraping removed |
| No database mirroring | ✅ | Incremental updates only |
| Commercial use allowed | ✅ | Personal seller inventory management |

---

## Maintenance

**Monthly Review:**
- Check API usage patterns remain under 50% of daily limit
- Verify attribution remains visible on all pages
- Confirm no new scraping functionality introduced
- Review any new API endpoint usage

**Resources:**
- [API_RATE_LIMITING.md](API_RATE_LIMITING.md) - Full rate limiting documentation
- `npm run check-api-usage` - Check current usage
- BrickLink API Support: apisupport@bricklink.com

---

**Last Updated:** April 13, 2026  
**Next Review:** May 13, 2026

---

**Remember:** BrickLink provides this API as a service to the community. Responsible usage ensures it remains available for everyone.
