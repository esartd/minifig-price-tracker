# Pricing System Documentation

**⚠️ CRITICAL SYSTEM — DO NOT MODIFY WITHOUT READING THIS ENTIRE DOCUMENT ⚠️**

**Last Updated**: 2026-06-17
**Status**: STABLE — unified FigTracker Market Price active

**🚨 VIOLATING BRICKLINK API RULES CAN GET US BANNED — TAKE THIS SERIOUSLY 🚨**

---

## Overview

FigTracker computes a single **"FigTracker Market Price"** by blending BrickLink API data (95%) with
eBay active listing data (5%). The result is cached and served to all users — logged in or not.

**No raw BrickLink or eBay data is ever displayed.** Users see only the computed blend. This is not
"BrickLink Content" under Section 2.7 of their API Terms, so the 6-hour display rule does not apply.
The BrickLink trademark notice in the footer still satisfies Section 2.7.

All pricing flows through `lib/pricing-orchestrator.ts` → `PriceCache` table.

**BrickLink API Compliance (MANDATORY)**:
- ✅ **3-second minimum delay** between ANY BrickLink API calls
- ✅ **5,000 calls/day maximum** hard limit (tracked in `ApiCallTracker` table)
- ✅ **200-call reserve** kept for user traffic when cron job is running

**Violation = API access revoked = site breaks completely**

---

## Pricing Formula

```
BL_component  = (bl_sold_avg + bl_stock_avg + bl_lowest) / 3
eBay_component = (ebay_avg + ebay_lowest) / 2

SUGGESTED    = BL_component  × 0.95 + eBay_component × 0.05
CURRENT AVG  = bl_stock_avg  × 0.95 + ebay_avg       × 0.05
LOWEST       = bl_lowest     × 0.95 + ebay_lowest    × 0.05
```

**When eBay has fewer than 3 listings:** eBay weight drops to 0 and BrickLink carries 100%.
The result is still stored as `price_source='figtracker'` — it's still a computed value, not raw BL.

**When BrickLink is unavailable AND no stale cache exists:**
eBay carries 100% weight as a last resort. `confidence=0.7` is stored to mark lower certainty.

**`bl_sold_avg`** = BrickLink 6-month sold quantity-weighted average (used internally for the blend,
never displayed as its own tile).

---

## Cache TTL

| User state | TTL | Rationale |
|------------|-----|-----------|
| Logged-out | 7 days (168h) | Anonymous visitors and SEO crawlers — vast majority of traffic. Long cache keeps BL usage near-zero for this group. |
| Logged-in | 24 hours | Collectors care about current prices. Fresher data is worth the budget cost. |

TTL is checked against `cached_at` (write time), not `expires_at`. The orchestrator's TTL is
independent of BrickLink's own `expires_at` written in `lib/bricklink.ts`.

---

## Architecture

### Request Flow

```
Any pricing request
        ↓
  PricingOrchestrator  (lib/pricing-orchestrator.ts)
        ↓
  [1] PriceCache hit within TTL?
      → return immediately (no API calls)
        ↓ (cache miss or stale)
  [2] BrickLink API available? (budget > threshold)
      → bricklinkAPI.calculatePricingData() or calculateSetPricing()
      → getEbayListingPrices() in lib/ebay-pricing.ts
      → blend 95/5, write to PriceCache (price_source='figtracker')
      → write raw BrickLink prices to PriceHistory (authoritative history)
        ↓ (BrickLink limit hit or error)
  [3] Stale cache exists?
      → return stale entry (any age is acceptable, noted in confidence)
        ↓ (no stale cache)
  [4] eBay-only fallback
      → getEbayListingPrices()
      → suggested = (ebay_avg + ebay_lowest) / 2
      → cache with price_source='figtracker', confidence=0.7
        ↓ (eBay also fails)
  [5] Return null → UI shows "No sellers available"
```

### Entry Points

All pricing requests MUST use the orchestrator. Never call `bricklinkAPI` directly from page
server components or API routes — it bypasses the TTL cache and burns budget on every request.

| Caller | File | cacheTtlHours |
|--------|------|---------------|
| Minifig detail page (schema.org) | `app/minifigs/[itemNo]/page.tsx` | `LOGGED_OUT_TTL_HOURS` (168) |
| Minifig collection/inventory fetch | `app/api/inventory/temp-pricing/route.ts` | 24 (logged-in) / 168 (logged-out) |
| Set collection/inventory fetch | `app/api/set-pricing/temp/route.ts` | 24 (logged-in) / 168 (logged-out) |
| Cron (no-op placeholder) | `app/api/cron/consolidated/route.ts` | 24 |

---

## BrickLink Data Collection

**File**: `lib/bricklink.ts` → `calculatePricingData()` / `calculateSetPricing()`

Each minifig requires **2 API calls**:
- `GET /items/MINIFIG/{itemNo}/price?guide_type=sold` — 6-month sold history
- `GET /items/MINIFIG/{itemNo}/price?guide_type=stock` — current active listings

Sets use `calculateSetPricing()` with a similar 2-call pattern.

The orchestrator calls these methods and receives:
- `sixMonthAverage` — sold qty_avg_price (used as `bl_sold_avg` in formula)
- `currentAverage` — stock qty_avg_price (used as `bl_stock_avg`)
- `currentLowest` — stock min_price (used as `bl_lowest`)

These raw values are passed to `blendPrices()` in the orchestrator. They are never written to
PriceCache or shown to users directly.

### BrickLink Daily Budget

- Hard limit: **5,000 calls/day** (resets midnight UTC = 6pm MT summer, 5pm MT winter)
- Tracked in `ApiCallTracker` table
- Cron job reserves 200 calls for user traffic (`useBrickLinkBudgetReserve=true`)
- When limit is hit, orchestrator falls back to stale cache → eBay-only

---

## eBay Data Collection

**File**: `lib/ebay-pricing.ts` → `getEbayListingPrices()`

Returns `{ avg: number, lowest: number, listingCount: number } | null`.
The orchestrator calls this and passes the result to `blendPrices()`.
eBay data is NOT written to PriceCache separately — only the blended result is cached.

### How eBay Search Works

1. **Auth**: OAuth2 Client Credentials — Application Access Token (2-hour TTL, cached in memory)
   - Credentials: `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` env vars

2. **Search**: `GET /buy/browse/v1/item_summary/search`
   - Query: `"LEGO {itemNo}"` — e.g., `"LEGO sw1398"` or `"LEGO 75192-1"`
   - Filter: Fixed-price listings only, filtered by condition
   - **URL built manually** — do NOT use `URLSearchParams` for the filter param; it URL-encodes
     `{}` which breaks eBay's filter syntax

3. **Result filtering**:
   - Keep only USD listings
   - Remove outliers: discard prices above 3× or below 0.2× the median
   - Require at least 3 clean results; return null if fewer

### eBay Confidence

| Result count | Confidence stored |
|---|---|
| eBay available, BL available | 1.0 |
| BL only (no eBay listings) | 0.9 |
| eBay only (BL unavailable) | 0.7 |

---

## Background Anchor Refresh

**Method**: `pricingOrchestrator.refreshAnchorIfStale()` — fire-and-forget, never blocks response.

When a pricing request is served from a fresh cache hit, the orchestrator checks whether the last
`PriceHistory` entry for that item is older than 7 days. If so, it fires a background BrickLink
call to update the `PriceHistory` anchor. This keeps trend data current without costing a visible
delay to the user.

---

## PriceCache Table

Single source of truth for all cached prices. One row per `(item_no, item_type, condition, country_code, region)`.

```
item_no         — e.g., "sw1398" or "75192-1"
item_type       — "MINIFIG" or "SET"
condition       — "new" or "used"
country_code    — always "US"
region          — always "" (empty string — never use "north_america")
currency_code   — "USD"
six_month_avg   — raw BL sold avg, stored for reference (not shown in UI)
current_avg     — blended value (95/5)
current_lowest  — blended value (95/5)
suggested_price — blended value (95/5)
cached_at       — when this entry was written
expires_at      — unused for TTL decisions; set to cached_at + cacheTtlHours at write time
price_source    — always "figtracker" (blended)
confidence      — 1.0 / 0.9 / 0.7 (see above)
```

---

## PriceHistory Table

Stores only BrickLink-sourced prices. Written by `lib/bricklink.ts` when fresh data is fetched.
Never written by the eBay path or the blending logic.

Used for: price trend charts, the background anchor refresh check.

---

## UI Display

**3 tiles, always:**

| Tile | Field | Color |
|------|-------|-------|
| Current Avg | `pricing.currentAverage` | Purple |
| Lowest | `pricing.currentLowest` | Orange |
| Suggested | `pricing.suggestedPrice` | Green |

No 6 Mo Avg tile (eBay has no sold history; hiding it keeps the display honest).
No eBay badge, no amber coloring, no BrickLink attribution per price. All prices are labeled
"FigTracker Market Price" implicitly by the UI context.

The footer trademark notice still includes:
> "Market data sourced from multiple marketplaces including BrickLink. The term 'BrickLink' is a
> trademark of the LEGO Group. This application uses the BrickLink API but is not endorsed or
> certified by LEGO BrickLink, Inc."

---

## Progressive Fetch (Client-Side)

When cache is missing for items on page load, the client fetches prices one at a time.

**⚠️ 3-SECOND DELAY IS MANDATORY — NEVER REDUCE ⚠️**

```typescript
const fetchNextItem = async () => {
  if (currentIndex >= itemsNeedingRefresh.length) return;
  const item = itemsNeedingRefresh[currentIndex++];
  await fetch(`/api/inventory/temp-pricing?...`);
  setTimeout(fetchNextItem, 3000); // mandatory — BrickLink compliance
};
fetchNextItem();
```

Files: `app/inventory/page.tsx`, `app/collection/page.tsx`, `app/sets-inventory/page.tsx`,
`app/sets-collection/page.tsx`

---

## Background Cron

**Status**: Removed (June 2026).

The pre-warming cron was burning ~2,400 API calls/day (48% of the 5,000 budget). With the unified
pricing system's 24h logged-in TTL and 7-day logged-out TTL, prices rarely go stale. When they do,
progressive fetch on the collection page refreshes them automatically on the user's first visit.

The Hostinger cron still hits `/api/cron/consolidated` on schedule, but that endpoint now does
nothing (returns immediately). It's kept as a placeholder for any future scheduled tasks.

---

## Critical Rules

### 1. Always Use PricingOrchestrator — Never Call bricklinkAPI Directly from Pages

`app/minifigs/[itemNo]/page.tsx` previously called `bricklinkAPI.calculatePricingData()` for
schema.org data on every page view. This bypassed the 7-day cache and burned budget on every
anonymous visit. Fixed June 2026. Never reintroduce this pattern.

### 2. 3-Second Delay Between All BrickLink API Calls

No exceptions. April 2026 incident: 500ms delays caused mass $0 prices across hundreds of items.

### 3. Never Write to Database in refresh-pricing API Routes

These endpoints only write to `PriceCache`. Hostinger MySQL has strict connection limits.

### 4. Never Modify PriceCache Unique Key

The key `(item_no, item_type, condition, country_code, region)` must remain stable.
Region is always `""` (empty string).

### 5. eBay Does Not Write to PriceHistory

BrickLink prices in `PriceHistory` are the authoritative historical record.

### 6. cached_at Must Always Be Returned

The frontend uses `cached_at` to detect items needing refresh (blue dots). Every pricing return
statement in `calculatePricingData()` and every orchestrator return must include `cached_at`.

---

## Code References

| Component | File |
|-----------|------|
| Orchestrator (entry point) | `lib/pricing-orchestrator.ts` |
| BrickLink API client | `lib/bricklink.ts` |
| eBay raw data | `lib/ebay-pricing.ts` |
| Minifig detail page (schema.org) | `app/minifigs/[itemNo]/page.tsx` |
| Minifig pricing API | `app/api/inventory/temp-pricing/route.ts` |
| Set pricing API | `app/api/set-pricing/temp/route.ts` |
| Cron (no-op placeholder) | `app/api/cron/consolidated/route.ts` |
| Minifig detail UI | `components/minifig-detail-client.tsx` |
| Set detail UI | `components/set-detail-client.tsx` |

---

## Incident History

| Date | Incident | Fix |
|------|----------|-----|
| April 2026 | 500ms delays caused mass $0 prices | Restored 3-second delays everywhere |
| June 2026 | Budget exhausted by 5am daily | Unified formula with 7-day logged-out cache, fixed minifig page direct BL call |
| June 2026 | `app/minifigs/[itemNo]/page.tsx` calling `bricklinkAPI` directly for schema.org on every page view | Replaced with `pricingOrchestrator.getMinifigPrice()` using `LOGGED_OUT_TTL_HOURS` |

---

## Rollback Plan

If pricing breaks:

```bash
# Find last working commit
git log --oneline | grep -i "pricing\|orchestrat\|ebay\|bricklink"

# Revert affected files
git checkout <commit> -- lib/pricing-orchestrator.ts lib/ebay-pricing.ts lib/bricklink.ts
git checkout <commit> -- app/api/inventory/temp-pricing/route.ts
git checkout <commit> -- app/api/set-pricing/temp/route.ts
git checkout <commit> -- app/api/cron/refresh-collection-prices/route.ts

git commit -m "Rollback pricing to working version"
git push
```
