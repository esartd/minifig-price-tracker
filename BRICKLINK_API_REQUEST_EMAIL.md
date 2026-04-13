# Email to BrickLink API Support

**To:** apisupport@bricklink.com  
**Subject:** Request for Bulk Minifigure Catalog Access - FigTracker Inventory Tool

---

Hi BrickLink API Team,

I'm reaching out to request assistance with catalog access for **FigTracker** (https://figtracker.ericksu.com), a tool I've built to help LEGO minifigure resellers manage their inventory and pricing.

## About FigTracker

FigTracker helps sellers:
- Track minifigure inventory with quantities and conditions
- See real-time BrickLink marketplace pricing (suggested price from current listings)
- Generate platform-specific listings (Facebook, eBay, BrickLink formats)
- Monitor price trends over time

The tool is **currently free during beta** and designed to help small-to-medium sellers who need professional inventory management without enterprise-level complexity.

## Current Compliance Status

I've carefully implemented your API Terms of Service:

✅ **Rate Limiting:** 3-second delays between requests, hard limit at 5,000 calls/day  
✅ **Pricing Freshness:** Cached max 6 hours (refreshed every 6 hours per "item content" rule)  
✅ **Metadata Freshness:** Minifig names/IDs cached max 24 hours (per "other content" rule)  
✅ **User-Driven Caching:** No systematic enumeration - only cache what users search for  
✅ **Attribution:** Required trademark notice displayed in footer  
✅ **Current Usage:** ~400-600 API calls/day (10% of limit)

**Implementation Details:**
- Rate limiter code: https://github.com/esartd/minifig-price-tracker/blob/main/lib/bricklink.ts
- Full compliance docs: https://github.com/esartd/minifig-price-tracker/blob/main/BRICKLINK_COMPLIANCE_SUMMARY.md

## The Challenge

Currently, users can only search by **exact BrickLink ID** (e.g., "sw1219"). While this works, the user experience isn't ideal:

- ✅ Search "sw1219" → Shows "Luke Skywalker (Tatooine)" with current price
- ❌ Search "luke skywalker" → No results (no name index without systematic enumeration)

To enable name-based search while staying compliant, I need to avoid systematically enumerating all 15,000+ minifig IDs through the API (which would constitute robot/spider behavior per your terms).

## What I'm Requesting

I'd like to offer better search UX while maintaining full compliance. Would any of these be possible?

**Option 1 (Ideal):** One-time bulk catalog export
- Just minifig IDs + names (no pricing data)
- I'd still fetch all pricing via your API with proper caching
- This would enable instant name searches without systematic API enumeration

**Option 2:** Higher API rate limit
- Increase from 5,000 to 10,000 or 20,000 calls/day
- Would allow on-demand searches that hit your API when needed
- Still maintaining all rate limiting and caching rules

**Option 3:** Access to a catalog search endpoint
- Endpoint that returns minifig IDs matching a name query
- Example: `GET /catalog/search?name=luke+skywalker` → returns matching IDs
- I'd still fetch full details and pricing through normal endpoints

## Why This Benefits BrickLink

1. **Drives Traffic:** Users discover minifigs on FigTracker → visit BrickLink to buy/sell
2. **Helps Sellers:** Makes it easier for sellers to list on BrickLink marketplace
3. **Responsible Usage:** I've proven compliance and responsible API usage
4. **Ecosystem Value:** Tool serves the LEGO reseller community and promotes BrickLink as the pricing source

## Alternative

If none of the above are possible, I understand and will continue with the current ID-based search system. I just wanted to explore options for improving the experience while staying compliant with your terms.

Thank you for considering this request. I'm happy to provide any additional information about my implementation or use case.

Best regards,

**Erick Su**  
**[Your Email]**  
**FigTracker:** https://figtracker.ericksu.com  
**GitHub:** https://github.com/esartd/minifig-price-tracker

---

## Notes for Sending

Before sending:
1. ✅ GitHub links - Already filled in
2. ✅ Your name - Already filled in
3. ⚠️ **Add your email address** - Replace `[Your Email]` with your contact email
4. Consider making your GitHub repo public temporarily so they can verify your implementation
5. Include screenshots of your rate limiter code if you want to attach them

**Pro tip:** If you have any BrickLink seller account history (good feedback, active listings), mention it - shows you're part of the community.
