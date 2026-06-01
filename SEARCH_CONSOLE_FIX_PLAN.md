# Google Search Console Issues - Fix Plan
**Date:** June 1, 2026
**Domain:** pl.figtracker.ericksu.com (Polish site)

## Current Status (May 28, 2026)
- **236 pages NOT indexed**
- **230 pages indexed**
- **0 impressions** (site is not showing up in Google search)

---

## Issues Identified

### 🚨 CRITICAL - Server Errors (5xx): 32 pages
**Impact:** Google can't crawl these pages → zero indexing
**Root Cause:** Unknown - need specific URLs to diagnose
**Action Required:** User must export list of affected URLs from Search Console

Likely causes based on CLAUDE.md history:
- Database connection limits (Hostinger MySQL strict limits)
- API calls timing out
- Dynamic page generation failures

### ⚠️ HIGH - Duplicate Without Canonical: 45 pages
**Impact:** Google doesn't know which version is authoritative
**Root Cause:** ANALYSIS SHOWS THIS IS **NOT** THE ISSUE
**Current State:** ✅ **CANONICAL TAGS ARE PROPERLY IMPLEMENTED**

Evidence:
- `app/layout.tsx` line 98: `canonical: domains[locale]` 
- `app/minifigs/[itemNo]/page.tsx` line 118: Full canonical with language alternates
- `app/sets/[boxNo]/page.tsx` line 102: Full canonical with language alternates
- `app/sitemap.ts` lines 33-41: Multilingual alternates properly configured

**Why Google still reports this:**
Google may be seeing duplicate content from:
1. www vs non-www variants (if both resolve)
2. http vs https (if http still accessible)
3. Trailing slash inconsistencies (/page vs /page/)
4. Query parameters (?ref=, ?utm=, etc.)

### ⚠️ MEDIUM - Crawled But Not Indexed: 142 pages
**Impact:** Google found pages but decided not to index
**Root Cause:** Combination of factors
- Low content quality signals
- Duplicate content between language versions
- Pages may be too thin (just price data, no description)
- Internal linking issues

### 🔍 OTHER ISSUES
- **11 pages:** Blocked due to other 4xx (need URLs)
- **1 page:** Page with redirect (need URL)
- **5 pages:** Google chose different canonical (need URLs)

---

## Diagnosis Results

### ✅ What's Working Correctly

**1. Canonical Tags Implementation:**
```typescript
// Root layout (line 98)
canonical: domains[locale as keyof typeof domains]

// Individual pages (minifigs line 118, sets line 102)
alternates: {
  canonical: `${domains[locale]}/minifigs/${itemNo}`,
  languages: {
    'en': `${domains.en}/minifigs/${itemNo}`,
    'de': `${domains.de}/minifigs/${itemNo}`,
    // ... all 10 languages
    'x-default': `${domains.en}/minifigs/${itemNo}`,
  }
}
```

**2. Sitemap Implementation:**
- Dynamic generation with all locales
- Proper multilingual alternates
- 18,000+ minifig URLs × 10 languages = 180,000+ URLs
- 20,000+ set URLs × 10 languages = 200,000+ URLs
- **Total: ~400,000 URLs in sitemap**

**3. Robots.txt:**
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  }
}
```

**4. Structured Data:**
- WebApplication schema (line 161)
- Organization schema (line 184)
- WebSite schema with search box (line 196)

---

## Recommended Fixes

### IMMEDIATE (Do First)

#### 1. Get Specific Error URLs
**User Action Required:**
Go to Google Search Console → Coverage Report:
- Click "Server error (5xx)" → Export URLs
- Click "Blocked due to 4xx" → Export URLs
- Click "Page with redirect" → Export URL
- Click "Duplicate without canonical" → Export sample URLs

Without these URLs, we can only guess.

#### 2. Fix Server Errors (Once URLs Identified)
Test each failing URL:
```bash
curl -I https://pl.figtracker.ericksu.com/[failing-url]
```

Common fixes:
- Increase database connection pool
- Add error boundaries to prevent 500s
- Fix missing data handling
- Add request timeout handling

#### 3. Force HTTPS & Canonical Domain
Add to `next.config.js`:
```javascript
async redirects() {
  return [
    // Force www → non-www (or vice versa)
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.pl.figtracker.ericksu.com' }],
      destination: 'https://pl.figtracker.ericksu.com/:path*',
      permanent: true,
    },
  ]
}
```

### SHORT-TERM (Do Next)

#### 4. Add Robots.txt File
Currently defined in metadata, but Google prefers actual `/robots.txt` file.

Create `app/robots.ts`:
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://pl.figtracker.ericksu.com/sitemap.xml',
  }
}
```

#### 5. Verify Sitemap Accessibility
Test that Google can actually fetch your sitemap:
```bash
curl https://pl.figtracker.ericksu.com/sitemap.xml | head -50
```

If sitemap is too large (>50MB or >50K URLs), split it:
```typescript
// app/sitemap-minifigs.ts
// app/sitemap-sets.ts
// app/sitemap-index.ts (references the split sitemaps)
```

#### 6. Add More Content to Pages
Currently pages might be too thin. For each minifig/set page, ensure:
- ✅ Title (has)
- ✅ Description (has from database)
- ⚠️ Minimum 300 words of unique content
- ⚠️ Internal links to related items
- ⚠️ User reviews/comments (future)

### LONG-TERM (Optional Improvements)

#### 7. Reduce Duplicate Content Across Languages
Problem: 10 language versions with mostly identical content = duplicate signals

Solutions:
- Add `rel="alternate" hreflang="x"` tags (already done ✅)
- Translate more content (descriptions, guides)
- Use `noindex` on less important language versions temporarily

#### 8. Improve Internal Linking
Add "Related Minifigs" sections to boost crawl depth:
```typescript
// Get same theme/category items
const related = getMinifigsByCategoryId(minifig.category_id)
```

#### 9. Monitor & Iterate
- Weekly Search Console checks
- Track indexing progress (currently 230 → goal 400+)
- Monitor impressions (currently 0 → goal 100+/day)

---

## Risk Assessment

### Changes Required vs Risk Level

| Fix | Files Changed | Risk Level | Reason |
|-----|---------------|------------|--------|
| Server errors | Unknown until URLs provided | 🔴 HIGH | Could affect live site |
| Force HTTPS redirect | `next.config.js` | 🟡 MEDIUM | Could break if wrong |
| Add robots.txt | `app/robots.ts` (new) | 🟢 LOW | New file, no changes |
| Split sitemap | `app/sitemap-*.ts` | 🟡 MEDIUM | Changes URL structure |
| Add more content | Multiple page files | 🟡 MEDIUM | Could slow pages |

### Testing Plan

**Before deploying ANY changes:**
1. Create feature branch: `git checkout -b fix/search-console-issues`
2. Make changes on branch
3. Test locally: `npm run build` must succeed
4. Test specific URLs work
5. Deploy to staging/preview (if available)
6. Get user approval
7. Merge to main
8. Monitor for 500 errors in production

---

## What NOT to Change

Based on code review, these are **already correct** and should NOT be modified:

❌ Don't change `app/layout.tsx` canonical tags (already correct)
❌ Don't change `app/minifigs/[itemNo]/page.tsx` metadata (already correct)
❌ Don't change `app/sets/[boxNo]/page.tsx` metadata (already correct)
❌ Don't change `app/sitemap.ts` structure (already correct)
❌ Don't add canonical meta tags to HTML head (Next.js handles it)

---

## Next Steps

**Waiting on user:**
1. Export URLs for 5xx errors from Search Console
2. Export URLs for 4xx errors
3. Export sample "duplicate" URLs to verify

**Once URLs received:**
1. Diagnose root cause of 500 errors
2. Create fix plan with specific code changes
3. Test on feature branch
4. Deploy fix
5. Request re-indexing in Search Console

---

## Success Metrics

**Within 1 week:**
- ✅ Zero 5xx errors in Search Console
- ✅ Zero 4xx errors (except expected ones like /admin/)
- ✅ All 230+ pages stay indexed

**Within 2 weeks:**
- ✅ 300+ pages indexed (up from 230)
- ✅ First impressions appearing (>0)

**Within 1 month:**
- ✅ 400+ pages indexed
- ✅ 100+ impressions per day
- ✅ 10+ clicks per day from Google

---

## Backup & Rollback Plan

**Before making changes:**
```bash
# Current working commit
git log -1 --oneline
# d0ccdfd docs(oauth): Add Google OAuth documentation

# Tag current working state
git tag search-console-fix-backup-2026-06-01
git push origin search-console-fix-backup-2026-06-01
```

**If something breaks:**
```bash
# Rollback to tagged version
git checkout search-console-fix-backup-2026-06-01

# Or rollback specific files
git checkout d0ccdfd -- app/layout.tsx
git checkout d0ccdfd -- app/sitemap.ts

# Commit and deploy
git commit -m "Rollback: search console fixes caused issues"
git push
```

---

## Questions for User

1. **Can you export the specific URLs** that have 5xx/4xx errors?
2. **Have you verified your sitemap** is accessible at https://pl.figtracker.ericksu.com/sitemap.xml?
3. **Is www.pl.figtracker.ericksu.com** also resolving? (shouldn't be)
4. **When did the 500 errors start?** (check dates in Search Console)
5. **Are other language domains** (en, de, fr, etc.) having the same issues?

---

**Status:** ⏸️ PAUSED - Waiting for specific error URLs from user before proceeding
