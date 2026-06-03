# Working State Backup - June 1, 2026

**Status:** ✅ ALL FEATURES WORKING  
**Git Tag:** `working-2026-06-01-oauth-seo-fixed`  
**Commit:** `41b7b13` - fix(auth): Add redirect callback to preserve subdomain in OAuth flow  
**VPS Backup:** `/root/backup-working-2026-06-01.tar.gz` (118MB)

---

## ✅ Verified Working Features

### 1. Search Engine Indexing
- ✅ Googlebot can crawl all pages (returns 200)
- ✅ Bingbot can crawl all pages (returns 200)
- ✅ All legitimate search engines whitelisted
- ✅ Scrapers still blocked (python-requests, curl, etc. return 403)

**Test:** `curl -A "Googlebot" https://pl.figtracker.ericksu.com/` returns 200

### 2. Google OAuth Sign-In
- ✅ Works on all 10 language subdomains
- ✅ Cookies shared across subdomains
- ✅ No configuration errors
- ✅ Account linking works

**Test:** Sign in from any subdomain, OAuth completes successfully

### 3. OAuth Language Preservation
- ✅ Sign in from Polish site → stays on Polish site
- ✅ Sign in from German site → stays on German site
- ✅ All 10 languages preserve subdomain after OAuth

**Test:** Sign in from `pl.figtracker.ericksu.com` → redirects back to `pl.figtracker.ericksu.com`

### 4. Site Functionality
- ✅ All pages load correctly
- ✅ Themes pages work
- ✅ Minifig detail pages work
- ✅ Set detail pages work
- ✅ Collection pages work
- ✅ Pricing system working

---

## 🔧 Key Files Modified

### 1. middleware.ts
**What changed:** Added ALLOWED_BOTS whitelist for search engines

```typescript
const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'duckduckbot',
  // ... 14 total
]
```

**Why:** Prevent blocking legitimate search engines while still blocking scrapers

### 2. auth.ts
**What changed:** 
- Added cross-subdomain cookie configuration
- Added redirect callback

```typescript
cookies: {
  // All OAuth cookies configured with domain: '.figtracker.ericksu.com'
}

callbacks: {
  async redirect({ url, baseUrl }) {
    // Allow all figtracker.ericksu.com subdomains
  }
}
```

**Why:** Enable OAuth to work across subdomains and preserve language after sign-in

### 3. lib/auth-utils.ts
**What changed:**
- Allow subdomain validation
- Return absolute URLs instead of relative paths

```typescript
// Allow all figtracker.ericksu.com subdomains
if (parsedUrl.hostname.endsWith('.figtracker.ericksu.com')) {
  return true
}

// Return full origin to preserve subdomain
return window.location.origin
```

**Why:** Validate callback URLs correctly for subdomains

---

## 🚫 What NOT to Change

These files are working correctly - **DO NOT MODIFY** without backup:

- ❌ `middleware.ts` - Search engine access depends on this
- ❌ `auth.ts` - OAuth functionality depends on this
- ❌ `lib/auth-utils.ts` - Callback URL validation depends on this
- ❌ Database schema - Already has strict protections in place

---

## 🔄 How to Rollback if Needed

### Option 1: Rollback to Git Tag (Recommended)
```bash
cd "/Users/erickkosysu/Code Projects/_Personal/FigTracker"
git checkout working-2026-06-01-oauth-seo-fixed
npm run build
# Deploy to VPS
```

### Option 2: Rollback to Specific Commit
```bash
git checkout 41b7b13
npm run build
# Deploy to VPS
```

### Option 3: Restore VPS Backup
```bash
ssh root@187.77.202.14
cd /var/www/figtracker
pm2 stop figtracker
tar -xzf /root/backup-working-2026-06-01.tar.gz
pm2 start figtracker
```

### Option 4: Rollback Individual Files
```bash
# If only one file breaks, restore just that file
git checkout 41b7b13 -- middleware.ts
git checkout 41b7b13 -- auth.ts
git checkout 41b7b13 -- lib/auth-utils.ts
```

---

## 🧪 Testing Checklist

Before deploying any new changes, verify these still work:

**Search Engines:**
- [ ] `curl -A "Googlebot" https://pl.figtracker.ericksu.com/` → 200 OK
- [ ] `curl -A "Bingbot" https://pl.figtracker.ericksu.com/` → 200 OK

**Scrapers Blocked:**
- [ ] `curl -A "python-requests" https://pl.figtracker.ericksu.com/` → 403 Forbidden

**OAuth:**
- [ ] Sign in from `pl.figtracker.ericksu.com` → Works
- [ ] After OAuth → Stays on `pl.figtracker.ericksu.com`

**Site Functionality:**
- [ ] Homepage loads
- [ ] Theme pages load
- [ ] Minifig detail pages load
- [ ] Collection pages load

---

## 📊 Deployment Information

**Production Server:**
- Host: 187.77.202.14
- User: root
- Path: /var/www/figtracker
- Process Manager: PM2

**Current Status:**
- Commit: `41b7b13`
- Status: Online
- Last Deployed: June 1, 2026, ~10:11 AM Mountain Time

**Environment Variables (VPS):**
- `AUTH_SECRET` ✅ Set
- `AUTH_TRUST_HOST=true` ✅ Set
- `GOOGLE_CLIENT_ID` ✅ Set
- `GOOGLE_CLIENT_SECRET` ✅ Set
- `NEXTAUTH_SECRET` ✅ Set
- `NEXTAUTH_URL` ❌ Removed (intentionally - allows subdomain detection)

---

## 📝 Commits Included in Working State

```
41b7b13 fix(auth): Add redirect callback to preserve subdomain in OAuth flow
70a0ec1 fix(auth): Preserve subdomain in OAuth callback by using absolute URLs
5ebabb5 fix(auth): Allow OAuth redirect to preserve language subdomains
a3a47df fix(auth): Configure all OAuth cookies for cross-subdomain support
8656ecd fix(auth): Add cross-subdomain cookie support for OAuth
245288b fix(seo): Allow search engines while blocking scrapers
```

---

## 🔮 Next Steps (Optional - Not Required)

**Remaining Issue:**
- GitHub Actions auto-deploy times out (but manual deploy works fine)

**Impact:**
- Low - Manual deployment works perfectly
- Only affects convenience (automation)

**Fix Required:**
- Check VPS firewall rules
- Verify GitHub Actions SSH key
- Or just continue manual deployment (works fine)

---

## 📞 Emergency Contacts

**If something breaks:**

1. **Rollback immediately** using one of the methods above
2. **Check PM2 logs:** `ssh root@187.77.202.14 "pm2 logs figtracker --lines 50"`
3. **Verify git state:** `git status` and `git log -3`
4. **Test basic functionality** before investigating complex issues

**Never commit directly to main for risky changes** - always use feature branch first!

---

**This state is SAFE, TESTED, and WORKING. Keep this file as reference before making any changes!**
