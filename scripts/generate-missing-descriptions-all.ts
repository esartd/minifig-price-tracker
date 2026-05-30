/**
 * Generate SEO descriptions for ALL minifigs missing descriptions
 *
 * Strategy: Process in batches of 50 to avoid overwhelming the API
 * Prioritize by category popularity
 */

import { PrismaClient } from '@prisma/client-hostinger';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

const BATCH_SIZE = 50;
const PRIORITY_CATEGORIES = [
  'Friends',
  'Town / City',
  'Town / Classic Town',
  'Town',
  'Town / City / Police',
  'Harry Potter',
  'Minecraft',
  'Town / City / Fire',
  'Super Heroes / Batman II',
  'Super Heroes / Marvel Super Heroes',
  'NEXO KNIGHTS',
  'LEGENDS OF CHIMA',
  'Monkie Kid'
];

async function generateDescriptions() {
  try {
    console.log('🔍 Finding minifigs without descriptions...\n');

    // Get missing minifigs by priority categories
    for (const category of PRIORITY_CATEGORIES) {
      const missing = await prisma.minifigCatalog.findMany({
        where: {
          category_name: category,
          OR: [
            { description_en: null },
            { description_en: '' }
          ]
        },
        select: {
          minifigure_no: true,
          name: true,
          category_name: true,
          year_released: true
        },
        take: BATCH_SIZE
      });

      if (missing.length === 0) {
        console.log(`✅ ${category}: All descriptions complete`);
        continue;
      }

      console.log(`\n📝 Generating descriptions for ${category} (${missing.length} minifigs)...\n`);

      // Build prompt with all minifigs in this batch
      const minifigList = missing.map((m, idx) =>
        `${idx + 1}. ${m.minifigure_no} - ${m.name} (${m.year_released || 'unknown year'})`
      ).join('\n');

      const prompt = `Generate SEO-optimized product descriptions for these LEGO minifigures from the "${category}" theme.

For each minifigure, write a 2-3 sentence description that:
- Describes the character/figure and what makes it unique
- Mentions the theme/series it's from
- Highlights key features (outfit, accessories, design elements)
- Uses keywords naturally for SEO (LEGO, minifigure, collectible)
- Sounds professional and informative

Minifigures:
${minifigList}

Return ONLY a JSON array with this exact format:
[
  {
    "minifigure_no": "fig001234",
    "description": "Your description here."
  },
  ...
]

Be concise, accurate, and professional. Do not add commentary.`;

      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        });

        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Unexpected response type');
        }

        // Parse JSON response
        const jsonMatch = content.text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No JSON array found in response');
        }

        const descriptions = JSON.parse(jsonMatch[0]);

        // Save to database
        let saved = 0;
        for (const desc of descriptions) {
          try {
            await prisma.minifigCatalog.update({
              where: { minifigure_no: desc.minifigure_no },
              data: {
                description_en: desc.description,
                description_status: 'completed',
                description_generated_at: new Date()
              }
            });
            saved++;
            console.log(`✅ ${desc.minifigure_no}: ${desc.description.substring(0, 60)}...`);
          } catch (err) {
            console.error(`❌ Failed to save ${desc.minifigure_no}:`, err);
          }
        }

        console.log(`\n✨ Saved ${saved}/${missing.length} descriptions for ${category}\n`);

        // Rate limiting: wait 2 seconds between batches
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error: any) {
        console.error(`❌ Error generating descriptions for ${category}:`, error.message);
        continue;
      }
    }

    console.log('\n🎉 Description generation complete!\n');

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateDescriptions();
