# BrickLink Affiliate Setup Guide

FigTracker now supports BrickLink affiliate links to help you monetize your traffic. When users click through to buy LEGO sets from your site, you'll earn a commission!

## How It Works

FigTracker automatically adds your affiliate ID to all BrickLink links:
- **"View on BrickLink"** buttons on minifig pages
- **Set cards** showing which sets contain each minifigure
- All external BrickLink product links

## Setup Instructions

### 1. Get Your BrickLink Affiliate ID

1. **Sign up for BrickLink's Affiliate Program**
   - Visit: https://www.bricklink.com/affiliate.asp
   - Apply for their affiliate program
   - Wait for approval (usually takes a few days)

2. **Find Your Affiliate ID**
   - Once approved, log into BrickLink
   - Go to your affiliate dashboard
   - Copy your unique affiliate ID (looks like: `123456`)

### 2. Add to Environment Variables

Add your affiliate ID to your `.env` file:

```bash
# BrickLink Affiliate Links
BRICKLINK_AFFILIATE_ID=your_affiliate_id_here
```

**For Client-Side Components:**
If you need the affiliate ID in client-side components, also add the public version:

```bash
NEXT_PUBLIC_BRICKLINK_AFFILIATE_ID=your_affiliate_id_here
```

### 3. Deploy

After adding your affiliate ID:

```bash
# Development - test locally first
npm run dev

# Production - deploy to Vercel
npm run deploy
```

Don't forget to add the environment variable in your Vercel dashboard:
1. Go to your project settings on Vercel
2. Navigate to **Environment Variables**
3. Add `BRICKLINK_AFFILIATE_ID` with your affiliate ID
4. Redeploy

## Testing Your Setup

1. Visit any minifigure page on your site (e.g., `/minifigs/sw0001a`)
2. Scroll down to the **"Found in X Sets"** section
3. Click on any set card
4. The BrickLink URL should include `&afflid=YOUR_ID`

Example URL:
```
https://www.bricklink.com/v2/catalog/catalogitem.page?S=75192-1&afflid=123456
```

## How Users See It

### Before (Without Affiliate)
Users click "View on BrickLink" → Opens BrickLink page with no tracking

### After (With Affiliate)
Users click "View on BrickLink" → Opens BrickLink page with your affiliate ID → You earn commission on purchases

## Features Using Affiliate Links

✅ **Minifig Detail Page**
   - "View on BrickLink" button (price guide)
   - "Found in X Sets" section (buy sets containing the minifig)

✅ **Set Cards**
   - Links to purchase individual sets
   - Quantity badges show how many minifigs are included

## Revenue Potential

BrickLink typically pays commissions on qualifying purchases made through your affiliate links. The exact commission rate depends on your agreement with BrickLink.

**Example Traffic:**
- 1,000 monthly visitors
- 10% click-through rate = 100 clicks
- 5% conversion = 5 purchases
- Average order $50
- 3% commission = **$7.50/month** per 1,000 visitors

Scale up your traffic to increase earnings!

## Future Enhancements

Planned affiliate integrations:
- [ ] Amazon affiliate links (for buying sealed LEGO sets)
- [ ] eBay Partner Network (for secondary market)
- [ ] LEGO.com affiliate program

## Compliance & Disclosure

**Important:** Make sure to comply with FTC guidelines and BrickLink's terms:
- Disclose affiliate relationships to users
- Add a disclaimer on your About page
- Follow BrickLink's affiliate program rules

Example disclosure:
```
FigTracker participates in affiliate programs with BrickLink. 
We may earn a commission when you purchase through our links, 
at no additional cost to you.
```

## Troubleshooting

**Links don't include `afflid` parameter:**
- Check that `BRICKLINK_AFFILIATE_ID` is set in `.env`
- Restart your dev server after adding environment variables
- For Vercel: ensure the variable is set in project settings and redeploy

**Not earning commissions:**
- Verify your affiliate ID is correct
- Check BrickLink affiliate dashboard for click tracking
- Ensure users complete purchases within tracking window
- Contact BrickLink support if issues persist

## Support

Questions? Open an issue on GitHub or check the BrickLink affiliate documentation.

Happy monetizing! 💰
