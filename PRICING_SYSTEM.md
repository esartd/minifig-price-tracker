# Pricing System Documentation

## Overview
FigTracker uses a centralized caching system to minimize Bricklink API calls while keeping prices fresh. All pricing data flows through the `priceCache` table with 6-hour expiration.

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

### Progressive Fetch

```javascript
// Show items immediately with cached prices
setCollection(data.data);
setLoading(false);

// Fetch missing prices in background
// IMPORTANT: Use Promise.all(map(...)) NOT forEach for proper async handling
const refreshPromises = itemsNeedingRefresh.map(async (item) => {
  const priceResponse = await fetch(`/api/inventory/${item.id}/refresh-pricing`, {
    method: 'POST'
  });
  const priceData = await priceResponse.json();
  
  if (priceData.success && priceData.data) {
    // Update state with new pricing - triggers re-render
    setCollection(prev => 
      prev.map(i => i.id === item.id ? priceData.data : i)
    );
  }
});

// Await all updates (ensures cleanup, doesn't block rendering)
await Promise.all(refreshPromises);
```

**Why Promise.all instead of forEach:**
- `forEach` does NOT handle async callbacks properly
- State updates can be missed or batched incorrectly in React 18
- `Promise.all` ensures all async operations are tracked
- Guarantees React re-renders as each price arrives

**Bug History (April 2026):**
- Issue: Prices fetched but UI didn't update without page refresh
- Cause: `forEach(async ...)` doesn't properly await async operations
- Fix: Changed to `Promise.all(map(...))` for proper async handling
- Commit: b4a1e8f "Fix inventory pricing not updating without page refresh"

## API Endpoints

### GET /api/inventory
- Returns all minifigures for user
- Pricing attached from priceCache
- Query param: `?all=true` (fetch all at once)

### GET /api/set-inventory  
- Returns all sets for user
- Pricing attached from priceCache
- Query param: `?all=true` (fetch all at once)

### POST /api/inventory/[id]/refresh-pricing
- Fetches fresh price from Bricklink API
- Saves to priceCache (6-hour expiration)
- Updates item table columns (backup)
- Returns updated item with pricing

### POST /api/set-inventory/[id]/refresh-pricing
- Same as above but for sets

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

## Future Improvements

### Potential Optimizations
- [ ] Preload prices for popular items
- [ ] Batch refresh-pricing endpoint (update multiple at once)
- [ ] Background job to refresh expiring prices
- [ ] WebSocket for real-time price updates
- [ ] CDN caching for popular items

### Potential Features
- [ ] Price history tracking
- [ ] Price alert notifications
- [ ] Manual price refresh button
- [ ] Cache warmup on user signup
- [ ] Smart refresh (only fetch if viewed recently)
