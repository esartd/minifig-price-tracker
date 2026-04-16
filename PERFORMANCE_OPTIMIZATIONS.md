# Performance Optimization Plan for FigTracker

## Current Performance Analysis

### ✅ Already Optimized
- **Server Components**: About, Themes, Minifig Detail pages use RSC
- **Image Optimization**: Next.js Image component used throughout
- **Bundle Analysis**: @next/bundle-analyzer configured
- **Analytics**: Vercel Analytics (lightweight)

### 🔍 Optimization Opportunities

## 1. Image Optimization (High Impact)

### Problem: Unoptimized External Images
- BrickLink images use `unoptimized` flag (12 locations)
- Forces Next.js to skip optimization
- External images loaded directly from BrickLink

### Solution A: Enable Image Optimization
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.bricklink.com',
    },
  ],
  // Remove unoptimized flag from components
  formats: ['image/avif', 'image/webp'],
}
```

**Trade-off**: May hit Vercel image optimization limits on free tier

### Solution B: Lazy Loading + Blur Placeholders
```tsx
<Image
  src={imageUrl}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..." // Generate blur hash
/>
```

**Impact**: Faster perceived load time, better UX

## 2. Database Query Optimization (High Impact)

### Problem: N+1 Queries
Theme pages may fetch minifigs one-by-one

### Solution: Batch Queries
```typescript
// Instead of multiple queries
const minifigs = await Promise.all(
  ids.map(id => prisma.minifig.findUnique({ where: { id } }))
);

// Do this
const minifigs = await prisma.minifig.findMany({
  where: { id: { in: ids } }
});
```

### Add Database Indexes
```sql
-- Frequently queried fields
CREATE INDEX idx_minifig_category ON minifig_catalog(category_name);
CREATE INDEX idx_minifig_year ON minifig_catalog(year_released);
CREATE INDEX idx_inventory_user ON inventory(user_id);
```

## 3. Caching Strategy (High Impact)

### Current State
- No Redis/CDN caching
- API routes fetch fresh data every time
- Sets.txt loaded from disk repeatedly

### Solution: Multi-Layer Caching

#### A. In-Memory Cache (Immediate)
```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; expires: number }>();

export function getCached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return Promise.resolve(cached.data);
  }
  
  return fetcher().then(data => {
    cache.set(key, { data, expires: Date.now() + ttl });
    return data;
  });
}
```

#### B. CDN Headers
```typescript
// API routes
export const revalidate = 3600; // 1 hour
```

#### C. Static Generation
```typescript
// Generate static pages for popular minifigs
export async function generateStaticParams() {
  const popular = await getPopularMinifigs(100);
  return popular.map(m => ({ itemNo: m.no }));
}
```

## 4. Code Splitting (Medium Impact)

### Problem: Large Client Components
Search page loads everything upfront

### Solution: Dynamic Imports
```typescript
// Only load when needed
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### Defer Non-Critical JS
```typescript
// Load after initial render
useEffect(() => {
  import('./analytics').then(m => m.track('pageview'));
}, []);
```

## 5. Font Optimization (Low Impact, Easy Win)

### Current: System Fonts
Already optimized with `font-family: inherit`

### Optional: Preload Critical Fonts
```typescript
// app/layout.tsx
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

## 6. API Route Optimization (Medium Impact)

### Problem: Slow Price Lookups
BrickLink API can be slow

### Solution: Background Jobs + Cache
```typescript
// Prefetch popular minifig prices
async function prefetchPopularPrices() {
  const popular = await getPopularMinifigs(50);
  await Promise.all(popular.map(m => 
    fetchAndCachePricing(m.no)
  ));
}

// Run every hour via cron
```

### Add Request Deduplication
```typescript
// Prevent duplicate API calls
const pendingRequests = new Map();

export async function fetchWithDedup(url: string) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }
  
  const promise = fetch(url);
  pendingRequests.set(url, promise);
  
  try {
    return await promise;
  } finally {
    pendingRequests.delete(url);
  }
}
```

## 7. Bundle Size Reduction (Medium Impact)

### Analyze Current Bundle
```bash
ANALYZE=true npm run build
```

### Common Optimizations
- Remove unused Heroicons (tree-shake)
- Use lighter date libraries (date-fns over moment)
- Lazy load heavy libraries

## 8. Database Connection Pooling (High Impact for Scale)

### Current: Direct Prisma Connection
May create too many connections

### Solution: Connection Pool
```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=20'
    }
  }
});
```

## 9. Minifig Cache Optimization (High Impact)

### Problem: Large minifigCache table
Storing 8000+ minifigs with pricing data

### Solution: Prune Stale Cache
```typescript
// Run weekly
async function pruneStaleCache() {
  await prisma.minifigCache.deleteMany({
    where: {
      expires_at: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  });
}
```

## 10. Static Asset Optimization (Easy Win)

### Compress Avatars
```bash
# Reduce avatar sizes from 200KB to ~50KB
npm install sharp
node scripts/compress-avatars.js
```

### Add Cache Headers
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/avatars/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

## Implementation Priority

### Phase 1: Quick Wins (1-2 hours)
1. ✅ Add database indexes
2. ✅ Enable CDN caching headers
3. ✅ Compress avatar images
4. ✅ Add in-memory cache for Sets.txt

### Phase 2: Core Optimizations (4-6 hours)
1. ✅ Optimize image loading (remove unoptimized where possible)
2. ✅ Add request deduplication
3. ✅ Batch database queries
4. ✅ Static generation for top minifigs

### Phase 3: Advanced (8+ hours)
1. ⚪ Redis caching layer
2. ⚪ Background price prefetching
3. ⚪ Full bundle analysis and splitting
4. ⚪ Service worker for offline support

## Expected Performance Gains

| Optimization | Load Time Improvement | Priority |
|--------------|----------------------|----------|
| Database indexes | 30-50% on theme pages | High |
| Image optimization | 20-40% perceived speed | High |
| CDN caching | 50-80% for repeat visits | High |
| Code splitting | 15-25% initial load | Medium |
| In-memory cache | 40-60% for Sets.txt | High |
| Static generation | 80-90% for static pages | High |

## Monitoring

### Tools to Use
- Vercel Speed Insights (included)
- Chrome Lighthouse
- WebPageTest.org
- Vercel Analytics

### Key Metrics
- **Time to First Byte (TTFB)**: < 200ms
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## Vercel-Specific Optimizations

### Edge Functions
Move static data fetching to Edge:
```typescript
export const runtime = 'edge';
```

### ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 3600; // Regenerate every hour
```

### Edge Config
Store frequently accessed data:
```typescript
import { get } from '@vercel/edge-config';
const popularMinifigs = await get('popular-minifigs');
```
