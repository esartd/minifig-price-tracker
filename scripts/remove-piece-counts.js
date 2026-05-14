/**
 * Remove unreliable piece counts from all descriptions
 * The 'weight' field in boxes.json is inconsistent - sometimes it's piece count,
 * sometimes it's actual weight in grams. This causes incorrect descriptions.
 *
 * Solution: Remove piece count from all descriptions, keep only name, theme, and year.
 */

const fs = require('fs');
const path = require('path');

const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
const boxes = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));

let updatedCount = 0;

console.log('🧹 REMOVING PIECE COUNTS FROM ALL DESCRIPTIONS...\n');
console.log('Reason: weight field contains inconsistent data (mix of piece counts and grams)\n');

for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];
  const name = box.name || 'Set';
  const category = box.category_name || '';
  const year = box.year_released || '';

  // Generate descriptions WITHOUT piece counts
  const templates = {
    en: category && year
      ? `${name} from the ${category} theme was released in ${year}.`
      : category
      ? `${name} from the ${category} theme.`
      : year
      ? `${name} was released in ${year}.`
      : `${name}.`,

    de: category && year
      ? `${name} aus dem ${category}-Thema wurde ${year} veröffentlicht.`
      : category
      ? `${name} aus dem ${category}-Thema.`
      : year
      ? `${name} wurde ${year} veröffentlicht.`
      : `${name}.`,

    fr: category && year
      ? `${name} du thème ${category} a été publié en ${year}.`
      : category
      ? `${name} du thème ${category}.`
      : year
      ? `${name} a été publié en ${year}.`
      : `${name}.`,

    es: category && year
      ? `${name} del tema ${category} fue lanzado en ${year}.`
      : category
      ? `${name} del tema ${category}.`
      : year
      ? `${name} fue lanzado en ${year}.`
      : `${name}.`
  };

  boxes[i].description_en = templates.en;
  boxes[i].description_de = templates.de;
  boxes[i].description_fr = templates.fr;
  boxes[i].description_es = templates.es;

  updatedCount++;

  if (updatedCount % 1000 === 0) {
    console.log(`✅ Processed ${updatedCount.toLocaleString()} sets...`);
  }
}

console.log(`\n💾 Saving cleaned descriptions...`);
fs.writeFileSync(boxesPath, JSON.stringify(boxes, null, 2), 'utf-8');

console.log(`\n✅ CLEANUP COMPLETE!`);
console.log(`📊 Updated ${updatedCount.toLocaleString()} sets`);
console.log(`✨ Descriptions now contain: name, theme, year`);
console.log(`🚫 REMOVED: piece counts (unreliable data)`);
