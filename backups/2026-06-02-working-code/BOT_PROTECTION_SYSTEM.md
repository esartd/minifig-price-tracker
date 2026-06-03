# Bot Protection System

**Date Implemented:** May 31, 2026

## Overview

Implemented comprehensive bot protection to block automated scrapers and data center traffic, particularly from Singapore, that was consuming CPU resources and distorting analytics.

## Implementation

### 1. Next.js Middleware Bot Detection

**File:** `middleware.ts`

**What it does:**
- Inspects User-Agent header on every request
- Blocks common scraper patterns (headless browsers, automated tools, generic HTTP clients)
- Returns 403 Forbidden before scrapers reach server resources

**Blocked User-Agent patterns:**
- `headless` - Headless Chrome/Firefox
- `scrapy` - Python scraping framework
- `python-requests` - Generic Python HTTP library
- `axios` - Node.js HTTP client (often used in scraping)
- `curl` / `wget` - Command-line tools
- `selenium` / `puppeteer` / `playwright` - Browser automation
- `bot` / `crawler` / `scraper` / `spider` - Generic scrapers

**Why at middleware level:**
- Executes at edge before hitting server code
- Prevents CPU waste on scraper requests
- Minimal performance impact on legitimate traffic

### 2. Enhanced robots.txt

**File:** `public/robots.txt`

**Added AI crawlers:**
- `ClaudeBot` - Anthropic's AI crawler
- `Google-Extended` - Google's AI training crawler
- `Bytespider` - TikTok/ByteDance crawler
- `Diffbot` - Knowledge graph crawler
- `ImagesiftBot` - Image scraping bot
- `Amazonbot` - Amazon's crawler
- `PetalBot` - Huawei search crawler
- `AhrefsBot` / `SemrushBot` / `DotBot` / `MJ12bot` / `BLEXBot` - SEO tool crawlers

**What remains allowed:**
- Legitimate search engines (Googlebot, Bingbot, DuckDuckBot, etc.)
- Public pages for SEO
- Protected: `/api/`, `/inventory/`, `/account/`

## How It Works

### Request Flow:

```
Incoming Request
    ↓
[Middleware checks User-Agent]
    ↓
Suspicious? → 403 Forbidden (stops here)
    ↓
Legitimate → Continue to application
    ↓
[robots.txt checked by well-behaved crawlers]
    ↓
Blocked in robots.txt? → Crawler stops (voluntary)
    ↓
Allowed → Normal page rendering
```

### Two-Layer Defense:

1. **Middleware (mandatory block):**
   - Catches malicious scrapers that ignore robots.txt
   - Server-enforced, cannot be bypassed
   - Protects CPU and bandwidth

2. **robots.txt (voluntary compliance):**
   - Well-behaved AI crawlers respect it
   - Reduces unnecessary crawling by legitimate bots
   - No CPU cost (they just don't request)

## What This Does NOT Block

**Legitimate traffic from Singapore:**
- Real users with normal browsers
- Mobile apps with legitimate User-Agents
- Corporate networks with standard browsers

**How to tell legitimate from bot:**
- Real browsers: `Mozilla/5.0 ... Chrome/125.0 ... Safari/537.36`
- Scrapers: `python-requests/2.31.0`, `axios/1.6.8`, `curl/8.5.0`

## Monitoring & Validation

### Check if bots are being blocked:

1. **Server logs** (check for 403 responses):
   ```bash
   grep "403" /var/log/your-app.log | grep -i "singapore"
   ```

2. **Google Analytics 4:**
   - Traffic from Singapore should decrease
   - Bounce rate from Singapore should normalize
   - Session duration should increase

3. **Test blocking locally:**
   ```bash
   # Should return 403
   curl -A "python-requests/2.31.0" http://localhost:3000

   # Should work normally
   curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0" http://localhost:3000
   ```

### Expected Results:

- ✅ CPU usage decreases (fewer scraper requests processed)
- ✅ Analytics data cleaner (fewer bot sessions)
- ✅ Server costs lower (bandwidth saved)
- ✅ Real users unaffected (legitimate browsers pass through)

## For Cloudflare WAF (Optional Additional Layer)

If you want additional protection at DNS level:

**Create WAF rule:**
```
(ip.geoip.country eq "SG" and 
 ip.geoip.asnum in {
   14618   # Amazon AWS Singapore
   15169   # Google Cloud Singapore
   16509   # AWS Asia Pacific
   8075    # Microsoft Azure Singapore
   14061   # DigitalOcean Singapore
 })
```

**Action:** Challenge (CAPTCHA) or Block

**Why optional:**
- Middleware already blocks scrapers by User-Agent
- WAF adds cost (if on paid Cloudflare plan)
- Geographic blocking can affect VPN users

## Maintenance

### When to update:

1. **New scraper patterns appear:**
   - Check server logs for suspicious User-Agents
   - Add new patterns to `BLOCKED_USER_AGENTS` array

2. **New AI crawlers launch:**
   - Update `public/robots.txt` with new User-agent names
   - AI companies usually announce new crawlers

3. **False positives reported:**
   - User claims legitimate access blocked
   - Review `BLOCKED_USER_AGENTS` for overly broad patterns
   - Consider removing or narrowing pattern

### Testing checklist after updates:

- [ ] `npm run build` succeeds
- [ ] Test with real browser: should work
- [ ] Test with curl: should return 403
- [ ] Check robots.txt loads: `https://figtracker.ericksu.com/robots.txt`
- [ ] Monitor logs after deploy for unexpected 403s

## Trade-offs

**Benefits:**
- ✅ Protects server resources
- ✅ Cleaner analytics data
- ✅ Lower hosting costs
- ✅ Faster for real users (less server load)

**Potential issues:**
- ⚠️ Some legitimate automation might break (API clients, monitoring tools)
- ⚠️ Developers using curl/wget for testing must use browser User-Agent
- ⚠️ Internal monitoring tools might need whitelisting

**Solution for legitimate automation:**
- Add custom header check: `if (request.headers.get('x-api-key') === process.env.INTERNAL_API_KEY)`
- Whitelist specific User-Agents if needed

## Related Documentation

- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- robots.txt Spec: https://www.robotstxt.org/
- Cloudflare WAF: https://developers.cloudflare.com/waf/

## Questions?

**"Why not just use Cloudflare?"**
- Middleware is free and runs on every hosting platform
- Cloudflare WAF costs extra on Pro/Business plans
- Middleware catches bots regardless of DNS provider

**"Will this block Google?"**
- No - Googlebot has User-Agent `Mozilla/5.0 ... Googlebot/2.1`
- Middleware only blocks generic scrapers
- robots.txt explicitly allows Googlebot

**"What if I need to scrape my own site?"**
- Use a custom User-Agent: `MyApp-Internal-Monitor/1.0`
- Add to middleware: `if (userAgent.includes('myapp-internal-monitor')) continue;`
- Or use API key header for authentication
