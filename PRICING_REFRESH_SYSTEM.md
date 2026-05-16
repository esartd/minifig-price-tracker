# Pricing Refresh System (Blue Dot System)

**Last Updated:** 2026-05-16

## 🚨 CRITICAL: How Price Refresh Works

**DO NOT MODIFY WITHOUT UNDERSTANDING THIS ENTIRE DOCUMENT**

## Overview

The pricing refresh system automatically updates stale prices when users visit their collection pages. Items with prices >6 hours old show **blue dots** and refresh progressively without blocking the UI.

## Key Components

### 1. Backend: Price Data with Timestamp (`lib/bricklink.ts`)

**CRITICAL:** `calculatePricingData()` MUST return `cached_at` field

```typescript
// ✅ CORRECT - includes cached_at
return {
  sixMonthAverage: cached.six_month_avg,
  currentAverage: cached.current_avg,
  currentLowest: cached.current_lowest,
  suggestedPrice: cached.suggested_price,
  currencyCode: cached.currency_code,
  cached_at: cached.cached_at.toISOString(), // ← REQUIRED
};

// ❌ WRONG - missing cached_at
return {
  sixMonthAverage: cached.six_month_avg,
  // ... other fields without cached_at
};
```

**Locations that return pricing data (ALL must include `cached_at`):**
- Line 514-521: Cache hit case
- Line 562-569: API failure fallback
- Line 614-621: No sellers case (×2 locations)
- Line 707-714: Fresh API data
- Line 839-847: Set pricing cache hit

**Why this matters:**
- Without `cached_at`, frontend can't check cache age
- No cache age check = no blue dots
- No blue dots = no refresh triggered
- Result: Stale prices never update

### 2. Database Layer: Pass cached_at Through (`lib/database.ts`)

**CRITICAL:** Database functions MUST include `cached_at` when mapping from priceCache

**Functions that fetch prices from cache:**
- `getAllItems()` - Minifig inventory
- `getAllPersonalCollectionItems()` - Minifig collection
- `getAllSetInventoryItems()` - Sets inventory
- `getAllSetPersonalCollectionItems()` - Sets collection

**Step 1: Copy cached_at from priceCache (4 locations, ~lines 200, 310, 607, 725):**

```typescript
// ✅ CORRECT - includes cached_at
if (freshPrice) {
  return {
    ...item,
    pricing_six_month_avg: freshPrice.six_month_avg,
    pricing_current_avg: freshPrice.current_avg,
    pricing_current_lowest: freshPrice.current_lowest,
    pricing_suggested_price: freshPrice.suggested_price,
    pricing_currency_code: freshPrice.currency_code,
    pricing_cached_at: freshPrice.cached_at  // ← REQUIRED
  };
}

// ❌ WRONG - missing cached_at
if (freshPrice) {
  return {
    ...item,
    pricing_six_month_avg: freshPrice.six_month_avg,
    // ... other fields without pricing_cached_at
  };
}
```

**Step 2: Include cached_at in transform functions (4 functions):**

```typescript
// ✅ CORRECT - transformFromDB() and others
pricing: item.pricing_six_month_avg !== undefined && item.pricing_six_month_avg !== null ? {
  sixMonthAverage: item.pricing_six_month_avg,
  currentAverage: item.pricing_current_avg,
  currentLowest: item.pricing_current_lowest,
  suggestedPrice: item.pricing_suggested_price,
  currencyCode: item.pricing_currency_code,
  cached_at: item.pricing_cached_at ? item.pricing_cached_at.toISOString() : undefined  // ← REQUIRED
} : undefined,

// ❌ WRONG - missing cached_at
pricing: item.pricing_six_month_avg !== undefined && item.pricing_six_month_avg !== null ? {
  sixMonthAverage: item.pricing_six_month_avg,
  // ... other fields without cached_at
} : undefined,
```

**Transform functions that MUST include cached_at:**
- `transformFromDB()` - Converts DB row to CollectionItem
- `transformPersonalFromDB()` - Converts DB row to PersonalCollectionItem
- `transformSetInventoryFromDB()` - Converts DB row to SetInventoryItem
- `transformSetPersonalFromDB()` - Converts DB row to SetPersonalCollectionItem

**Why this matters:**
- PriceCache table HAS `cached_at`
- But if database layer doesn't pass it through, it's lost
- Frontend receives pricing object WITHOUT `cached_at`
- Same symptoms as backend not returning it

**Data flow:**
```
priceCache table (HAS cached_at)
  ↓
getAllItems() copies fields → pricing_cached_at
  ↓
transformFromDB() builds pricing object → cached_at
  ↓
API returns to frontend → item.pricing.cached_at
  ↓
Frontend checks cache age → blue dots work
```

### 3. Frontend: Cache Age Check (Collection Pages)

**Files:**
- `app/inventory/page.tsx`
- `app/collection/page.tsx`
- `app/sets-inventory/page.tsx`
- `app/sets-collection/page.tsx`

**CRITICAL Logic (Lines ~100-113 in each file):**

```typescript
const itemsNeedingRefresh = data.data.filter((item: CollectionItem) => {
  // Refresh if no pricing at all
  if (!item.pricing || item.pricing.suggestedPrice === 0) return true;

  // Refresh if wrong currency
  if (item.pricing.currencyCode !== userCurrency) return true;

  // ⚠️ CRITICAL: Check if cached_at is missing FIRST
  if (!item.pricing.cached_at) return true; // Missing = needs refresh

  // Then check if cache is older than 6 hours
  const cacheAge = Date.now() - new Date(item.pricing.cached_at).getTime();
  if (cacheAge > SIX_HOURS_MS) return true;

  return false;
});
```

**Order matters:**
1. First check if `cached_at` is missing → refresh
2. Then check if `cached_at` > 6 hours → refresh

**DO NOT change this to:**
```typescript
// ❌ WRONG - won't catch missing cached_at
if (item.pricing.cached_at) {
  const cacheAge = Date.now() - new Date(item.pricing.cached_at).getTime();
  if (cacheAge > SIX_HOURS_MS) return true;
}
```

### 3. Blue Dot Display (`components/CollectionList.tsx`)

**State variables:**
- `staleItems: Set<string>` - IDs of items with stale prices
- `itemsUpdating: Set<string>` - IDs currently being fetched

**Blue dot appears when:** `staleItems.has(item.id)`

**Blue dot disappears when:** Item is removed from `staleItems` after successful refresh

**Lines ~122-124 (inventory page example):**
```typescript
// Mark ALL stale items with blue dots
const staleItemIds = new Set<string>(itemsNeedingRefresh.map(item => item.id));
setStaleItems(staleItemIds);
```

**Lines ~172-177 (inventory page example):**
```typescript
// Remove from stale items (blue dot disappears)
setStaleItems(prev => {
  const next = new Set(prev);
  next.delete(item.id);
  return next;
});
```

### 4. Progressive Fetch (3-Second Delays)

**CRITICAL:** Must respect BrickLink API 3-second rule

**Lines ~127-195 (inventory page example):**
```typescript
let currentIndex = 0;

const fetchNextItem = async () => {
  if (currentIndex >= itemsNeedingRefresh.length) {
    // All done
    setPricesUpdating(0);
    setPricesFetching(false);
    return;
  }

  const item = itemsNeedingRefresh[currentIndex];
  currentIndex++;

  // Mark as updating
  setItemsUpdating(prev => new Set(prev).add(item.id));

  try {
    // Call refresh API
    const response = await fetch(`/api/inventory/${item.id}/refresh-pricing`, {
      method: 'POST'
    });
    const result = await response.json();

    if (result.success && result.data) {
      // Update collection with new pricing
      setCollection(prev => prev.map(i =>
        i.id === item.id ? result.data : i
      ));
    }
  } catch (err) {
    console.error(`Error fetching ${item.minifigure_no}:`, err);
  }

  // Remove from updating and stale sets
  setItemsUpdating(prev => {
    const next = new Set(prev);
    next.delete(item.id);
    return next;
  });

  setStaleItems(prev => {
    const next = new Set(prev);
    next.delete(item.id);
    return next;
  });

  // ⚠️ CRITICAL: 3-second delay before next item
  setTimeout(fetchNextItem, 3000); // DO NOT CHANGE THIS
};

fetchNextItem(); // Start the chain
```

**DO NOT:**
- Remove the 3-second delay
- Use `Promise.all()` to fetch multiple items at once
- Call `fetchNextItem()` in a loop
- Reduce delay below 3000ms

**See:** [BRICKLINK_API_COMPLIANCE.md](BRICKLINK_API_COMPLIANCE.md)

## Data Flow Diagram

```
User visits collection page
  ↓
API returns items with pricing (includes cached_at)
  ↓
Frontend checks each item:
  - No cached_at? → Mark as stale
  - cached_at >6 hours? → Mark as stale
  - Otherwise → Fresh, no action
  ↓
Stale items get blue dots
  ↓
Progressive fetch starts (one item every 3 seconds)
  ↓
For each item:
  1. Call /api/{collection}/{id}/refresh-pricing
  2. Backend calls bricklinkAPI.calculatePricingData()
  3. Backend checks priceCache for cached data
  4. If cache >6 hours or missing, fetch from BrickLink API
  5. Save to priceCache with cached_at = now
  6. Return pricing WITH cached_at
  7. Frontend updates item
  8. Remove blue dot
  9. Wait 3 seconds
  10. Fetch next item
```

## Testing

### How to verify it's working:

1. **Visit collection page** (`/inventory`, `/collection`, `/sets-inventory`, `/sets-collection`)

2. **Check console logs:**
   ```
   Found X items needing pricing refresh (current currency: USD)
   🔄 Fetching prices for X items progressively...
   [1/X] Fetching price for sw0001...
     ✅ Updated sw0001: $45.00
   [2/X] Fetching price for sw0002...
   ```

3. **Visual check:**
   - Blue dots appear on stale items
   - Blue dots disappear one-by-one as prices update
   - Progress indicator shows "Updating prices... X/Y"

4. **Network tab:**
   - One request every 3 seconds to `/api/{collection}/{id}/refresh-pricing`
   - NO faster than 3 seconds between requests

### How to force a refresh (for testing):

**Option 1:** Clear priceCache for a specific item
```sql
DELETE FROM "priceCache" WHERE item_no = 'sw0001';
```

**Option 2:** Set expires_at to past date
```sql
UPDATE "priceCache" 
SET expires_at = NOW() - INTERVAL '1 day'
WHERE item_no = 'sw0001';
```

**Option 3:** Remove cached_at (simulates old data)
```sql
UPDATE "CollectionItem" 
SET pricing_six_month_avg = pricing_six_month_avg
WHERE id = 'some-id';
-- This removes cached_at from pricing object
```

## Common Issues

### Issue 1: No blue dots appear

**Symptom:** Items don't show blue dots even though prices are old

**Causes:**
1. `calculatePricingData()` not returning `cached_at`
2. Frontend check logic wrong (checks `if (cached_at)` instead of `if (!cached_at)`)
3. `staleItems` state not being set

**Fix:** Check backend returns `cached_at`, verify frontend logic order

### Issue 2: Blue dots appear but nothing refreshes

**Symptom:** Blue dots show but stay forever, no progress

**Causes:**
1. Progressive fetch not starting (`fetchNextItem()` not called)
2. API endpoint errors (check console for 500/400 errors)
3. `setTimeout` not triggering next item

**Fix:** Check console for errors, verify API endpoints work

### Issue 3: Prices refresh but blue dots don't disappear

**Symptom:** Prices update but blue dots remain

**Causes:**
1. `setStaleItems()` not removing item ID after refresh
2. Item ID mismatch between stale set and collection

**Fix:** Verify `staleItems` state is updated after each fetch

### Issue 4: "No sellers available" instead of prices

**Symptom:** Items show "No sellers available" when they should have prices

**Causes:**
1. BrickLink API rate limit reached (too many requests)
2. Item genuinely has no sellers
3. Currency mismatch (requesting wrong currency)

**Fix:** Check API logs, verify currency matches user preference

## Incident History

### May 16, 2026: Blue dots not appearing for 2 days

**Problem:** 
- `calculatePricingData()` returned pricing WITHOUT `cached_at` field
- Frontend couldn't check cache age
- No blue dots appeared
- No refresh triggered

**Root Cause:**
- Lines 514-520, 562-569, 614-621, 707-714, 839-847 in `lib/bricklink.ts` returned pricing objects without `cached_at`

**Fix:**
- Added `cached_at: cached.cached_at.toISOString()` to all return statements
- Added `cached_at: new Date().toISOString()` for fresh data

**Lesson:** ALL pricing return statements must include `cached_at`

### May 16, 2026: Existing items not refreshing after fix

**Problem:**
- Backend fixed to include `cached_at`
- But existing items in collections had no `cached_at`
- Frontend check `if (item.pricing.cached_at)` didn't catch missing field

**Fix:**
- Changed check to `if (!item.pricing.cached_at) return true;` FIRST
- Then check cache age

**Lesson:** Always handle missing data gracefully - check for absence before checking value

### May 16, 2026: Sets showing no prices even after backend fix

**Problem:**
- Backend (`bricklink.ts`) fixed to return `cached_at` ✅
- Frontend (collection pages) fixed to check for `cached_at` ✅
- But sets collections still showed no prices
- Console showed "Found X items needing pricing refresh" but items had prices in database

**Root Cause:**
- `priceCache` table HAD `cached_at` timestamps
- `database.ts` functions fetched from priceCache
- But mapping functions **didn't copy `cached_at` field**
- Transform functions built `pricing` object **without `cached_at`**
- Frontend received pricing WITHOUT `cached_at`
- Frontend treated it as stale and triggered refresh

**Affected Functions (4 total):**
- `getAllItems()` - line ~200
- `getAllPersonalCollectionItems()` - line ~310
- `getAllSetInventoryItems()` - line ~607
- `getAllSetPersonalCollectionItems()` - line ~725

**Affected Transform Functions (4 total):**
- `transformFromDB()`
- `transformPersonalFromDB()`
- `transformSetInventoryFromDB()`
- `transformSetPersonalFromDB()`

**Fix:**
1. Added `pricing_cached_at: freshPrice.cached_at` when copying from priceCache
2. Added `cached_at: item.pricing_cached_at?.toISOString()` in transform functions

**Lesson:** 
- **Data must flow through ALL layers:** Backend → Database → API → Frontend
- Missing `cached_at` at ANY layer breaks the entire system
- Test the complete data flow, not just individual functions

## Related Documentation

- [BRICKLINK_API_COMPLIANCE.md](BRICKLINK_API_COMPLIANCE.md) - API rate limits and rules
- [PRICING_SYSTEM.md](PRICING_SYSTEM.md) - Overall pricing architecture
- [CLAUDE.md](CLAUDE.md) - Critical system warnings

## Summary

**The pricing refresh system has 4 critical requirements:**

1. **Backend MUST return `cached_at` with every pricing object**
   - Location: `lib/bricklink.ts` - all return statements in `calculatePricingData()` and `calculateSetPricing()`

2. **Database layer MUST pass `cached_at` through from priceCache to frontend**
   - Location: `lib/database.ts` - 4 fetch functions (add `pricing_cached_at`)
   - Location: `lib/database.ts` - 4 transform functions (add `cached_at` to pricing object)

3. **Frontend MUST check for missing `cached_at` FIRST, then check cache age**
   - Location: All 4 collection page.tsx files (~line 107)

4. **Progressive fetch MUST use 3-second delays between requests**
   - Location: All 4 collection page.tsx files (~line 192)

**Break any of these = blue dots don't work = prices never refresh**

**Data flow chain (ALL must include cached_at):**
```
bricklink.ts → priceCache table → database.ts → API → Frontend
     ✅              ✅              ✅          ✅      ✅
```
