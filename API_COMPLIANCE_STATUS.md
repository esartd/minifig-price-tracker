# Bricklink API Compliance Status

**Last Updated:** 2026-03-31  
**Status:** ✅ FULLY COMPLIANT

---

## ✅ Compliance Checklist

### 1. Rate Limiting - IMPLEMENTED ✅

**Hard Limit Enforcement:**
- Maximum 5,000 API calls per day (enforced in code)
- System throws error at limit to prevent overuse
- Database tracking of all API calls

**Delay Between Requests:**
- Minimum 3 seconds between ALL requests
- Enforced automatically in `lib/bricklink.ts:29-80`
- Prevents rapid-fire requests that could trigger blocks

**Code Location:** [lib/bricklink.ts:11-80](lib/bricklink.ts#L11-L80)

```typescript
private static readonly MAX_CALLS_PER_DAY = 5000;
private static readonly MIN_DELAY_MS = 3000; // 3 seconds
```

---

### 2. Daily Update Strategy - SAFE ✅

**Current Configuration:**
- Runs once per day at 2am UTC
- Checks ~350 IDs across 27 themes
- Uses only 7% of daily quota (350/5000)
- Leaves 4,650 calls for user searches

**Weekly Usage:**
- 350 calls/day × 7 days = 2,450 calls/week
- Well under daily limit
- Predictable, consistent pattern

**Annual Usage:**
- 350 calls/day × 365 days = 127,750 calls/year
- Distributed evenly across all days
- No spike patterns that could trigger alerts

**Code Location:** [.github/workflows/update-catalog.yml](..github/workflows/update-catalog.yml)

---

### 3. Attribution - PRESENT ✅

**Footer Attribution:**
Located in [app/layout.tsx:42-55](app/layout.tsx#L42-L55)

Display text includes:
- "The term 'BrickLink' is a trademark of the LEGO Group BrickLink"
- "Minifigure data provided by Bricklink.com"
- "LEGO® is a trademark of the LEGO Group"
- Link to Bricklink.com

**Visibility:** Present on every page in footer

---

### 4. No Web Scraping - CONFIRMED ✅

**Status:** Web scraping has been REMOVED

- Old scraper code exists but is NOT used in production
- All pricing data comes from official API
- No Puppeteer/stealth techniques in use
- No bypassing of Bricklink's website protections

**Verification:** Search [lib/bricklink-scraper.ts](lib/bricklink-scraper.ts) - file exists but not imported anywhere

---

### 5. Error Handling - IMPLEMENTED ✅

**Protection Against Failures:**
- Hard stop at 5,000 calls/day
- Graceful error messages
- Database persistence prevents data loss
- Warnings at 90% usage (4,500 calls)

**User Protection:**
- System prevents user from accidentally hitting limit
- Clear error messages explain why request failed
- Automatic tracking prevents quota overrun

**Code Location:** [lib/bricklink.ts:47-53](lib/bricklink.ts#L47-L53)

---

### 6. Request Tracking - ACTIVE ✅

**Database Monitoring:**
- Every API call logged to database
- Date, count, and timestamp tracked
- Historical data preserved for audit
- Can review usage patterns anytime

**Table:** `api_call_tracker`
- `date`: YYYY-MM-DD
- `call_count`: Number of calls
- `last_call_at`: Timestamp of last call

**Monitoring Script:** [scripts/check-api-usage.ts](scripts/check-api-usage.ts)

Run: `npx tsx scripts/check-api-usage.ts`

---

## 📊 Daily Usage Breakdown

### Automated Updates (2am UTC daily)
- Star Wars: ~50 calls
- Super Heroes: ~40 calls  
- Harry Potter: ~30 calls
- Other active themes: ~150 calls
- Retired themes: ~80 calls
- **Total: ~350 calls (7% of quota)**

### User Searches (throughout day)
- Reserved: ~4,650 calls (93% of quota)
- Average user search: 1-2 API calls
- Supports: ~2,300 user searches per day
- Pricing refresh: Uses API quota

---

## 🛡️ Built-in Safeguards

### 1. Hard Stop
System throws error and stops execution at 5,000 calls:
```
🚫 BrickLink API daily limit reached (5,000 calls/day).
Resets at midnight. This protects you from being blocked.
```

### 2. Automatic Delays
Every API call waits minimum 3 seconds automatically. No manual delays needed.

### 3. Warning System
At 4,500 calls (90%), system warns:
```
⚠️ WARNING: Approaching daily API limit (4,500/5,000)
```

### 4. Database Persistence
All call counts stored in database, survives server restarts.

---

## 📋 Official API Terms Compliance

### Rate Limits
✅ **Compliant** - 3 second minimum enforced  
✅ **Compliant** - 5,000 daily limit enforced  
✅ **Compliant** - Predictable usage pattern

### Data Usage
✅ **Compliant** - No data reselling  
✅ **Compliant** - Personal collection management tool  
✅ **Compliant** - Data used for legitimate price tracking

### Attribution
✅ **Compliant** - Visible footer attribution  
✅ **Compliant** - Links to Bricklink.com  
✅ **Compliant** - Trademark acknowledgment

### Prohibited Activities
✅ **Compliant** - No web scraping in production  
✅ **Compliant** - No bypassing API limits  
✅ **Compliant** - No database mirroring  
✅ **Compliant** - No bulk data reselling

---

## 🔍 How to Verify Compliance

### Check Daily Usage
```bash
npx tsx scripts/check-api-usage.ts
```

Shows:
- Today's call count
- Percentage of limit used
- Remaining calls
- Last 7 days history

### Check Rate Limiting
All API calls go through `enforceRateLimit()` which:
1. Checks daily call count
2. Enforces 3-second minimum delay
3. Updates database tracker
4. Throws error at limit

### Verify No Scraping
```bash
grep -r "bricklink-scraper" app/ lib/ --exclude-dir=node_modules
```
Should return: No matches (scraper not imported)

---

## 📝 Update Schedule

**Current:** Daily at 2am UTC  
**API Calls:** ~350 per day  
**Percentage:** 7% of daily quota  
**Runtime:** ~18 minutes (350 calls × 3 seconds)

**Benefits:**
- Consistent daily pattern (safer than spikes)
- Low percentage of quota (93% reserved for users)
- Fast discovery of new minifigs (24 hour lag max)
- Respectful to shared API infrastructure

---

## 🚨 What Would Trigger Non-Compliance

### ❌ NEVER DO:
1. Remove rate limiting delays
2. Exceed 5,000 calls per day
3. Add web scraping back
4. Run multiple update scripts simultaneously
5. Remove attribution from footer
6. Bypass the enforceRateLimit() function
7. Set MIN_DELAY_MS below 3000ms (3 seconds)

### ⚠️ Warning Signs:
- Daily usage consistently above 80% (4,000+ calls)
- Multiple 5,000 limit errors
- Sudden API key blocks from Bricklink
- 429 rate limit responses

---

## ✅ Summary

**Overall Status:** FULLY COMPLIANT ✅

The system has multiple layers of protection:
1. **Code-level** rate limiting (can't be bypassed)
2. **Database** tracking (persistent across restarts)
3. **Daily** quota enforcement (hard stop at 5,000)
4. **Automatic** delays (3 seconds minimum)
5. **Warning** system (alerts at 90%)
6. **Attribution** (visible footer)

**Daily Strategy:** 350 calls/day is conservative and safe
- Only 7% of quota
- Consistent pattern
- Plenty of headroom
- Fast discovery

**Confidence Level:** 🟢 HIGH - Multiple safeguards prevent violations

---

## 📞 Contact & Support

If you need to increase API limits or request bulk access:
- Email: service@bricklink.com
- Reference: Your Consumer Key (in .env.local)
- Purpose: Minifigure price tracking tool

Keep this document updated as configuration changes.
