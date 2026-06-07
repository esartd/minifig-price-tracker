# CAPTCHA Setup Guide - Cloudflare Turnstile

**Deployed:** June 6, 2026

## 🎯 What This Does

Blocks bots from **Singapore and high-risk countries** using **invisible CAPTCHA**:

- **Real users:** No interruption (invisible verification in background)
- **Slow bots:** Show quick challenge (1-click verification)
- **Fast scrapers:** Blocked completely

## ✅ UX Best Practices Implemented

Following industry best practices for CAPTCHA UX:

### **1. Invisible by Default** ✅
- Uses Cloudflare Turnstile (modern, privacy-friendly)
- No user interaction unless suspicious behavior detected
- Background risk analysis (mouse movements, timing, etc.)

### **2. Smart Triggers** ✅
- Only triggers for high-risk countries (Singapore, China, etc.)
- Only on detail pages with no referer (bot pattern)
- Whitelisted IPs bypass completely
- Logged-in users bypass (once verified)

### **3. No Distorted Text** ✅
- No scrambled letters or hard-to-read text
- Quick, engaging interaction (1-click checkbox or instant pass)
- Mobile-friendly, accessible

### **4. Accessible** ✅
- WCAG compliant
- Works with screen readers
- Large tap targets for mobile
- Clear, simple interface

### **5. Graceful Error Recovery** ✅
- Preserves user's intended destination
- "Try Again" button if verification fails
- Auto-retry on token expiration
- Clear error messages

### **6. Transparent** ✅
- Explains WHY: "We detected unusual traffic patterns"
- Shows verification progress: "This usually takes just a few seconds..."
- Links to learn more about Cloudflare Turnstile

## 🚀 Setup Instructions

### **Step 1: Get Cloudflare Turnstile Keys (FREE)**

1. Go to: https://dash.cloudflare.com/turnstile
2. Log in with your Cloudflare account (same one managing figtracker.ericksu.com DNS)
3. Click **"Add Site"**
4. **Site Name:** FigTracker Bot Protection
5. **Domain:** `figtracker.ericksu.com`
6. **Widget Mode:** Managed (Recommended)
7. Click **Create**
8. Copy your keys:
   - **Site Key** (Public) - starts with `0x4...`
   - **Secret Key** (Private) - keep this secret!

### **Step 2: Add Environment Variables**

Add to your `.env` file (local) and production environment:

```bash
# Cloudflare Turnstile CAPTCHA
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAAA..."  # Your site key from Step 1
TURNSTILE_SECRET_KEY="0x4AAAAAAA..."            # Your secret key from Step 1
```

**In Hostinger:**
1. Go to Hostinger panel
2. Navigate to your VPS
3. Add environment variables in your deployment config
4. Or add to `.env.production` file on server

### **Step 3: Test Locally**

```bash
# 1. Add keys to .env.local
echo 'NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-site-key"' >> .env.local
echo 'TURNSTILE_SECRET_KEY="your-secret-key"' >> .env.local

# 2. Build and test
npm run build
npm run dev

# 3. Simulate Singapore traffic
# Use VPN or browser dev tools to spoof country header
# Or test directly: http://localhost:3000/verify-human?returnTo=/minifigs/sw0001
```

### **Step 4: Deploy**

```bash
git add .
git commit -m "feat: Add Cloudflare Turnstile CAPTCHA for Singapore bot protection"
git push origin main

# Then deploy to VPS via Hostinger panel or SSH
```

## 🔍 How It Works

### **User Flow:**

1. **Singapore visitor** accesses `/minifigs/sw0001` with no referer
2. **Middleware** detects:
   - Country: `SG` (high-risk)
   - No referer (bot pattern)
   - No `captcha_verified` cookie
3. **Redirect** to `/verify-human?returnTo=/minifigs/sw0001`
4. **CAPTCHA page** loads Turnstile widget (invisible)
5. **Two outcomes:**

   **A) Low Risk User (Normal Browsing):**
   - Turnstile verifies in background (0-1 seconds)
   - No visible challenge
   - Sets `captcha_verified` cookie
   - Redirects to `/minifigs/sw0001`
   - User never knows CAPTCHA happened

   **B) High Risk User (Suspicious Behavior):**
   - Turnstile shows quick challenge (checkbox or slider)
   - User clicks "I'm human"
   - Takes 2-3 seconds
   - Sets `captcha_verified` cookie
   - Redirects to original page

6. **Cookie valid for 24 hours** - no repeat challenges

### **Bot Outcome:**

**Automated scrapers can't:**
- Solve Turnstile challenges (too sophisticated)
- Get past the redirect (bots don't execute JavaScript)
- Bypass the cookie requirement

## 📊 Monitoring CAPTCHA Usage

### **Check CAPTCHA Stats:**

```bash
# View Turnstile dashboard
https://dash.cloudflare.com/turnstile

# See:
# - Total verifications
# - Pass/fail rate
# - Countries triggering challenges
# - Bot vs human ratio
```

### **Check Your Logs:**

Look for these in your server logs:

```
[🛡️  CAPTCHA REQUIRED] Country: SG | IP: xxx | No referer | Path: /minifigs/sw0001
[✅ CAPTCHA VERIFIED] Country: SG | IP: xxx | Path: /minifigs/sw0001
```

### **Google Analytics:**

Track `/verify-human` page views:
- High views = Many CAPTCHA challenges
- Low views = Mostly invisible pass-through

## 🎛️ Fine-Tuning

### **Change Challenge Sensitivity:**

In Cloudflare Turnstile dashboard:
- **Managed:** Balanced (Recommended)
- **Non-Interactive:** Always invisible (may let bots through)
- **Invisible:** Most aggressive (may challenge real users more)

### **Add/Remove High-Risk Countries:**

Edit `middleware.ts` line 112:

```typescript
const HIGH_RISK_COUNTRIES = ['SG', 'CN', 'RU', 'IN', 'VN', 'ID', 'PH'];

// Add more:
const HIGH_RISK_COUNTRIES = ['SG', 'CN', 'RU', 'IN', 'VN', 'ID', 'PH', 'KR', 'JP'];

// Remove Singapore (allow without CAPTCHA):
const HIGH_RISK_COUNTRIES = ['CN', 'RU', 'IN', 'VN', 'ID', 'PH'];
```

### **Adjust Cookie Duration:**

Edit `app/api/verify-captcha/route.ts` line 38:

```typescript
maxAge: 60 * 60 * 24,  // 24 hours (current)
maxAge: 60 * 60 * 2,   // 2 hours (stricter)
maxAge: 60 * 60 * 48,  // 48 hours (more lenient)
```

## 🧪 Testing

### **Test as Singapore User:**

**Method 1: Browser Dev Tools**
```javascript
// In Chrome/Firefox console
document.cookie = "cf-ipcountry=SG";
// Then visit: /minifigs/sw0001
```

**Method 2: VPN**
- Connect to Singapore VPN
- Visit: https://figtracker.ericksu.com/minifigs/sw0001
- Should redirect to CAPTCHA

**Method 3: Direct Test**
- Visit: https://figtracker.ericksu.com/verify-human?returnTo=/minifigs/sw0001
- Complete CAPTCHA
- Should redirect to minifig page

### **Verify It's Working:**

1. **Singapore without cookie** → Redirects to CAPTCHA
2. **Complete CAPTCHA** → Sets cookie, redirects back
3. **Visit another page** → No CAPTCHA (cookie valid)
4. **24 hours later** → CAPTCHA again (cookie expired)

## 🆘 Troubleshooting

### **CAPTCHA not showing:**

1. Check environment variables are set
2. Check Turnstile keys are correct
3. Check browser console for errors
4. Verify Cloudflare Turnstile domain matches

### **Always shows CAPTCHA (even for US):**

- Bug in middleware country detection
- Check `cf-ipcountry` header is working
- Verify `HIGH_RISK_COUNTRIES` array

### **CAPTCHA fails even when solved:**

- Secret key mismatch
- Cloudflare API issue
- Check server logs for error details

### **Real users complaining:**

- Turnstile challenge may be too aggressive
- Switch to "Managed" mode in Cloudflare dashboard
- Increase cookie duration (48 hours)
- Remove Singapore from HIGH_RISK_COUNTRIES

## 📈 Expected Results

**Before CAPTCHA:**
- Singapore: 100-500 bot visits/day
- Bot patterns: No referer, rapid access
- CPU waste: High

**After CAPTCHA:**
- Singapore bots: 0-5/day (>95% reduction)
- Real Singapore users: Pass through seamlessly
- CPU usage: Normal

## 🎓 Why Cloudflare Turnstile?

**vs Google reCAPTCHA:**
- ❌ reCAPTCHA tracks users for Google
- ❌ reCAPTCHA has worse UX (distorted text, image grids)
- ❌ reCAPTCHA requires Google account

- ✅ Turnstile is privacy-friendly
- ✅ Turnstile has better UX (invisible/1-click)
- ✅ Turnstile is free (Cloudflare account)

**vs hCaptcha:**
- Similar UX
- Turnstile integrates with Cloudflare (you already use)
- Turnstile is faster (edge network)

**vs Custom Solution:**
- Building custom is 100+ hours
- Maintaining costs time
- Turnstile is battle-tested (billions of challenges/day)

## 🔗 Resources

- **Cloudflare Turnstile:** https://developers.cloudflare.com/turnstile/
- **Dashboard:** https://dash.cloudflare.com/turnstile
- **UX Best Practices:** https://www.reform.app/blog/top-7-captcha-best-practices-for-forms
- **Accessibility:** https://www.cloudflare.com/products/turnstile/

---

**Questions?** Check Cloudflare Turnstile docs or test in staging first.
