# Pricing System Documentation

**⚠️ CRITICAL SYSTEM - DO NOT MODIFY WITHOUT READING THIS ENTIRE DOCUMENT ⚠️**

**Last Updated**: 2026-04-27  
**Status**: STABLE - Working correctly for all collection types

**🚨 VIOLATING BRICKLINK API RULES CAN GET US BANNED - TAKE THIS SERIOUSLY 🚨**

## Overview
FigTracker uses a centralized caching system to minimize Bricklink API calls while keeping prices fresh. All pricing data flows through the `priceCache` table with 6-hour expiration.

**BrickLink API Compliance (MANDATORY - NOT OPTIONAL)**:
- ✅ **3-second minimum delay** between ANY API calls (enforced everywhere)
- ✅ **6-hour cache** per BrickLink API Terms of Service  
- ✅ **5,000 calls/day maximum** (hard limit with tracking)

**Violation = API access revoked = site breaks completely**

## Architecture

### Core Principle
**Pricing is ALWAYS read from `priceCache`, never from item table columns.**

- ✅ `priceCache` table = Single source of truth (6-hour fresh data)
- ❌ Item table pricing columns = NOT used for reads (legacy/backup only)

### Database Tables

#### priceCache (Central cache)
```
item_no          VARCHAR   // e.g., "sw0001" or "75411-1"
item_type        VARCHAR   // "MINIFIG" or "SET"
condition        VARCHAR   // "new" or "used"
country_code     VARCHAR   // "US", "GB", "AU", etc.
region           VARCHAR   // Always "" (empty string, standardized)
currency_code    VARCHAR   // "USD", "GBP", "AUD", etc.
six_month_avg    FLOAT
current_avg      FLOAT
current_lowest   FLOAT
suggested_price  FLOAT
expires_at       DATETIME  // 6 hours from creation
created_at       DATETIME
```

**Unique Key**: `(item_no, item_type, condition, country_code, region)`

#### Item Tables (Minifigures/Sets)
```
CollectionItem / SetInventoryItem / PersonalCollectionItem / SetPersonalCollectionItem

pricing_six_month_avg    FLOAT?  // NOT USED FOR READS
pricing_current_avg      FLOAT?  // NOT USED FOR READS  
pricing_current_lowest   FLOAT?  // NOT USED FOR READS
pricing_suggested_price  FLOAT?  // NOT USED FOR READS
pricing_currency_code    VARCHAR? // NOT USED FOR READS
```

These columns exist but are **not queried**. They serve as backup/fallback only.

## Price Fetch Flow

### Initial Page Load

1. **Client**: Request GET `/api/inventory` or `/api/set-inventory`
2. **Server**: 
   - Fetch all items for user
   - Query `priceCache` with:
     - `item_no` IN (all item numbers)
     - `item_type` = "MINIFIG" or "SET"
     - `condition` = item condition
     - `country_code` = user's preferred country
     - `region` = "" (empty string)
     - `expires_at > NOW()` (not expired)
3. **Server**: Build lookup map and attach pricing to items
4. **Client**: Receive items with pricing (or undefined if no cache)

### When Cache is Missing

If cache entry doesn't exist or is expired:

1. **Client**: Detects `!item.pricing` or `pricing.currencyCode !== userCurrency`
2. **Client**: POST `/api/inventory/[id]/refresh-pricing` or `/api/set-inventory/[id]/refresh-pricing`
3. **Server**:
   - Call Bricklink API with user's currency
   - Save to `priceCache` with `expires_at = NOW() + 6 hours`
   - Update item table columns (backup only)
   - Return updated item
4. **Client**: Update state with fresh pricing

### Cache Lookup Key Format

**Critical**: Must match exactly for cache hits.

```javascript
// Minifigures
const key = `${minifigure_no}-${condition}-${countryCode}-${cacheRegion}`;
// Example: "sw0001-new-US-"

// Sets  
const key = `${box_no}-SET-${condition}-${countryCode}-${cacheRegion}`;
// Example: "75411-1-SET-used-US-"
```

**Note**: `cacheRegion` is always `""` (empty string). DO NOT use "north_america" or other values.

## Currency Handling

### Currency Change Flow

1. User changes currency preference in account settings
2. Next page load: `countryCode` changes in API request
3. Cache lookup key changes (includes `countryCode`)
4. Cache miss → triggers fresh fetch with new currency
5. New cache entry created with new currency_code

### Example

User switches from USD → GBP:

```javascript
// Old key: "sw0001-new-US-"
// New key: "sw0001-new-GB-"
// Different keys → cache miss → fetch GBP price
```

## Cache Expiration

### 6-Hour TTL

- Prices are cached for 6 hours from creation
- Query filters: `expires_at: { gt: new Date() }`
- After 6 hours: cache entry not returned → triggers refresh

### Why 6 Hours?

- Bricklink prices don't change frequently
- Balances freshness vs API usage
- 5000 API call limit per month
- Average user: ~50 items × 30 days / 6 hours = ~600 calls/month

## Client-Side Logic

### Filter: When to Refresh

```javascript
const itemsNeedingRefresh = data.data.filter((item) =>
  !item.pricing ||                              // No pricing at all
  item.pricing.suggestedPrice === 0 ||          // Price is $0
  item.pricing.currencyCode !== userCurrency    // Wrong currency
);
```

### Progressive Fetch (CORRECT IMPLEMENTATION)

**⚠️ THIS IS THE WORKING PATTERN - DO NOT CHANGE ⚠️**

```javascript
// 1. Show items immediately with cached prices
setCollection(data.data);
setLoading(false);

// 2. Find items needing refresh
const itemsNeedingRefresh = data.data.filter((item) =>
  !item.pricing ||
  item.pricing.suggestedPrice === 0 ||
  item.pricing.currencyCode !== userCurrency
);

// 3. Fetch prices ONE BY ONE with sequential timing
if (itemsNeedingRefresh.length > 0) {
  setPricesUpdating(itemsNeedingRefresh.length);
  
  let currentIndex = 0;
  
  const fetchNextItem = async () => {
    if (currentIndex >= itemsNeedingRefresh.length) {
      setPricesUpdating(0);
      return;
    }
    
    const item = itemsNeedingRefresh[currentIndex];
    currentIndex++;
    
    try {
      const response = await fetch(`/api/inventory/${item.id}/refresh-pricing`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        // Update state - triggers re-render, price appears immediately
        setCollection(prev => prev.map(i =>
          i.id === item.id ? result.data : i
        ));
      }
    } catch (err) {
      console.error(`Error fetching ${item.minifigure_no}:`, err);
    }
    
    // Decrement counter
    setPricesUpdating(prev => Math.max(0, prev - 1));
    
    // Fetch next item after delay (avoids rate limits)
    setTimeout(fetchNextItem, 500);
  };
  
  fetchNextItem();
}
```

**Why this pattern works:**
- Items show immediately with "No sellers available" or existing prices
- Prices fetch sequentially (avoids overwhelming server/API)
- Each successful fetch triggers React re-render
- Prices appear one-by-one progressively
- Failed fetches don't block remaining items
- 500ms delay between calls prevents rate limiting

**Why Promise.all instead of forEach:**
- `forEach` does NOT handle async callbacks properly
- State updates can be missed or batched incorrectly in React 18
- `Promise.all` ensures all async operations are tracked
- Guarantees React re-renders as each price arrives

**Bug History (April 2026):**

**Issue #1 (April 24)**: Prices fetched but UI didn't update without page refresh
- Cause: `forEach(async ...)` doesn't properly await async operations
- Fix: Changed to `Promise.all(map(...))` for proper async handling
- Commit: b4a1e8f "Fix inventory pricing not updating without page refresh"

**Issue #2 (April 26)**: Inventory page showed "Loading price..." during fetch, not "No sellers available"
- Cause: Added `loadingPriceIds` Set tracking that collection page didn't use
- Symptom: Different behavior than working collection page
- Fix: Removed loadingPriceIds, match collection pattern exactly
- Commit: c4a2530 "Remove 'Loading price...' state from inventory - match collection behavior"

**Issue #3 (April 27)**: All inventory pricing API calls returned 500 errors
- Cause: API tried to write pricing to database on every refresh
- Symptom: `database.updateItem()` hit Hostinger connection limits
- Fix: Remove database writes, only return data (match collection API)
- Commit: e3d3aef "Fix inventory refresh-pricing to not write to database"

**Issue #4 (April 27)**: Prices fetched successfully but React state didn't update
- Cause: API returned `userId` field from database layer, frontend type doesn't include it
- Symptom: Type mismatch prevented React from detecting state change
- Fix: Strip `userId` before returning to match `CollectionItem` type
- Commit: a3c02e6 "Remove userId from inventory API response to match CollectionItem type"

**Current Status**: All 4 collection types working correctly (collection, inventory, set-collection, set-inventory)

## API Endpoints

### GET /api/inventory
- Returns all minifigures for user
- Pricing attached from priceCache
- Query param: `?all=true` (fetch all at once)

### GET /api/set-inventory  
- Returns all sets for user
- Pricing attached from priceCache
- Query param: `?all=true` (fetch all at once)

### POST /api/inventory/[id]/refresh-pricing (Minifigs)
- **CRITICAL**: Does NOT write to database item table
- Fetches fresh price from BrickLink API
- Saves to priceCache only (6-hour expiration)
- Returns item with pricing attached in memory
- Frontend updates React state to display prices

**Why no database writes?**
- Writing to Hostinger MySQL hits connection limits
- Causes 500 errors on every pricing fetch
- Pricing is cached in priceCache table separately
- Frontend uses React state updates for progressive display

### POST /api/set-inventory/[id]/refresh-pricing (Sets)
- Same as above but for sets
- Also does NOT write to database

## ⚠️ CRITICAL RULES - NEVER VIOLATE THESE ⚠️

### 1. DO NOT Write to Database in refresh-pricing APIs
**Files**: 
- `app/api/inventory/[id]/refresh-pricing/route.ts`
- `app/api/set-inventory/[id]/refresh-pricing/route.ts`
- `app/api/personal-collection/[id]/refresh-pricing/route.ts`
- `app/api/set-personal-collection/[id]/refresh-pricing/route.ts`

**Rule**: These endpoints must ONLY:
```typescript
// ✅ CORRECT
const pricing = await bricklinkAPI.calculatePricingData(...);
const { userId, ...itemWithoutUserId } = item;
return NextResponse.json({
  success: true,
  data: { ...itemWithoutUserId, pricing }
});

// ❌ WRONG - DO NOT DO THIS
await database.updateItem(id, { pricing }); // Causes 500 errors!
```

**Why**: Hostinger MySQL has connection limits. Writing on every pricing fetch causes 500 errors.

### 2. DO NOT Track Loading State Per Item
**Files**:
- `app/inventory/page.tsx`
- `app/sets-inventory/page.tsx`

**Rule**: Do NOT use `loadingPriceIds` Set or similar per-item loading tracking

```typescript
// ❌ WRONG
const [loadingPriceIds, setLoadingPriceIds] = useState<Set<string>>(new Set());
setLoadingPriceIds(new Set(itemsNeedingRefresh.map(item => item.id)));

// ✅ CORRECT - Just update state directly
setCollection(prev => prev.map(i =>
  i.id === item.id ? result.data : i
));
```

**Why**: Collection page doesn't use it and works perfectly. Adding this complexity breaks the pattern.

### 3. DO NOT Return userId in API Responses
**Files**: All `refresh-pricing` route handlers

**Rule**: Strip `userId` before returning data to frontend

```typescript
// ✅ CORRECT
const { userId, ...itemWithoutUserId } = item;
return NextResponse.json({
  success: true,
  data: { ...itemWithoutUserId, pricing }
});

// ❌ WRONG
return NextResponse.json({
  success: true,
  data: { ...item, pricing } // item contains userId!
});
```

**Why**: Frontend types (`CollectionItem`, `SetInventoryItem`) don't include `userId`. Type mismatch prevents React state updates.

### 4. Always Use Sequential Fetching with 3-Second Delays
**Files**: All collection/inventory page components

**Rule**: Fetch prices ONE BY ONE with **3000ms (3 second)** delay - NO EXCEPTIONS

```typescript
// ✅ CORRECT - Sequential with 3-second delay
const fetchNextItem = async () => {
  // ... fetch logic ...
  setTimeout(fetchNextItem, 3000); // BrickLink API requires 3-second minimum
};
fetchNextItem();

// ❌ WRONG - Parallel
await Promise.all(items.map(item => fetch(...)));

// ❌ WRONG - Too fast (will get us banned!)
setTimeout(fetchNextItem, 500); // NEVER USE LESS THAN 3000ms
setTimeout(fetchNextItem, 1000); // STILL TOO FAST
setTimeout(fetchNextItem, 2000); // STILL TOO FAST
```

**Why 3 seconds is mandatory**: 
- BrickLink API Terms of Service requirement
- Violating this = empty price responses or API ban
- NOT negotiable, NOT optional, NOT "optimization"
- April 2026 incident: 500ms delays caused mass $0 prices
- Slower UX is acceptable, API ban is not

### 5. Match Working Reference Implementation
**Rule**: When in doubt, copy from `/app/collection/page.tsx` (minifigs) or `/app/sets-collection/page.tsx` (sets)

These pages are the **golden reference** - they work correctly and have been stable.

## Common Issues & Fixes

### Issue: Prices fetch every page load

**Cause**: Cache lookup key mismatch

**Check**:
1. Verify cache uses `region: ""` (empty string)
2. Verify query uses `cacheRegion = ''` (not "north_america")
3. Check cache exists: Run admin endpoint `/api/admin/check-price-cache`

**Fix**: Ensure region is always empty string in both save and query

### Issue: Wrong currency showing

**Cause**: Multiple cache entries with different currencies

**Check**:
1. Verify `currencyCode` is saved to priceCache
2. Verify filter checks `item.pricing.currencyCode !== userCurrency`

**Fix**: Clear old cache entries or wait 6 hours for expiration

### Issue: Prices are $0

**Cause**: Bricklink API returned no data (rare item, no sales)

**Check**: Bricklink API response
**Fix**: Cache $0 for 1 hour (shorter TTL) to retry sooner

### Issue: Prices don't update without page refresh

**Cause**: Using `forEach(async ...)` instead of `Promise.all(map(...))`

**Symptoms**:
- Prices fetch successfully (check Network tab)
- Console logs show "Updated state for [item]"
- But UI doesn't update until page refresh

**Why it happens**:
- JavaScript's `forEach` doesn't wait for async callbacks
- React state updates (`setCollection`) are called but may be batched incorrectly
- In React 18, batching can miss updates from forEach loops

**Check**:
1. Open browser console on /inventory page
2. Look for: "Updated state for sw1234"
3. Check Network tab: refresh-pricing calls succeed
4. If logs show success but UI doesn't update → this is the issue

**Fix**: Replace `forEach` with `Promise.all`
```javascript
// ❌ BAD: forEach doesn't handle async properly
itemsNeedingRefresh.forEach(async (item) => {
  const response = await fetch(...);
  setCollection(prev => ...); // May not trigger re-render!
});

// ✅ GOOD: Promise.all ensures proper async handling  
const promises = itemsNeedingRefresh.map(async (item) => {
  const response = await fetch(...);
  setCollection(prev => ...); // Guaranteed to re-render
});
await Promise.all(promises);
```

**Code Location**: `app/inventory/page.tsx` line ~99-136

## BrickLink Pricing Data Explained

### What is "LOWEST" Price?

**Source**: BrickLink API `price_guide` endpoint returns `min_price` field

**What it includes**:
- The absolute lowest current listing on BrickLink marketplace
- For SETS: Includes **all listings regardless of completeness**
  - Incomplete sets (missing minifigs, no box, missing pieces)
  - Complete sets
  - Used, New, any condition

**Why prices differ from manual BrickLink search**:
- **Cache staleness**: Prices cached for 6 hours, BrickLink listings change constantly
- **Completeness**: API `min_price` includes incomplete sets at $13.49, while you may want complete sets at $27.78
- **No filtering**: BrickLink API doesn't let you filter by completeness in price guide

**Example**: Darth Vader Transformation (75183-1)
- FigTracker "LOWEST": $27.78 (cached 6 hours ago, was lowest complete set)
- BrickLink now: $13.49 (new incomplete listing appeared since cache)

### Pricing Formula

**What we show**:
```
6 MO AVG    = BrickLink sold qty_avg_price (last 6 months sales)
CURRENT AVG = BrickLink stock qty_avg_price (current listings)
LOWEST      = BrickLink stock min_price (absolute lowest listing)
SUGGESTED   = (6 MO AVG + CURRENT AVG + LOWEST) / 3
```

**Code location**: `lib/bricklink.ts` lines 479-490

### Currency Conversion

**How it works**:
1. User selects preferred country (US, GB, AU, etc.)
2. API requests: `currency_code=USD` or `currency_code=GBP`
3. BrickLink converts ALL seller prices to requested currency
4. Returns aggregated data in that currency

**Example**:
- User in UK selects GBP
- BrickLink fetches listings from US, EU, Asia (all sellers worldwide)
- Converts all prices to GBP using current exchange rates
- Returns `min_price` in GBP

**Cache key includes country**: Different currencies = different cache entries

## Best Practices

### DO ✅
- Always use `cacheRegion = ''` (empty string)
- Check `expires_at > NOW()` in queries
- Save `currency_code` with every cache entry
- Use batch queries (fetch all prices in one query)
- Show items immediately, fetch prices progressively

### DON'T ❌
- Don't read from item table pricing columns
- Don't use region values like "north_america" 
- Don't skip currency validation
- Don't fetch prices synchronously (blocks UI)
- Don't cache prices without expiration

## Code References

### Database Query
- Minifigs: `lib/database.ts` → `getAllItems()` (line 53)
- Sets: `lib/database.ts` → `getAllSetInventoryItems()` (line 563)

### Client Logic  
- Minifigs: `app/inventory/page.tsx` → `loadCollection()` (line 68)
- Sets: `app/sets-inventory/page.tsx` → `loadCollection()` (line 68)

### API Endpoints
- Minifigs: `app/api/inventory/[id]/refresh-pricing/route.ts`
- Sets: `app/api/set-inventory/[id]/refresh-pricing/route.ts`

### Bricklink Integration
- `lib/bricklink.ts` → `calculateMinifigPricing()` (line 320)
- `lib/bricklink.ts` → `calculateSetPricing()` (line 581)

## Monitoring

### Check Cache Health

```javascript
// Browser console on figtracker.ericksu.com
fetch('/api/admin/check-price-cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    secret: 'YOUR_ADMIN_SECRET',
    itemNo: '75411-1',
    itemType: 'SET'
  })
}).then(r => r.json()).then(console.log)
```

### Network Tab
Filter for "refresh-pricing" to see when prices are being fetched.

### Console Logs
Page load shows: "Found N items needing pricing refresh (current currency: USD)"

## Testing Pricing Changes

**⚠️ BEFORE deploying any pricing changes, test ALL 4 collection types:**

### Manual Test Checklist

1. **Collection (Minifigs - Personal)**
   - Go to `/collection`
   - Verify prices appear progressively
   - Check console: "Found X items needing pricing refresh"
   - Watch Network tab: `refresh-pricing` calls return 200 (not 500)
   - Confirm prices update without page refresh

2. **Inventory (Minifigs - For Sale)**
   - Go to `/inventory`
   - Same checks as above
   - Verify "No sellers available" shows initially (not "Loading price...")
   - Prices should appear one-by-one

3. **Set Collection (Sets - Personal)**
   - Go to `/sets-collection`
   - Same checks as above

4. **Set Inventory (Sets - For Sale)**
   - Go to `/sets-inventory`
   - Same checks as above

### What to Watch For

**Good signs** ✅:
- Console: "Updated [item]: $XX.XX"
- Network: 200 status codes
- Prices appear progressively in UI
- No page refresh needed

**Bad signs** ❌:
- Console errors
- Network: 500 status codes
- Prices don't appear until page refresh
- "Loading price..." stuck forever
- Database connection errors

### Rollback Plan

If pricing breaks after deployment:

1. Check git log for last working commit
2. Revert pricing-related files:
   ```bash
   git checkout <last-working-commit> -- app/api/inventory/[id]/refresh-pricing/route.ts
   git checkout <last-working-commit> -- app/inventory/page.tsx
   git commit -m "Rollback pricing to working version"
   git push
   ```
3. Reference this document to understand what went wrong
4. Fix issue locally and test before redeploying

## Price Cache Pre-warming (IMPLEMENTED)

**Status**: ✅ Ready for deployment  
**Documentation**: See [PRICE_CACHE_PREWARMING.md](PRICE_CACHE_PREWARMING.md)

**What it does**:
- Background cron job runs every 6 hours
- Pre-fetches prices for all items in any user's collection
- Makes page loads **instant** (like BrickEconomy)
- No more waiting 3-5 minutes for prices to appear

**Setup**:
1. Add `CRON_SECRET` to environment
2. Configure Hostinger cron: `0 */6 * * *`
3. Endpoint: `/api/cron/refresh-collection-prices`

**Performance**:
- Processes up to 1,200 items per run (~1 hour)
- Stays within BrickLink's 5,000 calls/day limit
- Scales to thousands of items with prioritization

## Future Improvements

### Potential Optimizations
- [ ] Smart prioritization (refresh active items more frequently)
- [ ] Activity-based refresh (only items viewed recently)
- [ ] Parallel batching (5 items at once, faster but riskier)
- [ ] WebSocket for real-time price updates
- [ ] CDN caching for popular items

### Potential Features
- [ ] Price history tracking
- [ ] Price alert notifications
- [ ] Manual price refresh button
- [ ] Admin dashboard for cron monitoring
- [ ] Cache warmup on user signup
