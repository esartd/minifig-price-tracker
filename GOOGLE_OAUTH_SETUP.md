# Google OAuth Setup - Quick Guide

You need to set up Google OAuth to enable authentication. Here's exactly what to do:

## Step 1: Go to Google Cloud Console
Visit: https://console.developers.google.com/

## Step 2: Create a Project (if you don't have one)
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it "Minifig Price Tracker" (or anything you want)
4. Click "Create"

## Step 3: Enable Google+ API
1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 4: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Click "Create"
4. Fill in required fields:
   - App name: "Minifig Price Tracker"
   - User support email: (your email)
   - Developer contact: (your email)
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Add test users (your email and any others who will test)
8. Click "Save and Continue"

## Step 5: Create OAuth Client ID
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Name it "Minifig Tracker Web"
5. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production, when you deploy)
6. Click "Create"

## Step 6: Copy Your Credentials
You'll see a popup with:
- **Client ID** (starts with something like `123456-abc.apps.googleusercontent.com`)
- **Client Secret** (a random string)

## Step 7: Update .env.local
Open your `.env.local` file and paste your credentials:

```env
GOOGLE_CLIENT_ID="paste-your-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-client-secret-here"
```

## Step 8: Restart Your Dev Server
The server should auto-restart, but if not:
```bash
npm run dev
```

## Step 9: Test It!
1. Visit http://localhost:3000
2. Click "Sign in with Google"
3. You should see the Google sign-in popup
4. Sign in with your Google account
5. You'll be redirected back to your app

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
Make sure the redirect URI in Google Cloud Console exactly matches:
```
http://localhost:3000/api/auth/callback/google
```

### "This app isn't verified"
This is normal for development! Click "Advanced" → "Go to Minifig Price Tracker (unsafe)"

### Still having issues?
- Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in `.env.local`
- Restart your dev server
- Check that AUTH_SECRET is set
- Make sure there are no extra spaces in your .env.local values

## For Production Deployment

When you deploy to production (Vercel, etc.):

1. Add your production domain to authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

2. Set environment variables on your hosting platform:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
   - `AUTH_URL=https://yourdomain.com`

3. For Vercel:
   - Go to your project settings
   - Click "Environment Variables"
   - Add each variable
   - Redeploy

That's it! Your authentication should now work.
