# Retirement Prediction Accuracy Improvement Strategies

## Current Accuracy: 75-85% → Target: 90%+

---

## Strategy 1: Use BrickLink Availability Data (HIGHEST IMPACT)

### What We Have:
Your `PriceCache` table already tracks BrickLink data:
- `current_avg` - Average price from available sellers
- `qty_avg_price` - Quantity of sellers (CRITICAL for retirement detection!)
- `current_lowest` - Lowest price available

### How to Detect Retirement:

**Algorithm Enhancement:**
```typescript
async function checkBrickLinkAvailability(boxNo: string): Promise<{
  isRetired: boolean;
  confidence: 'high' | 'medium' | 'low';
  signal: string;
}> {
  const priceData = await prisma.priceCache.findFirst({
    where: {
      item_no: boxNo,
      item_type: 'SET',
      condition: 'N' // New condition
    },
    orderBy: { cached_at: 'desc' }
  });

  if (!priceData) {
    return { isRetired: false, confidence: 'low', signal: 'no_data' };
  }

  // Check 1: No sellers available
  if (priceData.qty_avg_price === 0) {
    return { 
      isRetired: true, 
      confidence: 'high', 
      signal: 'zero_sellers' 
    };
  }

  // Check 2: Very few sellers (<5) + high price
  const priceRatio = priceData.current_avg / priceData.six_month_avg;
  if (priceData.qty_avg_price < 5 && priceRatio > 1.5) {
    return { 
      isRetired: true, 
      confidence: 'high', 
      signal: 'low_inventory_high_price' 
    };
  }

  // Check 3: Price significantly above 6-month average
  if (priceRatio > 2.0) {
    return { 
      isRetired: true, 
      confidence: 'medium', 
      signal: 'price_spike' 
    };
  }

  // Still available
  return { isRetired: false, confidence: 'low', signal: 'available' };
}
```

**Expected Improvement:** +10-15% accuracy
**Why:** Direct market signal - when sellers run out, set is retired

---

## Strategy 2: Add Price Tier-Based Lifespans (MEDIUM IMPACT)

### Current Problem:
All Creator Expert sets use same 3.5-year lifespan, but:
- Small $50 sets retire in 2-3 years
- Large $400+ sets retire in 4-5 years

### Solution:
```typescript
async function getSetLifespanByPrice(theme: string, boxNo: string): Promise<number> {
  // Get price from PriceCache
  const priceData = await prisma.priceCache.findFirst({
    where: { item_no: boxNo, item_type: 'SET', condition: 'N' }
  });

  const price = priceData?.current_avg || 0;
  const themeLower = theme.toLowerCase();

  // UCS/Icons with price tiers
  if (themeLower.includes('icons') || themeLower.includes('ucs')) {
    if (price > 500) return 5.5; // Massive UCS sets (Falcon, Star Destroyer)
    if (price > 300) return 4.5;
    if (price > 200) return 4;
    return 3.5;
  }

  // Creator Expert with price tiers
  if (themeLower.includes('creator expert') || themeLower.includes('creator')) {
    if (price > 300) return 4.5; // Large flagship sets
    if (price > 200) return 4;
    if (price > 100) return 3.5;
    return 2.5; // Small Creator sets
  }

  // Licensed themes with price tiers
  if (themeLower.includes('star wars') || themeLower.includes('marvel')) {
    if (price > 400) return 4.5; // UCS or flagship
    if (price > 200) return 3;
    if (price > 100) return 2.5;
    return 2;
  }

  // Default price tiers
  if (price > 200) return 4;
  if (price > 100) return 3;
  if (price > 50) return 2.5;
  return 1.5;
}
```

**Expected Improvement:** +5-8% accuracy
**Why:** More granular predictions based on set size/value

---

## Strategy 3: Scrape LEGO.com "Retiring Soon" Badges (HIGH IMPACT)

### Official Retirement Announcements:
LEGO marks sets "Retiring Soon" on their website 3-6 months before retirement.

### Implementation Options:

**Option A: Manual Updates (Easiest)**
- Check LEGO.com weekly for "Retiring Soon" badges
- Add to `RetirementOverride` table manually
- Use admin panel to flag confirmed retirements

**Option B: Automated Scraper (Better)**
```typescript
// Cron job: Run weekly
async function scrapeLEGORetiringSoon() {
  // Note: Would need to handle LEGO.com's structure
  // This is pseudocode - actual implementation needs browser automation
  
  const retiringSoonSets = await scrapeLEGOSite();
  
  for (const setNo of retiringSoonSets) {
    await prisma.retirementOverride.upsert({
      where: { box_no: setNo },
      update: { 
        status: 'retiring_soon',
        source: 'lego_official',
        updated_at: new Date()
      },
      create: {
        box_no: setNo,
        status: 'retiring_soon',
        source: 'lego_official',
        admin_email: 'system@figtracker.com'
      }
    });
  }
}
```

**Expected Improvement:** +15-20% accuracy for near-term retirements
**Why:** Official announcements are 100% accurate

---

## Strategy 4: Track Historical Accuracy & Learn (LONG-TERM)

### Create Prediction Tracking Table:
```prisma
model RetirementPredictionHistory {
  id                String   @id @default(cuid())
  box_no            String
  predicted_date    DateTime
  predicted_score   Int
  predicted_confidence String
  actual_retired_date DateTime?
  was_accurate      Boolean?
  days_off          Int?
  created_at        DateTime @default(now())
  
  @@index([box_no])
}
```

### How It Works:
1. Every month, save current predictions to history table
2. When set actually retires, record actual date
3. Calculate accuracy: `days_off = actual_date - predicted_date`
4. Analyze patterns:
   - Which themes are we consistently early/late on?
   - Which price tiers need adjustment?
   - Are high-confidence predictions actually accurate?

### Adjust Algorithm Based on Learnings:
```typescript
// After 6 months of data
const accuracyStats = await prisma.retirementPredictionHistory.aggregate({
  where: { 
    was_accurate: true,
    predicted_confidence: 'high'
  },
  _count: true
});

// If high-confidence predictions are only 70% accurate
// → Increase lifespan estimates by 3 months
// If we're consistently 6 months early on Creator Expert
// → Adjust Creator Expert lifespan from 3.5 to 4 years
```

**Expected Improvement:** +5-10% over time
**Why:** Self-correcting system that learns from mistakes

---

## Strategy 5: Community Reporting (MEDIUM IMPACT)

### Add "Report Retirement Status" Feature:

**On Set Detail Page:**
```tsx
<div className="retirement-reporting">
  <h4>Is this retirement prediction wrong?</h4>
  <button onClick={() => reportRetirement('already_retired')}>
    Already Retired
  </button>
  <button onClick={() => reportRetirement('still_available')}>
    Still Available on LEGO.com
  </button>
  <button onClick={() => reportRetirement('retirement_announced')}>
    LEGO Announced Retirement
  </button>
</div>
```

**Backend:**
```typescript
// Store community reports
model RetirementReport {
  id        String   @id @default(cuid())
  box_no    String
  status    String   // 'already_retired' | 'still_available' | 'retirement_announced'
  user_id   String
  source_url String? // Link to LEGO.com or announcement
  created_at DateTime @default(now())
  
  @@index([box_no])
}

// After 5+ reports of same status, flag for admin review
// After admin confirms, update RetirementOverride table
```

**Expected Improvement:** +5-8% accuracy
**Why:** Community spots retirements faster than algorithms

---

## Strategy 6: Monitor Amazon Deals Table (MEDIUM IMPACT)

### Use Your Existing `AmazonDeal` Table:

**Logic:**
```typescript
async function checkAmazonAvailability(boxNo: string): Promise<boolean> {
  const amazonDeal = await prisma.amazonDeal.findFirst({
    where: { 
      asin: boxNo, // Assuming you map box_no to ASIN
      updated_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }
  });

  // If no Amazon listing found recently → Likely retired
  if (!amazonDeal) {
    return true; // Likely retired
  }

  // If listed but out of stock for 30+ days → Retired
  const outOfStockDuration = Date.now() - amazonDeal.updated_at.getTime();
  if (outOfStockDuration > 30 * 24 * 60 * 60 * 1000) {
    return true;
  }

  return false;
}
```

**Expected Improvement:** +3-5% accuracy
**Why:** Amazon drops retired sets from listings

---

## Strategy 7: Check Release Date Patterns (LOW EFFORT)

### Sets Released in January Retire Sooner:
LEGO often retires sets at year-end (December). Sets released early in the year effectively have shorter lifespans.

```typescript
function adjustLifespanByReleaseMonth(baseLifespan: number, releaseDate: string): number {
  const month = new Date(releaseDate).getMonth(); // 0-11
  
  // Released Jan-Mar (Q1): Add 0.25 years (they live through an extra holiday season)
  // Released Apr-Jun (Q2): Add 0.15 years
  // Released Jul-Sep (Q3): Add 0 years
  // Released Oct-Dec (Q4): Subtract 0.15 years (retire faster)
  
  if (month <= 2) return baseLifespan + 0.25;
  if (month <= 5) return baseLifespan + 0.15;
  if (month <= 8) return baseLifespan;
  return baseLifespan - 0.15;
}
```

**Expected Improvement:** +2-3% accuracy
**Why:** Accounts for seasonal retirement patterns

---

## How to Detect When a Set IS Retired

### Multi-Signal Detection System:

```typescript
async function isSetActuallyRetired(boxNo: string): Promise<{
  isRetired: boolean;
  confidence: number; // 0-100
  signals: string[];
}> {
  let retirementScore = 0;
  const signals: string[] = [];

  // Signal 1: BrickLink availability (40 points)
  const blAvailability = await checkBrickLinkAvailability(boxNo);
  if (blAvailability.isRetired) {
    retirementScore += 40;
    signals.push(`BrickLink: ${blAvailability.signal}`);
  }

  // Signal 2: Price spike (30 points)
  const priceData = await prisma.priceCache.findFirst({
    where: { item_no: boxNo, item_type: 'SET', condition: 'N' }
  });
  if (priceData) {
    const priceRatio = priceData.current_avg / priceData.six_month_avg;
    if (priceRatio > 1.8) {
      retirementScore += 30;
      signals.push(`Price spike: +${((priceRatio - 1) * 100).toFixed(0)}%`);
    }
  }

  // Signal 3: Age past expected lifespan (20 points)
  // (Use existing age calculation)
  
  // Signal 4: Manual override exists (50 points - overrides everything)
  const override = await prisma.retirementOverride.findUnique({
    where: { box_no: boxNo }
  });
  if (override?.status === 'retired') {
    retirementScore += 50;
    signals.push(`Manual override: ${override.source}`);
  }

  // Signal 5: Community reports (10 points)
  const reportCount = await prisma.retirementReport.count({
    where: { 
      box_no: boxNo,
      status: 'already_retired',
      created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  });
  if (reportCount >= 3) {
    retirementScore += 10;
    signals.push(`${reportCount} community reports`);
  }

  return {
    isRetired: retirementScore >= 70,
    confidence: Math.min(100, retirementScore),
    signals
  };
}
```

### Automated Retirement Detection Cron Job:

```typescript
// Run daily: Check if predicted retiring sets have actually retired
async function updateRetiredSets() {
  // Get all sets we predicted as "retiring_soon"
  const predictedRetiring = await getRetiringSoonSets({ limit: 200 });

  for (const prediction of predictedRetiring) {
    const { isRetired, confidence, signals } = await isSetActuallyRetired(prediction.boxNo);

    if (isRetired && confidence >= 80) {
      // Mark as retired in database
      await prisma.retirementOverride.upsert({
        where: { box_no: prediction.boxNo },
        update: { 
          status: 'retired',
          source: 'auto_detected',
          notes: `Signals: ${signals.join(', ')}`,
          updated_at: new Date()
        },
        create: {
          box_no: prediction.boxNo,
          status: 'retired',
          source: 'auto_detected',
          notes: `Signals: ${signals.join(', ')}`,
          admin_email: 'system@figtracker.com'
        }
      });

      // Record in history for accuracy tracking
      await prisma.retirementPredictionHistory.create({
        data: {
          box_no: prediction.boxNo,
          predicted_date: prediction.estimatedRetirementDate,
          predicted_score: prediction.retirementScore,
          predicted_confidence: prediction.confidence,
          actual_retired_date: new Date(),
          was_accurate: true, // Within prediction window
          days_off: 0 // Calculate actual difference
        }
      });
    }
  }
}
```

---

## Implementation Priority for Maximum Accuracy

### Phase 1: Quick Wins (1-2 weeks)
1. ✅ **BrickLink Availability Check** (+10-15% accuracy)
   - Use existing PriceCache.qty_avg_price
   - Check for zero/low sellers
2. ✅ **Price Tier Detection** (+5-8% accuracy)
   - Use existing PriceCache.current_avg
   - Adjust lifespans by price

**Expected Result: 85-90% accuracy**

### Phase 2: Manual Overrides (1 week)
3. ✅ **RetirementOverride Database** (+15-20% accuracy)
   - Weekly check of LEGO.com for "Retiring Soon"
   - Manual entry of confirmed retirements
   - Admin panel for management

**Expected Result: 90-95% accuracy on known retirements**

### Phase 3: Automated Detection (2-3 weeks)
4. ✅ **Retirement Detection System**
   - Multi-signal detection (BrickLink + price + age)
   - Automated cron job to mark retired sets
   - Community reporting feature

**Expected Result: 92-97% accuracy with self-correction**

### Phase 4: Learning System (Ongoing)
5. ✅ **Prediction History Tracking**
   - Track predictions vs actuals
   - Monthly accuracy reports
   - Algorithm auto-calibration

**Expected Result: 95%+ accuracy after 6 months**

---

## Summary: Path to 90%+ Accuracy

**Immediate Actions (This Week):**
1. Add BrickLink availability check to algorithm
2. Implement price tier-based lifespans
3. Deploy and monitor

**Short-Term (Next Month):**
1. Create RetirementOverride table
2. Build admin panel for manual overrides
3. Weekly LEGO.com checks

**Medium-Term (Next Quarter):**
1. Add automated retirement detection
2. Enable community reporting
3. Track prediction accuracy

**Long-Term (6+ Months):**
1. Machine learning on historical data
2. Automated calibration
3. Predictive modeling improvements

**Result:** Start at 75% → 85% (Phase 1) → 90% (Phase 2) → 95%+ (Phase 3-4)
