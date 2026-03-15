# Quick Start - Deploy Your Site in 10 Minutes

Follow these steps to get your Minifig Price Tracker live on the internet!

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `minifig-price-tracker`
3. Make it **Public** (so people can see it)
4. DON'T check any boxes (no README, no .gitignore, no license)
5. Click "Create repository"

## Step 2: Push Your Code (1 minute)

Copy these commands **one at a time** and run them in your terminal:

```bash
cd "/Users/erickkosysu/Code Projects/minifig-price-tracker"
git remote add origin https://github.com/YOUR_USERNAME/minifig-price-tracker.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 3: Deploy to Vercel (3 minutes)

1. Go to https://vercel.com and click "Sign Up" (use your GitHub account)
2. Click "Add New..." → "Project"
3. Find and click "Import" next to your `minifig-price-tracker` repository
4. Leave all settings as default, click "Deploy"
5. Wait 2-3 minutes for deployment to complete

## Step 4: Add Environment Variables (2 minutes)

1. In Vercel, go to your project → "Settings" → "Environment Variables"
2. Add these 4 variables (get values from your `.env.local` file):

   ```
   BRICKLINK_CONSUMER_KEY = [paste your value]
   BRICKLINK_CONSUMER_SECRET = [paste your value]
   BRICKLINK_TOKEN_VALUE = [paste your value]
   BRICKLINK_TOKEN_SECRET = [paste your value]
   ```

3. Click "Save" for each one

## Step 5: Set Up Database (2 minutes)

1. In your Vercel project, click "Storage" tab
2. Click "Create Database" → Select "Postgres"
3. Name it `minifig-db`
4. Select **Free tier** (256MB - plenty!)
5. Click "Create"
6. Vercel automatically adds `DATABASE_URL` to your environment variables
7. Click "Deployments" → Click the three dots on latest deployment → "Redeploy"

## Step 6: Initialize Database Tables

In your terminal, run:

```bash
npm install -g vercel
vercel login
vercel env pull .env.production
npx prisma db push
```

## Step 7: Set Up Monthly Auto-Updates (Optional but Recommended)

1. Go to your GitHub repo → "Settings" → "Secrets and variables" → "Actions"
2. Click "New repository secret" four times to add:
   - Name: `BRICKLINK_CONSUMER_KEY`, Value: [your key]
   - Name: `BRICKLINK_CONSUMER_SECRET`, Value: [your secret]
   - Name: `BRICKLINK_TOKEN_VALUE`, Value: [your token]
   - Name: `BRICKLINK_TOKEN_SECRET`, Value: [your token secret]

That's it! Your site will auto-update with new minifigs on the 1st of every month.

## Your Site is Live!

Visit: `https://minifig-price-tracker.vercel.app` (or your custom URL)

**Share it with the LEGO community!**

## What You Just Built:

- ✅ Live website on the internet
- ✅ 1,567 Star Wars minifigures searchable
- ✅ Real-time BrickLink pricing
- ✅ Free hosting forever (on free tier)
- ✅ Auto-updates monthly
- ✅ Mobile responsive
- ✅ SSL certificate (https)
- ✅ Ready for custom domain
- ✅ Ready for ads

## Add Ads (Optional)

To monetize your site with Google AdSense:

1. Sign up at https://www.google.com/adsense
2. Get approved (submit your Vercel URL)
3. Copy your ad code
4. Add it to `app/layout.tsx` in the `<head>` section
5. Redeploy on Vercel

## Custom Domain (Optional)

Want `minifigtracker.com` instead of `minifig-price-tracker.vercel.app`?

1. Buy domain from Namecheap/GoDaddy (~$10-15/year)
2. In Vercel → "Settings" → "Domains"
3. Add your domain
4. Follow DNS instructions
5. Done! Free SSL included.

## Need Help?

Read the full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Celebrate! 🎉

You just deployed a full-stack Next.js app with:
- PostgreSQL database
- OAuth API integration
- Automated deployments
- Monthly cron jobs
- Production-grade hosting

All for $0/month!

**Now go share it with the LEGO community!** 🧱
