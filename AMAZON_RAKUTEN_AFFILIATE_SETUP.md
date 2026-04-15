# Amazon & Rakuten Affiliate Setup Guide

FigTracker supports **Amazon Associates** and **Rakuten Advertising** (for LEGO.com) to help you monetize your LEGO collector traffic!

## Why These Platforms?

### Amazon Associates (Primary) ⭐
- **Best conversion rates** - Most users already have Amazon accounts
- **Highest traffic** - Amazon is #1 for online LEGO purchases
- **24-hour cookie** - Earn commission on any purchase within 24 hours
- **Commission rate** - Typically 3-4% on toys
- **Easy setup** - Get approved in minutes

### Rakuten Advertising (LEGO.com)
- **Official LEGO store** - Direct from manufacturer
- **Exclusive sets** - Some sets only available on LEGO.com
- **Better margins** - Commission varies by campaign
- **Brand trust** - Users trust official LEGO store

### Revenue Potential

**Conservative Estimate (5,000 monthly visitors):**
- 70% view minifig pages = 3,500 views
- 50% see sets section = 1,750 views  
- 5% click Amazon link = 88 clicks
- 8% convert to purchase = 7 sales
- $60 average order × 4% commission = **$16.80/month**

**At 20,000 visitors:** ~$67/month  
**At 50,000 visitors:** ~$168/month  
**At 100,000 visitors:** ~$336/month

---

## Part 1: Amazon Associates Setup

### Step 1: Sign Up for Amazon Associates

1. **Visit Amazon Associates**
   - Go to: https://affiliate-program.amazon.com/
   - Click "Sign Up" (top right)

2. **Account Information**
   - Use your existing Amazon account or create new one
   - Enter your website URL: `https://figtracker.ericksu.com` (or your domain)
   - Add app/mobile website if applicable

3. **Profile Information**
   - Website/Apps: Add all domains you'll use affiliate links on
   - Topics: Select "Toys & Games", "Hobbies", "Education"
   - Type of website: "Hobby/Enthusiast"
   - How do you drive traffic: "SEO", "Social Media", etc.
   - How do you monetize: "I use affiliate links to recommend products"

4. **Traffic & Monetization**
   - Monthly visitors: Be honest (even if it's low to start)
   - How do you build links: "Product recommendations in content"
   - How did you hear about us: "Search Engine"

5. **Payment & Tax**
   - Enter your payment method (direct deposit recommended)
   - Complete W-9 tax form (US) or W-8 (international)

6. **Get Your Affiliate Tag**
   - Once approved, go to: Tools → Site Stripe
   - Your tag format: `yoursite-20` or similar
   - **COPY THIS** - you'll need it for .env

### Step 2: Add to FigTracker

Add your Amazon Associate tag to `.env`:

```bash
# .env
AMAZON_AFFILIATE_TAG=yoursite-20
```

For client-side components (recommended):
```bash
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=yoursite-20
```

### Step 3: Deploy & Test

```bash
# Commit changes
git add .
git commit -m "Add Amazon Associates affiliate tracking"
git push

# On Vercel: Add environment variable
# Settings → Environment Variables → Add
# Key: AMAZON_AFFILIATE_TAG
# Value: yoursite-20

# Redeploy
```

**Test it:**
1. Visit any minifig page: `/minifigs/sw0001a`
2. Scroll to "Found in X Sets"
3. Click "Buy on Amazon"
4. URL should include: `&tag=yoursite-20`

### Step 4: Verify Tracking

1. Log into Amazon Associates dashboard
2. Go to "Reports" → "Link Type Report"
3. Make test purchase (or have friend do it)
4. Verify click shows up within 24 hours

---

## Part 2: Rakuten Advertising Setup (LEGO.com)

### Step 1: Apply to Rakuten Advertising

1. **Visit Rakuten Advertising**
   - Go to: https://rakutenadvertising.com/
   - Click "Become a Publisher" or "Join Now"

2. **Publisher Application**
   - Company/Individual name
   - Website URL: `https://figtracker.ericksu.com`
   - Website category: "Toys & Games" or "Hobby/Special Interest"
   - Monthly visitors: Be accurate
   - Primary traffic source: "Organic Search", "Social Media", etc.

3. **Wait for Approval**
   - ⚠️ Takes 3-7 business days
   - Rakuten reviews all applications manually
   - Must have quality content and real traffic

### Step 2: Join LEGO Affiliate Program

Once approved by Rakuten:

1. **Log into Rakuten Dashboard**
   - Go to: https://network.rakutenadvertising.com/

2. **Find LEGO Advertiser**
   - Search for "LEGO" in advertiser directory
   - Program name: "The LEGO Group" or "LEGO Shop"

3. **Apply to LEGO Program**
   - Click "Apply to Program"
   - Fill out application explaining your site
   - Mention you have a LEGO minifigure tracking community

4. **Wait for LEGO Approval**
   - ⚠️ LEGO reviews applications separately
   - Takes 5-14 days
   - They prefer quality LEGO content sites

### Step 3: Get Your Advertiser ID

Once approved for LEGO:

1. Go to "Links & Tools"
2. Find your "Advertiser ID" or "Publisher ID"
3. Format: Usually numeric like `123456`

### Step 4: Add to FigTracker

```bash
# .env
RAKUTEN_AFFILIATE_ID=123456
```

### Step 5: Implement Deep Linking (Advanced)

Rakuten requires special API calls for deep links. For now, FigTracker uses direct LEGO.com links.

**To implement full tracking:**
1. Get Rakuten API credentials
2. Use their "Text Link API" or "Deep Link Generator"
3. Update `getLegoOfficialUrl()` in `lib/affiliate-links.ts`

Example deep link format:
```
https://click.linksynergy.com/deeplink?id=YOUR_ID&mid=13923&murl=https://www.lego.com/product/12345
```

Where:
- `id` = Your Rakuten publisher ID
- `mid` = LEGO's merchant ID (varies by country)
- `murl` = Encoded destination URL

---

## Part 3: Testing Your Setup

### Test Amazon Links

1. Visit `/minifigs/sw1219` (Grogu - popular set)
2. Scroll to "Found in X Sets"  
3. Click "Buy on Amazon"
4. URL should be: `https://www.amazon.com/s?k=LEGO+75318+...&tag=yoursite-20`
5. Make test purchase (optional) to verify tracking

### Test Rakuten/LEGO Links

1. Visit same minifig page
2. Click "Buy on LEGO.com" (if button shows)
3. Should redirect through Rakuten tracking
4. Then land on official LEGO.com product page

### Check Dashboards

**Amazon Associates:**
- Reports → Link Type Report → See clicks
- Earnings Report → See conversions (24-48hr delay)

**Rakuten:**
- Performance Reports → See clicks
- Commission Reports → See earnings (2-3 day delay)

---

## Part 4: Compliance & Best Practices

### FTC Disclosure Requirements

You **MUST** disclose affiliate relationships. Add to your site:

**Option 1: Site-wide footer**
```
FigTracker participates in affiliate programs including Amazon Associates 
and Rakuten Advertising. We may earn a commission when you purchase 
through our links at no additional cost to you.
```

**Option 2: Dedicated page** (`/about` or `/disclosure`)
```markdown
# Affiliate Disclosure

FigTracker uses affiliate marketing to support the site and keep it free.

## Our Partners
- **Amazon Associates** - We earn a small commission when you buy LEGO 
  sets through our Amazon links
- **Rakuten/LEGO.com** - We earn commissions on official LEGO store purchases

## What This Means
- You pay the same price whether you use our links or not
- These commissions help us cover hosting costs and keep improving FigTracker
- We only recommend products relevant to LEGO collectors

## Your Trust
We value your trust. All recommendations are genuine and based on what 
we believe helps LEGO collectors.
```

### Amazon Associates Terms

**Must comply with:**
- Display disclosure on pages with affiliate links
- Don't use affiliate links in emails
- Don't use shortened links (bit.ly, etc.) without disclosure
- Must generate ≥3 sales within 180 days to stay active

### Rakuten/LEGO Terms

**Must comply with:**
- Only use approved creatives/text
- Don't bid on "LEGO" keywords in paid search
- Don't use LEGO trademarks without permission
- Follow LEGO's brand guidelines

---

## Part 5: Optimization Tips

### Increase Conversion Rates

1. **Show Multiple Options**
   - ✅ Amazon (fastest shipping)
   - ✅ LEGO.com (exclusive sets)
   - ✅ BrickLink (used/collectible)

2. **Highlight Popular Sets**
   - Sort by popularity
   - Show "Most Purchased" badge
   - Display set ratings if available

3. **Add Urgency**
   - "Limited Stock" indicators
   - "Retiring Soon" for EOL sets
   - Price drop alerts

4. **Improve Context**
   - "Contains 2 minifigs" badges
   - Release year
   - Piece count
   - Price range

### Maximize Earnings

1. **Focus on High-Value Sets**
   - UCS sets ($200-800)
   - Modular buildings ($150-300)
   - Creator Expert ($100-250)

2. **Target Popular Themes**
   - Star Wars (highest traffic)
   - Harry Potter (high conversion)
   - Marvel/DC (growing market)

3. **Seasonal Promotion**
   - Black Friday / Cyber Monday
   - Holiday shopping season
   - Prime Day (Amazon)

---

## Part 6: Troubleshooting

### Amazon Links Not Working

**Problem:** Links don't include affiliate tag

**Solutions:**
1. Verify `AMAZON_AFFILIATE_TAG` is set in `.env`
2. Check format is correct: `yoursite-20` (no spaces)
3. Restart dev server after adding env vars
4. For Vercel: ensure env var is set in project settings

**Problem:** Not earning commissions

**Solutions:**
1. Verify clicks showing up in Amazon dashboard
2. Check if purchases are within 24-hour window
3. Ensure you're not clicking your own links (disallowed)
4. Confirm account is still active (need 3 sales/180 days)

### Rakuten Links Not Working

**Problem:** Button doesn't appear

**Solutions:**
1. Verify `RAKUTEN_AFFILIATE_ID` is set
2. Check you've been approved for LEGO program specifically
3. May need to implement deep linking API

**Problem:** Not getting credited

**Solutions:**
1. Verify deep links are set up correctly
2. Check if cookies are enabled
3. Ensure users land on LEGO.com (not redirected)
4. Contact Rakuten support to verify setup

---

## Part 7: Expected Timeline

### Week 1: Setup
- ✅ Apply to Amazon Associates (approved in hours)
- ✅ Add affiliate tag to FigTracker
- ✅ Test links work correctly
- ✅ Add disclosure to site

### Week 2-3: Apply to Rakuten
- ⏳ Apply to Rakuten (wait 3-7 days)
- ⏳ Apply to LEGO program (wait 5-14 days)
- ⏳ Set up deep linking

### Week 4+: Optimize
- 📈 Monitor which sets get most clicks
- 📈 A/B test button text
- 📈 Add price comparisons
- 📈 Optimize for popular searches

### First Revenue
- 💰 Amazon: First commission within 1-2 weeks typically
- 💰 Rakuten: May take 1-2 months (slower approval + slower traffic)

---

## Summary

### Quick Start Checklist

**Amazon (Start Today):**
- [ ] Sign up at affiliate-program.amazon.com
- [ ] Get your affiliate tag
- [ ] Add to `.env`: `AMAZON_AFFILIATE_TAG=yoursite-20`
- [ ] Deploy to Vercel
- [ ] Test on production site
- [ ] Add disclosure to About page

**Rakuten (Start Next Week):**
- [ ] Apply at rakutenadvertising.com
- [ ] Wait for publisher approval (3-7 days)
- [ ] Apply to LEGO program
- [ ] Wait for LEGO approval (5-14 days)
- [ ] Get publisher ID
- [ ] Add to `.env`: `RAKUTEN_AFFILIATE_ID=123456`
- [ ] Implement deep linking (optional but recommended)

**Expected Revenue (Year 1):**
- Month 1-3: $10-30/month (building traffic)
- Month 4-6: $30-80/month (SEO improving)
- Month 7-12: $80-200/month (established traffic)

Scale traffic → Scale revenue! 🚀

---

## Need Help?

- **Amazon Support:** https://affiliate-program.amazon.com/help
- **Rakuten Support:** publishers@rakutenadvertising.com
- **FigTracker Issues:** Open GitHub issue

Happy monetizing! 💰
