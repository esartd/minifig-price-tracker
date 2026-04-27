# Claude Code Instructions for FigTracker

**READ THIS FIRST BEFORE ANY CODE CHANGES**

## 🚨 CRITICAL: BrickLink API Compliance 🚨

**VIOLATING THESE RULES WILL GET THE API ACCESS BANNED AND BREAK THE ENTIRE SITE**

### Mandatory Rules (NEVER violate these):

1. **3-Second Minimum Delay Between API Calls**
   - ANY code that calls BrickLink API must wait 3000ms between calls
   - This includes: client-side fetching, cron jobs, background jobs
   - No exceptions, no "optimizations", no "it's just a little faster"
   - Violation = empty price data or API ban

2. **6-Hour Cache Requirement**
   - All BrickLink data must be cached for exactly 6 hours
   - Never fetch the same data more frequently
   - Cache key must include: item_no, condition, country_code, region

3. **5,000 Calls Per Day Maximum**
   - Hard limit enforced in code via ApiCallTracker table
   - Never remove or bypass this check
   - Budget carefully: cron jobs + user requests combined

### Where These Rules Apply:

**Check before modifying these files:**
- `lib/bricklink.ts` - Core API client
- `app/inventory/page.tsx` - Client-side fetching
- `app/collection/page.tsx` - Client-side fetching
- `app/sets-inventory/page.tsx` - Client-side fetching
- `app/sets-collection/page.tsx` - Client-side fetching
- `app/api/cron/refresh-collection-prices/route.ts` - Background cron

**Search for:** `setTimeout(fetchNextItem` - Must always be 3000ms

### Incident History:

**April 27, 2026**: Implemented 500ms delays instead of 3000ms
- Result: Mass $0 prices across hundreds of items
- Cause: BrickLink rate limiting returned empty price data
- Lesson: **Never optimize away compliance delays**

## Pricing System

See [PRICING_SYSTEM.md](PRICING_SYSTEM.md) for complete pricing documentation.

**Key principles:**
- Always read from `priceCache` table (single source of truth)
- Never write to database in refresh-pricing APIs
- Use progressive fetch (one item at a time, 3-second delays)
- Match working reference: `app/collection/page.tsx`

## Database

**Provider**: Hostinger MySQL (production), PostgreSQL (local)

**Connection Limits**:
- Hostinger has strict connection limits
- Database writes can cause 500 errors under load
- Pricing APIs should NOT write to database
- Only cache layer (priceCache) gets writes

## Testing Changes

**Before deploying pricing changes:**
1. Test all 4 collection types (collection, inventory, sets-collection, sets-inventory)
2. Verify 3-second delays in console logs
3. Check Network tab: no faster than 1 request per 3 seconds
4. Monitor for $0 prices (indicates rate limit violation)
5. Check API call count doesn't exceed daily limit

## Documentation

**Always update when changing pricing:**
- [PRICING_SYSTEM.md](PRICING_SYSTEM.md) - How pricing works
- [BRICKLINK_API_COMPLIANCE.md](BRICKLINK_API_COMPLIANCE.md) - API rules
- [PRICE_CACHE_PREWARMING.md](PRICE_CACHE_PREWARMING.md) - Background cron

## Design System

**Before designing UI:**
Review principles in `/Users/erickkosysu/Code Projects/_Design-System-Principles/`
- Use Heroicons (never emoji)
- Follow 8px spacing grid
- Mobile-first responsive design

## Git Workflow

**Commit messages:**
- Brief description of what changed
- Why it changed (link to issue/requirement)
- Impact on users or system
- Always include co-author: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

**Before pushing:**
- Run `npm run build` - must succeed with no errors
- Test changed functionality manually
- Never commit secrets or credentials

## Emergency Rollback

If pricing breaks after deployment:

```bash
# Find last working commit
git log --oneline | grep -i "pricing"

# Rollback pricing files
git checkout <commit-hash> -- lib/bricklink.ts
git checkout <commit-hash> -- app/inventory/page.tsx
# ... other affected files

# Commit and push
git commit -m "Rollback pricing to working version"
git push
```

## Key Contacts

- User: Erick Su (ericksu0c@gmail.com)
- BrickLink API: https://www.bricklink.com/v3/api.page
- Hostinger Support: (if database issues)

---

**Remember**: Slow and compliant > fast and banned. The site can be slow, it cannot be non-functional.
