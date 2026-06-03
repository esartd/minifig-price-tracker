# Testing Bot Protection

## Quick Start

### 1. Test Locally

**Start dev server:**
```bash
npm run dev
```

**Run test script (in another terminal):**
```bash
./test-bot-protection.sh
```

**Or test production URL:**
```bash
./test-bot-protection.sh https://figtracker.ericksu.com
```

Expected output:
```
✅ Normal Browser - HTTP 200 (allowed)
✅ Python Requests - HTTP 403 (blocked)
✅ Headless Chrome - HTTP 403 (blocked)
✅ Generic curl - HTTP 403 (blocked)
✅ Axios - HTTP 403 (blocked)
```

---

## Manual Testing

### Test with curl (from terminal):

**1. Normal browser - should work (200 OK):**
```bash
curl -v -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36" \
  https://figtracker.ericksu.com/
```

**2. Python scraper - should block (403 Forbidden):**
```bash
curl -v -A "python-requests/2.31.0" https://figtracker.ericksu.com/
```

**3. Generic curl - should block (403 Forbidden):**
```bash
curl -v https://figtracker.ericksu.com/
```

**Look for:**
- `< HTTP/2 403` = Blocked ✅
- `< HTTP/2 200` = Allowed ✅

---

## Test in Browser

### 1. Check robots.txt

Visit: https://figtracker.ericksu.com/robots.txt

**Should see:**
```
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
Disallow: /
```

### 2. Test with Browser DevTools

**Chrome/Safari DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Visit homepage
4. Check Status column: should be `200`
5. Check Response headers for `x-locale` (confirms middleware ran)

### 3. Simulate a Bot (Advanced)

**Using Chrome DevTools:**
1. Open DevTools → Network Conditions
2. Uncheck "Use browser default"
3. Change User Agent to: `python-requests/2.31.0`
4. Refresh page
5. Should see **403 Forbidden** error

---

## Test After Deployment

### 1. Quick Smoke Test

```bash
# Should work
curl -A "Mozilla/5.0 Chrome/125.0.0.0 Safari/537.36" https://figtracker.ericksu.com/

# Should return 403
curl https://figtracker.ericksu.com/
```

### 2. Monitor Server Logs

**Check for 403 responses:**
```bash
# SSH into your VPS
ssh your-server

# Check nginx/application logs
tail -f /var/log/your-app.log | grep "403"
```

**Example log entry:**
```
[2026-05-31] GET / - 403 - "python-requests/2.31.0"
```

### 3. Check Google Analytics

**Wait 24-48 hours, then check:**

1. **Traffic from Singapore should decrease**
   - GA4 → Reports → User Attributes → Country
   - Compare before/after May 31, 2026

2. **Bounce rate should normalize**
   - Bots usually have 100% bounce rate
   - Real users browse multiple pages

3. **Session duration should increase**
   - Bots: 0-5 seconds
   - Real users: 30+ seconds

---

## Troubleshooting

### Issue: All requests return 403

**Problem:** Middleware blocking legitimate traffic

**Fix:**
```typescript
// In middleware.ts, add debug logging:
console.log('User-Agent:', userAgent);
console.log('Is suspicious:', isSuspiciousBot);
```

Check which pattern is matching incorrectly.

### Issue: Bots still getting through

**Check:**
1. Middleware is deployed (`middleware.ts` in production)
2. User-Agent header is being sent
3. Pattern matching is case-insensitive

**Add more patterns:**
```typescript
const BLOCKED_USER_AGENTS = [
  // ... existing patterns ...
  'your-new-pattern',
];
```

### Issue: Build fails after changes

**Run:**
```bash
npm run build
```

Check error messages. Common issues:
- Syntax error in middleware.ts
- TypeScript type mismatch

---

## Advanced Testing

### Test with Different HTTP Clients

**Python:**
```python
import requests
# Should get 403
requests.get('https://figtracker.ericksu.com/')
```

**Node.js:**
```javascript
const axios = require('axios');
// Should get 403
axios.get('https://figtracker.ericksu.com/');
```

**Go:**
```go
// Should get 403
http.Get("https://figtracker.ericksu.com/")
```

All should return 403 Forbidden.

### Load Testing (be careful!)

**Before running load tests:**
- Only test on local dev server
- Never load test production without permission

```bash
# Install apache bench
brew install apache2

# Test 100 requests with bot User-Agent
ab -n 100 -A "python-requests/2.31.0" http://localhost:3000/

# Should see 100% non-2xx responses (403s)
```

---

## Validation Checklist

Before considering protection complete:

- [ ] `./test-bot-protection.sh` passes all tests locally
- [ ] `./test-bot-protection.sh https://figtracker.ericksu.com` passes in production
- [ ] robots.txt loads and contains AI bot blocks
- [ ] Real browser access works normally
- [ ] curl without User-Agent returns 403
- [ ] Server logs show 403 responses for bots
- [ ] `npm run build` succeeds
- [ ] No false positives reported by users

---

## Monitoring Schedule

**Daily (first week):**
- Check error logs for unexpected 403s
- Monitor user reports of access issues
- Verify legitimate traffic still works

**Weekly (first month):**
- Review GA4 traffic from Singapore
- Check server CPU/bandwidth usage
- Update patterns if new scrapers appear

**Monthly (ongoing):**
- Review robots.txt for new AI crawlers
- Check for new scraping tools in logs
- Update BLOCKED_USER_AGENTS as needed

---

## What Success Looks Like

**Metrics after 7 days:**
- 📉 Singapore bot traffic: -60% to -90%
- 📉 Server CPU usage: -20% to -40%
- 📉 Bandwidth usage: -15% to -30%
- 📈 Average session duration: +10% to +25%
- 📈 Pages per session: +15% to +30%
- ✅ Zero legitimate user complaints

**Server logs:**
```
[Before] 1,000 requests/hour (700 bots + 300 users)
[After]  350 requests/hour (50 bots + 300 users)
```

---

## Need Help?

**Resources:**
- Full documentation: [BOT_PROTECTION_SYSTEM.md](BOT_PROTECTION_SYSTEM.md)
- Next.js Middleware: https://nextjs.org/docs/middleware
- User-Agent database: https://useragentstring.com/

**Contact:**
- Issues with protection: Check middleware.ts
- False positives: Remove overly broad patterns
- New bot types: Add to BLOCKED_USER_AGENTS array
