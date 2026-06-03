# Google OAuth Setup Guide

This document explains how to configure Google OAuth credentials for FigTracker authentication.

## Prerequisites

- Google Cloud Console access
- Admin access to FigTracker deployment environment (for environment variables)

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: **"FigTracker Production"**
4. Click "Create"

---

## Step 2: Enable Google+ API

1. In the Google Cloud Console, select your project
2. Go to "APIs & Services" → "Library"
3. Search for **"Google+ API"**
4. Click "Enable"

---

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select **"External"** user type
3. Click "Create"

**App Information:**
- App name: **FigTracker**
- User support email: **Your email**
- App logo: (Optional - upload FigTracker logo)

**App Domain:**
- Application home page: `https://figtracker.ericksu.com`
- Application privacy policy link: `https://figtracker.ericksu.com/privacy`
- Application terms of service link: `https://figtracker.ericksu.com/terms`

**Authorized Domains:**
- `figtracker.ericksu.com`

**Developer Contact Information:**
- Email addresses: **Your email**

4. Click "Save and Continue"

**Scopes:**
5. Click "Add or Remove Scopes"
6. Select these scopes:
   - `.../auth/userinfo.email` - See your primary Google Account email address
   - `.../auth/userinfo.profile` - See your personal info, including any personal info you've made publicly available
7. Click "Update" → "Save and Continue"

**Test Users:** (Optional for development)
8. Add test users if needed
9. Click "Save and Continue"

10. Review summary and click "Back to Dashboard"

---

## Step 4: Create OAuth 2.0 Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Select **"Web application"**

**Configuration:**
- Name: **FigTracker Web Client**

**Authorized JavaScript origins:**
- `http://localhost:3000` (development)
- `https://figtracker.ericksu.com` (production)
- `https://de.figtracker.ericksu.com` (German)
- `https://fr.figtracker.ericksu.com` (French)
- `https://es.figtracker.ericksu.com` (Spanish)
- `https://it.figtracker.ericksu.com` (Italian)
- `https://nl.figtracker.ericksu.com` (Dutch)
- `https://pl.figtracker.ericksu.com` (Polish)
- `https://sv.figtracker.ericksu.com` (Swedish)
- `https://pt.figtracker.ericksu.com` (Portuguese)
- `https://ja.figtracker.ericksu.com` (Japanese)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (development)
- `https://figtracker.ericksu.com/api/auth/callback/google` (production)
- `https://de.figtracker.ericksu.com/api/auth/callback/google`
- `https://fr.figtracker.ericksu.com/api/auth/callback/google`
- `https://es.figtracker.ericksu.com/api/auth/callback/google`
- `https://it.figtracker.ericksu.com/api/auth/callback/google`
- `https://nl.figtracker.ericksu.com/api/auth/callback/google`
- `https://pl.figtracker.ericksu.com/api/auth/callback/google`
- `https://sv.figtracker.ericksu.com/api/auth/callback/google`
- `https://pt.figtracker.ericksu.com/api/auth/callback/google`
- `https://ja.figtracker.ericksu.com/api/auth/callback/google`

4. Click "Create"

5. **Copy your credentials:**
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxxxxx`

---

## Step 5: Add Environment Variables

### Development (.env.local)

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-development-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-development-client-secret
```

### Production (Hostinger/VPS)

Add these environment variables to your deployment platform:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

**How to add on Hostinger/VPS:**
1. SSH into your server
2. Edit your environment file (`.env.production` or similar)
3. Add the variables above
4. Restart your Next.js application

---

## Step 6: Test the Integration

### Development Testing

1. Start development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/auth/signin`
3. Click "Continue with Google"
4. Sign in with your Google account
5. Verify redirect back to app
6. Check you're logged in

### Production Testing

1. Deploy to production
2. Visit `https://figtracker.ericksu.com/auth/signin`
3. Test Google sign-in
4. Test on different language subdomains
5. Verify account linking works:
   - Create account with email/password
   - Sign out
   - Click "Continue with Google" using same email
   - Verify you're logged into the same account

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:** Check that the redirect URI in Google Console exactly matches your app's URL, including the `/api/auth/callback/google` path.

### Error: "Access blocked: FigTracker has not completed the Google verification process"
**Solution:** For development, add yourself as a test user in OAuth consent screen. For production, submit app for verification (only needed if >100 users).

### Error: "Invalid client"
**Solution:** Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in environment variables.

### OAuth redirects to wrong domain
**Solution:** Check that all subdomain redirect URIs are added to Google Console.

### Account not linking automatically
**Solution:** Verify the email is verified by Google. Check browser console for errors from `auth.ts` signIn callback.

---

## Security Notes

1. **Never commit credentials** to git
2. Use separate OAuth clients for development and production
3. Regularly rotate client secrets
4. Monitor OAuth usage in Google Cloud Console
5. Review "Recent security activity" in Google Account settings

---

## Account Linking Behavior

**New user signs up with Google:**
- Creates new User record
- Creates Account record with provider="google"
- No password set

**Existing user (email/password) signs in with Google:**
- Uses existing User record
- Creates new Account record with provider="google"
- User can now sign in with either email/password OR Google

**After linking:**
- User sees both methods in Account Settings (future feature)
- User can unlink Google if password is set

---

## Rate Limits

Google OAuth has the following limits:
- **10,000 requests per day** (default quota)
- **100 requests per 100 seconds per user**

For most applications, these limits are sufficient. If you need higher limits, request a quota increase in Google Cloud Console.

---

## Production Checklist

Before launching to production:

- [ ] OAuth consent screen configured
- [ ] All subdomain redirect URIs added
- [ ] Production credentials created (separate from development)
- [ ] Environment variables set on production server
- [ ] Tested sign-up with Google
- [ ] Tested sign-in with Google
- [ ] Tested account linking (email → Google)
- [ ] Verified account linking shows success message
- [ ] Tested on multiple language subdomains
- [ ] Monitored for errors in logs

---

## Support

If you encounter issues:
- Check [NextAuth.js Google Provider docs](https://next-auth.js.org/providers/google)
- Review [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)
- Check FigTracker server logs for detailed error messages
