# Rate Limiting Strategy

**Last Updated:** June 4, 2026  
**Status:** Active in production

---

## Overview

FigTracker uses **tiered rate limiting** where different endpoints have different limits based on their actual cost to the system. This prevents abuse while allowing normal users to browse freely.

**Key principle:** Rate limits should reflect request cost, not treat all endpoints equally.

---

## Rate Limit Tiers

### 🟢 Regular Pages (300/min)
**What:** Cached pages, ISR pages, static content  
**Limits:** 300 requests/minute  
**Why:** These are pre-generated or cached, barely touch the server

**Paths:**
- Homepage `/`
- Theme pages `/themes`, `/themes/star-wars`
- Minifig pages `/minifigs/sw0001` (ISR cached)
- Set pages `/sets/75192-1` (ISR cached)
- Static pages `/faq`, `/support`, `/privacy`

**User impact:** Almost impossible to hit - allows free browsing

---

### 🔵 Search (100/min)
**What:** Search endpoints and pages  
**Limits:** 
- 100 requests/minute (sustained)
- 20 requests/10 seconds (burst protection)

**Why:** Users type quickly, infinite scroll, autocomplete

**Paths:**
- `/search`
- `/api/search`
- `/api/minifigs/search`

**User impact:** Power users searching aggressively still fine

---

### 🟡 Collection Pages (100/min)
**What:** Database-backed user data pages  
**Limits:** 100 requests/minute

**Why:** Database queries but normal usage, well-indexed

**Paths:**
- `/collection`
- `/inventory`
- `/sets-collection`
- `/sets-inventory`
- `/account`
- `/wishlist`

**User impact:** Generous for normal usage

---

### 🟠 Normal API (60/min)
**What:** Standard API endpoints (database reads)  
**Limits:** 60 requests/minute

**Why:** Database lookups, moderate cost

**Paths:**
- `/api/minifigs/*` (general)
- `/api/sets/*` (general)
- `/api/themes`
- `/api/user/*`

**User impact:** Rarely hit by real users

---

### 🔴 BrickLink Pricing API (20/min) - CRITICAL
**What:** Endpoints that call BrickLink API  
**Limits:**
- **20 requests/minute** (enforces 3-second delays)
- **3 requests/10 seconds** (burst protection)

**Why:** **BrickLink API compliance** - MUST respect 3-second minimum delays

**Paths:**
- `/api/minifigs/[itemNo]/pricing`
- `/api/sets/[boxNo]/pricing`
- `/api/refresh-pricing`

**BrickLink Rules Enforced:**
- ✅ 3-second minimum delay (20/min = 1 per 3 seconds)
- ✅ 6-hour cache (enforced separately)
- ✅ 5,000 calls/day limit (tracked in database)

**User impact:** Prevents accidental API abuse, protects against ban

---

### 🔴 Database Writes (10/min)
**What:** Operations that write to database  
**Limits:** 10 requests/minute

**Why:** Expensive, can cause locks, need protection

**Paths:**
- `POST /api/collection`
- `PUT /api/inventory`
- `DELETE /api/wishlist`
- Any POST/PUT/DELETE to collection endpoints

**User impact:** Normal users never hit this (adding items is slow)

---

### ⚫ Cron/Admin Endpoints (5/min)
**What:** Background jobs and admin operations  
**Limits:** 5 requests/minute

**Why:** Very expensive, should not be called frequently

**Paths:**
- `/api/cron/*`
- `/api/admin/*`

**User impact:** Not user-facing, only for scheduled jobs

---

### 🔵 Authentication (30/min)
**What:** Login, signup, password reset  
**Limits:**
- 30 requests/minute
- 5 requests/10 seconds (brute-force protection)

**Why:** Prevent credential stuffing and brute force attacks

**Paths:**
- `/api/auth/*`
- `/api/login`
- `/api/signup`

**User impact:** Normal login attempts fine, attacks blocked

---

### ⚪ Static Assets (Unlimited)
**What:** Images, CSS, JS, fonts  
**Limits:** None (effectively 999,999/min)

**Why:** Served by CDN or nginx, doesn't touch Next.js

**Paths:**
- `/_next/static/*`
- `/_next/image/*`
- `/avatars/*`
- `/catalog/*`
- `*.svg`, `*.png`, `*.jpg`, etc.

**User impact:** Zero friction

---

## Implementation Details

### Burst Protection

Some endpoints have burst limits to prevent rapid-fire requests:

```typescript
// Example: Search
{
  maxRequests: 100,        // 100 requests per minute (sustained)
  windowMs: 60 * 1000,     // 1 minute window
  burstMax: 20,            // Max 20 requests in burst window
  burstWindowMs: 10 * 1000 // 10 second burst window
}
```

**Why:** Prevents attacks that stay just under the sustained limit by spreading requests evenly.

---

### BrickLink API Protection

**Critical:** BrickLink API has strict rules. Our rate limiting enforces them:

```typescript
API_PRICING: {
  maxRequests: 20,           // 20/min = 1 request every 3 seconds ✅
  windowMs: 60 * 1000,
  burstMax: 3,               // No more than 3 requests in 10 seconds
  burstWindowMs: 10 * 1000,
}
```

**Math:**
- 20 requests per minute = 1 request every 3 seconds
- BrickLink requires minimum 3-second delays
- **Compliance guaranteed** 🎯

**Additional protections:**
- 6-hour cache (enforced in `lib/bricklink.ts`)
- Daily limit tracker (ApiCallTracker table)
- Progressive fetch with 3-second setTimeout

---

### Retry-After Header

When rate limited, responses include `Retry-After` header:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42

Rate limit exceeded. Please wait 42 seconds.
```

Clients can use this to automatically retry after the window resets.

---

## Whitelist

**Owner IP whitelisted:** `73.52.155.221`

Whitelisted IPs skip ALL rate limiting. Used for:
- Site owner testing
- Development
- Emergency access

**Do not whitelist production traffic.**

---

## Monitoring

### How to Check Rate Limit Usage

**Server logs:**
```bash
pm2 logs figtracker | grep "429\|rate"
```

**Look for:**
- Frequent 429 responses (too strict)
- Same IP hitting limits repeatedly (possible attack)
- Legitimate users being blocked (adjust limits)

### Metrics to Track

1. **429 Response Rate**
   - Should be < 0.1% of total requests
   - If higher: limits too strict or under attack

2. **Top Rate-Limited IPs**
   - Check if legitimate users or bots
   - Whitelist if needed

3. **BrickLink API Calls**
   - Query ApiCallTracker table
   - Should stay under 5,000/day
   - Should never exceed 20/minute

---

## Adjusting Limits

### When to Increase Limits

**Signs limits are too strict:**
- ✋ Legitimate users report "Too Many Requests"
- ✋ 429 rate > 1% of requests
- ✋ Support tickets about timeouts

**How to adjust:**
1. Identify which tier is causing issues
2. Increase limit by 50% (e.g., 100 → 150)
3. Monitor for 1 week
4. Repeat if needed

### When to Decrease Limits

**Signs limits are too loose:**
- 🚨 Server CPU consistently high
- 🚨 Database connection pool exhausted
- 🚨 Obvious bot traffic getting through
- 🚨 BrickLink API approaching daily limit

**How to adjust:**
1. Check logs for abusive IPs
2. Decrease limit by 25% (e.g., 100 → 75)
3. Monitor for false positives
4. Revert if legitimate users affected

---

## Testing

### Local Testing

```bash
# Test regular pages (should allow 300/min)
for i in {1..310}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://figtracker.ericksu.com/minifigs/sw0001
done
# First 300 should return 200, last 10 should return 429

# Test pricing API (should allow 20/min)
for i in {1..25}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://figtracker.ericksu.com/api/minifigs/sw0001/pricing
done
# First 20 should return 200, last 5 should return 429
```

### Production Monitoring

**Google Analytics:**
- Track 429 errors as events
- Monitor by page type
- Alert if > 0.5% of traffic

**Server Metrics:**
- Track rate limit hits by tier
- Monitor CPU/memory during attacks
- Alert on sustained high 429 rate

---

## Attack Scenarios

### Scenario 1: DDoS on Homepage
**Attack:** 10,000 requests/minute to `/`

**Protection:**
- Homepage: 300 requests/min per IP
- Attacker blocked after 300 requests
- Legitimate users unaffected (different IPs)
- Cloudflare Bot Fight Mode catches most

**Result:** ✅ Site stays up

---

### Scenario 2: Pricing API Abuse
**Attack:** Bot hammering `/api/minifigs/*/pricing`

**Protection:**
- Pricing API: 20 requests/min per IP
- BrickLink rules enforced (3-second delays)
- Daily limit tracker (5,000 calls/day total)
- Attacker blocked quickly

**Result:** ✅ BrickLink API safe, no ban

---

### Scenario 3: Brute Force Login
**Attack:** Password guessing on `/api/auth/login`

**Protection:**
- Auth endpoints: 30 requests/min
- Burst limit: 5 requests/10 seconds
- After 5 attempts: wait 10 seconds
- After 30 attempts: wait 60 seconds

**Result:** ✅ Brute force ineffective

---

### Scenario 4: Collection Spam
**Attack:** Bot adding thousands of items to collection

**Protection:**
- Write endpoints: 10 requests/min
- User must be authenticated
- Database locks prevent corruption

**Result:** ✅ Spam blocked, database safe

---

## Future Improvements

### 1. Redis-Based Rate Limiting
**Why:** Current in-memory solution doesn't work across multiple servers

**When to implement:** If scaling to multiple VPS instances

**Benefits:**
- Consistent limits across servers
- Persistent across restarts
- Atomic operations

### 2. IP Reputation System
**Why:** Assign dynamic limits based on behavior

**How it works:**
- New IPs: strict limits
- Good behavior IPs: relaxed limits
- Bad behavior IPs: permanently blocked

**Example:**
- New user: 100/min
- After 1 week good behavior: 200/min
- After bot detection: 10/min

### 3. User-Based Limits
**Why:** Authenticated users should get higher limits

**Implementation:**
```typescript
if (user.isPremium) {
  limit = 500/min; // Premium users
} else if (user.isAuthenticated) {
  limit = 200/min; // Free users
} else {
  limit = 100/min; // Anonymous
}
```

### 4. Geographic Limits
**Why:** Different regions have different traffic patterns

**Example:**
- Singapore: strict (high bot traffic)
- US/Europe: normal
- Search engines: unlimited

---

## FAQ

### Q: Why 300/min for regular pages?
**A:** ISR-cached pages cost almost nothing to serve. Even aggressive browsing rarely exceeds 100/min. 300/min gives headroom for power users.

### Q: Why such strict limits on pricing API?
**A:** BrickLink WILL ban us if we exceed their limits (3-second delays, 5,000/day). 20/min enforces compliance automatically.

### Q: What if a legitimate user hits the limit?
**A:** 
1. Check logs to confirm they're legitimate
2. Add their IP to whitelist temporarily
3. Consider if limits are too strict
4. User can wait 60 seconds for reset

### Q: How does this protect against DDoS?
**A:** 
- Per-IP limits isolate attackers
- They can't consume entire server capacity
- Legitimate users on different IPs unaffected
- Cloudflare provides additional DDoS protection

### Q: Why not use Cloudflare rate limiting?
**A:** 
- Cloudflare Free tier: very limited rules
- We need custom logic (BrickLink compliance)
- Cheaper to implement ourselves
- More control and flexibility

---

## Related Documentation

- [BrickLink API Compliance](BRICKLINK_API_COMPLIANCE.md)
- [Pricing System](PRICING_SYSTEM.md)
- [Price Cache Prewarming](PRICE_CACHE_PREWARMING.md)

---

**Maintained by:** Erick Su + Claude Code  
**Review Frequency:** Quarterly, or after any 429 spike
