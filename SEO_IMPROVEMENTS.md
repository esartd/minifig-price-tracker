# SEO Improvements Tracker

**Date Started:** June 4, 2026  
**Baseline Score:** 7.5/10

---

## Progress: 5/7 Complete

### ✅ Fix #1: Schema.org Product Markup with Pricing (COMPLETE)

**Date:** June 4, 2026  
**Status:** ✅ Deployed to production  
**Impact:** High - Enables rich snippets in Google search results

**What was added:**
- Real-time price data (lowPrice, highPrice, offerCount)
- SKU field for product identification
- Seller URL (BrickLink) in offers
- Full product descriptions in schema

**Files changed:**
- `app/minifigs/[itemNo]/page.tsx`

**Expected result:**
- Google shows prices in search results
- Higher click-through rates
- Better product rich snippets

**Test:**
```bash
curl -s -A "Googlebot" "https://figtracker.ericksu.com/minifigs/sw0001" | grep -oP '<script type="application/ld\+json">.*?</script>'
```

---

### ✅ Fix #2: Page Titles with Pricing (COMPLETE)

**Date:** June 4, 2026  
**Status:** ✅ Deployed to production  
**Impact:** High - Improves click-through from search results

**Goal:**
Transform page titles from:
- Current: "Boba Fett (sw0001) - LEGO Minifigure Price Guide"
- Better: "Boba Fett (sw0001) - $89.99 | LEGO Minifigure Price Tracker"

**Why:**
- Shows price directly in search results
- Creates urgency ("price" implies current market value)
- Better keyword targeting

**Files to modify:**
- `app/minifigs/[itemNo]/page.tsx` - generateMetadata function
- May need to fetch pricing in metadata generation

---

### ✅ Fix #3: Internal Linking Strategy (VERIFIED)

**Date:** June 4, 2026  
**Status:** ✅ Already implemented and verified  
**Impact:** Medium-High - Improves crawlability and PageRank distribution

**Goal:**
- Theme pages link to top 10 minifigs in that theme
- Minifig pages link to related characters
- Set pages link to minifigs contained in set
- Add "You may also like" section with internal links

**Files to modify:**
- `app/themes/[theme]/page.tsx`
- `app/minifigs/[itemNo]/page.tsx` (add "You may also like" section)
- `app/sets/[itemNo]/page.tsx`

---

### ✅ Fix #4: Breadcrumb Navigation UI (COMPLETE)

**Date:** June 4, 2026  
**Status:** ✅ Deployed to production  
**Impact:** Medium - Better UX and SEO

**Goal:**
- Add visual breadcrumb component to all pages
- Already have breadcrumb schema ✅
- Need to add actual UI element

**Files to create:**
- `components/breadcrumb.tsx`

**Files to modify:**
- `app/minifigs/[itemNo]/page.tsx`
- `app/sets/[itemNo]/page.tsx`
- `app/themes/[theme]/page.tsx`

---

### ✅ Fix #5: Core Web Vitals Optimization (AUDITED)

**Date:** June 4, 2026  
**Status:** ✅ Baseline audit complete  
**Impact:** High - Google ranking factor

**What was done:**
1. ✅ Audited all performance optimizations
2. ✅ Documented existing optimizations (preconnect, lazy load, caching)
3. ✅ Identified improvement opportunities for Fix #6 (ISR)
4. ✅ Created comprehensive audit document

**Findings:**
- Already optimized: Image loading (next/image), preconnect, caching
- Recommended: ISR for popular pages (200-400ms LCP improvement)
- API quota issue: Use PageSpeed web UI for manual testing

**Document:** See `CORE_WEB_VITALS_AUDIT.md`

**Test URL:**
https://pagespeed.web.dev/analysis?url=https://figtracker.ericksu.com/minifigs/sw1319

---

### ⏳ Fix #6: ISR for Popular Pages (PENDING)

**Status:** Not started  
**Impact:** Medium - Faster page loads

**Goal:**
- Use Incremental Static Regeneration for top 1000 minifigs
- Cache for 1 hour, revalidate in background
- Dramatically faster load times for popular pages

**Files to modify:**
- `app/minifigs/[itemNo]/page.tsx` - Change from `force-dynamic` to ISR
- May need to implement `generateStaticParams` for top pages

---

### ⏳ Fix #7: FAQ Schema Markup (PENDING)

**Status:** Not started  
**Impact:** Low-Medium - Rich snippets for FAQ page

**Goal:**
- Add FAQPage schema to `/faq` page
- Google can show Q&A directly in search results

**Files to modify:**
- `app/faq/page.tsx`

---

## Success Metrics

**Track these weekly:**
- [ ] Google Search Console impressions (target: +20% in 30 days)
- [ ] Click-through rate from search (target: +15%)
- [ ] Average search position (target: improve by 5 positions)
- [ ] Core Web Vitals scores (target: all green)
- [ ] Rich snippet appearances (check manually in Google)

**Where to check:**
- Google Search Console: https://search.google.com/search-console
- PageSpeed Insights: https://pagespeed.web.dev
- Rich Results Test: https://search.google.com/test/rich-results

---

## Notes

- All changes are incremental and non-breaking
- Each fix is deployed separately for easy rollback
- SEO improvements take 2-4 weeks to show in Google
- Monitor Search Console for errors after each deployment

---

**Next Fix:** #6 - ISR for Popular Pages (biggest performance improvement)
