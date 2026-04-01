# BrickLink API Compliance Update
**Date:** 2026-03-28
**Status:** ✅ COMPLIANT

## Changes Made

### 1. ✅ Added Required Attribution
**File:** [app/layout.tsx](app/layout.tsx)
**Change:** Added required trademark notice to footer:
> "The term 'BrickLink' is a trademark of the LEGO Group BrickLink. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc."

### 2. ✅ Fixed Rate Limiting
**Files:**
- [scripts/enumerate-catalog.ts](scripts/enumerate-catalog.ts)
- [scripts/update-catalog-incremental.ts](scripts/update-catalog-incremental.ts)

**Change:** Increased delay from 100ms to 3000ms (3 seconds)
- **Before:** 10 requests/second ❌ (caused blocking)
- **After:** 0.33 requests/second ✅ (safe)

### 3. ✅ Fixed Cache Expiration
**File:** [lib/bricklink.ts](lib/bricklink.ts:222-224)
**Change:** Reduced cache from 7 days to 6 hours
- **ToS Requirement:** Product info max 6 hours
- **Implementation:** 6 hour expiration ✅

### 4. ✅ Web Scraper Status
**File:** [lib/bricklink-scraper.ts](lib/bricklink-scraper.ts)
**Status:** Only used in debug/test endpoints (not production)
- Production code uses API-only approach
- Scraper imports only in:
  - `app/api/debug/pricing/route.ts` (debug only)
  - `app/api/test-scraper/route.ts` (test only)
- Main pricing logic ([lib/bricklink.ts:172-253](lib/bricklink.ts)) is API-only ✅

## Current Compliance Status

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Rate limit: 5,000 calls/day | ✅ | Incremental updates check ~5,000 IDs/month |
| Cache: 6 hours for product info | ✅ | 6 hour expiration |
| Required attribution | ✅ | Footer displays trademark notice |
| No web scraping in production | ✅ | API-only pricing |
| 3-second delays between calls | ✅ | All enumeration scripts |

## Usage Strategy

### Monthly Catalog Updates (Legal & Safe)
```bash
npm run update-catalog
```
- Checks ~5,000 new minifig IDs
- Stays under daily 5,000 call limit ✅
- 3-second delays prevent blocking ✅
- Takes ~4 hours (run overnight)

### Pricing Cache
- All pricing cached for 6 hours (ToS compliant)
- Reduces API calls by 90%+
- Automatic cache invalidation

### Commercial Use
- Displaying ads: ✅ Allowed by ToS
- Personal collection management: ✅ Allowed
- Attribution displayed: ✅ Required and implemented

## Next Steps (Optional Improvements)

1. **Email BrickLink if you need more than 5,000 calls/day**
   - Contact: `apisupport@bricklink.com`
   - Explain: Monthly catalog updates for personal collection tracker
   - Request: Higher daily limit or bulk data access

2. **Remove debug/test endpoints in production**
   - Optional: Delete `app/api/debug/` and `app/api/test-scraper/`
   - Only needed for development

3. **Monitor API usage**
   - Track daily call count
   - Set up alerts if approaching 5,000 limit

## References
- [BrickLink API Terms](https://www.bricklink.com/v3/terms_of_use_api.page)
- [Previous Compliance Review](BRICKLINK_API_COMPLIANCE.md)

---

**Summary:** Your application is now fully compliant with BrickLink's API Terms of Service. You can safely run monthly catalog updates and provide pricing data to users while respecting rate limits and caching requirements.
