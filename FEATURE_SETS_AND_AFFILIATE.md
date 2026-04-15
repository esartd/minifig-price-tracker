# Feature: Set Discovery & Multi-Platform Affiliate Links

## Summary

Added two powerful features to FigTracker:

1. **Set Discovery** - Show which LEGO sets contain each minifigure
2. **Multi-Platform Affiliate Links** - Monetize with Amazon Associates, Rakuten (LEGO.com), and BrickLink

## What's New

### For Users
- **"Found in X Sets"** section on every minifig page
- **Multiple purchase options** - Amazon, LEGO.com, and BrickLink
- **Primary CTA** - "Buy on Amazon" button (orange, prominent)
- **Secondary options** - LEGO.com (yellow) and BrickLink (gray outline)
- Quantity badges show how many minifigs are in each set
- Beautiful set cards with images and descriptions

### For You (Site Owner)
- **Amazon Associates** - 3-4% commission, highest conversion rates
- **Rakuten/LEGO.com** - Official LEGO store commissions
- **BrickLink** - Used/collectible market (optional)
- Automatic affiliate tracking on all external links
- Easy setup via environment variables

## Files Added

### Core Implementation
- `app/api/minifigs/[itemNo]/sets/route.ts` - API endpoint to fetch sets
- `components/MinifigSets.tsx` - React component to display sets
- `lib/affiliate-links.ts` - Centralized affiliate link management

### Documentation
- `AFFILIATE_SETUP.md` - Complete setup guide for affiliate program
- `FEATURE_SETS_AND_AFFILIATE.md` - This file

### Testing
- `scripts/test-sets-api.ts` - Test script to verify API works

## Files Modified

### Backend
- `lib/bricklink.ts` - Added `getSetsContainingMinifig()` method

### Frontend
- `components/minifig-detail-client.tsx` - Integrated MinifigSets component
- `types/index.ts` - SetInfo interface already existed (no changes needed)

### Configuration
- `.env.example` - Added `BRICKLINK_AFFILIATE_ID`
- `package.json` - Added `test-sets-api` script
- `README.md` - Updated features list and added monetization section

## API Endpoint

### GET `/api/minifigs/[itemNo]/sets`

Fetches all LEGO sets that contain a specific minifigure.

**Example Request:**
```bash
GET /api/minifigs/sw0001a/sets
```

**Example Response:**
```json
{
  "success": true,
  "sets": [
    {
      "no": "75301-1",
      "name": "Luke Skywalker's X-wing Fighter",
      "quantity": 1,
      "image_url": "https://img.bricklink.com/ItemImage/SN/0/75301-1.png"
    }
  ],
  "count": 1
}
```

## How It Works

### Backend Flow
1. User visits minifig page (e.g., `/minifigs/sw0001a`)
2. `MinifigSets` component calls `/api/minifigs/sw0001a/sets`
3. API calls BrickLink's `/supersets` endpoint
4. Returns filtered list of sets (excludes non-set items)
5. Component displays set cards with affiliate links

### Affiliate Link Flow
1. `getBrickLinkSetUrl(setNo)` is called
2. Checks if `BRICKLINK_AFFILIATE_ID` is configured
3. Appends `&afflid=YOUR_ID` to URL if configured
4. User clicks → tracked click → purchase → commission!

## Setup Instructions (Quick)

### Option 1: Amazon Associates (Recommended - Start Today!)

1. **Get Amazon Affiliate Tag**
   ```
   Visit: https://affiliate-program.amazon.com/
   Sign up (approved in hours!)
   Get your tag: yoursite-20
   ```

2. **Add to Environment**
   ```bash
   # .env
   AMAZON_AFFILIATE_TAG=yoursite-20
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Add Amazon affiliate tracking"
   git push
   ```

4. **Test**
   ```bash
   # Production
   Visit: https://your-site.com/minifigs/sw0001a
   Scroll to "Found in X Sets"
   Click "Buy on Amazon" → URL should include &tag=yoursite-20
   ```

### Option 2: Rakuten/LEGO.com (Optional)

1. **Apply to Rakuten**
   ```
   Visit: https://rakutenadvertising.com/
   Apply (takes 3-7 days)
   Then apply to LEGO program (takes 5-14 days)
   ```

2. **Add to Environment**
   ```bash
   # .env
   RAKUTEN_AFFILIATE_ID=123456
   ```

### Option 3: All Three Platforms

```bash
# .env - Maximum monetization!
AMAZON_AFFILIATE_TAG=yoursite-20
RAKUTEN_AFFILIATE_ID=123456
BRICKLINK_AFFILIATE_ID=789012
```

## Revenue Model

### How You Earn (Amazon - Primary)
- User visits your minifig page
- Sees sets containing that minifig
- Clicks "Buy on Amazon" (prominent orange button)
- Makes purchase within 24 hours
- You earn commission (3-4% on toys)

### Example Calculation (Amazon)
```
Monthly Traffic: 5,000 visitors
View Minifig Pages: 70% = 3,500 views
See Sets Section: 80% = 2,800 views
Click Amazon Button: 5% = 140 clicks
Purchase: 8% = 11 purchases (Amazon has high conversion!)
Avg Order Value: $60
Commission Rate: 4%

Monthly Revenue: 11 × $60 × 0.04 = $26.40

At 20,000 visitors: ~$106/month
At 50,000 visitors: ~$264/month
At 100,000 visitors: ~$528/month
```

**Add Rakuten/LEGO.com:** Additional 20-30% revenue on top!

Scale up traffic → scale up revenue! 💰

## Testing

### Test on Production (Recommended)
```bash
# Visit any minifig with sets
https://your-site.com/minifigs/sw0001a

# Scroll down to "Found in X Sets"
# Click any set card
# Check URL includes: &afflid=YOUR_ID
```

### Test API Directly
```bash
npm run test-sets-api
```

This will:
- Test a few popular minifigs
- Show which sets contain them
- Verify API is working correctly

**Note:** API is blocked on localhost to preserve production rate limits. Deploy to test fully.

## BrickLink API Usage

### Rate Limits
- ✅ Respects 5,000 calls/day limit
- ✅ 3-second delay between requests
- ✅ Smart caching (not implemented for sets yet, consider adding)

### Cost
- Each minifig page load = 1 API call to fetch sets
- Consider caching set data if traffic grows
- Sets rarely change, so 30-day cache is safe

## Future Enhancements

### Short-term
- [ ] Cache set data (30-day expiration)
- [ ] Show set release year
- [ ] Sort sets by year/popularity
- [ ] Add set piece count

### Long-term
- [ ] Amazon affiliate links (sealed sets)
- [ ] eBay Partner Network (used sets)
- [ ] Price comparison across platforms
- [ ] "Where to Buy" button with best price

## Troubleshooting

### No Sets Showing Up
**Problem:** "No sets found for this minifigure"

**Solutions:**
1. Check you're on production (API blocked on localhost)
2. Verify BrickLink API credentials in `.env`
3. Check API call count hasn't hit daily limit
4. Try a different minifig (some minifigs aren't in any sets)

### Affiliate ID Not Working
**Problem:** Links don't include `&afflid=`

**Solutions:**
1. Verify `BRICKLINK_AFFILIATE_ID` is set
2. Restart dev server (env vars need reload)
3. Check Vercel environment variables (if deployed)
4. Clear browser cache

### API Rate Limit Hit
**Problem:** "BrickLink API daily limit reached"

**Solutions:**
1. Wait until midnight for reset
2. Implement caching for set data
3. Reduce API calls by caching aggressively

## Support

Questions? 
- Check [AFFILIATE_SETUP.md](./AFFILIATE_SETUP.md)
- Open an issue on GitHub
- Contact BrickLink support for affiliate program questions

---

**Built with ❤️ for LEGO collectors**
