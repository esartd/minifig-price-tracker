import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface MinifigInput {
  minifigure_no: string;
  name: string;
  category_name: string;
  year_released: string | null;
}

interface DescriptionOutput {
  en: string;
  de: string;
  fr: string;
  es: string;
}

export async function generateMinifigDescription(
  minifig: MinifigInput
): Promise<DescriptionOutput> {
  const prompt = `Generate an SEO-optimized description for this LEGO minifigure in 4 languages (English, German, French, Spanish).

Minifigure Details:
- Name: ${minifig.name}
- ID: ${minifig.minifigure_no}
- Theme: ${minifig.category_name}
- Year: ${minifig.year_released || 'Unknown'}

Requirements for EACH language:
1. Length: 4-6 sentences (100-150 words total)
2. Structure:
   - Sentence 1-2: Character background and franchise context (what makes them recognizable)
   - Sentence 3-4: Special features, design details, accessories, unique elements
   - Sentence 5-6: Release year, theme significance, why collectible/valuable
3. Include keywords naturally: character name, theme, "LEGO minifigure"/"LEGO Minifigur"/"minifigurine LEGO"/"minifigura LEGO", year, "collectible"/"Sammler"/"collection"/"colección"
4. Engaging tone for collectors
5. Unique content (no generic filler like "this minifigure is...")
6. For special editions: Mention what makes them special (exclusive set, limited release, rare printing, etc.)

IMPORTANT: Generate native translations (not literal translations). Each language should read naturally to native speakers.

Return as JSON:
{
  "en": "English description here...",
  "de": "German description here...",
  "fr": "French description here...",
  "es": "Spanish description here..."
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an expert LEGO collector and multilingual content writer specializing in SEO-optimized product descriptions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }

  return JSON.parse(content) as DescriptionOutput;
}
