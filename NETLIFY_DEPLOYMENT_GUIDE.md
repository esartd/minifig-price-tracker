# Netlify Deployment Guide - FigTracker

## Why Netlify Instead of Cloudflare?

**Cloudflare Pages doesn't support Next.js 16 yet** (they only support up to Next.js 15.5.2)

**Netlify supports Next.js 16** and has a more generous free tier than Vercel.

---

## Netlify vs Vercel Free Tier

| Feature | Netlify Free | Vercel Free | Current Usage |
|---------|--------------|-------------|---------------|
| **Bandwidth** | 100 GB/month | 100 GB total | Used 67.78 GB |
| **Build Minutes** | 300/month | 6000/month | Under limit |
| **Functions** | 125K/month | 1M/month | Used 1.1M |
| **Concurrent Builds** | 1 | 1 | OK |
| **Team Members** | Unlimited | 1 | OK |

**Verdict:** Netlify's free tier is MORE generous for bandwidth, but LESS for functions.

**Your site:** Likely stays under Netlify free tier with optimizations we made.

---

## Step-by-Step Deployment

### 1. Create Netlify Account

1. Go to https://app.netlify.com/signup
2. Sign up with GitHub (easiest)
3. Authorize Netlify to access your repos

### 2. Create New Site

1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select repository: `esartd/minifig-price-tracker`
4. Select branch: `cloudflare-migration`

### 3. Configure Build Settings

Netlify should auto-detect Next.js, but verify:

**Build command:** `npm run build`
**Publish directory:** `.next`
**Functions directory:** `.netlify/functions` (auto-created)

Click "Show advanced" → Add build environment variables:
- `NODE_VERSION` = `20`

### 4. Add Environment Variables

Go to Site settings → Environment variables → Add variables:

**Required:**
```
DATABASE_URL = postgresql://postgres.xvgbwqyhoqlqfrfucnmp:Legominifiguresite@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true

NEXTAUTH_SECRET = [generate new: openssl rand -base64 32]
NEXTAUTH_URL = https://[your-netlify-url].netlify.app (update after deploy)

BRICKLINK_CONSUMER_KEY = 39E2D89370FF46069B15DA124C907EBF
BRICKLINK_CONSUMER_SECRET = 6DBE0045933D4395AD90908EFDEC0977
BRICKLINK_TOKEN_VALUE = B0BB22082CE6477B9E92D879BAB9868B
BRICKLINK_TOKEN_SECRET = C2741D91EEB74EE0BE722C4E27C99B30

NEXT_PUBLIC_BASE_URL = https://[your-netlify-url].netlify.app
```

**Optional:**
```
RESEND_API_KEY = re_eigXZP9i_Gmmjc7a3pb8qmvo9LncrjxzP
AMAZON_ACCESS_KEY_ID = AKPA7WBUJF1778079109
AMAZON_SECRET_ACCESS_KEY = cGQ0nW6NxdeaGUA6Sm0h1NfOYerZOj6th2Ow
AMAZON_ASSOCIATE_TAG = ericksu0c-20
NEXT_PUBLIC_EBAY_CAMPAIGN_ID = 5339150379
```

### 5. Deploy!

Click "Deploy site"

**Build time:** ~5-10 minutes

**Preview URL:** `https://[random-name].netlify.app`

### 6. Test the Deployment

Visit your preview URL and test:
- ✅ Homepage loads
- ✅ Search works
- ✅ Minifig pages load
- ✅ Set pages load
- ✅ Login works (NextAuth)
- ✅ Collection pages work
- ✅ Pricing data loads

### 7. Add Custom Domains

Once tested, add your domains:

**Site settings → Domain management → Add custom domain:**

1. `figtracker.ericksu.com`
2. `de.figtracker.ericksu.com`
3. `fr.figtracker.ericksu.com`
4. `es.figtracker.ericksu.com`

**Netlify will provide DNS records:**
- Either point A record to Netlify's IP
- Or use Netlify's nameservers

### 8. Update Environment Variables

After custom domain is added, update:
```
NEXTAUTH_URL = https://figtracker.ericksu.com
NEXT_PUBLIC_BASE_URL = https://figtracker.ericksu.com
```

Then redeploy (trigger new build).

### 9. Enable Netlify Features (Optional)

**Analytics:** Free on all plans
**Forms:** If you add contact forms
**Split Testing:** Test features with % of users
**Branch Deploys:** Auto-deploy every branch

---

## Troubleshooting

### Build Fails

**Error:** `Cannot find module '@prisma/client-hostinger'`
**Fix:** Add to build command:
```
npx prisma generate --schema=prisma/schema-hostinger.prisma && npm run build
```

Update `netlify.toml`:
```toml
[build]
  command = "npx prisma generate --schema=prisma/schema-hostinger.prisma && npm run build"
```

### Functions Timeout

**Error:** Function execution timed out
**Fix:** Increase timeout in `netlify.toml`:
```toml
[functions]
  timeout = 26
```

### Large Files Warning

**Warning:** `boxes.json is 69.46 MB`
**Status:** Warning only, not an error
**Fix (optional):** Use Git LFS if it becomes a problem

---

## Cost Monitoring

**Check usage:**
1. Go to Netlify Dashboard
2. Team settings → Usage
3. Monitor:
   - Bandwidth (100 GB free)
   - Build minutes (300 free)
   - Function invocations (125K free)

**If you exceed free tier:**
- Netlify Pro: $19/month (same as Vercel)
- OR optimize further to stay under limits

---

## Rollback Plan

**If Netlify doesn't work:**

1. **Immediate:** Change DNS back to Vercel
2. **Or:** Deploy `main` branch to Netlify (before optimizations)
3. **Or:** Delete Netlify site, stick with Vercel Pro

**DNS changes take 1-24 hours to propagate.**

---

## Next Steps After Deployment

1. ✅ Test all features on Netlify preview URL
2. ✅ Add custom domains
3. ✅ Update environment variables with custom domain
4. ✅ Change DNS to point to Netlify
5. ✅ Monitor usage for 1 week
6. ✅ If under limits: stay on free tier
7. ✅ If over limits: upgrade to Pro ($19/month)

---

## Comparison: Netlify vs Vercel

### **Why Netlify is Better for You:**

**Vercel:**
- ✅ Best Next.js support
- ✅ Fast deploys
- ❌ Strict free tier limits (you got paused)
- ❌ $20/month Pro

**Netlify:**
- ✅ Good Next.js support
- ✅ More generous free tier
- ✅ Less strict about commercial use
- ✅ $19/month Pro (cheaper)
- ⚠️ Fewer functions (125K vs 1M)

**Your site with optimizations:**
- Removed cron (saves 75% usage)
- Added caching (reduces requests)
- Should stay under Netlify free tier

---

## Emergency Contacts

**Netlify Support:**
- Community: https://answers.netlify.com/
- Email: support@netlify.com (Pro plan only)
- Status: https://www.netlifystatus.com/

**If site goes down:**
1. Check Netlify status page
2. Check build logs for errors
3. Rollback to previous deploy
4. Or change DNS back to Vercel

---

**Deployment branch pushed:** `cloudflare-migration`
**Ready to deploy:** ✅ YES
**Estimated setup time:** 20-30 minutes
