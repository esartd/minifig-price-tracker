# Claude Code Instructions for FigTracker

**READ THIS FIRST BEFORE ANY CODE CHANGES**

## ⏰ TIMEZONE: Always Use Mountain Time

**User is in Utah (Mountain Time Zone: UTC-7 in summer, UTC-6 in winter)**

- Always express times in Mountain Time (MT)
- BrickLink API resets at midnight UTC = **6pm MT (summer) or 5pm MT (winter)**
- Cron jobs run in server time (UTC) but communicate in MT
- When discussing schedules, deadlines, or timing, use MT

---

## 🎯 GENERAL PRINCIPLE: DO IT RIGHT, NOT EASY

**Always choose the correct solution over the quick solution.**

- Don't take shortcuts that create technical debt
- Don't avoid proper architecture because it's more work
- Don't use workarounds when the right approach exists
- Example: Use PostgreSQL (better) instead of MySQL (easier) when migrating databases
- Example: Fix root causes instead of patching symptoms

**"Do things the right way" - not the lazy way.**

---

## 🚨 CRITICAL: Database Schema Changes 🚨

**NEVER MODIFY PRISMA SCHEMA ON MAIN BRANCH**

### Mandatory Workflow for Schema Changes:

1. **Create a feature branch FIRST**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make schema changes on feature branch**
   - Modify `prisma/schema.prisma` or other schema files
   - Run migrations locally: `npx prisma migrate dev`
   - Test thoroughly with local database

3. **Test before merging**
   - Verify all features work with new schema
   - Check that migrations run cleanly
   - Ensure no breaking changes

4. **Merge only after confirmation**
   - Get user approval
   - Merge feature branch to main
   - Deploy to production

### Why This Matters:

**May 5, 2026**: Modified schema directly on main branch
- Result: 500 errors across entire production site
- Cause: Code referenced database tables that didn't exist yet
- Duration: 30 minutes of downtime
- Lesson: **Schema changes break production instantly if not migrated first**

### Protection:

- Git hook prevents schema commits on main (run `.githooks/install.sh`)
- Hook forces feature branch workflow
- Cannot be bypassed without `--no-verify` (don't use it)

---

## 🚨 CRITICAL: Catalog Descriptions Storage 🚨

**DESCRIPTIONS ARE STORED IN DATABASE, NOT JSON FILES**

### Key Points:

1. **Minifig descriptions:** Stored in `MinifigCatalog` database table
2. **Set descriptions:** Stored in `SetsCatalog` database table
3. **JSON files (`minifigs.json`, `boxes.json`):** Updated twice/month from BrickLink - contain NO descriptions
4. **Database tables:** NEVER modified by catalog updates - descriptions are safe

### Why This Matters:

**May 16, 2026**: Almost stored descriptions in JSON files
- Problem: Catalog JSON files are overwritten twice/month from BrickLink exports
- Result would be: All descriptions deleted on every catalog update
- Solution: Separate database tables that catalog updates never touch

### When Updating Catalogs:

Running `scripts/update-catalogs-simple.ts` will:
- ✅ Update item names, categories, years, weights
- ✅ Add new items from BrickLink
- ❌ NOT affect descriptions (they're in database)

**See [CATALOG_DESCRIPTIONS_SYSTEM.md](CATALOG_DESCRIPTIONS_SYSTEM.md) for complete documentation**

---

## 🚨 CRITICAL: eBay Partner Network (EPN) Affiliate Links 🚨

**DO NOT MODIFY WITHOUT UNDERSTANDING EPN REQUIREMENTS**

### Current Implementation (VERIFIED WORKING):

**Files:**
- `lib/ebay-affiliate-links.ts` - Link generation functions
- `components/minifig-detail-client.tsx` - eBay button on minifig pages
- `components/set-detail-client.tsx` - eBay button on set pages
- `app/layout.tsx` - EPN Smart Tools script

**Campaign ID:** `5339150379`
**Environment Variable:** `NEXT_PUBLIC_EBAY_CAMPAIGN_ID`

### EPN Link Requirements (Per Official Docs):

Required parameters in this exact format:
```
{target}&mkevt=1&mkcid=1&mkrid={rotation_id}&campid={campaign_id}&toolid={tool_id}
```

- `target` - eBay URL (search or product page)
- `mkevt=1` - Tracking event type (1 = Click)
- `mkcid=1` - Channel ID (1 = EPN)
- `mkrid` - Rotation ID per marketplace (e.g., 711-53200-19255-0 for US)
- `campid` - Campaign ID (5339150379)
- `toolid` - Tool ID (10001 = default)
- `customid` - Optional sub-tracking ID

**Official Documentation:** https://developer.ebay.com/api-docs/buy/static/ref-epn-link.html

### What NOT to Change:

1. **DO NOT** remove any of the 6 required parameters
2. **DO NOT** change parameter order (some systems are order-sensitive)
3. **DO NOT** remove the EPN Smart Tools script from layout.tsx
4. **DO NOT** change rotation IDs (mkrid) - they're marketplace-specific
5. **DO NOT** change Campaign ID without user approval

### Button Order (DO NOT CHANGE):

**Minifig pages:** eBay (blue) → Whatnot (grey) → BrickLink (grey) → Amazon (grey)
**Set pages:** eBay (blue) → Whatnot (grey) → Amazon (grey) → BrickLink (grey)

Only the top button is colored to avoid visual competition.

Whatnot was added second in September 2026. eBay keeps the top, colored slot
because it is the proven earner; Whatnot is unproven and sits below it rather
than displacing it. Revisit the order once there is real Whatnot revenue to
compare — not before.

### Testing After Changes:

1. Build succeeds: `npm run build`
2. Visit `/minifigs/sw0001` and `/sets/75192-1`
3. Click eBay button
4. Verify URL contains all 6 required parameters
5. Verify `campid=5339150379` is in URL
6. Test on different browsers/devices

### Commission Tracking:

- Links are validated against official eBay EPN documentation
- Smart Tools script provides backup tracking
- Any changes could break commission attribution
- Lost commissions = lost revenue

**If you need to modify:** Read the official docs first, test thoroughly, get user approval.

---

## Whatnot Affiliate Links

**Files:** `lib/whatnot-affiliate-links.ts`, `app/marketplace/`, `app/api/marketplace/`
**Partner ID:** 2875567 (via impact.com)
**Env var:** `NEXT_PUBLIC_WHATNOT_AFFILIATE_URL` (default `https://whatnot.pxf.io/k4Jrdz`)

Two facts that cost real time to establish — do not rediscover them:

1. **The search parameter is `query`, not `q`.** `?q=` loads the search page
   with an empty query and renders "There's nothing here at the moment" — it
   looks like a working page with no stock. `/search/<terms>` as a path is a
   404.
2. **Deep links go through `?u=<url-encoded destination>`.** Without that
   wrapper the visit is untracked and earns nothing. Verify any change by
   following redirects and confirming `utm_partnerid=2875567` survives.

**There is no Whatnot data feed.** The Seller API only manages your own store
and is closed to new applicants; the affiliate program hands out links, not a
catalog. The marketplace page is therefore built from our own catalog and deep
links into Whatnot search. Do not "improve" it by scraping Whatnot — that was
considered and rejected.

Search queries deliberately include the full BrickLink name and item number.
Sellers copy BrickLink names verbatim, so long names with `{2nd edition}`-style
annotations still return exact matches; when nothing matches every word Whatnot
falls back to partial results rather than an empty page.

---

## 🚨 CRITICAL: Pricing Refresh System (Blue Dots) 🚨

**DO NOT MODIFY WITHOUT READING [PRICING_REFRESH_SYSTEM.md](PRICING_REFRESH_SYSTEM.md)**

### Key Points:

1. **Backend MUST return `cached_at` with all pricing data**
   - File: `lib/bricklink.ts`
   - Function: `calculatePricingData()`
   - All return statements must include: `cached_at: cached.cached_at.toISOString()`

2. **Frontend MUST check for missing `cached_at` FIRST**
   - Files: All 4 collection pages (inventory, collection, sets-inventory, sets-collection)
   - Logic: `if (!item.pricing.cached_at) return true;` before checking age
   - Missing cached_at = needs refresh

3. **Progressive fetch MUST use 3-second delays**
   - All 4 collection pages: `setTimeout(fetchNextItem, 3000)`
   - Never reduce below 3000ms
   - Never fetch multiple items in parallel

### Why This Matters:

**May 16, 2026**: Blue dots not appearing for 2 days
- Cause: `calculatePricingData()` didn't return `cached_at`
- Result: Frontend couldn't check cache age, no refresh triggered
- Fix: Added `cached_at` to all pricing return statements
- Lesson: **All pricing data MUST include cached_at or system breaks**

**See complete documentation:** [PRICING_REFRESH_SYSTEM.md](PRICING_REFRESH_SYSTEM.md)

---

## 🚨 CRITICAL: BrickLink API Compliance 🚨

**VIOLATING THESE RULES WILL GET THE API ACCESS BANNED AND BREAK THE ENTIRE SITE**

### Mandatory Rules (NEVER violate these):

1. **3-Second Minimum Delay Between API Calls**
   - ANY code that calls BrickLink API must wait 3000ms between calls
   - This includes: client-side fetching, cron jobs, background jobs
   - No exceptions, no "optimizations", no "it's just a little faster"
   - Violation = empty price data or API ban

2. **TTL-Based Cache**
   - Logged-out users (anonymous, SEO crawlers): 7-day cache (168h)
   - Logged-in users: 24-hour cache
   - TTL is checked against `cached_at`, not `expires_at`
   - Cache key: (item_no, item_type, condition, country_code="US", region="")
   - Never hard-code 6 hours — the 6-hour rule applied to raw BrickLink display, which we no longer do

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
- `app/api/cron/consolidated/route.ts` - Cron endpoint (no active tasks — pre-warming removed June 2026)

**Search for:** `setTimeout(fetchNextItem` - Must always be 3000ms

### Incident History:

**April 27, 2026**: Implemented 500ms delays instead of 3000ms
- Result: Mass $0 prices across hundreds of items
- Cause: BrickLink rate limiting returned empty price data
- Lesson: **Never optimize away compliance delays**

**June 2026**: `app/minifigs/[itemNo]/page.tsx` called `bricklinkAPI.calculatePricingData()` directly for schema.org structured data
- Result: Budget exhausted by 5am daily — every anonymous page view burned 2 API calls
- Cause: Direct call in server component bypassed the orchestrator's 7-day cache entirely
- Fix: Replaced with `pricingOrchestrator.getMinifigPrice(..., LOGGED_OUT_TTL_HOURS)`
- Lesson: **Never call bricklinkAPI directly from page server components — always use the orchestrator**

## Pricing System

See [PRICING_SYSTEM.md](PRICING_SYSTEM.md) for complete pricing documentation.

**Key principles:**
- All prices are a 95% BrickLink / 5% eBay blend — stored as `price_source='figtracker'`
- Never display raw BrickLink or eBay data; always compute the blend first
- Always use `pricingOrchestrator` — never call `bricklinkAPI` directly from page server components
- Cache TTL: 7 days for logged-out users, 24h for logged-in (passed as `cacheTtlHours`)
- Progressive fetch: one item at a time, 3-second delays (4 collection pages)
- `cached_at` must be returned with all pricing data (blue dot refresh system depends on it)

## Database

**Provider**: Hostinger MySQL — **the same database for local and production**.
`DATABASE_URL` points at the live Hostinger instance, so there is no separate
local database to try a migration against. Consequences:
- `npx prisma migrate dev` would run against production — **never use it**.
  Write the migration SQL by hand under `prisma/migrations/<timestamp>_name/`
  and let `prisma migrate deploy` apply it (deploy.sh already does).
- Additive, nullable columns are safe to apply before deploying the code that
  uses them; already-running code ignores columns it doesn't know about.
- Local dev reads and writes real user data. Be careful with test values.

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
- ~~PRICE_CACHE_PREWARMING.md~~ — removed, cron pre-warming was discontinued June 2026

## Design System

**Before designing UI:**
Review principles in `/Users/erickkosysu/Code Projects/_Design-System-Principles/`
- Use Heroicons (never emoji)
- Follow 8px spacing grid
- Mobile-first responsive design

## 🚨 CRITICAL: Internationalization (i18n) 🚨

**NEVER HARDCODE TEXT - ALWAYS USE TRANSLATIONS**

### Mandatory i18n Rules:

1. **All user-facing text MUST use translation keys**
   - No hardcoded English strings in components
   - No exceptions for "temporary" features
   - No "I'll add translations later"

2. **Translation Pattern:**
   ```typescript
   // ✅ CORRECT
   import { useTranslation } from '@/components/TranslationProvider';
   const { t } = useTranslation();
   <h1>{t.navigation.guides || 'Articles'}</h1>
   
   // ❌ WRONG
   <h1>Articles</h1>
   ```

3. **Always include fallback strings**
   - Use `||` operator with English fallback
   - Ensures graceful degradation if translation missing
   - Example: `{t.guides?.cta?.title || 'Start tracking your collection'}`

4. **Check translation files for all supported languages**
   - Add translation keys to ALL language files in the project
   - Ensure consistency across all translations
   - Never leave a language file incomplete

### Where to Add Translations:

**Client Components:**
```typescript
import { useTranslation } from '@/components/TranslationProvider';
const { t } = useTranslation();
```

**Server Components:**
```typescript
import { getTranslations } from '@/lib/i18n-subdomain';
const t = await getTranslations(locale);
```

### Incident History:

**May 6, 2026**: Articles page launched with hardcoded English text
- Result: Non-English users saw English instead of their language
- Cause: Forgot to use translation keys in new design
- Impact: Poor UX for non-English visitors
- Fix: Retroactively added translation support
- Lesson: **Always build with i18n from day 1, never add it later**

### Keeping translations from rotting:

`translations-backup/` IS the runtime source — despite the name, it is not a
backup. `lib/i18n-subdomain.ts` imports from it directly.

Run the checker after any change to user-facing text:

```bash
npm run check:translations
```

It reports four things: keys missing from a locale, values that have become
identical to English, values with English words left inside them, and — the
important one — English strings that changed since translations were last
reviewed.

That last check needs a baseline, so **after updating translations, re-record
it**:

```bash
npm run accept:translations
```

Skip that step and every key stays flagged forever, at which point the tool
gets ignored and stops working. The baseline also stores which strings are
deliberately identical to English ("Star Wars", "Premium"), so a clean tree
reports zero rather than 255 non-problems.

The build runs the check as a non-blocking warning; it prints in every deploy
log but never stops a deploy.

**September 2026:** 439 strings across it/ja/nl/pl/pt/sv were not translations
at all. A word-level find-and-replace had been run over English text, giving
"something that's net in the database" and "you've probably enantalered
Bricklink". Separately, `guides.cta` was rewritten in English and no
translation followed, in all nine locales. Neither surfaced on its own. That
is what this checker exists to catch.

**Article text lives in the database, not here.** `Article.translations` holds
per-locale titles and descriptions; `Article.contentBlocks` holds the body and
is English-only for every locale. Use `scripts/translate-article-metadata.mjs`
to update the former.

### Testing Translations:

**Before deploying UI changes:**
1. Test all supported languages in the project
2. Visit all language-specific URLs/subdomains
3. Verify no hardcoded text shows in non-default language sites
4. Check all translation files have the needed keys
5. Ensure fallback strings work if translation missing

**If you forget:** User will notice and ask "Is this translated?" - do it right the first time.

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
