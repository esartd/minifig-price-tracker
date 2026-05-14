/**
 * Regenerate LEGO set descriptions with actual details
 * Uses Claude to research and write detailed descriptions
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not found in .env.local');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface LegoSet {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string;
  description_en?: string;
  description_de?: string;
  description_fr?: string;
  description_es?: string;
}

// Load all sets from boxes.json
function loadAllSets(): LegoSet[] {
  const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
  const data = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));
  return data;
}

// Save updated descriptions back to boxes.json
function saveDescriptions(sets: LegoSet[]) {
  const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
  fs.writeFileSync(boxesPath, JSON.stringify(sets, null, 2), 'utf-8');
}

// Generate description with web search for actual details
async function generateSetDescription(set: LegoSet): Promise<{
  en: string;
  de: string;
  fr: string;
  es: string;
} | null> {
  try {
    const prompt = `Research and write detailed SEO descriptions for LEGO set "${set.name}" (${set.box_no}).

**Your task:**
1. Use web search to find REAL details about this set:
   - Piece count
   - Key features (opening doors, moving parts, unique elements)
   - Included minifigures (names, not just count)
   - Specific scenes or locations it recreates
   - Scale or size details
   - Why it's notable or collectible

2. Write 4 factual descriptions (one per language) that mention SPECIFIC details.

**Context:**
- Theme: ${set.category_name}
- Year Released: ${set.year_released || 'Unknown'}
- Set Number: ${set.box_no}

**Rules for ALL languages:**
- 2-3 sentences, ~60-90 words
- MUST include specific details (piece count, features, minifigs)
- NO generic filler ("detailed building instructions", "quality bricks", "perfect for collectors")
- Focus on what makes THIS set unique
- Natural, engaging tone
- SEO keywords: set number, theme name, character/vehicle names

**Format as JSON:**
{
  "en": "English description with SPECIFIC details",
  "de": "German description with SPECIFIC details",
  "fr": "French description with SPECIFIC details",
  "es": "Spanish description with SPECIFIC details"
}

**Example good description (Star Wars Millennium Falcon):**
"The UCS Millennium Falcon features 7,541 pieces including rotating gun turrets, detailed cockpit, removable hull panels revealing interior corridors, holochess table, and engineering bay. This ${set.year_released} release includes Han Solo, Chewbacca, Princess Leia, C-3PO, and BB-8 minifigures. At over 33 inches long, it's one of the largest LEGO sets ever produced."

**Example BAD description (what NOT to write):**
"This collectible LEGO set features detailed building instructions and high-quality bricks. Perfect for collectors building themed displays or completing collections."

Only return the JSON, no other text.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`No JSON found in response for ${set.box_no}`);
      return null;
    }

    const descriptions = JSON.parse(jsonMatch[0]);

    // Validate we got actual details (not generic filler)
    if (descriptions.en.includes('detailed building instructions') ||
        descriptions.en.includes('quality bricks') ||
        descriptions.en.includes('perfect for collectors')) {
      console.warn(`Generic description generated for ${set.box_no}, skipping`);
      return null;
    }

    return descriptions;
  } catch (error) {
    console.error(`Error generating description for ${set.box_no}:`, error);
    return null;
  }
}

async function main() {
  const sets = loadAllSets();
  console.log(`📦 Total sets: ${sets.length}`);

  // Filter to sets that need better descriptions
  // Priority: Star Wars, popular themes, sets from last 10 years
  const prioritySets = sets.filter(set => {
    const year = parseInt(set.year_released);
    const isRecent = year >= 2015;
    const isStarWars = set.category_name.includes('Star Wars');
    const isUCS = set.category_name.includes('Ultimate Collector');
    const isPopular = set.category_name.includes('Harry Potter') ||
                      set.category_name.includes('Marvel') ||
                      set.category_name.includes('DC');

    return isRecent || isStarWars || isUCS || isPopular;
  });

  console.log(`🎯 Priority sets to regenerate: ${prioritySets.length}`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const set of prioritySets) {
    console.log(`\n🔨 Processing: ${set.box_no} - ${set.name}`);

    const descriptions = await generateSetDescription(set);

    if (descriptions) {
      // Update the set in the array
      const index = sets.findIndex(s => s.box_no === set.box_no);
      if (index !== -1) {
        sets[index].description_en = descriptions.en;
        sets[index].description_de = descriptions.de;
        sets[index].description_fr = descriptions.fr;
        sets[index].description_es = descriptions.es;
        updated++;
        console.log(`✅ Updated ${set.box_no}`);
        console.log(`   EN: ${descriptions.en.substring(0, 80)}...`);
      }
    } else {
      skipped++;
      console.log(`⏭️  Skipped ${set.box_no} (no valid description)`);
    }

    // Save progress every 10 sets
    if (updated % 10 === 0 && updated > 0) {
      saveDescriptions(sets);
      console.log(`💾 Progress saved (${updated} updated so far)`);
    }

    // Rate limiting: 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Final save
  saveDescriptions(sets);

  console.log(`\n\n📊 Final Stats:`);
  console.log(`   Total sets: ${sets.length}`);
  console.log(`   Priority sets: ${prioritySets.length}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`\n✅ Descriptions saved to boxes.json`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
