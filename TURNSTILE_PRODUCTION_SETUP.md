# 🚀 Production Deployment - Cloudflare Turnstile

**Status:** Keys configured locally ✅  
**Next:** Add to production environment

## 📋 Add Keys to Production

### **Option 1: Via Hostinger Panel (Recommended)**

1. Log into Hostinger
2. Go to your VPS
3. Navigate to environment variables section
4. Add these two variables:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAADgCKY-yTw_0o4H-
TURNSTILE_SECRET_KEY=0x4AAAAAADgCKWV98cJB_fV5y1sOZMm4i0Y
```

5. Restart your Node.js application

### **Option 2: Via SSH (Alternative)**

```bash
# SSH into your VPS
ssh root@137.184.34.143

# Navigate to your app
cd /root/minifig-price-tracker

# Add to .env.production
echo 'NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAADgCKY-yTw_0o4H-"' >> .env.production
echo 'TURNSTILE_SECRET_KEY="0x4AAAAAADgCKWV98cJB_fV5y1sOZMm4i0Y"' >> .env.production

# Pull latest code
git pull origin main

# Rebuild
npm install
npm run build

# Restart
pm2 restart figtracker
```

## ✅ Verify It's Working

### **1. Test the CAPTCHA page directly:**
```
https://figtracker.ericksu.com/verify-human?returnTo=/minifigs/sw0001
```

You should see:
- Page loads with shield icon
- "Quick Security Check" heading
- Turnstile widget appears
- Completes verification (0-3 seconds)
- Redirects to minifig page

### **2. Test as Singapore visitor:**

**Using browser console:**
```javascript
// Open Chrome/Firefox DevTools (F12)
// Go to Console tab
// Paste this:
document.cookie = "captcha_verified=; path=/; max-age=0"; // Clear cookie
// Then visit a minifig page with no referer (direct URL)
```

**Using VPN:**
- Connect to Singapore VPN
- Visit: https://figtracker.ericksu.com/minifigs/sw0001
- Should redirect to /verify-human
- Complete CAPTCHA
- Redirects back to minifig

### **3. Check logs:**

```bash
# SSH into VPS
ssh root@137.184.34.143

# Check PM2 logs
pm2 logs figtracker --lines 50

# Look for these messages:
# [🛡️  CAPTCHA REQUIRED] Country: SG | IP: xxx | No referer | Path: /minifigs/sw0001
# [✅ CAPTCHA VERIFIED] Country: SG | IP: xxx | Path: /minifigs/sw0001
```

## 📊 Monitor Results

### **Google Analytics (24 hours after deployment):**

**Before CAPTCHA:**
- Singapore: 3+ active users/day
- Mix of bots and real users

**After CAPTCHA:**
- Singapore bots: 0 (blocked)
- Singapore real users: 0-2 (pass seamlessly)
- No complaints

### **Cloudflare Turnstile Dashboard:**
```
https://dash.cloudflare.com/[your-account]/turnstile
```

Monitor:
- Total verifications
- Pass rate (should be 95%+)
- Countries triggering challenges
- Bot detection rate

### **Your Visitor Analytics:**
```
https://figtracker.ericksu.com/admin/visitor-analytics
```

Check Singapore traffic:
- Should drop to near zero
- Remaining traffic should have normal browsing patterns

## 🔧 If Something Breaks

### **CAPTCHA not showing:**
1. Check environment variables are set
2. Verify keys are correct (no quotes issues)
3. Check browser console for errors
4. Restart Node.js app

### **All visitors getting CAPTCHA:**
- Check middleware logic
- Verify `HIGH_RISK_COUNTRIES` array
- Ensure cookie is being set correctly

### **Emergency: Disable CAPTCHA**

If CAPTCHA breaks and you need to disable it quickly:

**Method 1: Remove from middleware (quick fix)**
```bash
# SSH into VPS
cd /root/minifig-price-tracker

# Comment out CAPTCHA redirect in middleware.ts
# OR revert to previous commit:
git revert HEAD
npm run build
pm2 restart figtracker
```

**Method 2: Allow all traffic temporarily**
```typescript
// In middleware.ts, add at top:
const CAPTCHA_ENABLED = false;

// Then wrap the CAPTCHA check:
if (CAPTCHA_ENABLED && isHighRisk && !captchaVerified) {
  // ... redirect logic
}
```

## 🎯 Expected Timeline

- **Day 1 (Today):** Deploy, some Singapore users hit CAPTCHA
- **Day 2-3:** Bots completely blocked, real users pass through
- **Day 7:** Check GA to confirm 90%+ reduction in Singapore bot traffic

## 🔐 Security Notes

**Your Keys:**
- **Site Key:** Public (visible in client-side code) ✅
- **Secret Key:** Private (NEVER commit to git) ⚠️

**Already added to `.gitignore`:**
- `.env.local` ✅
- `.env.production` ✅

**Safe to commit:**
- All code files ✅
- This documentation ✅

**NEVER commit:**
- `.env.local`
- `.env.production`
- Any file with the actual secret key

---

**Ready to deploy!** Just add the keys to production and restart.
