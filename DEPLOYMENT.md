# Deployment Guide - Minifig Price Tracker

This guide will help you deploy your Minifig Price Tracker to Vercel as a public website.

## Prerequisites

1. **GitHub Account** - Sign up at https://github.com if you don't have one
2. **Vercel Account** - Sign up at https://vercel.com (use your GitHub account to sign in)
3. **BrickLink API Keys** - You already have these in your `.env.local` file

## Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `minifig-price-tracker` (or any name you like)
   - Make it **Private** (keeps your business code secret)
   - Don't initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/minifig-price-tracker.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub

2. Click "Add New..." → "Project"

3. Import your `minifig-price-tracker` repository

4. Configure your project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `.next` (should auto-fill)

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   BRICKLINK_CONSUMER_KEY=your_consumer_key_here
   BRICKLINK_CONSUMER_SECRET=your_consumer_secret_here
   BRICKLINK_TOKEN_VALUE=your_token_value_here
   BRICKLINK_TOKEN_SECRET=your_token_secret_here
   DATABASE_URL=postgresql://...  (we'll set this up next)
   ```

## Step 3: Set Up Database (Vercel Postgres - FREE)

1. In your Vercel project dashboard, go to the **Storage** tab

2. Click "Create Database" → Select **Postgres**

3. Choose a database name (e.g., `minifig-tracker-db`)

4. Select **Free tier** (256MB storage, plenty for this project)

5. Click "Create" - Vercel will automatically add `DATABASE_URL` to your environment variables

6. After database is created, click "Connect" and run the Prisma migration:
   ```bash
   npx prisma db push
   ```
   (This creates the tables in your production database)

## Step 4: Set Up Monthly Catalog Updates

Your code already has a GitHub Action that will update the catalog on the 1st of every month!

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

2. Click "New repository secret" and add each of these:
   - `BRICKLINK_CONSUMER_KEY` = your consumer key
   - `BRICKLINK_CONSUMER_SECRET` = your consumer secret
   - `BRICKLINK_TOKEN_VALUE` = your token value
   - `BRICKLINK_TOKEN_SECRET` = your token secret

3. The GitHub Action (`.github/workflows/update-catalog.yml`) will automatically:
   - Run on the 1st of every month at 2am UTC
   - Check for NEW minifigures (incremental update - fast!)
   - Update `lib/minifig-catalog.ts`
   - Commit and push changes
   - Vercel will auto-deploy the updated catalog

   **Note:** This only checks new IDs (~2-3 minutes). Run a full update manually once per year.

**Manual trigger**: You can also manually run the update:
- Go to **Actions** tab in GitHub
- Click "Monthly Catalog Update"
- Click "Run workflow"

## Step 5: Get Your Live URL

After deployment completes (takes 2-3 minutes):

1. Vercel will give you a URL like: `https://minifig-price-tracker.vercel.app`

2. Test your site:
   - Search for minifigures
   - Add to collection
   - Check pricing updates
   - Verify everything works

## Step 6: Custom Domain (Optional)

Want a custom `.com` domain?

1. Buy a domain from Namecheap, GoDaddy, or any registrar (~$10-15/year)

2. In Vercel project settings → **Domains**:
   - Add your domain (e.g., `minifigtracker.com`)
   - Follow the DNS instructions to point your domain to Vercel

3. Vercel automatically provides free SSL certificate (https)

## Step 7: Monetization (Ads & Affiliate Links)

**Good news**: Vercel free tier allows monetization! You can add:

### Google AdSense
1. Sign up at https://www.google.com/adsense
2. Get your ad code snippet
3. Add it to your `app/layout.tsx` file in the `<head>` section

### Amazon Affiliate Links
1. Join [Amazon Associates](https://affiliate-program.amazon.com/)
2. Add affiliate links to LEGO sets in your app
3. Earn commission on sales

### Important Notes
- **Bandwidth**: Ads/images count toward 100GB/month
- **Terms**: Vercel free tier says "non-commercial" but small sites with ads are generally fine
- **Upgrade**: If you exceed 100GB, upgrade to Pro ($20/month) — but by then you're making money!
- **Private code**: Your repo stays private, competitors can't copy your strategy

## Costs Summary

- **GitHub Private Repo**: $0/month
  - Unlimited private repositories (FREE!)
  - Keeps your code and business logic secret
  - Works perfectly with Vercel

- **Hosting (Vercel Free)**: $0/month
  - 100GB bandwidth
  - Unlimited websites
  - Free SSL certificate
  - Automatic deployments
  - **Allows ads and affiliate links** (Amazon Associates, AdSense, etc.)

- **Database (Vercel Postgres Free)**: $0/month
  - 256MB storage (enough for thousands of minifigs)
  - 60 compute hours/month

- **BrickLink API**: FREE

- **GitHub Actions**: 2,000 minutes/month FREE (more than enough for monthly updates)

**Total: $0/month** to start. Upgrade to Vercel Pro ($20/month) only when you exceed 100GB bandwidth — which means you're already making money from ads!

## Monitoring & Maintenance

1. **Check your site**: Visit it regularly to make sure it's working

2. **Monthly updates**: Automatic on 1st of each month
   - Check GitHub Actions tab to verify it ran
   - New minifigs will appear automatically

3. **Vercel Dashboard**: Monitor traffic, errors, and performance
   - Go to https://vercel.com/dashboard
   - Click your project
   - View Analytics tab

## Troubleshooting

**Build fails on Vercel:**
- Check the build logs in Vercel dashboard
- Make sure all environment variables are set
- Verify DATABASE_URL is connected

**Database errors:**
- Make sure you ran `npx prisma db push` after creating the database
- Check DATABASE_URL in environment variables

**Monthly update doesn't run:**
- Verify GitHub Secrets are set correctly
- Check the Actions tab for error logs
- Manually trigger workflow to test

**Ads not showing:**
- Make sure AdSense approved your site
- Check for ad-blockers
- Verify ad code is in the correct file

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

## You're Ready! 🚀

Your Minifig Price Tracker is now:
- ✅ Deployed to the internet
- ✅ Running on a free public URL
- ✅ Auto-updating monthly with new minifigs
- ✅ Ready for ads
- ✅ Ready for a custom domain
- ✅ Costing you $0/month

Share your URL with the LEGO community and start tracking those minifigs!
