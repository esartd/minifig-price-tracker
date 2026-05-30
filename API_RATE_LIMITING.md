# BrickLink API Rate Limiting System

## 🛡️ Built-in Protection

Your application now has **automatic enforcement** of BrickLink's API Terms of Service. You can NEVER accidentally break the rules.

## 📋 BrickLink Rules (From ToS)

- **Maximum:** 5,000 API calls per day
- **Minimum delay:** 3 seconds between requests
- **Reset:** Daily limit resets at midnight
- **Violation:** Can result in API key being blocked

## ✅ How Protection Works

### 1. Every API Call is Tracked
All API calls go through `BricklinkAPI.makeRequest()` which:
- ✅ Counts every call in the database
- ✅ Enforces 3-second delays between requests
- ✅ Blocks calls if daily limit reached
- ✅ Warns when approaching 90% of limit

### 2. Hard Limit Enforcement
```typescript
// From lib/bricklink.ts
if (tracker.call_count >= 5000) {
  throw new Error(
    '🚫 BrickLink API daily limit reached (5,000 calls/day). ' +
    'Resets at midnight. This protects you from being blocked.'
  );
}
```

**Result:** Scripts will STOP automatically if you hit 5,000 calls. Your API key stays safe.

### 3. Automatic Delays
```typescript
private static readonly MIN_DELAY_MS = 3000; // 3 seconds
```

Every request waits at least 3 seconds from the previous one. No need to add delays in your scripts anymore.

## 📊 Check Your Usage

Run this anytime to see your current usage:
```bash
npm run check-api-usage
```

**Output:**
```
📊 BrickLink API Usage Report
─────────────────────────────

📅 Date: 2026-03-28
📞 Calls Made: 1,234 / 5,000
📈 Usage: 24.7%
✅ Remaining: 3,766 calls
🕐 Last Call: 3/28/2026, 2:30:45 PM

✅ You are within safe limits.
```

## 🚀 Running Catalog Updates Safely

### Incremental Updates (Recommended)
```bash
npm run update-catalog
```
- Checks ~1,500-2,000 new IDs
- Takes 4-6 hours
- Well under 5,000 limit ✅

### Full Enumeration (Use with Caution)
```bash
npm run update-catalog:full
```
- Checks ~10,000+ IDs
- Takes 24+ hours
- **Will stop at 5,000 calls** ✅
- Run over multiple days

## ⚠️ What Happens When You Hit the Limit

**Before (Old Code):**
- ❌ Would keep making calls
- ❌ BrickLink blocks your API key
- ❌ Have to contact support to unblock

**Now (With Protection):**
- ✅ Script stops with clear error message
- ✅ Shows how many calls were made
- ✅ API key stays safe
- ✅ Can resume tomorrow after midnight

## 🔍 Database Tracking

API usage is stored in the `ApiCallTracker` table:

```sql
-- Example data
date       | call_count | last_call_at
-----------+------------+------------------
2026-03-28 | 1,234      | 2026-03-28 14:30:45
2026-03-27 | 4,892      | 2026-03-27 23:55:12
2026-03-26 | 3,456      | 2026-03-26 18:22:03
```

View in Prisma Studio:
```bash
npm run db:studio
```

## 💡 Best Practices

### 1. Check Usage Before Long Scripts
```bash
npm run check-api-usage
npm run update-catalog
```

### 2. Run Updates Overnight
Schedule intensive scripts to run during off-hours:
```bash
# Run at 2am (when you're asleep)
cron: 0 2 * * * cd /path/to/project && npm run update-catalog
```

### 3. Monitor Progress
The system logs warnings at 90% usage:
```
⚠️  WARNING: Approaching daily API limit (4,521/5,000)
```

### 4. Space Out Manual Queries
If running test scripts:
```bash
npm run check-api-usage  # Check first
npm run test-prefixes    # Then test
npm run check-api-usage  # Check after
```

## 📈 Typical Daily Usage

| Activity | API Calls | Safe? |
|----------|-----------|-------|
| Normal user searches | 50-100 | ✅ Very safe |
| Refresh 20 item prices | 20-40 | ✅ Very safe |
| Incremental catalog update | 1,500-2,000 | ✅ Safe |
| Full catalog enumeration | 10,000+ | ⚠️ Spans multiple days |
| Monthly maintenance | 2,000-3,000 | ✅ Safe |

## 🔒 Cannot Be Bypassed

The rate limiter is built into the `BricklinkAPI` class. There is **no way** to make API calls without going through it:

```typescript
// All these methods use makeRequest() which enforces limits:
- getMinifigureByNumber()
- getPriceGuide()
- calculatePricingData()
```

Even if you tried to bypass it, the 3-second delays are hardcoded in the class.

## 📞 Need More Than 5,000 Calls/Day?

Contact BrickLink support:
- **Email:** apisupport@bricklink.com
- **Explain:** "I run a personal collection tracker that updates monthly"
- **Request:** Higher daily limit or bulk data access
- **Proof:** Show them your rate limiting code

They may approve higher limits for legitimate use cases.

## ✅ Summary

- ✅ **Automatic protection** - Cannot exceed 5,000 calls/day
- ✅ **3-second delays** - Built into every request
- ✅ **Database tracking** - Persistent across restarts
- ✅ **Clear warnings** - Know when approaching limit
- ✅ **Script stops safely** - No risk of API key blocking
- ✅ **Easy monitoring** - `npm run check-api-usage`

**You are now fully protected and compliant with BrickLink's API Terms of Service.**
