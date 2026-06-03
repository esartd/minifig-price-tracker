/**
 * Generate SEO descriptions for LEGO sets using Claude API
 * Similar to minifig descriptions but for sets
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prisma = new PrismaClient();

interface LegoSet {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string;
}

// Load all sets from boxes.json
function loadAllSets(): LegoSet[] {
  const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
  const data = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));
  return data;
}

// Generate description in all 4 languages for a single set
async function generateSetDescription(set: LegoSet): Promise<{
  en: string;
  de: string;
  fr: string;
  es: string;
}> {
  const prompt = `Generate SEO-optimized product descriptions for the LEGO set "${set.name}" (Set #${set.box_no}).

Context:
- Theme: ${set.category_name}
- Year Released: ${set.year_released || 'Unknown'}
- This is a LEGO set (not a minifigure)

Write 4 descriptions (one per language) following these rules:

**English (en):**
- 2-3 sentences, ~50-80 words
- Natural, engaging tone
- Include: theme, year, what makes it special/collectible
- Use keywords: "LEGO set", set number, theme name
- Focus on collectibility, display value, play features
- Example tone: "The ${set.name} is a ${set.category_name} LEGO set released in ${set.year_released}. This detailed build features..."

**German (de):**
- Same guidelines but in German
- Use "LEGO-Set" or "LEGO Set"

**French (fr):**
- Same guidelines but in French
- Use "set LEGO" or "ensemble LEGO"

**Spanish (es):**
- Same guidelines but in Spanish
- Use "set de LEGO" or "conjunto LEGO"

Format your response as JSON:
{
  "en": "English description here",
  "de": "German description here",
  "fr": "French description here",
  "es": "Spanish description here"
}

Only return the JSON, no other text.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
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
    throw new Error('No JSON found in response');
  }

  const descriptions = JSON.parse(jsonMatch[0]);
  return descriptions;
}

// Save descriptions to database
async function saveSetDescription(
  boxNo: string,
  descriptions: { en: string; de: string; fr: string; es: string }
) {
  const set = await prisma.setCatalog.findUnique({
    where: { box_no: boxNo },
  });

  if (set) {
    // Update existing
    await prisma.setCatalog.update({
      where: { box_no: boxNo },
      data: {
        description_en: descriptions.en,
        description_de: descriptions.de,
        description_fr: descriptions.fr,
        description_es: descriptions.es,
        description_generated_at: new Date(),
        description_status: 'completed',
      },
    });
  } else {
    // Create new entry (shouldn't happen if catalog is seeded)
    const boxesData = loadAllSets();
    const setData = boxesData.find((s) => s.box_no === boxNo);
    if (!setData) return;

    await prisma.setCatalog.create({
      data: {
        box_no: boxNo,
        name: setData.name,
        category_id: 0, // Will be populated from boxes.json
        category_name: setData.category_name,
        year_released: setData.year_released,
        weight_grams: null,
        search_name: setData.name.toLowerCase(),
        description_en: descriptions.en,
        description_de: descriptions.de,
        description_fr: descriptions.fr,
        description_es: descriptions.es,
        description_generated_at: new Date(),
        description_status: 'completed',
      },
    });
  }
}

async function main() {
  const sets = loadAllSets();
  console.log(`📦 Total sets to process: ${sets.length}`);

  // Check how many already have descriptions
  const existing = await prisma.setCatalog.count({
    where: { description_status: 'completed' },
  });
  console.log(`✅ Already completed: ${existing}`);
  console.log(`⏳ Remaining: ${sets.length - existing}`);

  // Get sets that need descriptions
  const setsNeedingDescriptions = sets.filter(async (set) => {
    const exists = await prisma.setCatalog.findUnique({
      where: { box_no: set.box_no },
    });
    return !exists || exists.description_status !== 'completed';
  });

  let processed = 0;
  let errors = 0;

  for (const set of sets) {
    try {
      // Check if already done
      const existing = await prisma.setCatalog.findUnique({
        where: { box_no: set.box_no },
      });

      if (existing?.description_status === 'completed') {
        processed++;
        if (processed % 100 === 0) {
          console.log(`⏭️  Skipped ${processed}/${sets.length} (already done)`);
        }
        continue;
      }

      // Generate descriptions
      console.log(`\n🔨 Generating: ${set.box_no} - ${set.name}`);
      const descriptions = await generateSetDescription(set);

      // Save to database
      await saveSetDescription(set.box_no, descriptions);

      processed++;
      console.log(`✅ [${processed}/${sets.length}] ${set.box_no} - Success`);
      console.log(`   EN: ${descriptions.en.substring(0, 60)}...`);

      // Rate limiting: 1 request per second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      errors++;
      console.error(`❌ Error processing ${set.box_no}:`, error);

      // Mark as failed
      try {
        await prisma.setCatalog.upsert({
          where: { box_no: set.box_no },
          create: {
            box_no: set.box_no,
            name: set.name,
            category_id: 0,
            category_name: set.category_name,
            year_released: set.year_released,
            weight_grams: null,
            search_name: set.name.toLowerCase(),
            description_status: 'failed',
          },
          update: {
            description_status: 'failed',
          },
        });
      } catch (dbError) {
        console.error('Failed to mark as failed:', dbError);
      }

      // Continue on error
      continue;
    }
  }

  console.log(`\n\n📊 Final Stats:`);
  console.log(`   Total: ${sets.length}`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Success Rate: ${((processed / sets.length) * 100).toFixed(1)}%`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
