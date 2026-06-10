# Enhanced Bot Protection - June 2026

**Date:** June 10, 2026  
**Issue:** Bots bypassing Singapore blocking via global residential proxies

---

## Current Situation (June 10, 2026)

### Bot Traffic Pattern:
- **Bangladesh:** 5 users (↓66.7%) - NEW bot source
- **Hong Kong:** 4 users (↓20%) - Proxy network
- **Pakistan:** 3 users (↑200%) - NEW bot source
- **Vietnam:** 3 users (↓25%) - Proxy network
- **Argentina:** 2 users (↑100%) - NEW bot source
- **Singapore:** 3 users (↓98%) - **Singapore blocking worked!**

### What Happened:
1. ✅ Singapore blocking **WORKED** (dropped from 573 to 3 users)
2. ❌ Bots **ADAPTED** by switching to global residential proxies
3. ❌ Residential IPs bypass ASN blocking (not data center IPs)
4. ❌ Global distribution bypasses country-specific CAPTCHA

### Evidence This Is Bot Traffic:
- Countries with zero historical human traffic suddenly active
- Sequential patterns (similar to Singapore bot behavior)
- Direct detail page hits with no referer
- No engagement with browse/search pages

---

## Solution: Multi-Layer Enhanced Protection

### Layer 1: Cloudflare WAF (IMMEDIATE - Manual Setup Required)

#### Step 1: Check Current Cloudflare Setup
1. Login: https://dash.cloudflare.com
2. Select domain: `figtracker.ericksu.com`
3. Go to: **Security > WAF > Custom rules**
4. Verify these 3 rules exist and are **ENABLED**:
   - ✅ Challenge Singapore Bots
   - ✅ Block US Scrapers & Scripts
   - ✅ Challenge Suspicious Bots Worldwide

#### Step 2: Add NEW Cloudflare Rule - Global Residential Proxy Challenge

**Purpose:** Challenge traffic from residential proxy countries with no human history

```
Rule name: Challenge High-Risk Bot Countries

Expression:
(ip.geoip.country in {"BD" "PK" "VN" "AR" "HK"} and not cf.verified_bot_category in {"Search Engine Crawler"})

Action: Managed Challenge

Priority: 1 (run first)
```

**What it does:**
- ✅ Challenges Bangladesh, Pakistan, Vietnam, Argentina, Hong Kong
- ✅ Allows verified search engines (Google, Bing)
- ✅ Real users pass with one click
- ✅ Bots are blocked

#### Step 3: Strengthen Existing "Suspicious Bots Worldwide" Rule

**Current expression:**
```
(cf.client.bot and not cf.verified_bot_category in {"Search Engine Crawler" "Search Engine Optimization (SEO) Crawler"}) or (not cf.client.bot and (http.user_agent contains "bot" or http.user_agent contains "crawler" or http.user_agent contains "spider" or http.user_agent contains "scraper"))
```

**Enhanced expression (ADD behavioral signals):**
```
(cf.client.bot and not cf.verified_bot_category in {"Search Engine Crawler" "Search Engine Optimization (SEO) Crawler"})
or
(not cf.client.bot and (http.user_agent contains "bot" or http.user_agent contains "crawler" or http.user_agent contains "spider" or http.user_agent contains "scraper"))
or
(cf.threat_score gt 10 and not cf.verified_bot_category in {"Search Engine Crawler"})
```

**What changed:**
- Added `cf.threat_score gt 10` (Cloudflare's ML bot score)
- Catches sophisticated bots that hide user-agent

#### Step 4: Enable Super Bot Fight Mode (if available)

1. Go to: **Security > Bots**
2. Check if "Super Bot Fight Mode" is available
3. If yes: Enable it (better than regular Bot Fight Mode)
4. If no: Ensure regular "Bot Fight Mode" is **ON**

---

### Layer 2: Server-Side Enhancements (Code Changes)

#### Enhancement A: Add High-Risk Countries to CAPTCHA Requirement

**File:** `middleware.ts` (line 114)

**Current:**
```typescript
const HIGH_RISK_COUNTRIES = ['SG', 'CN', 'RU', 'IN', 'VN', 'ID', 'PH'];
```

**Enhanced:**
```typescript
// Countries with 90%+ bot traffic and no historical human users
const HIGH_RISK_COUNTRIES = [
  'SG', 'CN', 'RU', 'IN', 'VN', 'ID', 'PH', // Original list
  'BD', 'PK', 'AR', 'HK',                   // NEW: Residential proxy sources
];
```

#### Enhancement B: Stricter Smart Bot Detection Thresholds

**File:** `lib/smart-bot-detector.ts` (line 154)

**Current:**
```typescript
const BOT_THRESHOLD = 60; // Score must reach 60 to block
```

**Enhanced:**
```typescript
const BOT_THRESHOLD = 40; // STRICTER: Block at 40 instead of 60
// Reason: Bots using residential proxies are more sophisticated
// Lower threshold catches them faster
```

#### Enhancement C: Add Known Residential Proxy ASNs

**File:** `middleware.ts` (line 122)

**Current:** Only blocks data center ASNs (Tencent Cloud, Oxylabs, etc.)

**Enhanced:** Add known residential proxy networks

```typescript
const BLOCKED_ASNS = [
  // Singapore bot networks (existing)
  'AS132203', 'AS212238', 'AS139628', 'AS150436',
  '132203', '212238', '139628', '150436',

  // Known proxy/scraping services (existing)
  'AS208843', 'AS206092', 'AS212695',
  '208843', '206092', '212695',

  // NEW: Residential proxy networks used by bots
  'AS55990',  // Bangladesh - Banglalink (common bot source)
  'AS23674',  // Pakistan - PCCW (VPN provider)
  'AS131353', // Hong Kong - NTT Communications (proxy service)
  'AS27882',  // Argentina - Fibertel (proxy exit nodes)
  '55990', '23674', '131353', '27882',
];
```

**⚠️ WARNING:** This may block some legitimate users. Monitor logs carefully.

---

### Layer 3: Real-Time Monitoring & Auto-Learning

#### Add Automated ASN Discovery from Logs

**Purpose:** Automatically identify which ASNs are producing bot traffic

**File:** `scripts/analyze-bot-asns.ts` (NEW)

```typescript
/**
 * Analyze server logs to find ASNs with high bot scores
 * Run weekly to discover new bot networks
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeASNs() {
  // Parse middleware logs for AUTO-BLOCKED entries
  // Group by ASN
  // If ASN has 10+ blocks and 0 human scores, add to blocklist
  
  console.log('[ASN ANALYZER] Run weekly to find new bot networks');
  console.log('TODO: Implement log parsing + ASN grouping');
}

analyzeASNs();
```

---

## Implementation Priority

### IMMEDIATE (Today):
1. ✅ Check Cloudflare WAF rules are active
2. ✅ Add new Cloudflare rule: "Challenge High-Risk Bot Countries"
3. ✅ Update HIGH_RISK_COUNTRIES in middleware.ts (add BD, PK, AR, HK)

### HIGH PRIORITY (This Week):
4. ✅ Lower BOT_THRESHOLD from 60 to 40 in smart-bot-detector.ts
5. ✅ Monitor logs for 48 hours (check for false positives)
6. ⚠️ Add residential proxy ASNs (ONLY if logs confirm they're bots)

### MEDIUM PRIORITY (Next Week):
7. 📊 Build ASN analysis script
8. 📊 Create admin dashboard to view bot scores
9. 📊 Set up weekly ASN review process

---

## Testing Plan

### After Cloudflare Changes (24 hours):
1. Check Cloudflare Analytics: Security > Events
   - Should see "Managed Challenge" actions for BD, PK, HK, VN, AR
   - Verify search engines still pass through

2. Check Google Analytics (48 hours later):
   - Bangladesh sessions should drop to ~0
   - Pakistan sessions should drop to ~0
   - Argentina, HK, Vietnam should drop to ~0

3. Check Server Logs:
   ```bash
   ssh root@187.77.202.14 'grep -E "Country: (BD|PK|AR|HK|VN)" /root/.pm2/logs/figtracker-out.log | tail -50'
   ```
   - Should see very few requests from these countries
   - Cloudflare should be blocking most at edge

### After Server-Side Changes (48 hours):
1. Monitor AUTO-BLOCKED logs:
   ```bash
   ssh root@187.77.202.14 'grep "AUTO-BLOCKED" /root/.pm2/logs/figtracker-out.log | tail -100'
   ```
   - Should see more blocks with lower threshold
   - Check for false positives (legitimate IPs blocked)

2. Monitor CAPTCHA REQUIRED logs:
   ```bash
   ssh root@187.77.202.14 'grep "CAPTCHA REQUIRED" /root/.pm2/logs/figtracker-out.log | tail -100'
   ```
   - Should see challenges for BD, PK, AR, HK countries
   - Real users can still pass after one-time verification

---

## Expected Results (7 days)

### Current Bot Traffic (June 10):
- **Bangladesh:** 5 active users
- **Pakistan:** 3 active users  
- **Hong Kong:** 4 active users
- **Vietnam:** 3 active users
- **Argentina:** 2 active users
- **TOTAL:** 17 bot users/day

### After Enhanced Protection:
- **Cloudflare blocks:** 80-90% at edge (never reaches server)
- **Server blocks:** Remaining 10-20% caught by smart detector
- **Expected bot traffic:** <1 user/day
- **Real user impact:** Zero (one-time challenge if needed)

---

## Rollback Plan (If False Positives)

### If Cloudflare blocks legitimate users:
1. Go to Cloudflare Dashboard
2. Find rule: "Challenge High-Risk Bot Countries"
3. Change action from "Challenge" to "Log" (monitoring mode)
4. Review Security > Events for 48 hours
5. If still blocking real users, remove country from list

### If Server-side blocks legitimate users:
1. Check logs for their IP address
2. Add to WHITELISTED_IPS array in middleware.ts
3. Redeploy: `npm run build && pm2 restart figtracker`

---

## Success Metrics (Track Daily)

### Bot Reduction:
- Cloudflare challenges issued: Should be >50/day
- Cloudflare blocks: Should be >100/day
- Server-side AUTO-BLOCKED: Should decrease (Cloudflare catching them first)

### Real User Impact:
- Bounce rate: Should stay same or improve
- Average session duration: Should stay same or improve
- Conversion rate: Should stay same or improve
- Support tickets about access: Should be ZERO

---

## Contact & Support

**If you need help:**
1. Check this document first
2. Review CLAUDE.md for critical rules
3. Check Cloudflare logs: Security > Events
4. Check server logs: `pm2 logs figtracker`

**Emergency disable:**
- Cloudflare: Toggle rules OFF in dashboard
- Server: Add problematic IP to WHITELISTED_IPS

---

## References
- [CLOUDFLARE_WAF_SETUP.md](./CLOUDFLARE_WAF_SETUP.md) - Original setup guide
- [BRICKLINK_API_COMPLIANCE.md](./BRICKLINK_API_COMPLIANCE.md) - API rules
- [Cloudflare Threat Score](https://developers.cloudflare.com/ruleset-engine/rules-language/fields/#cfthreat_score)
- [Cloudflare Verified Bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)
