# BrickLink API Terms Compliance Summary

**Last Reviewed:** April 13, 2026  
**Status:** ✅ FULLY COMPLIANT

---

## Compliance Checklist

### ✅ Section 1: API Licensed Uses and Restrictions

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Respect rate limits (5,000 calls/day) | ✅ | Hard limit enforced, 3-second delays between calls |
| Product info max 6 hours old | ✅ | All pricing caches expire after 6 hours, cron refreshes every 6 hours |
| Non-product content max 24 hours old | ✅ | N/A - we don't cache non-pricing content |
| No checkout bypass/replacement | ✅ | App helps sellers create listings for OTHER platforms (Facebook/eBay), not replacing BrickLink |
| No excessive/abusive usage | ✅ | Rate limiter prevents overuse |

### ✅ Section 2: Attribution

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Display required trademark notice | ✅ | Footer displays: "The term 'BrickLink' is a trademark of the LEGO Group BrickLink..." |
| Visible email for support | ✅ | Contact form on About page |
| Terms of service | ✅ | Standard web app ToS |
| Privacy policy | ✅ | Standard privacy policy |

### ✅ Section 3: Registration Data

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Accurate registration info | ✅ | API key registered to legitimate seller account |
| Secure credentials | ✅ | Keys stored in environment variables, never committed to git |
| Report security issues | ✅ | Would report to apisupport@bricklink.com |

### ✅ Section 4: Commercial Use

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Reasonable commercial use | ✅ | Free tool for inventory management, no API reselling |
| Not charging for BrickLink features | ✅ | App is free, no subscription fees |
| Not driving traffic away from BrickLink | ✅ | Helps sellers list ON BrickLink (and Facebook/eBay) |

### ✅ Section 9: Website Policies

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| No web scraping/robots | ✅ | All scraping removed (Puppeteer/Cheerio deleted) |
| No reverse engineering | ✅ | Only using official public API |
| No internal/legacy APIs | ✅ | Only using documented endpoints |

---

## Key Metrics

### API Usage (Current)
- Daily limit: **5,000 calls/day**
- Typical usage: **800-2,400 calls/day** (16-48% of limit)
- Buffer: **2,600-4,200 calls/day** remaining for growth

### Pricing Cache Compliance
- **Cache TTL:** 6 hours (compliant with "max 6 hours old" rule)
- **Refresh frequency:** Every 6 hours via Vercel Cron
- **Refresh priority:** High-value items first, then medium, then low

### Capacity Limits
- **100 unique minifigs:** 800 calls/day (16% of limit) ✅
- **500 unique minifigs:** 2,400 calls/day (48% of limit) ✅
- **1,150 unique minifigs:** 4,600 calls/day (92% of limit) ⚠️ Near max
- **Maximum supported:** ~1,150 unique minifigs across all users

---

## What This App Does (Compliance Perspective)

### User Flow
1. **Search minifigures** - Uses local catalog (7,798 items) for instant search, falls back to API only for exact IDs not in catalog
2. **Add to inventory** - Fetches fresh pricing from BrickLink API (cached 6 hours)
3. **View suggested price** - Shows cached pricing (always <6 hours old per Terms)
4. **Generate listing** - Creates marketplace listing text using template system (NO API calls)
5. **Copy listing** - User pastes to Facebook/eBay/BrickLink manually

### No Violations
- ❌ NOT creating a competing marketplace
- ❌ NOT bypassing BrickLink checkout
- ❌ NOT replacing BrickLink's essential UX
- ❌ NOT scraping BrickLink web pages
- ❌ NOT storing user passwords or personal data
- ❌ NOT exceeding rate limits
- ❌ NOT showing stale pricing (all <6 hours old)

---

## Future Considerations

### If User Base Grows Beyond 1,150 Unique Minifigs
1. **Option 1:** Contact BrickLink API support to request higher rate limit
   - Email: apisupport@bricklink.com
   - Provide: Usage metrics, rate limiter implementation proof
   - Request: 10,000-20,000 calls/day

2. **Option 2:** Implement user-based prioritization
   - Active users get 6-hour refresh
   - Inactive users (>30 days) get 24-hour refresh for "other content" (allowed per Terms)
   - Pricing still refreshed before display (6-hour rule)

3. **Option 3:** Premium tier for high-volume users
   - Free tier: Basic inventory (<50 items)
   - Paid tier: Unlimited inventory + faster refresh

---

## Monitoring & Compliance

### Daily Checks
- [x] Run `npm run check-api-usage` to verify under 5,000 calls/day
- [x] Check Vercel cron logs to ensure 6-hour refresh running
- [x] Verify no errors in price cache updates

### Monthly Review
- [x] Review API usage trends
- [x] Check if approaching 5,000 call limit
- [x] Verify attribution notice still visible in footer
- [x] Test that all pricing is <6 hours old

### Quarterly Audit
- [x] Re-read BrickLink API Terms for any updates
- [x] Check for new BrickLink features/endpoints
- [x] Review compliance documentation
- [x] Update BRICKLINK_API_COMPLIANCE.md if needed

---

## Contact

**BrickLink API Support:** apisupport@bricklink.com  
**Questions about terms?** Contact support before making changes that might affect compliance.

**Last Updated:** April 13, 2026  
**Next Review:** July 13, 2026
