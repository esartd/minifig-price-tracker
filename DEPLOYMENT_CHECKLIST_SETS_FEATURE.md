# Deployment Checklist: Sets & Affiliate Feature

Use this checklist to safely deploy the new set discovery and affiliate link features.

## Pre-Deployment

### 1. Review Changes
- [ ] Read `FEATURE_SETS_AND_AFFILIATE.md` to understand what's new
- [ ] Read `AFFILIATE_SETUP.md` for affiliate program setup
- [ ] Review code changes in key files:
  - `lib/bricklink.ts` (new method)
  - `app/api/minifigs/[itemNo]/sets/route.ts` (new endpoint)
  - `components/MinifigSets.tsx` (new component)
  - `lib/affiliate-links.ts` (new utility)

### 2. Get BrickLink Affiliate ID (Optional)
- [ ] Visit https://www.bricklink.com/affiliate.asp
- [ ] Apply for affiliate program
- [ ] Wait for approval (3-7 days typically)
- [ ] Get your affiliate ID once approved

**Note:** You can deploy without affiliate ID - the feature will work, you just won't earn commissions yet.

### 3. Test Locally
```bash
# Install dependencies (if new ones added)
npm install

# Start dev server
npm run dev

# Visit http://localhost:3000/minifigs/sw0001a
# Note: Sets won't load on localhost (API blocked), but UI should render
```

- [ ] App starts without errors
- [ ] Minifig pages load correctly
- [ ] Build succeeds: `npm run build`

## Deployment Steps

### 4. Commit Changes
```bash
git add .
git commit -m "Add set discovery and BrickLink affiliate links

- Show which LEGO sets contain each minifigure
- Add BrickLink affiliate link support for monetization
- New API endpoint: /api/minifigs/[itemNo]/sets
- New component: MinifigSets
- Centralized affiliate link management in lib/affiliate-links.ts"
```

- [ ] Committed to git

### 5. Push to GitHub
```bash
git push origin main
```

- [ ] Pushed to remote repository

### 6. Configure Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables

**Optional (for affiliate links):**
- [ ] Add `BRICKLINK_AFFILIATE_ID` with your affiliate ID
- [ ] Save changes

**Existing variables to verify:**
- [ ] `BRICKLINK_CONSUMER_KEY` - exists
- [ ] `BRICKLINK_CONSUMER_SECRET` - exists
- [ ] `BRICKLINK_TOKEN_VALUE` - exists
- [ ] `BRICKLINK_TOKEN_SECRET` - exists

### 7. Deploy to Vercel

**Option A: Automatic (if connected to GitHub)**
- [ ] Vercel auto-deploys on push
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

**Option B: Manual**
```bash
npm run deploy
```
- [ ] Deployment succeeds

### 8. Verify Deployment

**Test Minifig Page:**
- [ ] Visit `https://your-site.com/minifigs/sw0001a`
- [ ] Page loads successfully
- [ ] "Found in X Sets" section appears
- [ ] Sets load and display correctly
- [ ] Images show up
- [ ] Click on a set card
- [ ] Opens BrickLink in new tab
- [ ] URL includes `&afflid=YOUR_ID` (if affiliate configured)

**Test Multiple Minifigs:**
- [ ] Try another minifig: `/minifigs/sw0105` (Darth Vader)
- [ ] Try Harry Potter: `/minifigs/hp001`
- [ ] Try one with no sets (some rare minifigs)

**Test Different Devices:**
- [ ] Desktop browser
- [ ] Mobile browser
- [ ] Tablet (if available)

## Post-Deployment

### 9. Monitor Performance

**Check Vercel Logs:**
- [ ] No errors in function logs
- [ ] API routes responding correctly
- [ ] Response times reasonable (<2s)

**Check BrickLink API Usage:**
```bash
# From production
curl https://your-site.com/api/api-usage
```
- [ ] API usage within limits
- [ ] No rate limit errors

### 10. Monitor Analytics

**Vercel Analytics (if enabled):**
- [ ] Check page views on minifig pages
- [ ] Monitor error rates
- [ ] Check performance metrics

**BrickLink Affiliate Dashboard (if configured):**
- [ ] Log into BrickLink
- [ ] Go to Affiliate Dashboard
- [ ] Verify clicks are being tracked
- [ ] Monitor conversions (takes time)

### 11. User Communication (Optional)

**Announce the Feature:**
- [ ] Blog post about new feature
- [ ] Social media announcement
- [ ] Email newsletter (if applicable)

**Example announcement:**
```
🎉 New Feature: Set Discovery!

Now you can see which LEGO sets contain each minifigure!

Visit any minifig page and scroll down to the 
"Found in X Sets" section. Click to buy the full 
set on BrickLink.

Perfect for completing your collection! 🧱
```

## Rollback Plan (If Issues)

### If Deployment Fails:

**Option 1: Revert on Vercel**
- [ ] Go to Vercel → Deployments
- [ ] Find previous working deployment
- [ ] Click "..." → "Promote to Production"

**Option 2: Revert on Git**
```bash
git revert HEAD
git push origin main
```

### If API Rate Limits Hit:

**Temporary Fix:**
- [ ] Disable feature by commenting out `<MinifigSets />` in `minifig-detail-client.tsx`
- [ ] Redeploy

**Long-term Fix:**
- [ ] Implement caching for set data
- [ ] Add to price cache table with 30-day expiration

## Success Criteria

✅ **Feature is successful when:**
- Zero errors in production logs
- Sets display correctly on minifig pages
- Affiliate links include correct ID
- BrickLink API usage remains under limits
- Page load times stay under 2 seconds
- Users click through to BrickLink (check analytics)

## Optimization Ideas (Post-Launch)

### Week 1
- [ ] Monitor most-viewed minifigs
- [ ] Check which sets get most clicks
- [ ] Optimize set image loading

### Week 2
- [ ] Add set data caching to reduce API calls
- [ ] Implement lazy loading for sets section
- [ ] Add loading skeleton for better UX

### Month 1
- [ ] Review affiliate earnings
- [ ] A/B test different CTAs ("Buy on BrickLink" vs "View Set")
- [ ] Add set sorting options (by year, popularity, etc.)
- [ ] Consider adding set prices

## Support Resources

- **Feature Documentation:** `FEATURE_SETS_AND_AFFILIATE.md`
- **Affiliate Setup:** `AFFILIATE_SETUP.md`
- **BrickLink API Docs:** https://www.bricklink.com/v3/api.page
- **Vercel Docs:** https://vercel.com/docs

## Questions?

- Check existing documentation first
- Review Vercel logs for errors
- Open GitHub issue if stuck
- Contact BrickLink support for affiliate issues

---

**Good luck with your deployment! 🚀**

Once deployed, start earning from your traffic while providing 
even more value to your LEGO collector community!
