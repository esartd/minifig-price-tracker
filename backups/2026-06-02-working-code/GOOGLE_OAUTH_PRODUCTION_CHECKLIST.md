# Google OAuth Production Checklist

**Status:** Ready for Production Setup  
**Last Updated:** June 1, 2026

---

## ✅ Completed (Development)

- [x] Google OAuth integration working locally
- [x] Automatic account linking enabled
- [x] Email verification enforced (`email_verified: true`)
- [x] Success toast component created
- [x] OAuth event logging implemented
- [x] **Translation keys added (ALL 10 languages)** ✨
  - English, German, French, Spanish, Italian
  - Japanese, Dutch, Polish, Portuguese, Swedish
- [x] Error handling implemented
- [x] Documentation created

---

## 🚨 Required Before Production Launch

### 1. Production OAuth Credentials

**Status:** ⚠️ NOT DONE - REQUIRED

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your FigTracker project
3. Go to **APIs & Services → Credentials**
4. Create **NEW** OAuth 2.0 Client ID for production (separate from development)

**Configuration:**

**Authorized JavaScript origins:**
```
https://figtracker.ericksu.com
https://de.figtracker.ericksu.com
https://fr.figtracker.ericksu.com
https://es.figtracker.ericksu.com
https://it.figtracker.ericksu.com
https://nl.figtracker.ericksu.com
https://pl.figtracker.ericksu.com
https://sv.figtracker.ericksu.com
https://pt.figtracker.ericksu.com
https://ja.figtracker.ericksu.com
```

**Authorized redirect URIs:**
```
https://figtracker.ericksu.com/api/auth/callback/google
https://de.figtracker.ericksu.com/api/auth/callback/google
https://fr.figtracker.ericksu.com/api/auth/callback/google
https://es.figtracker.ericksu.com/api/auth/callback/google
https://it.figtracker.ericksu.com/api/auth/callback/google
https://nl.figtracker.ericksu.com/api/auth/callback/google
https://pl.figtracker.ericksu.com/api/auth/callback/google
https://sv.figtracker.ericksu.com/api/auth/callback/google
https://pt.figtracker.ericksu.com/api/auth/callback/google
https://ja.figtracker.ericksu.com/api/auth/callback/google
```

5. **Copy the credentials:**
   - Client ID: `xxxxx-production.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxx-production`

6. **Add to production environment variables:**
   ```bash
   GOOGLE_CLIENT_ID="your-production-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   ```

**How to add on your VPS/Hostinger:**
- SSH into server
- Edit `.env.production` or add to environment config
- Restart Next.js app

**⚠️ CRITICAL:** Do NOT use development credentials in production!

---

### 2. Verify OAuth Consent Screen

**Status:** ⚠️ NOT VERIFIED

**Steps:**
1. Go to **APIs & Services → OAuth consent screen**
2. Verify these settings:

**App Information:**
- ✅ App name: FigTracker
- ✅ User support email: Your email
- ✅ App logo: (Optional but recommended)

**App Domain:**
- ✅ Application home page: `https://figtracker.ericksu.com`
- ✅ Privacy policy: `https://figtracker.ericksu.com/privacy`
- ✅ Terms of service: `https://figtracker.ericksu.com/terms`

**Authorized Domains:**
- ✅ `figtracker.ericksu.com`

**Scopes:**
- ✅ `.../auth/userinfo.email`
- ✅ `.../auth/userinfo.profile`

3. **Publishing Status:**
   - For <100 users: Can stay "Testing" (add test users)
   - For 100+ users: Submit for verification (takes 1-4 weeks)

---

### 3. Production Environment Variables

**Status:** ⚠️ NOT DONE

**Required variables on production server:**

```bash
# Google OAuth (PRODUCTION credentials)
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"

# NextAuth
NEXTAUTH_URL="https://figtracker.ericksu.com"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Database (already configured)
DATABASE_URL="your-production-database-url"
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 4. Test Production OAuth Flow

**Status:** ⚠️ NOT TESTED

**Test Cases:**

**Test 1: New User Sign-Up with Google**
1. Visit `https://figtracker.ericksu.com/auth/signup`
2. Click "Sign up with Google"
3. Use a Google account NOT in your database
4. ✅ Should create new account and log in

**Test 2: Existing User Account Linking**
1. Create account with email/password on production
2. Sign out
3. Click "Continue with Google" with same email
4. ✅ Should link accounts and log in
5. ✅ Should see success toast

**Test 3: Returning Google User**
1. Sign out
2. Click "Continue with Google"
3. ✅ Should log in immediately

**Test 4: Multi-Language Subdomains**
1. Test on `de.figtracker.ericksu.com/auth/signin`
2. Click Google button
3. ✅ Should redirect back to German subdomain
4. Repeat for FR, ES, IT, etc.

**Test 5: Error Handling**
1. Test with unverified Google account (if possible)
2. ✅ Should show error message
3. Test canceling OAuth flow
4. ✅ Should return to sign-in page

---

## 📊 Monitoring Setup

**Status:** ✅ BASIC LOGGING IN PLACE

**What's Being Logged:**
- 🆕 `google_signup` - New user signs up with Google
- 🔐 `google_signin` - User signs in with Google
- 🔗 `account_linked` - Email/password account linked to Google
- ❌ `oauth_failure` - OAuth error occurred

**Where to Check Logs:**
- **Development:** Node terminal console
- **Production:** Check your server logs

**View logs on production:**
```bash
# SSH into server
tail -f /path/to/your/app/logs/production.log | grep "OAuth"
```

**Optional Enhancement (Later):**
Send events to Google Analytics:
```typescript
// In lib/oauth-analytics.ts
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', event, {
    event_category: 'oauth',
    event_label: 'google',
  })
}
```

---

## 🎨 Nice to Have (Implemented)

### Success Toast

**Status:** ✅ IMPLEMENTED

The `AccountLinkedToast` component shows:
- "Account Linked!" heading
- "Your Google account is now connected to FigTracker."
- Auto-dismisses after 5 seconds
- Green success styling

**When it shows:**
- After automatic account linking occurs
- Triggered by `?account_linked=true` URL parameter

---

## 📋 Pre-Launch Testing Checklist

**Before going live, test these scenarios in production:**

- [ ] **New user signup:** Sign up with Google (new email)
- [ ] **Existing user linking:** Create password account → link Google
- [ ] **Returning user:** Sign in with already-linked Google account
- [ ] **Sign out/in flow:** Sign out → sign in with Google
- [ ] **Success toast:** Verify toast appears after linking
- [ ] **Multi-language:** Test on DE, FR, ES subdomains
- [ ] **Error handling:** Cancel OAuth → returns gracefully
- [ ] **Email verification:** Only verified emails allowed
- [ ] **Logs working:** Check production logs for OAuth events
- [ ] **Mobile:** Test on mobile Chrome/Safari

---

## 🚫 Skip For Now

### Account Settings Page
**Reason:** Low priority - most users never check this  
**When to build:** If users ask OR when adding Apple/GitHub login

### Multi-Language Translations
**Reason:** Won't move key metrics (registrations, retention)  
**When to build:** After you've validated core product-market fit

---

## 🆘 Troubleshooting Production Issues

### Error: "redirect_uri_mismatch"
**Solution:** Verify ALL subdomain redirect URIs are in Google Console

### Error: "Access blocked: App not verified"
**Solution:** Add yourself as test user, or submit app for verification

### Error: "Configuration error"
**Solution:** Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars

### No success toast showing
**Solution:** Check browser console for JavaScript errors

### Accounts not linking automatically
**Solution:** Check production logs for "Account linked" message

---

## 📞 Support Resources

- **NextAuth Google Docs:** https://next-auth.js.org/providers/google
- **Google OAuth Docs:** https://developers.google.com/identity/protocols/oauth2
- **FigTracker Setup Guide:** See `GOOGLE_OAUTH_SETUP.md`

---

## ✅ Launch Approval

**When all checkboxes above are complete:**

1. ✅ Production OAuth credentials configured
2. ✅ All 10 test cases pass
3. ✅ OAuth events logging to production logs
4. ✅ Success toast working
5. ✅ Mobile tested

**Then:** 🚀 **READY TO LAUNCH!**

---

**Last Tested:** [Date]  
**Tested By:** [Name]  
**Production URL:** https://figtracker.ericksu.com
