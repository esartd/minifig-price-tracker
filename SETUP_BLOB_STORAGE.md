# Setup Vercel Blob Storage for Article Images

## The Problem
Article image uploads are failing with 500 errors because `BLOB_READ_WRITE_TOKEN` is not configured in production.

## Solution - Setup Vercel Blob Storage

### Step 1: Enable Blob Storage in Vercel
1. Go to https://vercel.com/dashboard
2. Select your **FigTracker** project
3. Go to **Storage** tab (or Settings → Storage)
4. Click **Create Database** → **Blob**
5. Name it: `figtracker-articles-images`
6. Click **Create**

### Step 2: Get the Token
After creating, Vercel will show you environment variables including:
- `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXX`

Copy this token.

### Step 3: Add to Environment Variables
1. Still in Vercel Dashboard → Your Project
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**
4. **Name**: `BLOB_READ_WRITE_TOKEN`
5. **Value**: Paste the token from Step 2
6. **Environment**: Select **Production**, **Preview**, and **Development**
7. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~1 minute)

### Step 5: Test
1. Go to https://figtracker.ericksu.com/write
2. Add an image block
3. Upload an image
4. Should now work! ✓

## Alternative: Use Existing Blob Store
If you already have a Blob store for other purposes:
1. Settings → Storage → Click on your existing Blob
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Follow Step 3-5 above

## Cost
- Vercel Blob Storage: **Free** up to 500MB and 1GB bandwidth
- After: $0.15/GB storage, $0.30/GB bandwidth
- Article images (optimized to ~500KB each) = ~1,000 images free tier

## Fallback
If you can't setup Blob right now, images will fail to upload in production.
Local development works fine (saves to public/uploads/).
