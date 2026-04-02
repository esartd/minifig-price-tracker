# Pre-Deployment Checklist

Use this checklist before deploying to GitHub + Vercel.

## ✅ Code Preparation

- [ ] All environment variables are in `.env` (not committed)
- [ ] `.env.example` exists with template values
- [ ] `.gitignore` includes `.env` and sensitive files
- [ ] All code is committed locally
- [ ] Tests pass (if you have any)
- [ ] Remove any console.log with sensitive data

## ✅ GitHub Setup

- [ ] Create private repository on GitHub
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USERNAME/minifig-price-tracker.git`
- [ ] Push code: `git push -u origin main`
- [ ] Verify `.env` is NOT visible in GitHub repo

## ✅ Vercel Setup

- [ ] Sign up for Vercel account (free)
- [ ] Import GitHub repository to Vercel
- [ ] Create Vercel Postgres database (free tier)
- [ ] Add environment variables in Vercel settings:
  - [ ] `BRICKLINK_CONSUMER_KEY`
  - [ ] `BRICKLINK_CONSUMER_SECRET`
  - [ ] `BRICKLINK_TOKEN_VALUE`
  - [ ] `BRICKLINK_TOKEN_SECRET`
  - [ ] `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
  - [ ] `NEXTAUTH_URL` (your Vercel URL)
  - [ ] ~~`DATABASE_URL`~~ (auto-added by Vercel Postgres)

## ✅ First Deployment

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Visit your site URL
- [ ] Test sign up / sign in
- [ ] Test search functionality
- [ ] Add a minifig to inventory
- [ ] Test refresh pricing button

## ✅ Post-Deployment

- [ ] Update `NEXTAUTH_URL` in Vercel to match your actual URL
- [ ] Redeploy after updating `NEXTAUTH_URL`
- [ ] Test authentication again
- [ ] Bookmark your Vercel dashboard for monitoring

## 🎉 Optional Enhancements

- [ ] Set up custom domain (requires domain purchase ~$10-15/year)
- [ ] Add Google OAuth (add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)
- [ ] Integrate Google AdSense (for monetization)
- [ ] Add Amazon affiliate links (for monetization)
- [ ] Set up email notifications with Resend

---

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
