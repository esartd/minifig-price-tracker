# Price Cache Pre-warming System

**Status**: ✅ Ready for deployment  
**Purpose**: Make page loads instant by refreshing prices in background (like BrickEconomy)

## How It Works

### The Problem
- BrickLink API: Each item requires separate API call
- User visits page → Wait 3-5 minutes for all prices to load
- Poor UX compared to competitors

### The Solution
**Background cron job** refreshes prices every 6 hours:

```
Every 6 hours:
├─ Find all items in any user's collection/inventory
├─ Check which prices are expired (>6 hours old)
├─ Fetch fresh prices from BrickLink API
└─ Save to priceCache table

User visits page:
├─ Query items + cached prices
└─ Instant render (0 API calls needed)
```

## Setup Instructions

### 1. Add CRON_SECRET to Environment

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to `.env.local` and Vercel:
```bash
CRON_SECRET=your-generated-secret-here
```

### 2. Configure Hostinger Cron Job

**Hostinger Control Panel → Cron Jobs → Add New**

```
Schedule: Every 6 hours (0 */6 * * *)
Command:
curl -X POST https://figtracker.ericksu.com/api/cron/refresh-collection-prices \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE" \
  -H "Content-Type: application/json"
```

**Schedule options**:
- Every 6 hours: `0 */6 * * *`
- Specific times: `0 0,6,12,18 * * *` (midnight, 6am, noon, 6pm)

### 3. Test the Endpoint

**Manual test** (run before setting up cron):

```bash
# Test locally
curl -X POST http://localhost:3000/api/cron/refresh-collection-prices \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"

# Test production
curl -X POST https://figtracker.ericksu.com/api/cron/refresh-collection-prices \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

**Expected response**:
```json
{
  "success": true,
  "message": "Price refresh complete",
  "stats": {
    "totalItems": 547,
    "needingRefresh": 234,
    "processed": 234,
    "successCount": 230,
    "errorCount": 4,
    "duration": 720000,
    "durationMinutes": 12
  },
  "errors": []
}
```

### 4. Monitor Logs

**Check cron execution**:
```bash
# View logs on Vercel
vercel logs --follow

# Or check Hostinger cron output
# (saved to ~/cron_output.log if configured)
```

**What to watch for**:
- ✅ "Price refresh complete" message
- ✅ successCount close to processed count
- ⚠️  High errorCount (check errors array)
- ❌ 401 Unauthorized (wrong CRON_SECRET)

## Performance & Scaling

### Current Capacity

**Rate Limits**:
- BrickLink: 5,000 API calls per day
- Per 6-hour run: ~1,250 calls budget
- With safety margin: 1,200 items max per run

**Processing Time**:
- 3 seconds per item (BrickLink compliance)
- 1,200 items = 1 hour runtime
- Runs in background, doesn't block users

### Scaling Strategy

**When you have more than 1,200 unique items**:

**Option A - Prioritize by activity** (recommended):
```typescript
// Refresh items in this order:
1. Items viewed in last 24 hours (highest priority)
2. Items in active users' collections
3. Popular items (owned by 3+ users)
4. Rest (on-demand only)
```

**Option B - Increase frequency**:
- Change from 6 hours → 4 hours
- 6 runs per day × 1,200 items = 7,200 capacity
- Still within 5,000/day limit if not all items need refresh

**Option C - Hybrid approach**:
- Cron: Pre-warm top 1,000 items (active + popular)
- Page load: Fetch remaining items on-demand (current system)

### Database Impact

**Additional queries per cron run**:
1. `SELECT` all collection items (4 tables) - ~10ms
2. `SELECT` existing cache entries - ~50ms
3. BrickLink API calls - ~1 hour total
4. Cache writes handled by existing code

**No performance impact on user queries** - runs in background.

## Comparison: Before vs After

### Before (Current System)
```
User visits /inventory with 100 items:
├─ Load items from DB: 50ms
├─ Fetch prices one-by-one: 3-5 minutes
└─ Total: 3-5 minutes
```

### After (With Pre-warming)
```
User visits /inventory with 100 items:
├─ Load items + cached prices: 100ms
└─ Total: 100ms (30x faster!)
```

### How It Matches BrickEconomy
- ✅ Instant page loads
- ✅ No API calls on page load
- ✅ Background refresh every 6 hours
- ✅ Scales to thousands of items

## Troubleshooting

### Issue: Cron job returns 401

**Cause**: Wrong CRON_SECRET or missing Authorization header

**Fix**:
```bash
# Check secret matches
echo $CRON_SECRET

# Verify header format
curl -v -X POST https://figtracker.ericksu.com/api/cron/refresh-collection-prices \
  -H "Authorization: Bearer YOUR_SECRET_HERE"
```

### Issue: High error count

**Cause**: BrickLink API issues or rate limiting

**Check**:
1. Review errors array in response
2. Check BrickLink API status
3. Verify rate limit not exceeded:
   ```sql
   SELECT * FROM "ApiCallTracker" WHERE date = CURRENT_DATE;
   ```

**Fix**: Errors are logged but don't block processing. Failed items will retry next run.

### Issue: Cron takes too long

**Cause**: Too many items to process in 6-hour window

**Symptoms**:
- `durationMinutes` > 60
- Next cron run starts before previous finishes

**Fix**: Reduce items processed per run:
```typescript
// In route.ts, reduce MAX_CALLS_PER_RUN
const MAX_CALLS_PER_RUN = 800; // Down from 1200
```

### Issue: Prices still show "No sellers available"

**Cause**: Item genuinely has no BrickLink listings (rare item)

**Expected behavior**: Cron fetches, gets $0, caches $0, shows "No sellers available"

**Not a bug** - working as intended.

## Future Enhancements

### Potential Optimizations

- [ ] **Smart scheduling**: Refresh popular items more frequently
- [ ] **Activity tracking**: Only refresh items viewed recently
- [ ] **Parallel batching**: Process 5 items concurrently (faster, but riskier)
- [ ] **Webhook triggers**: Refresh on user action (add to collection)
- [ ] **Cache warming on signup**: Pre-load prices for new user's first items

### Monitoring Dashboard

Add admin endpoint to track cron health:
```
GET /api/admin/cron-stats
Returns:
- Last run time
- Success rate
- Average duration
- Items processed per run
- API calls remaining today
```

## Related Documentation

- [PRICING_SYSTEM.md](PRICING_SYSTEM.md) - How pricing works overall
- [BRICKLINK_API_COMPLIANCE.md](BRICKLINK_API_COMPLIANCE.md) - API rules and limits
- [HOSTINGER_CRON_SETUP.md](HOSTINGER_CRON_SETUP.md) - General cron setup guide

## Testing Checklist

Before deploying to production:

- [ ] CRON_SECRET added to .env.local and Vercel
- [ ] Test endpoint locally (returns 200)
- [ ] Test endpoint on production (returns 200)
- [ ] Verify prices appear in priceCache table
- [ ] Check page load is faster after cron runs
- [ ] Set up Hostinger cron job
- [ ] Monitor first 2-3 runs for errors
- [ ] Verify API call count stays under 5,000/day
