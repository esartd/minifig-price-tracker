# eBay Partner Network Integration Guide

**Status**: Ready to integrate when Publisher ID is available  
**Campaign ID**: 5339150379 ✅  
**Publisher ID**: Waiting for EPN approval

---

## Step 1: Get Your Publisher ID

1. Go to https://epn.ebay.com/
2. Click **"Tools"** → **"Link Generator"**
3. Generate any test link
4. Look for the number starting with `5338` in the URL
5. That's your Publisher ID!

---

## Step 2: Add Environment Variables

Add to `.env` (for production):
```bash
NEXT_PUBLIC_EBAY_CAMPAIGN_ID=5339150379
NEXT_PUBLIC_EBAY_PUBLISHER_ID=5338xxxxxx  # Your publisher ID here
```

Add to `.env.local` (for development):
```bash
NEXT_PUBLIC_EBAY_CAMPAIGN_ID=5339150379
NEXT_PUBLIC_EBAY_PUBLISHER_ID=5338xxxxxx  # Your publisher ID here
```

---

## Step 3: Files to Modify

### **Minifigure Pages** (Button Order: eBay → BrickLink → Amazon)

#### File: `app/minifigs/[itemNo]/page.tsx`

**Import the eBay function:**
```typescript
import { generateEbayMinifigLink } from '@/lib/ebay-affiliate-links';
```

**Add eBay button BEFORE BrickLink button:**
```typescript
{/* eBay Button - NEW */}
<a
  href={generateEbayMinifigLink(itemNo, minifig.name)}
  target="_blank"
  rel="noopener noreferrer nofollow"
  onClick={(e) => {
    e.stopPropagation();
    // Optional: Track click
  }}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#3665f3', // eBay blue
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = '#2952d9';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = '#3665f3';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  <ShoppingCartIcon style={{ width: '20px', height: '20px' }} />
  Buy on eBay
</a>

{/* Existing BrickLink button */}
{/* Existing Amazon button */}
```

---

### **Set Pages** (Button Order: eBay → Amazon → BrickLink)

#### File: `app/sets/[boxNo]/page.tsx`

**Import the eBay function:**
```typescript
import { generateEbaySetLink } from '@/lib/ebay-affiliate-links';
```

**Add eBay button BEFORE Amazon button:**
```typescript
{/* eBay Button - NEW */}
<a
  href={generateEbaySetLink(boxNo, set.name)}
  target="_blank"
  rel="noopener noreferrer nofollow"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#3665f3',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s'
  }}
>
  <ShoppingCartIcon style={{ width: '20px', height: '20px' }} />
  Buy on eBay
</a>

{/* Existing Amazon button */}
{/* Existing BrickLink button */}
```

---

### **Wishlist Page**

#### File: `app/wishlist/page.tsx`

Add eBay as the first button in the button group:

```typescript
{/* eBay Button */}
<button
  onClick={(e) => {
    e.stopPropagation();
    handleBuyClick('ebay', item, generateEbayMinifigLink(item.minifigure_no, item.minifigure_name));
  }}
  style={{
    flex: 1,
    padding: '12px 16px',
    background: '#3665f3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  }}
>
  <ShoppingCartIcon style={{ width: '16px', height: '16px' }} />
  eBay
</button>
```

---

### **Search Results Cards**

#### File: `components/search/MinifigCard.tsx`

Add eBay button to minifig cards in search results (if applicable).

---

## Step 4: Testing

After adding environment variables and code:

1. **Restart dev server** to pick up new env vars
2. **Visit a minifig page** (e.g., `/minifigs/sw0001`)
3. **Click the eBay button**
4. Verify it:
   - Opens eBay search for "LEGO sw0001 [minifig name]"
   - URL contains your campaign ID
   - Opens correct regional eBay site (ebay.com, ebay.de, etc.)

---

## Step 5: Deploy to Production

1. Add env vars to **Vercel**:
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_EBAY_CAMPAIGN_ID` and `NEXT_PUBLIC_EBAY_PUBLISHER_ID`
   - Redeploy

2. Test on production:
   - Visit https://figtracker.ericksu.com/minifigs/sw0001
   - Click eBay button
   - Verify affiliate link works

---

## Step 6: Track Performance

Monitor in eBay Partner Network dashboard:
- Click-through rate
- Conversion rate
- Commission earned
- Custom IDs track whether clicks came from minifigs vs sets

---

## Button Colors

**eBay Brand Blue**:
- Primary: `#3665f3`
- Hover: `#2952d9`

**Existing Colors**:
- BrickLink Orange: `#f97316`
- Amazon: White bg with border

---

## Regional eBay Sites

The code automatically detects user locale and directs to correct eBay:
- `en` → ebay.com
- `de` → ebay.de
- `fr` → ebay.fr
- `es` → ebay.es
- `en-GB` → ebay.co.uk

---

## Notes

- eBay works for **both new and old** LEGO products
- Search-based links (not direct product links)
- Compliance: Uses official EPN Rover links
- Click tracking via `customid` parameter
- No external dependencies needed

---

## When Ready to Integrate

Contact Claude Code and say:
> "I have my eBay Publisher ID: 5338xxxxxx - let's integrate eBay links"

I'll help you add the buttons to all pages with the correct ordering! 🎉
