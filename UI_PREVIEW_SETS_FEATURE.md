# UI Preview: Set Discovery Feature

## What Users See

### Minifigure Detail Page (Updated)

```
┌─────────────────────────────────────────────────────────────────┐
│ Home > Themes > Star Wars > sw0001a                             │
│                                                                   │
│  [Image]      Luke Skywalker (X-Wing Pilot)                     │
│               sw0001a                                             │
│                                                                   │
│               Qty Avg: $8.50  Simple Avg: $9.20                  │
│               Lowest: $7.00   Suggested: $7.70                   │
│                                                                   │
│               [Add to Inventory]                                  │
│               [View on BrickLink]                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Found in 8 Sets                              │
│                LEGO sets that include this minifigure            │
│                                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │ [Image] │  │ [Image] │  │ [Image] │  │ [Image] │           │
│  │   ×2    │  │         │  │         │  │   ×1    │           │
│  │         │  │         │  │         │  │         │           │
│  │ X-Wing  │  │Red Five │  │ Rogue   │  │ Yavin 4 │           │
│  │ Fighter │  │ X-Wing  │  │ One     │  │ Rebel   │           │
│  │75301-1  │  │10240-1  │  │75572-1  │  │75235-1  │           │
│  │         │  │         │  │         │  │         │           │
│  │[Buy on Amazon]  │  │[Buy on Amazon]                          │
│  │[Buy on LEGO.com]│  │[Buy on LEGO.com]                       │
│  │[View on BrickLink]│[View on BrickLink]                      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Other Variants                                │
│              Different versions of this character                │
│                                                                   │
│  [Luke - Tatooine] [Luke - Jedi] [Luke - Bespin] ...            │
└─────────────────────────────────────────────────────────────────┘
```

## Set Card Design (Detailed)

### With All Affiliate Programs Configured

```
┌──────────────────────────────────────┐
│            ×2                        │  ← Quantity badge (top-right)
│                                       │
│        [Set Image]                   │  ← 140x140px product image
│         (centered)                    │
│                                       │
├──────────────────────────────────────┤
│ X-Wing Fighter                       │  ← Set name (2 lines max)
│ 75301-1                              │  ← Set number (monospace)
│                                       │
│ ┌──────────────────────────────────┐ │
│ │    🛒  Buy on Amazon            │ │  ← Primary (orange)
│ └──────────────────────────────────┘ │
│                                       │
│ ┌──────────────────────────────────┐ │
│ │    🧱  Buy on LEGO.com          │ │  ← Secondary (yellow)
│ └──────────────────────────────────┘ │
│                                       │
│ ┌──────────────────────────────────┐ │
│ │    🔗  View on BrickLink        │ │  ← Tertiary (outline)
│ └──────────────────────────────────┘ │
│                                       │
└──────────────────────────────────────┘
```

### With Only Amazon Configured

```
┌──────────────────────────────────────┐
│                                       │
│        [Set Image]                   │
│         (centered)                    │
│                                       │
├──────────────────────────────────────┤
│ X-Wing Fighter                       │
│ 75301-1                              │
│                                       │
│ ┌──────────────────────────────────┐ │
│ │    🛒  Buy on Amazon            │ │  ← Only Amazon (primary)
│ └──────────────────────────────────┘ │
│                                       │
│ ┌──────────────────────────────────┐ │
│ │    🔗  View on BrickLink        │ │  ← BrickLink reference
│ └──────────────────────────────────┘ │
│                                       │
└──────────────────────────────────────┘
```

### No Affiliate Programs Configured

```
┌──────────────────────────────────────┐
│                                       │
│        [Set Image]                   │
│         (centered)                    │
│                                       │
├──────────────────────────────────────┤
│ X-Wing Fighter                       │
│ 75301-1                              │
│                                       │
│ ┌──────────────────────────────────┐ │
│ │    🔗  View on BrickLink        │ │  ← Only BrickLink
│ └──────────────────────────────────┘ │  (no affiliate)
│                                       │
└──────────────────────────────────────┘
```

## Button Styles

### Primary: Amazon (Orange)
- **Color:** `#FF9900` (Amazon orange)
- **Hover:** `#F08000` (darker)
- **Icon:** Shopping cart
- **Text:** White, 13px, semibold
- **Padding:** 10px 14px
- **Most prominent** - draws user's eye first

### Secondary: LEGO.com (Yellow)
- **Color:** `#FFCF00` (LEGO yellow)
- **Hover:** `#E6BA00` (darker)
- **Icon:** LEGO brick
- **Text:** White, 13px, semibold
- **Padding:** 10px 14px
- **Visible but not competing** with Amazon

### Tertiary: BrickLink (Outline)
- **Color:** Transparent background
- **Border:** `#e5e5e5` → `#3b82f6` on hover
- **Text:** `#737373` → `#3b82f6` on hover
- **Icon:** External link
- **Font:** 12px, medium weight
- **Padding:** 8px 14px
- **Reference only** - not primary purchase option

## Responsive Behavior

### Desktop (1200px+)
- 4 sets per row
- All buttons visible
- Full set names (2 lines)

### Tablet (768px - 1199px)
- 3 sets per row
- All buttons visible
- Set names may truncate

### Mobile (< 768px)
- 2 sets per row
- Stack buttons vertically
- Smaller images (100x100)
- Shorter button text if needed

## Color Coding

### Quantity Badges
- **Green:** `#10b981` - indicates multiple minifigs in set
- **White text:** `#ffffff` - high contrast
- **Top-right:** Absolute positioning
- **Only shows:** When quantity > 1

### Hover States
- **Amazon:** Darkens by ~10%
- **LEGO:** Darkens by ~10%
- **BrickLink:** Border turns blue
- **Card:** No card-level hover (individual buttons only)

## Loading States

### While Fetching Sets
```
┌─────────────────────────────────────┐
│                                     │
│         🔄 [Spinner]                │
│                                     │
│       Loading sets...               │
│                                     │
└─────────────────────────────────────┘
```

### No Sets Found
```
┌─────────────────────────────────────┐
│                                     │
│    No sets found for this          │
│    minifigure                       │
│                                     │
└─────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────┐
│                                     │
│    ⚠️ Failed to load sets           │
│                                     │
└─────────────────────────────────────┘
```

## User Flow

### Discovery Flow
1. User searches for "Luke Skywalker"
2. Clicks on specific variant (e.g., sw0001a)
3. Sees pricing and inventory options
4. **Scrolls down** → sees "Found in 8 Sets"
5. Browses set thumbnails
6. Finds set they want
7. Clicks "Buy on Amazon"
8. Opens in new tab → Amazon product page
9. **URL includes your affiliate tag**
10. User completes purchase → **You earn commission!**

### Comparison Flow
1. User views sets section
2. Compares prices mentally:
   - Amazon: Fast shipping, familiar checkout
   - LEGO.com: Official, sometimes exclusive items
   - BrickLink: Used/collectible, reference pricing
3. Chooses platform based on preference
4. Makes purchase

## Key UX Decisions

### Why Amazon First?
1. **Highest conversion** - Most users have Prime
2. **Fastest shipping** - 1-2 days typically
3. **Familiar checkout** - Reduces friction
4. **Best commission rates** - 3-4% on toys
5. **24-hour cookie** - User can browse, buy later

### Why LEGO.com Second?
1. **Official store** - Trust factor
2. **Exclusive sets** - Some only on LEGO.com
3. **VIP points** - Users collect LEGO rewards
4. **Pre-orders** - New releases

### Why BrickLink Last?
1. **Used market** - Different use case
2. **Collectible focus** - Retired sets
3. **Price reference** - What collectors pay
4. **Not primary** - Most users want new sets

### Button Hierarchy
- **Size:** Amazon = LEGO > BrickLink
- **Color:** Amazon (warm) > LEGO (bright) > BrickLink (neutral)
- **Position:** Amazon (top) > LEGO (middle) > BrickLink (bottom)
- **Weight:** Semibold > Semibold > Medium

## A/B Testing Ideas (Future)

### Test 1: Button Order
- **A:** Amazon → LEGO → BrickLink (current)
- **B:** LEGO → Amazon → BrickLink
- **Hypothesis:** Amazon first drives higher CTR

### Test 2: Button Text
- **A:** "Buy on Amazon" (current)
- **B:** "Shop on Amazon"
- **C:** "Get on Amazon"
- **Hypothesis:** "Buy" is most direct

### Test 3: Icons
- **A:** With icons (current)
- **B:** Text only
- **Hypothesis:** Icons improve recognition

### Test 4: Quantity Display
- **A:** Badge (×2) in corner (current)
- **B:** Text below image
- **C:** No quantity indicator
- **Hypothesis:** Badge is most visible

---

## Implementation Notes

### Conditional Rendering
- Amazon button only shows if `AMAZON_AFFILIATE_TAG` is set
- LEGO button only shows if `RAKUTEN_AFFILIATE_ID` is set
- BrickLink always shows (works without affiliate ID)

### Link Tracking
- All links open in new tab (`target="_blank"`)
- Include `rel="noopener noreferrer"` for security
- Affiliate parameters added automatically

### Performance
- Images lazy-loaded (Next.js Image component)
- API call cached (consider adding cache in future)
- Minimal JavaScript (mostly static HTML/CSS)

---

**This UI maximizes conversion while maintaining clean, professional design.**
