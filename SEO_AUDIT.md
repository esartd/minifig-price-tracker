# FigTracker SEO Audit - May 13, 2026

## ✅ EXCELLENT (What's Working)

### Content & Descriptions
- ✅ **74,980 unique descriptions** (18,745 minifigs × 4 languages)
- ✅ **Multilingual support**: EN, DE, FR, ES with proper locale detection
- ✅ **SEO-optimized descriptions**: 150-200 words, keyword-rich, unique per item
- ✅ **Meta descriptions**: First 2 sentences extracted (perfect length ~150 chars)
- ✅ **Fallback chain**: Locale → English → null (graceful degradation)

### Technical SEO
- ✅ **Sitemap.xml**: Dynamic generation with all 18,745+ minifig pages
- ✅ **Multilingual sitemap**: All 4 locales included with hreflang alternates
- ✅ **Canonical URLs**: Properly set per locale
- ✅ **Alternate language tags**: x-default fallback to English
- ✅ **Open Graph tags**: Complete with images, locale, alternateLocale
- ✅ **Twitter Cards**: summary_large_image with proper metadata
- ✅ **Structured data**: schema.org Product markup with BreadcrumbList
- ✅ **Dynamic rendering**: force-dynamic for fresh pricing data
- ✅ **Image optimization**: Next.js Image component used

### URL Structure
- ✅ **Clean URLs**: `/minifigs/sw0001a` (no .html or query params)
- ✅ **Subdomain locales**: de.figtracker.com, fr.figtracker.com, es.figtracker.com
- ✅ **Consistent structure**: Same paths across all locales

### Mobile & Performance
- ✅ **Responsive design**: Mobile-first approach
- ✅ **Image lazy loading**: Only loads visible images
- ✅ **Dynamic imports**: Price charts lazy-loaded when needed

## ⚠️ NEEDS IMPROVEMENT (Priority Order)

### 1. 🚨 CRITICAL: Missing robots.txt
**Impact**: Search engines don't know your sitemap location or crawl preferences

**Fix needed:**
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/collection/', '/inventory/'],
      },
    ],
    sitemap: [
      'https://figtracker.ericksu.com/sitemap.xml',
      'https://de.figtracker.ericksu.com/sitemap.xml',
      'https://fr.figtracker.ericksu.com/sitemap.xml',
      'https://es.figtracker.ericksu.com/sitemap.xml',
    ],
  }
}
```

### 2. 🔴 HIGH: Structured Data Incomplete
**Current**: Basic Product schema exists
**Missing**:
- Price validity dates
- Seller information
- Review/rating markup (if applicable)
- AggregateOffer for multiple conditions (new/used)
- Availability status (InStock, OutOfStock, PreOrder)

**Enhance in minifig-detail-client.tsx:**
```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: minifig.name,
  image: minifig.image_url,
  description: minifig.description || `LEGO ${minifig.name}`,
  sku: minifig.no,
  brand: {
    '@type': 'Brand',
    name: 'LEGO'
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: pricing?.min_price || 0,
    highPrice: pricing?.max_price || 0,
    offerCount: pricing?.total_quantity || 0,
    availability: 'https://schema.org/InStock',
    priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    url: `https://figtracker.ericksu.com/minifigs/${minifig.no}`
  },
  releaseDate: minifig.year_released || undefined,
  category: minifig.category_name
}
```

### 3. 🟡 MEDIUM: Missing Alt Text on Images
**Issue**: BrickLink images loaded without descriptive alt text
**SEO Impact**: Missing keyword opportunities + accessibility issues

**Fix**: Add to all Image components:
```typescript
<Image 
  src={minifig.image_url}
  alt={`LEGO ${minifig.name} Minifigure ${minifig.no} - ${minifig.category_name}`}
  // ... other props
/>
```

### 4. 🟡 MEDIUM: H1 Tag Optimization
**Check**: Ensure each page has exactly ONE H1 with primary keyword
**Best practice**: `<h1>LEGO {minifig.name} ({minifig.no}) - Price Guide</h1>`

### 5. 🟢 LOW: Internal Linking
**Current**: Category links, variant links exist
**Enhance**:
- Add "Related minifigs" section with keyword-rich anchor text
- Link to theme pages from minifig pages
- Breadcrumb structured data (already exists - good!)

### 6. 🟢 LOW: Loading Speed Optimization
**Check needed**:
- Enable Next.js Image optimization in production
- Consider CDN for BrickLink images (cache externally)
- Lazy load "Similar Sets" section below the fold

## 📊 SEO METRICS ESTIMATE

### Indexable Pages
- **Minifigs**: 18,745 × 4 locales = 74,980 pages
- **Sets**: ~20,000 × 4 locales = 80,000 pages
- **Themes**: ~200 × 4 locales = 800 pages
- **Articles**: ~50 × 4 locales = 200 pages
- **Static pages**: ~10 × 4 locales = 40 pages
- **TOTAL**: ~156,020 indexable pages

### Keyword Coverage
- ✅ Long-tail keywords: Each minifig name + number (e.g., "sw0001a Battle Droid")
- ✅ Category keywords: "Star Wars minifigures", "Friends minifigures"
- ✅ Action keywords: "price guide", "price tracker", "inventory management"
- ✅ Multilingual keywords: German "LEGO Minifiguren", French "figurines LEGO"

## 🎯 QUICK WINS (Do These Now)

1. **Create robots.txt** (5 minutes) - Tells Google where sitemap is
2. **Add image alt text** (30 minutes) - Quick find/replace in components
3. **Enhance structured data** (1 hour) - Better Google Shopping/rich snippets
4. **Submit sitemaps to Google Search Console** (10 minutes) - All 4 locales
5. **Check Google Search Console for coverage errors** (15 minutes)

## 📈 LONG-TERM SEO STRATEGY

### Content Expansion
- Add "Buying Guide" section to popular minifigs
- Create comparison articles: "Top 10 Most Valuable Star Wars Minifigs"
- Add user reviews/ratings (if permitted)
- Historical price analysis articles

### Link Building
- Get listed on LEGO collector directories
- Partner with LEGO bloggers for reviews
- Create embeddable price widgets for other sites
- Submit to LEGO subreddits (with permission)

### Technical Enhancements
- Add FAQ schema to FAQ pages
- Implement video markup if adding YouTube reviews
- Add LocalBusiness schema if physical location
- Consider AMP pages for mobile (optional)

## 🔍 MONITORING CHECKLIST

Weekly:
- [ ] Check Google Search Console for coverage errors
- [ ] Monitor Core Web Vitals scores
- [ ] Review top landing pages and bounce rates

Monthly:
- [ ] Audit broken internal links
- [ ] Check sitemap submission status (all 4 locales)
- [ ] Review keyword rankings in target languages
- [ ] Analyze competitor SEO strategies

## ✅ SUMMARY

**Overall Grade: B+ (Very Good)**

Your SEO foundation is **excellent**:
- Comprehensive multilingual content ✅
- Proper technical SEO structure ✅
- Clean URLs and sitemap ✅
- Mobile-responsive ✅

**Critical gaps** (fix within 1 week):
- Missing robots.txt 🚨
- Incomplete structured data 🔴
- Missing image alt text 🟡

**With these fixes, you'll achieve A+ SEO readiness.**

---

## 📝 NEXT STEPS (Priority Order)

1. Create `app/robots.ts` (use code above)
2. Add comprehensive Product structured data
3. Add alt text to all images
4. Submit all 4 sitemaps to Google Search Console
5. Set up Google Analytics 4 + Search Console integration
6. Monitor indexing progress over next 2-4 weeks

Your site is 90% SEO-ready. The remaining 10% is quick wins that will significantly boost discoverability.
