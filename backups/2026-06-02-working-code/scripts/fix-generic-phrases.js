/**
 * Remove generic template phrases and keep only factual information
 */

const fs = require('fs');
const path = require('path');

const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
const boxes = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));

let updatedCount = 0;

console.log('🧹 REMOVING GENERIC TEMPLATE PHRASES...\n');

for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];
  const desc = box.description_en || '';

  // Check if it has the new generic phrases
  if (desc.includes('Features high-quality LEGO bricks') ||
      desc.includes('Represents premium craftsmanship')) {

    const pieces = parseInt(box.weight) || 0;
    const name = box.name || 'Set';
    const category = box.category_name || '';
    const year = box.year_released || '';

    // Create SIMPLE factual description with NO generic phrases
    const templates = {
      en: pieces > 0
        ? `${name} contains ${pieces.toLocaleString()} pieces${category ? ` from the ${category} theme` : ''}${year ? `, released in ${year}` : ''}.`
        : `${name}${category ? ` from the ${category} theme` : ''}${year ? ` was released in ${year}` : ''}.`,

      de: pieces > 0
        ? `${name} enthält ${pieces.toLocaleString()} Teile${category ? ` aus dem ${category}-Thema` : ''}${year ? `, veröffentlicht ${year}` : ''}.`
        : `${name}${category ? ` aus dem ${category}-Thema` : ''}${year ? ` wurde ${year} veröffentlicht` : ''}.`,

      fr: pieces > 0
        ? `${name} comprend ${pieces.toLocaleString()} pièces${category ? ` du thème ${category}` : ''}${year ? `, publié en ${year}` : ''}.`
        : `${name}${category ? ` du thème ${category}` : ''}${year ? ` a été publié en ${year}` : ''}.`,

      es: pieces > 0
        ? `${name} contiene ${pieces.toLocaleString()} piezas${category ? ` del tema ${category}` : ''}${year ? `, lanzado en ${year}` : ''}.`
        : `${name}${category ? ` del tema ${category}` : ''}${year ? ` fue lanzado en ${year}` : ''}.`
    };

    boxes[i].description_en = templates.en;
    boxes[i].description_de = templates.de;
    boxes[i].description_fr = templates.fr;
    boxes[i].description_es = templates.es;

    updatedCount++;

    if (updatedCount % 1000 === 0) {
      console.log(`✅ Cleaned ${updatedCount} sets...`);
    }
  }
}

console.log(`\n💾 Saving cleaned descriptions...`);
fs.writeFileSync(boxesPath, JSON.stringify(boxes, null, 2), 'utf-8');

console.log(`\n✅ CLEANUP COMPLETE!`);
console.log(`📊 Removed generic phrases from ${updatedCount.toLocaleString()} sets`);
console.log(`✨ Descriptions now contain ONLY factual information (pieces, theme, year)`);
console.log(`🚫 NO MORE: "high-quality bricks", "premium craftsmanship", etc.`);
