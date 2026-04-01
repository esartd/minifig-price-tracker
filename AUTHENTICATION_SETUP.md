# Authentication Setup Guide

Authentication has been added to your Minifig Price Tracker app! Each seller now has their own private collection that no one else can see.

## What Changed

### 1. Database Schema
- Added `User`, `Account`, `Session`, and `VerificationToken` models
- Added `userId` field to `CollectionItem` to link items to specific users
- Updated unique constraint to prevent duplicates per user (not globally)

### 2. API Routes
All collection API routes now:
- Require authentication (return 401 if not signed in)
- Filter data by authenticated user's ID
- Verify ownership before allowing updates/deletes (return 403 if forbidden)

### 3. Authentication UI
- **Sign-in page** at `/auth/signin` with Google OAuth and Email magic link options
- **Header component** showing user email and sign-out button
- **Protected routes** via middleware - redirects to sign-in if not authenticated

## Setup Instructions

### Step 1: Generate Auth Secret
Generate a random secret for NextAuth:

```bash
openssl rand -base64 32
```

### Step 2: Update Environment Variables
Add these to your `.env.local` file:

```env
# Required
AUTH_SECRET="paste-the-generated-secret-here"
AUTH_URL="http://localhost:3000"

# Optional - For Google Sign-in (recommended)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional - For Email Magic Link
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Step 3: Set Up Google OAuth (Recommended)

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local`

### Step 4: Migrate Your Database

Run the migration to update your database schema:

```bash
npm run db:migrate
```

**Important:** If you have existing data in your `CollectionItem` table, you'll need to handle the migration carefully since we added a required `userId` field. Options:

1. **Delete existing data** (if it's test data):
   ```sql
   DELETE FROM "CollectionItem";
   ```
   Then run the migration.

2. **Assign existing items to a user** (if you want to keep data):
   - First, run the migration (it may fail)
   - Manually create a user in the database
   - Update existing items to have that userId
   - Re-run the migration

### Step 5: Restart Your Dev Server

Stop your current dev server and restart it:

```bash
npm run dev
```

## How It Works

### User Flow
1. User visits the app → redirected to `/auth/signin`
2. User signs in with Google or Email
3. After authentication → redirected to main app
4. User can now add/view/edit their own collection
5. User clicks "Sign out" → redirected back to sign-in page

### Security
- All API routes check authentication before processing requests
- Users can only access their own collection items
- Attempting to access another user's items returns 403 Forbidden
- Middleware protects all routes except sign-in and API auth routes

## Production Deployment

When deploying to production (Vercel, etc.):

1. **Update `AUTH_URL`** in your environment variables:
   ```env
   AUTH_URL="https://yourdomain.com"
   ```

2. **Add production OAuth redirect URIs** in Google Cloud Console:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. **Set up email sending** (if using email auth):
   - For production, use a proper email service (SendGrid, AWS SES, etc.)
   - Don't use personal Gmail credentials in production

4. **Run database migration** on your production database:
   ```bash
   npx prisma migrate deploy
   ```

## Testing

To test authentication:

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should be redirected to the sign-in page
4. Sign in with Google (or email if configured)
5. Add some minifigs to your collection
6. Open an incognito window and sign in as a different user
7. Verify that each user sees only their own collection

## Troubleshooting

### "Can't reach database server"
Make sure your database is running. If using Prisma Postgres:
```bash
prisma dev
```

### "Invalid client_id"
Double-check your Google OAuth credentials in `.env.local`

### "Email not sent"
Verify your email server settings. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### TypeScript errors
Run `npx prisma generate` to regenerate the Prisma client with the new schema.

## Next Steps

- Consider adding user profiles with display names
- Add the ability for users to export their collection
- Implement collection sharing features (if desired)
- Add email notifications for price changes
