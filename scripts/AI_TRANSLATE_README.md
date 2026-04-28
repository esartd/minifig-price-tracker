# AI Translation Guide for FigTracker

## Current Status

✅ **Infrastructure Complete:**
- next-intl installed and configured
- Middleware set up for locale detection
- Translation files created at `/locales/`
- UI strings translated (German, French, Spanish)

⏳ **Pending:**
- 179 theme descriptions need AI translation (currently in English as placeholders)

## Translation Scope

**Total Content:**
- 179 theme descriptions
- ~200 words per description
- 3 target languages (German, French, Spanish)
- **Total: ~107,000 words to translate**

## How to Complete Translations

### Option 1: Use Claude AI (Recommended)

Since you're already using Claude, you can translate batches efficiently:

1. Extract themes in batches of 10-20
2. Ask Claude: "Translate these LEGO theme descriptions to German, French, and Spanish. Keep LEGO®, BrickLink, product names, and character names in English. Maintain enthusiastic SEO-friendly tone"
3. Copy translations into respective JSON files

### Option 2: Use DeepL API

DeepL Pro offers excellent translations:

```bash
# Install DeepL Python SDK
pip install deepl

# Run translation script
python scripts/translate-with-deepl.py
```

Cost: ~$0.02/1000 characters = ~$21 for all translations

### Option 3: Use ChatGPT/Claude API

Automate with API calls (requires API key):

```bash
export ANTHROPIC_API_KEY=your_key_here
python scripts/translate-with-claude-api.py
```

### Option 4: Professional Service

Export to XLIFF format, send to translation service:

- Gengo: ~$0.10/word = ~$3,600
- Smartling: ~$0.15/word = ~$5,400
- Unbabel: ~$0.08/word = ~$2,880

## File Structure

```
/locales/
  en.json  - ✅ Complete (master file)
  de.json  - ⚠️  UI complete, themes need translation
  fr.json  - ⚠️  UI complete, themes need translation
  es.json  - ⚠️  UI complete, themes need translation
```

## Translation Guidelines

**Keep in English:**
- Brand names: LEGO®, BrickLink, DUPLO®
- Character names: Luke Skywalker, Harry Potter, Batman
- Product IDs: sw1398, hp300, njo0974
- Theme names as keys: "Star Wars", "Harry Potter"

**Translate:**
- All description text
- Enthusiastic phrases: "Perfect for..." → "Perfekt für..." (DE)
- Action phrases: "Collect heroes" → "Sammle Helden" (DE)
- SEO keywords naturally integrated

**Tone:**
- Enthusiastic and engaging
- SEO-optimized (naturally mention key terms)
- ~150-200 words per description
- End with "Perfect for [target audience]"

## Priority Translation Order

**Tier 1 (Top 20 - Highest SEO value):**
1. Star Wars
2. Harry Potter  
3. NINJAGO
4. Super Heroes (Marvel/DC)
5. City
6. Friends
7. Minecraft
8. Jurassic World
9. Spider-Man
10. Batman
11. Avengers
12. Pirates of the Caribbean
13. Lord of the Rings
14. Disney Princess
15. Super Mario
16. Frozen
17. Technic
18. Creator
19. Architecture
20. Botanicals

**Tier 2 (Next 30 - Medium SEO value):**
Classic, Castle, Space, Pirates, Collectible Minifigures, etc.

**Tier 3 (Remaining 129 - Long-tail SEO):**
All other themes

## Testing Translations

After adding translations:

```bash
# Verify JSON is valid
node -e "require('./locales/de.json')"
node -e "require('./locales/fr.json')"  
node -e "require('./locales/es.json')"

# Build and test
npm run build
npm run dev

# Visit test URLs
# http://localhost:3000/de/themes/star-wars
# http://localhost:3000/fr/themes/harry-potter
# http://localhost:3000/es/themes/ninjago
```

## SEO Impact

**When complete:**
- 179 themes × 4 languages = **716 indexed pages**
- Each with unique ~200-word translated content
- Proper hreflang tags for Google
- Localized URLs for better regional rankings
- Target markets: Germany, Austria, Switzerland, France, Belgium, Spain, Latin America

**Expected organic traffic increase:** 30-50% from European markets

## Need Help?

- Check existing translations in `/locales/en.json` for examples
- Use consistent terminology across all descriptions
- Test one language first, then replicate to others
- Maintain JSON structure exactly (brackets, commas, quotes)
