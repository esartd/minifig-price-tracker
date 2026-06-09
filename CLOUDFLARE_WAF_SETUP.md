# Cloudflare WAF Setup Guide for FigTracker

**Date:** June 9, 2026  
**Purpose:** Block bot traffic at Cloudflare edge (before reaching server)

---

## Current Protection Layers

### Layer 1: Cloudflare WAF (NEW - Set up manually)
- Blocks bots at edge network (saves server bandwidth)
- Uses Cloudflare's global bot intelligence
- Free tier allows 5 custom rules

### Layer 2: Server-Side Blocking (ACTIVE)
- Historical blocklist: 2,096 known bot IPs
- IP range blocking: Tencent Cloud (Singapore)
- Smart behavioral detection: 6 bot patterns
- IP-bound CAPTCHA: Backup layer

---

## Cloudflare WAF Rules to Create

### Rule 1: Challenge Singapore Bots ✅

**Purpose:** Singapore has 60% bot traffic (3,595 bots vs 0 real users)

**Configuration:**
```
Rule name: Challenge Singapore Bots

Expression:
(ip.geoip.country eq "SG" and not cf.client.bot)

Action: Managed Challenge
```

**What it does:**
- ✅ Allows verified search engines (Googlebot, Bingbot)
- ✅ Challenges all other Singapore traffic
- ✅ Real users pass with one click
- ✅ Bots are blocked

---

### Rule 2: Block US Scrapers & Scripts ✅

**Purpose:** 63% of US traffic shows bot patterns (635 out of 1,009 requests)

**Configuration:**
```
Rule name: Block US Scrapers & Scripts

Expression:
(ip.geoip.country eq "US" and not cf.client.bot) and (http.user_agent contains "python" or http.user_agent contains "curl" or http.user_agent contains "wget" or http.user_agent contains "scrapy" or http.user_agent contains "headless" or http.user_agent contains "Go-http-client" or http.user_agent contains "axios" or http.user_agent contains "node-fetch")

Action: Managed Challenge
```

**What it does:**
- ✅ Blocks automated scripts (python, curl, scrapy)
- ✅ Allows real browsers (Chrome, Firefox, Safari)
- ✅ Allows verified search engines
- ✅ Protects against headless browsers

---

### Rule 3: Challenge Suspicious Bots Worldwide ✅

**Purpose:** Catch bots from all other countries

**Configuration:**
```
Rule name: Challenge Suspicious Bots Worldwide

Expression:
(cf.client.bot and not cf.verified_bot_category in {"Search Engine Crawler" "Search Engine Optimization (SEO) Crawler"}) or (not cf.client.bot and (http.user_agent contains "bot" or http.user_agent contains "crawler" or http.user_agent contains "spider" or http.user_agent contains "scraper"))

Action: Managed Challenge
```

**What it does:**
- ✅ Allows Google, Bing, Yahoo, etc.
- ✅ Challenges unverified bots
- ✅ Blocks scrapers with bot-like user agents
- ✅ Global protection (all countries)

---

### Rule 4: Enable Bot Fight Mode ✅

**Purpose:** Cloudflare's automated ML-based bot detection

**How to enable:**
1. Go to Security > Bots
2. Find "Bot Fight Mode"
3. Toggle ON

**What it does:**
- ✅ Machine learning detection
- ✅ Automatic challenge issuance
- ✅ No configuration needed
- ✅ Free on all plans

---

## Implementation Steps

### Step 1: Login to Cloudflare
1. Go to https://dash.cloudflare.com
2. Select domain: figtracker.ericksu.com
3. Navigate to Security > WAF > Custom rules

### Step 2: Create 3 Custom Rules
Follow the configurations above in order:
1. Singapore Challenge
2. US Scrapers Block
3. Worldwide Bot Challenge

### Step 3: Enable Bot Fight Mode
Security > Bots > Toggle ON

### Step 4: Verify (24 hours later)
- Check Security > Events for blocked traffic
- Monitor Google Analytics for bot reduction
- Review server logs for decreased load

---

## Expected Results

### Before Cloudflare WAF:
- **Bot traffic:** 76% of all requests (4,515/5,921)
- **Server load:** High (bots waste bandwidth)
- **API usage:** 90% quota (4,480/5,000 calls)
- **Clean data:** No (GA polluted)

### After Cloudflare WAF + Server Blocking:
- **Bot traffic:** <5% (blocked at Cloudflare edge)
- **Server load:** Low (bots never reach server)
- **API usage:** 10-20% quota (only real users)
- **Clean data:** Yes (accurate analytics)

---

## Monitoring Commands

**Check server-side blocks:**
```bash
ssh root@187.77.202.14 'grep -E "TENCENT CLOUD BLOCKED|AUTO-BLOCKED|HISTORICAL BOT" /root/.pm2/logs/figtracker-out.log | wc -l'
```

**Check Cloudflare blocks:**
- Dashboard > Security > Events
- Look for "Managed Challenge" actions
- Filter by rule name

**Check API usage:**
```bash
bash /tmp/check_api_usage.sh
```

---

## Troubleshooting

### If you get blocked from your own site:

**Your IP is whitelisted:** `73.52.155.221`

**If your IP changes:**
1. Find new IP: `curl -s https://api.ipify.org`
2. SSH to server
3. Edit middleware.ts whitelist array
4. Add new IP
5. Redeploy

### If legitimate users are blocked:

**Cloudflare WAF:**
- Change Action from "Block" to "Managed Challenge"
- Users will see one-time challenge
- After passing, they're whitelisted for 24h

**Server-side:**
- Check logs for false positives
- Add IP to whitelist if needed

---

## Cost

**Cloudflare:** FREE
- Bot Fight Mode: Included
- 5 Custom WAF Rules: Included
- Bandwidth savings: FREE benefit

**Current Server Costs:** No change
- Historical blocklist: No cost
- Smart detection: No cost
- All runs on your existing VPS

---

## Security Contact

**If you need to adjust rules:**
- Check this document
- Review CLAUDE.md for critical notes
- Test changes on staging first

**Emergency disable:**
- Cloudflare: Toggle rules OFF in dashboard
- Server: Comment out middleware checks

---

## References

- [Cloudflare Bot Management](https://developers.cloudflare.com/bots/)
- [WAF Custom Rules](https://developers.cloudflare.com/waf/custom-rules/)
- [Verified Bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)
