# Currency Implementation Guide

## ⚠️ CRITICAL: How Currency Works in Bricklink API

### The Problem We Solved

**WRONG APPROACH** (caused all prices to show £0.00):
```typescript
// ❌ DON'T DO THIS - Filters to ONLY UK sellers
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}&country_code=GB`;
```

**CORRECT APPROACH** (shows worldwide sellers with GBP prices):
```typescript
// ✅ DO THIS - Shows all sellers, converts to GBP
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}&currency_code=GBP`;
```

---

## 🎯 Key Concepts

### Bricklink API Parameters

| Parameter | Purpose | Effect | When to Use |
|-----------|---------|--------|-------------|
| `country_code` | **FILTERS sellers** | Only shows sellers from that country | **NEVER for pricing** (too restrictive) |
| `currency_code` | **CONVERTS prices** | Shows ALL sellers with prices in that currency | **ALWAYS for pricing** |
| `region` | **FILTERS sellers** | Only shows sellers from that region | **NEVER for pricing** |

### Why This Matters

- **Rare items** (Star Wars minifigs, retired sets) often have:
  - ✅ **Many US sellers** (competitive prices)
  - ❌ **Few/no UK sellers** (would show £0.00)
  - ❌ **Few/no other country sellers**

- Using `country_code=GB` means:
  - Only UK sellers shown
  - Rare items = no sellers = £0.00
  - User sees "No sellers available" even though 1000+ US sellers exist

- Using `currency_code=GBP` means:
  - ALL worldwide sellers shown
  - Prices converted to GBP
  - User sees £1.45 from worldwide market

---

## ✅ Current Implementation

### Location: `lib/bricklink.ts`

#### Minifig Pricing
```typescript
async getPriceGuide(
  itemNo: string,
  condition: 'N' | 'U' = 'N',
  countryCode: string = 'US',  // Only used for cache key
  region: string = 'north_america',  // Not used
  currencyCode?: string  // Used for API call
): Promise<PriceGuide | null> {
  // ✅ CORRECT: No country filter, only currency conversion
  let url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}`;
  if (currencyCode) {
    url += `&currency_code=${currencyCode}`;
  }
  // Don't use country_code - it filters sellers which gives zeros for rare items
}
```

#### Set Pricing
```typescript
async getSetPriceGuide(
  boxNo: string,
  condition: 'N' | 'U' = 'N',
  countryCode: string = 'US',  // Only used for cache key
  region: string = 'north_america',  // Not used
  currencyCode?: string  // Used for API call
): Promise<PriceGuide | null> {
  // ✅ CORRECT: No country filter, only currency conversion
  let url = `/items/SET/${bricklinkNo}/price?new_or_used=${condition}`;
  if (currencyCode) {
    url += `&currency_code=${currencyCode}`;
  }
}
```

### Cache Key Structure

```typescript
// Cache key DOES use countryCode to separate USD from GBP prices
const cached = await prisma.priceCache.findUnique({
  where: {
    item_no_item_type_condition_country_code_region: {
      item_no: itemNo,
      item_type: 'MINIFIG',
      condition: condition,
      country_code: countryCode,  // Separates USD cache from GBP cache
      region: ''  // Always empty string
    }
  }
});
```

**Why separate cache by country_code?**
- USD prices are cached separately from GBP prices
- Prevents USD cache from showing when user switches to GBP
- Cache key uses country, but API call uses currency

---

## 🌍 Supported Currencies

All 23 currencies work the same way:

### North America
- **USD** (US Dollar) - `country_code: 'US'`
- **CAD** (Canadian Dollar) - `country_code: 'CA'`
- **MXN** (Mexican Peso) - `country_code: 'MX'`
- **GTQ** (Guatemalan Quetzal) - `country_code: 'GT'`

### Europe
- **GBP** (Pound Sterling) - `country_code: 'GB'`
- **EUR** (Euro) - `country_code: 'DE'`
- **CHF** (Swiss Franc) - `country_code: 'CH'`
- **NOK** (Norwegian Kroner) - `country_code: 'NO'`
- **SEK** (Swedish Krona) - `country_code: 'SE'`
- **DKK** (Danish Krone) - `country_code: 'DK'`
- **PLN** (Polish Zloty) - `country_code: 'PL'`
- **CZK** (Czech Koruna) - `country_code: 'CZ'`
- **HUF** (Hungarian Forint) - `country_code: 'HU'`
- **BGN** (Bulgarian Lev) - `country_code: 'BG'`
- **RON** (Romanian New Lei) - `country_code: 'RO'`
- **RUB** (Russian Rouble) - `country_code: 'RU'`

### Asia
- **JPY** (Japanese Yen) - `country_code: 'JP'`
- **KRW** (South Korean Won) - `country_code: 'KR'`
- **CNY** (Chinese Yuan) - `country_code: 'CN'`
- **HKD** (Hong Kong Dollar) - `country_code: 'HK'`
- **MOP** (Macau Pataca) - `country_code: 'MO'`
- **SGD** (Singapore Dollar) - `country_code: 'SG'`
- **MYR** (Malaysian Ringgit) - `country_code: 'MY'`
- **THB** (Thai Baht) - `country_code: 'TH'`
- **PHP** (Philippine Peso) - `country_code: 'PH'`

### Oceania
- **AUD** (Australian Dollar) - `country_code: 'AU'`
- **NZD** (New Zealand Dollar) - `country_code: 'NZ'`

---

## 🔄 How It Works (Complete Flow)

### 1. User Selects Currency
```typescript
// User settings: currency = 'GBP', countryCode = 'GB'
session.user.preferredCurrency = 'GBP';
session.user.preferredCountryCode = 'GB';
```

### 2. Price Request
```typescript
// calculatePricingData called with GB (for cache key)
const pricing = await bricklinkAPI.calculatePricingData(
  'sw1321',
  'used',
  'GB',  // Cache key only
  ''     // Empty region
);
```

### 3. Currency Derived
```typescript
// Get currency code from country code
const currencyConfig = getCurrencyByCountryCode('GB');
const currencyCode = currencyConfig?.code; // 'GBP'
```

### 4. API Call Made
```typescript
// Bricklink API called WITHOUT country filter
const url = `/items/MINIFIG/sw1321/price?new_or_used=U&currency_code=GBP`;
// Returns: { min_price: "0.54", avg_price: "1.45", total_quantity: 1748 }
```

### 5. Response Cached
```typescript
// Cached with GB key so it doesn't conflict with USD cache
await prisma.priceCache.create({
  data: {
    item_no: 'sw1321',
    item_type: 'MINIFIG',
    condition: 'used',
    country_code: 'GB',  // Cache separator
    region: '',
    currency_code: 'GBP',
    suggested_price: 1.45
  }
});
```

---

## 🧪 Testing

### Test Individual Item
```bash
# Test GBP pricing
GET /api/test-pricing?itemNo=sw1321&condition=used

# Expected response:
{
  "success": true,
  "countryCode": "GB",
  "currencyCode": "GBP",
  "pricing": {
    "suggestedPrice": 1.45,
    "currencyCode": "GBP"
  },
  "rawPriceGuide": {
    "currency_code": "GBP",
    "total_quantity": 1748  // ✅ Many sellers
  }
}
```

### Test Different Currency
```bash
# Change account to USD, then:
GET /api/test-pricing?itemNo=sw1321&condition=used

# Should show:
{
  "countryCode": "US",
  "currencyCode": "USD",
  "pricing": {
    "suggestedPrice": 1.99,  // Different price
    "currencyCode": "USD"
  }
}
```

### Clear Cache After Changes
```bash
# Visit in browser or POST:
GET /api/clear-price-cache

# Response:
{
  "success": true,
  "message": "Cleared 170 cached prices for GB",
  "count": 170
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ MISTAKE 1: Using country_code in API Call
```typescript
// ❌ DON'T DO THIS
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=U&country_code=GB`;
// Result: Only UK sellers → zeros for rare items
```

### ❌ MISTAKE 2: Not Passing currency_code
```typescript
// ❌ DON'T DO THIS
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=U`;
// Result: Prices in USD by default, even for GBP users
```

### ❌ MISTAKE 3: Using region Parameter
```typescript
// ❌ DON'T DO THIS
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=U&region=europe`;
// Result: Filters to only European sellers → zeros for rare items
```

### ❌ MISTAKE 4: Wrong Cache Key
```typescript
// ❌ DON'T DO THIS - No way to separate USD from GBP cache
const cached = await prisma.priceCache.findUnique({
  where: {
    item_no_condition: {  // Missing country_code
      item_no: itemNo,
      condition: condition
    }
  }
});
// Result: USD cache shows for GBP users
```

---

## ✅ Correct Patterns

### Pattern 1: Getting Currency from Country
```typescript
import { getCurrencyByCountryCode } from '@/lib/currency-config';

const countryCode = session.user.preferredCountryCode || 'US';
const currencyConfig = getCurrencyByCountryCode(countryCode);
const currencyCode = currencyConfig?.code || 'USD';
```

### Pattern 2: Making API Request
```typescript
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}&currency_code=${currencyCode}`;
// NO country_code parameter!
const data = await this.makeRequest(url);
```

### Pattern 3: Caching with Country Key
```typescript
await prisma.priceCache.upsert({
  where: {
    item_no_item_type_condition_country_code_region: {
      item_no: itemNo,
      item_type: 'MINIFIG',
      condition: condition,
      country_code: countryCode,  // Separates USD from GBP
      region: ''  // Always empty
    }
  },
  create: {
    currency_code: currencyCode,  // GBP, USD, EUR, etc.
    suggested_price: calculatedPrice
  }
});
```

---

## 📊 Real-World Example

### Scenario: UK user viewing sw1321 (Super Battle Droid)

#### Wrong Implementation (Before Fix)
```
User selects: GBP
API call: /price?country_code=GB  ❌
Bricklink returns: { total_quantity: 0 }  ← No UK sellers!
Display: "No sellers available"
User confused: "But Bricklink shows 1000+ sellers!"
```

#### Correct Implementation (After Fix)
```
User selects: GBP
API call: /price?currency_code=GBP  ✅
Bricklink returns: { 
  total_quantity: 1748,  ← Worldwide sellers!
  min_price: "0.54",
  avg_price: "1.45"
}
Display: "£1.45"
User happy: "Matches what I see on Bricklink!"
```

---

## 🔍 Debugging

### Check User Settings
```typescript
// GET /api/debug-cache
{
  "userPreferences": {
    "countryCode": "GB",
    "region": "europe",
    "currency": "GBP"
  },
  "cacheEntries": [
    {
      "country_code": "GB",
      "currency_code": "GBP",
      "suggested_price": 1.45  // ✅ Should have price
    }
  ]
}
```

### Check API Response
```typescript
// GET /api/test-pricing?itemNo=sw1321
{
  "rawPriceGuide": {
    "total_quantity": 1748,  // ✅ Should be > 0
    "currency_code": "GBP"
  }
}
```

### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| All prices show £0.00 | Using `country_code` in API | Remove `country_code` parameter |
| Prices show $ when set to £ | Not passing `currency_code` | Add `currency_code=${currencyCode}` |
| Switching currency shows wrong prices | Cache key doesn't include country | Verify cache uses `country_code` key |
| Some items have price, others don't | Old cache with zeros | Clear cache: `/api/clear-price-cache` |

---

## 📝 Summary

### The Golden Rules

1. **NEVER** use `country_code` parameter in Bricklink API price calls
2. **ALWAYS** use `currency_code` parameter for price conversion
3. **DO** use `country_code` in cache keys to separate currencies
4. **DON'T** use `region` parameter (same problem as country_code)

### Why It Works

- **Worldwide sellers** = More sellers = Better prices = No zeros
- **Currency conversion** = User sees their currency = Good UX
- **Matches Bricklink.com** = User expectations met

### Files to Review

When making changes, check these files:
- `lib/bricklink.ts` - API calls and caching
- `lib/currency-config.ts` - Currency mappings
- `app/api/*/route.ts` - API endpoints using pricing
- `prisma/schema-hostinger.prisma` - Cache structure

---

## 🎯 Quick Reference

```typescript
// ✅ CORRECT PATTERN - Copy this!
const currencyConfig = getCurrencyByCountryCode(countryCode);
const currencyCode = currencyConfig?.code || 'USD';
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}&currency_code=${currencyCode}`;
```

```typescript
// ❌ WRONG PATTERN - Never do this!
const url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}&country_code=${countryCode}`;
```

---

**Last Updated:** 2026-04-23  
**Issue Fixed:** All currencies showing £0.00 / $0.00 due to country filtering  
**Solution:** Remove country_code filter, use only currency_code for conversion  
**Result:** All 23 currencies now work with worldwide sellers ✅
