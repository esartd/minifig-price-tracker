# Retirement Prediction Validation Guide

## Our Top 20 Predictions (Current Algorithm)

### 2022 Sets (4 years old) - Our algorithm says Q4 2026
| Set # | Name | Theme | Our Score | Our Confidence |
|-------|------|-------|-----------|----------------|
| 21057-1 | Singapore | Architecture | 100 | High |
| 10297-1 | Boutique Hotel | Creator | 100 | High |
| 10299-1 | Real Madrid Stadium | Creator | 100 | High |
| 10298-1 | Vespa 125 | Creator | 100 | High |
| 10300-1 | Back to the Future | Creator | 100 | High |
| 4000038-1 | LEGO Campus | Architecture | 100 | High |
| 75341-1 | Luke's Landspeeder UCS | Star Wars | 100 | High |
| 21058-1 | Great Pyramid | Architecture | 100 | High |
| 10302-1 | Optimus Prime | Creator | 100 | High |
| 10303-1 | Loop Coaster | Creator | 100 | High |
| 10304-1 | Camaro Z28 | Creator | 100 | High |
| 10306-1 | Atari 2600 | Creator | 100 | High |
| 10308-1 | Holiday Main Street | Creator | 100 | High |
| 75331-1 | Razor Crest UCS | Star Wars | 100 | High |

### 2023 Sets (3 years old) - Our algorithm says Q4 2026
| Set # | Name | Theme | Our Score | Our Confidence |
|-------|------|-------|-----------|----------------|
| 41724-1 | Paisley's House | Friends | 100 | High |
| 41727-1 | Dog Rescue Center | Friends | 100 | High |
| 41728-1 | Downtown Diner | Friends | 100 | High |
| 41731-1 | International School | Friends | 100 | High |
| 41730-1 | Autumn's House | Friends | 100 | High |
| 75575-1 | Ilu Discovery | Avatar | 100 | High |

---

## Validation Checklist

### Step 1: Check BrickEconomy Predictions
Visit: https://www.brickeconomy.com/sets/retiring-soon

**Instructions:**
1. Look for sets from our list
2. Note what BrickEconomy predicts for retirement date
3. Compare confidence levels

**Record findings:**
```
Set: 10297-1 Boutique Hotel
- BrickEconomy Status: [Retiring Soon / Still Available / Already Retired]
- BrickEconomy Predicted Date: [Q? 2026/2027]
- Our Prediction: Q4 2026
- Match? [Yes/No]
```

### Step 2: Check LEGO.com Official Status
Visit: https://www.lego.com/en-us/product/[set-number]

**Check these specific sets:**
- 10297-1 (Boutique Hotel)
- 75341-1 (Luke's Landspeeder UCS)
- 10302-1 (Optimus Prime)
- 75331-1 (Razor Crest UCS)

**Look for:**
- "Retiring Soon" badge on product page
- "Hard to Find" badge
- "Out of Stock" / "Available" status

**Record findings:**
```
Set: 10297-1 Boutique Hotel
- LEGO.com Status: [Available / Retiring Soon / Out of Stock]
- Has retirement badge? [Yes/No]
- If yes, what does it say?
```

### Step 3: Check Brickset Community Data
Visit: https://brickset.com/sets/[set-number]

**Check "Status" field:**
- Available
- Retiring Soon
- Retired

**Record findings:**
```
Set: 10297-1 Boutique Hotel
- Brickset Status: [Available / Retiring Soon / Retired]
- Release Date: [confirms our 2022 data]
- Any retirement notes in comments?
```

### Step 4: Reddit r/lego EOL Discussions
Search: https://www.reddit.com/r/lego/search/?q=EOL+2026

**Look for:**
- "EOL List 2026" posts
- "Retiring Soon" discussions
- Community consensus on retirements

**Record findings:**
```
Sets mentioned in recent EOL discussions:
- [list sets from our predictions that appear]
- [note any sets NOT in our list but should be]
```

---

## Analysis Questions

### 1. **Are our 2022 sets (4 years old) actually retiring?**
Expected: YES for Creator Expert, Architecture, UCS
- These typically retire after 3-4 years
- If LEGO.com shows "Retiring Soon" → Algorithm is correct
- If still "Available" with no badge → We might be too aggressive

### 2. **Are our 2023 sets (3 years old) retiring too early?**
Expected: MAYBE for Friends, licensed themes
- Friends sets often retire faster (2-3 years)
- Licensed themes (Avatar) retire when license expires
- If NOT retiring yet → We need longer lifespan for these themes

### 3. **What are we MISSING?**
Check if BrickEconomy/LEGO.com show retiring sets we DON'T predict:
- Older sets (2020-2021) that should have already retired?
- Specific themes we underestimate?
- Licensed sets with known license expiration?

---

## Scoring Calibration

Based on validation, adjust these thresholds in `lib/retiring-soon-algorithm.ts`:

### Current Theme Lifespans (lines 26-155):
```typescript
UCS/Icons: 4 years
Star Wars/Marvel: 2 years
Creator Expert/Architecture: 3.5 years
Friends: 2.5 years (default)
```

### Potential Adjustments:
- If 2022 sets NOT retiring yet → Increase Creator/Architecture to 4.5 years
- If 2023 Friends sets retiring → Keep at 2.5 years
- If missing 2021 UCS sets → Check our filtering logic

---

## Expected Validation Results

### Best Case (Algorithm is accurate):
- ✅ 80%+ of our 2022 predictions match BrickEconomy
- ✅ LEGO.com shows "Retiring Soon" for several of our top predictions
- ✅ Brickset confirms retirement status
- ✅ We're not missing major retirements from other sources

### Needs Calibration:
- ⚠️ 50-80% match → Adjust some theme lifespans
- ⚠️ We predict sets that others say are still available → Too aggressive
- ⚠️ We miss sets that others say are retiring → Too conservative

### Major Issues:
- ❌ <50% match → Rethink algorithm entirely
- ❌ All our predictions are wrong → Wrong lifespan assumptions
- ❌ We're completely missing obvious retirements → Add manual overrides

---

## Next Steps After Validation

### If Validation is Good (80%+ accuracy):
1. Proceed with Phase 4A integrations (set detail warnings, homepage teaser, theme banners)
2. Add manual overrides for the 20% we got wrong
3. Track accuracy over time

### If Needs Calibration (50-80%):
1. Adjust theme lifespans based on findings
2. Add price tier detection (Phase 4B #5) to improve accuracy
3. Re-validate after adjustments
4. Then proceed with integrations

### If Major Issues (<50%):
1. Add manual overrides system FIRST (Phase 4C)
2. Manually curate known retirements from BrickEconomy/LEGO.com
3. Use algorithm as secondary signal only
4. Build historical tracking to improve algorithm over time

---

## Template for Reporting Back

Please share findings in this format:

**BrickEconomy Validation:**
- Sets checked: [number]
- Matches our predictions: [number / percentage]
- Notable differences: [describe]

**LEGO.com Validation:**
- Sets checked: [number]
- Have "Retiring Soon" badge: [number]
- Out of stock: [number]
- Still available: [number]

**Brickset Validation:**
- Sets checked: [number]
- Marked "Retiring Soon": [number]
- Marked "Available": [number]

**Overall Assessment:**
- Accuracy estimate: [percentage]
- Recommended action: [Proceed / Calibrate / Major Changes Needed]
- Specific adjustments: [list if needed]
