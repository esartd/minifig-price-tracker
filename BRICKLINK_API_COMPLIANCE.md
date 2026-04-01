# BrickLink API Compliance Review

**Date:** 2026-03-17
**Status:** CRITICAL ISSUES FOUND - Requires Immediate Attention

## Current Issues Identified

### 1. RATE LIMITING VIOLATION (CRITICAL)
**Evidence:** Consumer Key `39E2D89370FF46069B15DA124C907EBF` was blocked after ~10,780 requests

**Current Implementation:**
- [enumerate-catalog.ts:134](scripts/enumerate-catalog.ts#L134): Only 100ms delay between requests
- [enumerate-catalog.ts:121](scripts/enumerate-catalog.ts#L121): Additional 100ms for variant checks
- No exponential backoff or retry logic
- No request rate tracking or throttling

**Risk:** API key permanent ban, service disruption

**Required Changes:**
- Increase minimum delay to 2-5 seconds between API requests
- Implement proper rate limiting (max requests per hour/day)
- Add exponential backoff for errors
- Add request queuing system

---

### 2. WEB SCRAPING WITHOUT EXPLICIT PERMISSION

**Files:**
- [lib/bricklink-scraper.ts](lib/bricklink-scraper.ts) - Puppeteer scraping of price guide pages
- [lib/bricklink.ts:189-193](lib/bricklink.ts#L189-L193) - Parallel API + scraping calls

**Current Scraping:**
- Price guide pages: `https://www.bricklink.com/catalogPG.asp?M={itemNo}`
- "Appears In" pages: `https://www.bricklink.com/catalogItemIn.asp?M={itemNo}`
- Uses stealth techniques to bypass detection (line 30-34, 160-164)

**Concerns:**
- Most terms of service prohibit automated scraping
- Stealth headers to avoid detection may violate ToS
- No robots.txt compliance check
- Concurrent with API usage increases load

**Recommendation:**
- Check if scraping is explicitly allowed in BrickLink ToS
- Consider API-only approach if scraping violates terms
- Implement robots.txt compliance
- Add longer delays between scrape requests (30-60 seconds minimum)

---

### 3. BULK ENUMERATION STRATEGY

**Current Approach:**
- Brute-force checking of 10,000+ sequential IDs
- 28 different theme prefixes checked exhaustively
- Variant checking (a, b, c, d suffixes) for every valid item

**Issues:**
- Extremely high request volume in short timeframe
- Purpose appears to be catalog building (data collection at scale)
- May be considered database mirroring/replication

**Better Approach:**
- Use incremental updates (check only recent ranges)
- Implement caching to avoid re-checking known items
- Space out enumeration over days/weeks, not hours
- Consider requesting bulk data access from BrickLink directly

---

### 4. MISSING ATTRIBUTION

**Required in most API ToS:**
- Display "Powered by BrickLink" or similar attribution
- Link back to BrickLink for data sources
- Copyright notice for BrickLink data

**Current Implementation:**
- [README.md:207](README.md#L207) has acknowledgment section
- No visible attribution in web UI
- No copyright notices in code comments

**Action Required:**
- Add visible attribution to UI (footer/header)
- Include BrickLink copyright in data displays
- Add ToS compliance statement

---

### 5. COMMERCIAL USE CONSIDERATIONS

**Current Project:** Personal collection management tool

**Concerns:**
- If deployed publicly, may be considered commercial use
- If monetized (ads, subscriptions), definitely commercial
- API keys are often restricted to personal/non-commercial use

**Verification Needed:**
- Check if your API key tier allows public deployment
- Verify if commercial use requires different licensing
- Confirm if pricing data can be displayed publicly

---

## Recommended Code Changes

### Priority 1: Rate Limiting (URGENT)

```typescript
// Add to lib/bricklink.ts
class RateLimiter {
  private lastRequest = 0;
  private minDelay = 2000; // 2 seconds minimum

  async throttle() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.minDelay) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minDelay - timeSinceLastRequest)
      );
    }
    this.lastRequest = Date.now();
  }
}
```

### Priority 2: Update enumerate-catalog.ts

```typescript
// Change from 100ms to 3000ms (3 seconds)
await new Promise(resolve => setTimeout(resolve, 3000));

// Add progress tracking
// Save every 10 items instead of 100 to reduce data loss risk
if (checked % 10 === 0) {
  saveProgress(validEntries, itemNo);
}

// Add error handling with exponential backoff
let retries = 0;
const maxRetries = 3;
while (retries < maxRetries) {
  try {
    const minifig = await bricklinkAPI.getMinifigureByNumber(itemNo);
    break;
  } catch (error) {
    retries++;
    if (retries >= maxRetries) throw error;
    await new Promise(resolve =>
      setTimeout(resolve, Math.pow(2, retries) * 1000)
    );
  }
}
```

### Priority 3: Reduce Scraping Frequency

```typescript
// In bricklink-scraper.ts, add longer delays
await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds

// Cache scraped results
// Add 24-hour cache for price data to minimize scraping
```

---

## Compliance Checklist

- [ ] **Increase API delays to minimum 2-3 seconds**
- [ ] **Implement proper rate limiter class**
- [ ] **Add exponential backoff for errors**
- [ ] **Review web scraping - verify if allowed**
- [ ] **Add robots.txt compliance check**
- [ ] **Add visible attribution to UI**
- [ ] **Add BrickLink copyright notices**
- [ ] **Reduce bulk enumeration frequency**
- [ ] **Implement 24-hour cache for pricing data**
- [ ] **Review commercial use restrictions**
- [ ] **Contact BrickLink support about bulk data access**
- [ ] **Document API usage patterns**
- [ ] **Add request logging/monitoring**

---

## Key Terms to Verify from Official ToS

When you can access https://www.bricklink.com/v3/terms_of_use_api.page, verify:

1. **Rate Limits:** What are the official request limits per hour/day?
2. **Scraping:** Is automated web scraping allowed alongside API use?
3. **Data Usage:** Can pricing data be cached? For how long?
4. **Attribution:** What specific attribution is required?
5. **Commercial Use:** What constitutes commercial use?
6. **Bulk Access:** Is there a bulk data export option?
7. **Caching:** What data can be cached and for how long?
8. **Public Display:** Can API data be displayed publicly?
9. **Prohibited Uses:** What uses are explicitly forbidden?
10. **Account Suspension:** What triggers automatic blocking?

---

## Immediate Actions

1. **Stop running enumerate-catalog.ts until fixed**
2. **Implement rate limiting (2-3 second delays minimum)**
3. **Contact BrickLink support to unblock your key**
4. **Wait for unblock confirmation before resuming**
5. **Test with small batches (10-20 requests) first**
6. **Monitor for any blocking/throttling responses**

---

## Long-term Strategy

Instead of bulk enumeration:
- **Monthly incremental updates:** Only check new ID ranges
- **User-driven queries:** Only fetch data when users search
- **Cache aggressively:** Store results for 24-48 hours
- **Respect the API:** Treat it as a shared resource
- **Request bulk access:** Ask BrickLink for official catalog dump

---

## Notes

- Your support message acknowledges the violation - good first step
- BrickLink may require proof of rate limiting implementation
- Consider open-sourcing compliance measures for community benefit
- Document all rate limiting in README for transparency

---

**Remember:** BrickLink provides this API as a service to the community. Responsible usage ensures it remains available for everyone.
