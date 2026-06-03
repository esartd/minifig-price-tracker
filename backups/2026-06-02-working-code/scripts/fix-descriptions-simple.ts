/**
 * Generate better set descriptions using Claude's knowledge
 * No web search needed - Claude knows popular LEGO sets
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface LegoSet {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string;
  [key: string]: any;
}

function loadSets(): LegoSet[] {
  const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
  return JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));
}

function saveSets(sets: LegoSet[]) {
  const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
  fs.writeFileSync(boxesPath, JSON.stringify(sets, null, 2), 'utf-8');
}

async function generateDescription(set: LegoSet) {
  const prompt = `Write a detailed, factual description for this LEGO set:

**Set:** ${set.name} (${set.box_no})
**Theme:** ${set.category_name}
**Year:** ${set.year_released}

**Requirements:**
- Write in English only (we'll translate later)
- 2-3 sentences, ~70-90 words
- Include SPECIFIC details you know about this set:
  * Piece count (if known)
  * Key features (opening doors, moving parts, lights, etc.)
  * Included minifigures by NAME (not just "includes minifigures")
  * What scenes or locations it recreates
  * Notable building techniques or unique elements
  * Size/scale details

**CRITICAL:**
- NO generic filler like "features high-quality bricks", "perfect for collectors", "detailed instructions"
- If you don't know specific details, write a SHORT factual description about what the set depicts
- Be honest - if it's a simple set, say so
- Focus on what makes it unique or interesting

**Good example (if you knew details):**
"The UCS Millennium Falcon features 7,541 pieces including rotating turrets, detailed cockpit, and removable panels revealing corridors. Includes Han Solo, Chewbacca, Leia, C-3PO, and BB-8. Measures over 33 inches long."

**Good example (if unknown set):**
"This 1982 Town set includes classic town minifigures in various professions. Features simple building designs typical of early LEGO Town sets with basic vehicles and buildings."

Return ONLY the description text, no other commentary.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  return content.type === 'text' ? content.text.trim() : null;
}

async function main() {
  const sets = loadSets();
  
  // Test with just a few popular sets first
  const testSets = sets.filter(s => 
    s.box_no === '75192-1' || // Millennium Falcon
    s.box_no === '75313-1' || // AT-AT
    s.box_no === '75331-1' || // Razor Crest
    s.box_no === '76419-1' || // Hogwarts Castle
    s.box_no === '21348-1'    // Titanic
  );

  console.log(`Testing with ${testSets.length} sets...`);

  for (const set of testSets) {
    console.log(`\nGenerating: ${set.name} (${set.box_no})`);
    
    const desc = await generateDescription(set);
    if (desc && !desc.includes('high-quality bricks') && !desc.includes('perfect for collectors')) {
      console.log(`✅ ${desc.substring(0, 100)}...`);
      
      const index = sets.findIndex(s => s.box_no === set.box_no);
      if (index !== -1) {
        sets[index].description_en = desc;
      }
    } else {
      console.log(`⏭️  Skipped (generic or invalid)`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }

  saveSets(sets);
  console.log('\n✅ Saved updated descriptions');
}

main().catch(console.error);
