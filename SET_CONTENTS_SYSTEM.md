# Set Contents System

**Status:** ✅ Phase 1 Complete - API and Database Ready

Progressive data collection system to track which minifigs appear in which sets.

---

## System Overview

**Problem:** Users want to know which sets contain specific minifigs, and which minifigs are in a set.

**Solution:** Fetch from BrickLink API on-demand, cache forever in database (sets don't change after release).

**Strategy:** Hybrid approach - on-demand fetching + background seeding of popular sets.

---

## Current Status (June 3, 2026)

### ✅ Phase 1: Database + API (COMPLETE)

**Database Tables:**
- `SetContents` - Maps set_no → minifig_no with quantity
- `SetContentsFetched` - Tracks which sets have been fetched

**API Endpoint:**
- `GET /api/sets/[boxNo]/contents` - Returns minifigs in a set
- Example: `/api/sets/75192-1/contents`
- Response:
```json
{
  "set_no": "75192-1",
  "minifigs": [
    {"minifig_no": "sw0532", "quantity": 1},
    {"minifig_no": "sw0661", "quantity": 1},
    ...
  ],
  "cached": true,
  "count": 8
}
```

**Tested:**
- UCS Millennium Falcon (75192-1): 8 minifigs fetched and cached ✅
- Second request returns cached data instantly ✅
- Migration ran successfully on production ✅

---

## API Usage Budget

**Current Usage (June 3, 2026):**
- Daily average: 2,168 calls/day (43% of 5,000 limit)
- Today: 223 calls (4% used, 4,777 remaining)
- Peak day: 5,000 (hit limit on May 27)

**Budget Allocation:**
- Existing usage: ~700 calls/day baseline
- User-triggered fetches: ~500 calls/day buffer
- Background seeding: 200 sets/day (when implemented)
- **Total: ~1,400 calls/day (28% of limit)**

**Headroom: 72% remaining** - safe margin for spikes.

---

## Technical Details

### Database Schema

```sql
CREATE TABLE SetContents (
  id VARCHAR(191) PRIMARY KEY,
  set_no VARCHAR(191) NOT NULL,        -- e.g., "75192-1"
  minifig_no VARCHAR(191) NOT NULL,    -- e.g., "sw0532"
  quantity INT NOT NULL,                -- how many in set
  fetched_at DATETIME DEFAULT NOW(),
  UNIQUE(set_no, minifig_no),
  INDEX(set_no),
  INDEX(minifig_no)
);

CREATE TABLE SetContentsFetched (
  set_no VARCHAR(191) PRIMARY KEY,
  minifig_count INT NOT NULL,
  fetched_at DATETIME DEFAULT NOW(),
  fetched_via VARCHAR(191) NOT NULL,   -- "user_view" | "cron_seed"
  INDEX(fetched_at),
  INDEX(fetched_via)
);
```

### BrickLink API Integration

**Endpoint:** `GET /items/SET/{setNo}/subsets`

**Response Format:**
```javascript
[
  {
    match_no: 0,
    entries: [
      {
        item: { no: "sw0532", name: "Han Solo", type: "MINIFIG" },
        quantity: 1,
        ...
      }
    ]
  },
  ...
]
```

**Processing:**
1. Flatten all `entries` arrays
2. Filter where `item.type === 'MINIFIG'`
3. Extract `item.no` and `quantity`
4. Save to database with transaction

**Rate Limiting:**
- 3-second delay between calls (enforced in BricklinkAPI class)
- 5,000 calls/day limit (tracked in ApiCallTracker table)
- Automatic blocking when limit approached

---

## Implementation Files

### Core Logic
- `lib/set-contents.ts` - Main system logic
  - `fetchSetContents()` - Fetch and cache
  - `getSetsContainingMinifig()` - Query cached data
  - `getMinifigsInSet()` - Query cached data
  - `hasSetContents()` - Check if fetched
  - `getSetContentsStats()` - Coverage statistics

### API Routes
- `app/api/sets/[boxNo]/contents/route.ts` - Public endpoint

### Database
- `prisma/schema-hostinger.prisma` - Schema definition
- `prisma/migrations/20260603_add_set_contents/migration.sql` - Migration

### BrickLink Client
- `lib/bricklink.ts` - Added `getSubsets()` method

---

## Usage Examples

### Check if Set Has Been Fetched
```typescript
import { hasSetContents } from '@/lib/set-contents';

const isCached = await hasSetContents('75192-1');
// Returns: true
```

### Get Minifigs in a Set (Cached Only)
```typescript
import { getMinifigsInSet } from '@/lib/set-contents';

const minifigs = await getMinifigsInSet('75192-1');
// Returns: [{minifig_no: "sw0532", quantity: 1}, ...]
```

### Get Sets Containing a Minifig (Cached Only)
```typescript
import { getSetsContainingMinifig } from '@/lib/set-contents';

const sets = await getSetsContainingMinifig('sw0532');
// Returns: [{set_no: "75192-1", quantity: 1}, ...]
```

### Fetch Set Contents (API Call if Not Cached)
```typescript
import { fetchSetContents } from '@/lib/set-contents';

const result = await fetchSetContents('75192-1', 'user_view');
// First call: Makes API request, saves to DB
// Second call: Returns cached data instantly
```

### Get Coverage Statistics
```typescript
import { getSetContentsStats } from '@/lib/set-contents';

const stats = await getSetContentsStats();
// Returns: {
//   totalSetsFetched: 1,
//   totalMinifigMappings: 8,
//   bySource: { user_view: 1, cron_seed: 0 }
// }
```

---

## Next Phases

### Phase 2: Display on Set Detail Pages
**Goal:** Show which minifigs are included when user views a set

**Tasks:**
- [ ] Add "Included Minifigures" section to set detail pages
- [ ] Display minifig images in grid
- [ ] Show quantity for each minifig
- [ ] Link to minifig detail pages
- [ ] Trigger fetch when user views set (if not cached)

**Files to modify:**
- `app/sets/[boxNo]/page.tsx` - Server component
- `components/set-detail-client.tsx` - Add minifigs section

### Phase 3: Display on Minifig Pages
**Goal:** Show which sets contain this minifig

**Tasks:**
- [ ] Add "Appears in These Sets" section to minifig detail pages
- [ ] Display set images in grid
- [ ] Show set names, years, piece counts
- [ ] Link to set detail pages
- [ ] Show "Data available for X sets" message

**Files to modify:**
- `app/minifigs/[itemNo]/page.tsx` - Server component
- `components/minifig-detail-client.tsx` - Add sets section

### Phase 4: Background Cron Seeding
**Goal:** Pre-populate popular sets to improve coverage

**Tasks:**
- [ ] Create cron endpoint `/api/cron/seed-set-contents`
- [ ] Prioritize by theme: Star Wars > Marvel > Harry Potter > Architecture
- [ ] Fetch 200 sets/day at 3am
- [ ] Stop after ~1,000 most popular sets seeded
- [ ] Add to deployment documentation

**Budget:** 200 calls/day = stays under 28% total usage

### Phase 5: Admin Dashboard
**Goal:** Monitor coverage and API usage

**Tasks:**
- [ ] Add stats to `/admin/stats` page
- [ ] Show total sets fetched
- [ ] Show coverage by theme
- [ ] Show API calls used today
- [ ] Show seeding progress

---

## Testing Checklist

Before deploying changes:

- [ ] Test API endpoint with real set number
- [ ] Verify data saves to database
- [ ] Verify cached response on second call
- [ ] Check API call count doesn't spike
- [ ] Test with set that has no minifigs
- [ ] Test with invalid set number
- [ ] Check logs for errors

---

## Monitoring

### Check Coverage
```bash
ssh root@187.77.202.14 "cd /var/www/figtracker && node -e \"
const { PrismaClient } = require('@prisma/client-hostinger');
const prisma = new PrismaClient();
prisma.setContentsFetched.count()
  .then(count => console.log('Total sets fetched:', count))
  .finally(() => prisma.\$disconnect());
\""
```

### Check API Usage Today
```bash
ssh root@187.77.202.14 "cd /var/www/figtracker && node -e \"
const { PrismaClient } = require('@prisma/client-hostinger');
const prisma = new PrismaClient();
const today = new Date().toISOString().split('T')[0];
prisma.apiCallTracker.findUnique({ where: { date: today } })
  .then(t => console.log('API calls today:', t?.call_count || 0))
  .finally(() => prisma.\$disconnect());
\""
```

### Check Specific Set
```bash
ssh root@187.77.202.14 "cd /var/www/figtracker && node -e \"
const { PrismaClient } = require('@prisma/client-hostinger');
const prisma = new PrismaClient();
prisma.setContents.findMany({ where: { set_no: '75192-1' } })
  .then(m => console.log('Minifigs:', m.length))
  .finally(() => prisma.\$disconnect());
\""
```

---

## Troubleshooting

### Issue: API Returns Empty Array
**Cause:** Set has no minifigs (valid response)
**Solution:** This is normal for sets without minifigs

### Issue: "Unexpected response format"
**Cause:** BrickLink API changed response structure
**Check:** Logs show response format
**Solution:** Update parsing logic in `lib/set-contents.ts`

### Issue: Approaching API Limit
**Cause:** Too many requests in one day
**Check:** ApiCallTracker table
**Solution:** Reduce background seeding rate or pause

### Issue: Database Connection Errors
**Cause:** Hostinger MySQL connection limits
**Solution:** Prisma client auto-handles connections, check for leaked connections

---

## Documentation Updates

When completing phases, update:
- [ ] This file (SET_CONTENTS_SYSTEM.md)
- [ ] CLAUDE.md - Add any new critical rules
- [ ] API documentation (if public-facing)
- [ ] Admin dashboard tooltips

---

## Success Metrics

**Phase 1 (Complete):**
- ✅ Database tables created
- ✅ Migration ran successfully
- ✅ API endpoint working
- ✅ First set fetched and cached (75192-1)
- ✅ Staying under API budget

**Phase 2 Target:**
- Sets display minifigs when viewed
- 90%+ of viewed sets trigger fetch
- No user-facing errors

**Phase 3 Target:**
- Minifigs show which sets they're in
- Coverage message clear to users
- Link navigation works both ways

**Phase 4 Target:**
- 1,000 popular sets seeded in 5 days
- API usage stays under 30% daily
- Zero failed API calls

**Phase 5 Target:**
- Admin can monitor coverage
- Easy to see which themes need work
- API usage trends visible

---

**Last Updated:** June 3, 2026
**Status:** Production-ready, Phase 1 complete
**Next Step:** Phase 2 - Display on set detail pages
