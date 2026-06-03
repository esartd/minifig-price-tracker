# Swedish Translation Setup for FigTracker

## Current Status

- **English (en.json):** 1,698 lines, 326KB ✅
- **Swedish (sv.json):** 92 lines, 2.9KB ❌ (INCOMPLETE)
- **Target:** ~1,700 lines, ~330KB

## Required: Install Translation Library

To complete the Swedish translation, you need to install a translation library:

### Option 1: deep-translator (Recommended)

```bash
pip3 install deep-translator
```

Then run:
```bash
python3 translate_to_swedish.py
```

### Option 2: googletrans

```bash
pip3 install googletrans==4.0.0-rc1
```

Then run:
```bash
python3 translate_to_swedish_v2.py
```

## What the Script Does

1. Reads complete `en.json` (1,698 lines)
2. Translates ALL content to Swedish:
   - All 35 sections
   - All 100+ theme descriptions
   - All UI strings
   - All guide content
3. Preserves:
   - Brand names: "LEGO®", "BrickLink", "FigTracker"
   - Variables: `{count}`, `{theme}`, etc.
   - URLs
4. Applies Swedish LEGO terminology:
   - "klossar" (bricks)
   - "minifigurer" (minifigures)
   - "set" (sets)
5. Uses formal Swedish (ni form)
6. Overwrites `sv.json` with complete translation

## Expected Result

After running the script:
- **File size:** ~330KB (from 2.9KB)
- **Line count:** ~1,700 lines (from 92)
- **Completeness:** 100% (matching de.json, es.json, fr.json)

## Alternative: Manual Translation Service

If you prefer a professional translation service:

1. Export `en.json` content
2. Send to professional Swedish translator
3. Specify: formal Swedish (ni form), LEGO terminology
4. Import translated content to `sv.json`

## Files Created

- `translate_to_swedish.py` - Main script (uses deep-translator)
- `translate_to_swedish_v2.py` - Fallback script (uses googletrans)
- Both scripts do the same job, just use different libraries
