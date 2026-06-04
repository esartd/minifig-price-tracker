# Core Web Vitals Audit - FigTracker

**Date:** June 4, 2026  
**Auditor:** Claude Code  
**Goal:** Document performance optimizations for Google search ranking

---

## What Are Core Web Vitals?

Google's ranking signals measuring real-world user experience:

1. **LCP (Largest Contentful Paint)** - Loading performance
   - Target: < 2.5 seconds
   - Measures: When main content becomes visible

2. **FID (First Input Delay)** - Interactivity
   - Target: < 100 milliseconds
   - Measures: Time until page responds to user input

3. **CLS (Cumulative Layout Shift)** - Visual stability
   - Target: < 0.1
   - Measures: Unexpected layout shifts during page load

---

## ✅ Optimizations Already Implemented

### 1. Next.js Framework Benefits (Automatic)
- **Server-Side Rendering (SSR):** Initial HTML sent immediately
- **Automatic Code Splitting:** Only load JavaScript needed per page
- **Image Optimization:** `next/image` component used (16 instances found)
- **Font Optimization:** System fonts used (no external font loading)

### 2. Resource Hints (app/layout.tsx:216-221)
```tsx
<link rel="preconnect" href="https://img.bricklink.com" />
<link rel="preconnect" href="https://www.lego.com" />
<link rel="preconnect" href="https://cdn.rebrickable.com" />
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://img.bricklink.com" />
<link rel="dns-prefetch" href="https://www.lego.com" />
```

**Impact:**
- Preconnect: Establishes early connections to external domains
- DNS-prefetch: Resolves DNS before resources are needed
- **Estimated LCP improvement:** 200-500ms

### 3. Script Loading Strategy (app/layout.tsx:238-241)
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-PXLF7KRTSB"
  strategy="afterInteractive"
/>
```

**Impact:**
- Google Analytics loads AFTER page becomes interactive
- Doesn't block main content rendering
- **Estimated FID improvement:** No blocking, maintains < 100ms

### 4. Responsive Images (via next/image)
- Automatic: WebP format for modern browsers
- Automatic: Lazy loading for off-screen images
- Automatic: Proper sizing to prevent CLS

### 5. Caching Strategy
- BrickLink pricing: 6-hour cache (reduces database queries)
- Static catalog data: JSON files loaded once at startup
- API responses: Proper cache headers

---

## 🟡 Potential Issues & Fixes

### Issue 1: External Image CDNs (BrickLink, LEGO.com)
**Problem:** Loading images from `img.bricklink.com` - no control over optimization

**Current State:**
```tsx
image_url: `https://img.bricklink.com/ItemImage/MN/0/${minifig_no}.png`
```

**Impact on LCP:** External images can delay LCP by 500-1500ms

**Fix Options:**
1. **Proxy images through Next.js Image Optimization API** (Recommended)
   - Add BrickLink domain to `next.config.js` remotePatterns
   - Already done! (Check next.config.js)

2. **Self-host popular images**
   - Download top 1000 minifig images
   - Serve from `/public/images/`
   - Trade-off: Storage costs vs. speed

**Recommendation:** Keep current proxy approach (already optimized)

---

### Issue 2: Database Queries Blocking Page Load
**Problem:** Pricing data fetched on every minifig page load

**Current State:**
```tsx
// app/minifigs/[itemNo]/page.tsx:409-420
const pricingData = await bricklinkAPI.calculatePricingData(itemNo, 'new', 'US', '');
```

**Impact on LCP:** Database query adds 50-200ms to page load

**Fix:** Already cached! (6-hour cache in priceCache table)

**Status:** ✅ Optimized

---

### Issue 3: Google Analytics Inline Script
**Problem:** Inline `<Script>` with analytics code in layout.tsx

**Current State:** 238+ lines including inline gtag config

**Impact:** Minor - already using `afterInteractive` strategy

**Fix (Optional):** Move to external file and preload
```tsx
<Script src="/scripts/analytics.js" strategy="afterInteractive" />
```

**Recommendation:** Not urgent - current approach is acceptable

---

### Issue 4: No Static Generation for Popular Pages
**Problem:** Every minifig page is server-rendered on demand (`force-dynamic`)

**Current State:**
```tsx
// app/minifigs/[itemNo]/page.tsx:8
export const dynamic = 'force-dynamic';
```

**Impact on LCP:** Server render time adds 100-300ms per request

**Fix:** SEO Fix #6 (ISR - Incremental Static Regeneration)
- Pre-generate top 100 minifig pages at build time
- Revalidate every 6 hours (matches cache)
- Example: sw0001, sw1319, hp001, etc.

**Estimated Improvement:** 200-400ms faster LCP for popular pages

**Status:** ⏳ Pending (Fix #6)

---

### Issue 5: CLS from Dynamic Pricing Display
**Problem:** Price loads after page renders (client-side fetch)

**Current State:** Collection pages fetch prices progressively

**Impact on CLS:** Price elements shift when data loads

**Fix Options:**
1. Reserve space with skeleton loaders (height/width)
2. Load pricing server-side (already done on detail pages!)
3. Use `min-height` on price containers

**Recommendation:** Add skeleton loaders to collection pages

---

## 📊 Testing Methods

### Method 1: PageSpeed Insights (Google's Official Tool)
**URL:** https://pagespeed.web.dev/

**Test:**
1. Visit PageSpeed Insights
2. Enter: `https://figtracker.ericksu.com/minifigs/sw1319`
3. Run test for Mobile + Desktop
4. Check Core Web Vitals scores

**Target Scores:**
- Performance: > 90 (Green)
- LCP: < 2.5s (Green)
- FID: < 100ms (Green)
- CLS: < 0.1 (Green)

### Method 2: Chrome DevTools Lighthouse
**Steps:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select: Performance, Mobile
4. Generate report

### Method 3: Real User Monitoring (Google Analytics)
**Already Tracking:**
- Google Analytics collects real user Core Web Vitals
- View in GA4: Reports → Engagement → Pages and Screens
- Check "Web Vitals" metrics

**Location:** GA4 Dashboard → Engagement → Web Vitals

---

## 🎯 Action Items (Priority Order)

### High Priority (Biggest Impact)
1. ✅ **DONE:** Add breadcrumb navigation (Fix #4)
2. ⏳ **NEXT:** Implement ISR for popular pages (Fix #6)
   - Pre-generate top 100 minifigs
   - Revalidate every 6 hours
   - **Expected LCP improvement:** 200-400ms

### Medium Priority
3. Add skeleton loaders to collection pages
   - Prevent CLS when prices load
   - Reserve space for price elements
   - **Expected CLS improvement:** 0.05-0.1 reduction

4. Optimize middleware (reduce blocking time)
   - Current: User-Agent checks on every request
   - Consider: Move bot checks to edge (Cloudflare)

### Low Priority (Diminishing Returns)
5. Self-host top 1000 minifig images
   - Only if budget allows
   - Storage cost: ~500MB
   - **Expected LCP improvement:** 100-200ms

6. Implement Service Worker for offline support
   - PWA capabilities
   - Cache static assets locally
   - Nice-to-have, not SEO critical

---

## 📈 Success Metrics

**How to Track Improvement:**

1. **Before/After Comparison:**
   - Run PageSpeed before changes → Record scores
   - Implement optimizations
   - Run PageSpeed after → Compare scores

2. **Google Search Console:**
   - Reports → Experience → Core Web Vitals
   - Shows: Good URLs, URLs needing improvement, Poor URLs
   - Track over 28 days

3. **Ranking Improvement:**
   - Monitor keyword positions in Google Search Console
   - Expected: 5-15 position improvement after CWV fixes
   - Timeline: 4-8 weeks after fixes deployed

---

## 🚀 Quick Wins (Immediate Implementation)

### 1. Add Viewport Meta Tag (Already Done)
```tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
```
✅ Status: Implemented in app/layout.tsx:115-119

### 2. Preconnect to Critical Domains (Already Done)
✅ Status: Implemented in app/layout.tsx:216-221

### 3. Lazy Load Off-Screen Images (Already Done via next/image)
✅ Status: 16 components using next/image

### 4. Cache API Responses (Already Done)
✅ Status: 6-hour cache for BrickLink pricing

---

## 🔍 How to Verify Improvements

### Test 1: Lighthouse Score
**Command (if lighthouse CLI available):**
```bash
lighthouse https://figtracker.ericksu.com/minifigs/sw1319 --view
```

**Expected Scores:**
- Performance: 85+ (Good baseline)
- Best Practices: 90+
- SEO: 95+
- Accessibility: 90+

### Test 2: WebPageTest
**URL:** https://www.webpagetest.org/

**Test Configuration:**
- Location: Multiple (US East, US West, Europe)
- Browser: Chrome (Mobile + Desktop)
- Connection: 4G LTE

**Key Metrics to Watch:**
- Start Render: < 1.5s
- Speed Index: < 2.5s
- LCP: < 2.5s

### Test 3: Real User Data (Field Data)
**Google Search Console → Experience → Core Web Vitals**

**Timeline:**
- Data collected over 28 days
- Shows: Desktop + Mobile separately
- Grouped by: Good, Needs Improvement, Poor

---

## 📝 Notes

**PageSpeed API Quota Issue (June 4, 2026):**
- Encountered rate limit on Google PageSpeed API
- Daily quota: 0 requests per day (default)
- Workaround: Use web UI at pagespeed.web.dev
- Alternative: Chrome DevTools Lighthouse (local testing)

**Next Steps:**
- Manually test on PageSpeed Insights web UI
- Record baseline scores before ISR implementation
- Re-test after SEO Fix #6 (ISR)

---

## 🎓 References

- [Google Core Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Next.js Performance Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/performance)
- [Web.dev Lighthouse Guide](https://web.dev/measure/)

---

**Last Updated:** June 4, 2026  
**Status:** Baseline audit complete, optimizations identified for Fix #6 (ISR)
