# Quick Deploy: Amazon Affiliate Setup

**Time to deploy:** 30 minutes  
**Time to first commission:** 1-2 weeks  
**Difficulty:** Easy ✅

---

## Pre-Flight Checklist

- [ ] You have an Amazon account
- [ ] FigTracker is deployed and live
- [ ] You have access to Vercel dashboard
- [ ] You can commit to GitHub

---

## Step 1: Sign Up for Amazon Associates (10 minutes)

1. **Go to:** https://affiliate-program.amazon.com/
2. **Click:** "Sign Up" (top right)
3. **Login** with your Amazon account (or create one)

4. **Account Information:**
   - Name: Your name or business name
   - Address: Your address
   - Phone: Your phone number

5. **Website/Apps:**
   - Add: `https://figtracker.ericksu.com` (or your domain)
   - Click "Add"
   - Mobile app: Leave blank (or add if applicable)

6. **Profile:**
   - Preferred Store ID: Choose something like `figtracker-20`
   - Website primary content: Select "Hobby/Enthusiast"
   - Topics: Check "Toys & Games", "Hobbies", "Education"

7. **Traffic:**
   - How do you drive traffic: Check "SEO", "Social Media"
   - How do you build links: "Product recommendations"
   - How do you monetize: "I use affiliate links"
   - Monthly visitors: Be honest (even if it's low)

8. **Payment:**
   - Preferred payment: "Direct Deposit" (recommended)
   - Add your bank account details
   - Fill out W-9 (US) or W-8BEN (international)

9. **Verify:**
   - Verify your website ownership (they'll check it's live)
   - Complete phone verification
   - Accept terms

10. **Get Your Tag:**
    - After approval, go to: "Product Linking" → "Link to Any Page"
    - Your tracking ID is shown at the top
    - Format: `yoursite-20` or similar
    - **COPY THIS** - you'll need it next

---

## Step 2: Add to FigTracker (5 minutes)

### Option A: Already Deployed

**On your local machine:**

1. **Edit `.env` file:**
   ```bash
   # Open .env in your editor
   nano .env  # or use VS Code

   # Add this line (replace with your actual tag):
   AMAZON_AFFILIATE_TAG=yoursite-20
   ```

2. **Commit and push:**
   ```bash
   git add .env
   git commit -m "Add Amazon Associates affiliate tag"
   git push
   ```

3. **Update Vercel:**
   - Go to https://vercel.com/dashboard
   - Select your FigTracker project
   - Go to "Settings" → "Environment Variables"
   - Click "Add Variable"
     - Key: `AMAZON_AFFILIATE_TAG`
     - Value: `yoursite-20` (your actual tag)
   - Click "Save"

4. **Redeploy:**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait ~2 minutes for build

### Option B: Deploying for First Time

1. **Edit `.env`:**
   ```bash
   AMAZON_AFFILIATE_TAG=yoursite-20
   ```

2. **Deploy to Vercel:**
   ```bash
   npm run deploy
   ```

3. **During setup, add env var when prompted**

---

## Step 3: Test It (5 minutes)

### Test 1: Check Button Appears

1. Visit: `https://figtracker.ericksu.com/minifigs/sw0001a`
2. Scroll down to "Found in X Sets"
3. You should see:
   - Orange "Buy on Amazon" button ✅
   - Gray "View on BrickLink" button ✅

### Test 2: Check Affiliate Link Works

1. Click "Buy on Amazon" button
2. New tab opens to Amazon
3. **Check the URL** - should include: `&tag=yoursite-20`

Example URL:
```
https://www.amazon.com/s?k=LEGO+75301+X-Wing+Fighter&tag=yoursite-20
```

### Test 3: Check Tracking in Amazon Dashboard

1. Log into Amazon Associates: https://affiliate-program.amazon.com/
2. Go to "Reports" → "Link Type Report"
3. Within 24 hours, you should see your test click

---

## Step 4: Add Disclosure (5 minutes)

**Required by FTC - don't skip this!**

### Option A: Add to About Page

1. Edit `app/about/page.tsx`
2. Add this section:

```tsx
## Affiliate Disclosure

FigTracker participates in the Amazon Associates Program, an affiliate 
advertising program designed to provide a means for sites to earn 
advertising fees by advertising and linking to Amazon.com.

When you click "Buy on Amazon" and make a purchase, we may earn a small 
commission at no additional cost to you. This helps us keep FigTracker 
free and continue improving the site.

We only recommend products that are relevant to LEGO collectors.
```

### Option B: Add Footer Disclosure

1. Edit `app/layout.tsx`
2. Add small text in footer:

```tsx
<footer style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#737373' }}>
  FigTracker is a participant in the Amazon Associates Program. 
  We may earn from qualifying purchases.
</footer>
```

3. Commit and deploy:
```bash
git add .
git commit -m "Add Amazon affiliate disclosure"
git push
```

---

## Step 5: Monitor Performance (Ongoing)

### Week 1: Verify Tracking

**Check daily:**
- [ ] Log into Amazon Associates dashboard
- [ ] Go to Reports → Link Type Report
- [ ] Verify clicks are being tracked
- [ ] Check for any errors

**What you should see:**
- Day 1-2: Your test clicks
- Day 3-7: Real user clicks (if you have traffic)

### Week 2-4: First Sales!

**Check weekly:**
- [ ] Reports → Earnings Report
- [ ] Look for "Items Ordered"
- [ ] Check "Affiliate Revenue"

**Typical timeline:**
- Week 1: 0-3 sales (just getting started)
- Week 2: 2-8 sales (if you have decent traffic)
- Week 3+: Consistent pattern emerges

### Optimize

**Track which minifigs/sets get most clicks:**
1. Use Vercel Analytics (if enabled)
2. Check Amazon's "Product Link" report
3. Focus SEO on popular sets

---

## Troubleshooting

### Problem: Button Doesn't Appear

**Possible causes:**
1. Environment variable not set
2. Typo in variable name
3. Didn't redeploy after adding variable

**Fix:**
```bash
# Check .env file
cat .env | grep AMAZON

# Should show:
# AMAZON_AFFILIATE_TAG=yoursite-20

# Check Vercel dashboard
# Settings → Environment Variables → Should see AMAZON_AFFILIATE_TAG

# Force redeploy
git commit --allow-empty -m "Force redeploy"
git push
```

### Problem: Link Missing Affiliate Tag

**Possible causes:**
1. Tag not configured in client component
2. Cached page (hard refresh)

**Fix:**
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Check source code - search for "tag=" in network tab
3. Try incognito/private window

### Problem: Not Getting Credit for Sales

**Possible causes:**
1. User used coupon/discount code that overrides affiliate
2. User abandoned cart, returned later (>24hrs)
3. Product not eligible for commission
4. Cookie was blocked

**Fix:**
- Most common: Just wait! Sales can take 24-48hrs to show
- Check "Returns" report - sometimes orders are returned
- Verify you're not clicking your own links (against ToS)
- Ensure site has proper cookie consent (if in EU)

### Problem: Account Suspended

**Possible causes:**
1. Clicked your own links
2. Asked friends/family to "help" by buying
3. Didn't make 3 sales in first 180 days

**Fix:**
- Contact Amazon Associates support
- Provide explanation
- Reapply if necessary

---

## Expected Results

### Month 1 (Bootstrap Phase)
```
Traffic:    1,000 visitors
Clicks:     50 clicks (5% CTR)
Sales:      4 purchases (8% conversion)
Revenue:    $9.60
```

### Month 3 (Growth Phase)
```
Traffic:    5,000 visitors
Clicks:     250 clicks (5% CTR)
Sales:      20 purchases (8% conversion)
Revenue:    $48.00
```

### Month 6 (Established)
```
Traffic:    15,000 visitors
Clicks:     750 clicks (5% CTR)
Sales:      60 purchases (8% conversion)
Revenue:    $144.00
```

### Month 12 (Mature)
```
Traffic:    40,000 visitors
Clicks:     2,000 clicks (5% CTR)
Sales:      160 purchases (8% conversion)
Revenue:    $384.00
```

**Key drivers:**
- SEO improvements
- More indexed pages
- Word of mouth
- Return visitors

---

## Next Steps

### Immediate (This Week)
- [ ] Deploy with Amazon tag
- [ ] Test thoroughly
- [ ] Add disclosure
- [ ] Share on social media

### Short-term (This Month)
- [ ] Apply to Rakuten for LEGO.com
- [ ] Monitor which sets get most clicks
- [ ] Write blog post about popular sets
- [ ] Add more minifigs to catalog

### Long-term (3-6 Months)
- [ ] Optimize for high-value sets
- [ ] A/B test button placement
- [ ] Add price tracking/alerts
- [ ] Build email list

---

## Pro Tips

### 1. Focus on Expensive Sets
- UCS sets ($200-800) = higher commission
- Creator Expert ($100-250) = sweet spot
- Regular sets ($20-60) = volume play

### 2. Target Gift-Givers
- Holiday season (Nov-Dec): 3x traffic
- Back-to-school (Aug): Good for parents
- Birthday season (year-round): Steady

### 3. Leverage Star Wars
- Highest search volume
- Most expensive sets
- Loyal collector base
- New releases (TV shows drive interest)

### 4. Don't Neglect Small Sets
- Lower commission per sale
- Higher conversion rate (impulse buys)
- More frequent purchases

### 5. Cross-Sell Related Sets
- "Complete the collection" messaging
- "Build the whole scene" bundles
- Theme-based recommendations

---

## Success Metrics

### Week 1
- ✅ Affiliate links working
- ✅ First test click tracked
- ✅ Disclosure added

### Month 1
- ✅ 10+ tracked clicks
- ✅ First commission earned
- ✅ No account issues

### Month 3
- ✅ Consistent daily clicks
- ✅ 5-10 sales/month
- ✅ $25-50/month revenue

### Month 6
- ✅ 20+ sales/month
- ✅ $80-120/month revenue
- ✅ Rakuten (LEGO) also configured

---

## Support Resources

- **Amazon Associates Help:** https://affiliate-program.amazon.com/help
- **Operating Agreement:** https://affiliate-program.amazon.com/help/operating/agreement
- **FigTracker Docs:** Check other .md files in this repo

---

## Quick Reference

### Your Info
```
Affiliate Tag: yoursite-20
Dashboard: https://affiliate-program.amazon.com/
Reports: https://affiliate-program.amazon.com/home/reports
Payment: Last Wed of month (60-day delay)
```

### Common Links
```
Test Minifig:     /minifigs/sw0001a (Luke)
Popular Set:      LEGO 75301 (X-Wing)
Your .env:        AMAZON_AFFILIATE_TAG=yoursite-20
Vercel Settings:  vercel.com/yourproject/settings/environment-variables
```

---

**You're all set! Start earning from your LEGO traffic! 🚀💰**

Questions? Open a GitHub issue or check Amazon Associates help.
