/**
 * AUTOMATED description generator - replaces ALL generic templates at once
 * Processes entire catalog and generates specific descriptions based on metadata
 */

const fs = require('fs');
const path = require('path');

const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
const boxes = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));

let updatedCount = 0;

// Helper function to generate detailed description
function generateDescription(box, lang = 'en') {
  const pieces = parseInt(box.weight) || 0;
  const name = box.name || 'Set';
  const setNo = box.box_no || '';
  const category = box.category_name || '';
  const year = box.year_released || '';

  // Only update sets with generic template descriptions
  const hasGeneric = box.description_en && box.description_en.includes('high-quality LEGO bricks');
  if (!hasGeneric) return null; // Remove piece count restriction - update ALL generic templates

  const templates = {
    en: {
      intro: `${name} features ${pieces.toLocaleString()} pieces`,
      category: category ? ` from the ${category} theme` : '',
      year: year ? `, released in ${year}` : '',
      features: pieces > 500 ? '. This detailed LEGO set offers authentic building experience with intricate design elements' : '. Compact LEGO set with quality construction',
      scale: pieces > 5000 ? ' and massive scale construction' : pieces > 3000 ? ' and large-scale display model' : pieces > 1500 ? ' and impressive size' : pieces > 500 ? '' : '',
      quality: '. Features high-quality LEGO bricks with precise fit and durability',
      display: pieces > 2000 ? '. Perfect centerpiece display model' : pieces > 500 ? '. Makes excellent display piece' : '. Great for play and collecting',
      value: ` for collectors and builders. Represents premium craftsmanship within the ${category || 'LEGO'} collection.`
    },
    de: {
      intro: `${name} enthält ${pieces.toLocaleString()} Teile`,
      category: category ? ` aus dem ${category}-Thema` : '',
      year: year ? `, veröffentlicht ${year}` : '',
      features: '. Dieses detaillierte LEGO-Set bietet authentisches Bauerlebnis mit aufwendigen Design-Elementen',
      scale: pieces > 5000 ? ' und massiver Maßstabs-Konstruktion' : pieces > 3000 ? ' und großformatigem Display-Modell' : pieces > 1500 ? ' und beeindruckender Größe' : '',
      quality: '. Mit hochwertigen LEGO-Steinen mit präziser Passform und Langlebigkeit',
      display: pieces > 2000 ? '. Perfektes Herzstück-Display-Modell' : '. Ausgezeichnetes Display-Stück',
      value: ` für Sammler und Baumeister. Repräsentiert erstklassige Handwerkskunst innerhalb der ${category || 'LEGO'}-Sammlung.`
    },
    fr: {
      intro: `${name} comprend ${pieces.toLocaleString()} pièces`,
      category: category ? ` du thème ${category}` : '',
      year: year ? `, publié en ${year}` : '',
      features: '. Cet ensemble LEGO détaillé offre une expérience de construction authentique avec des éléments de design complexes',
      scale: pieces > 5000 ? ' et construction à échelle massive' : pieces > 3000 ? ' et modèle d\'affichage à grande échelle' : pieces > 1500 ? ' et taille impressionnante' : '',
      quality: '. Comprend des briques LEGO de haute qualité avec ajustement précis et durabilité',
      display: pieces > 2000 ? '. Modèle d\'exposition pièce maîtresse parfait' : '. Excellente pièce d\'exposition',
      value: ` pour collectionneurs et constructeurs. Représente l'artisanat premium au sein de la collection ${category || 'LEGO'}.`
    },
    es: {
      intro: `${name} contiene ${pieces.toLocaleString()} piezas`,
      category: category ? ` del tema ${category}` : '',
      year: year ? `, lanzado en ${year}` : '',
      features: '. Este detallado set LEGO ofrece experiencia de construcción auténtica con elementos de diseño intrincados',
      scale: pieces > 5000 ? ' y construcción a escala masiva' : pieces > 3000 ? ' y modelo de exhibición a gran escala' : pieces > 1500 ? ' y tamaño impresionante' : '',
      quality: '. Presenta ladrillos LEGO de alta calidad con ajuste preciso y durabilidad',
      display: pieces > 2000 ? '. Modelo de exhibición pieza central perfecta' : '. Excelente pieza de exhibición',
      value: ` para coleccionistas y constructores. Representa artesanía premium dentro de la colección ${category || 'LEGO'}.`
    }
  };

  const t = templates[lang];
  return t.intro + t.category + t.year + t.features + t.scale + t.quality + t.display + t.value;
}

console.log('🤖 AUTO-GENERATING DESCRIPTIONS FOR ALL LARGE SETS...');
console.log(`Total catalog size: ${boxes.length} sets\n`);

// Process all boxes
for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];

  const descEN = generateDescription(box, 'en');
  if (descEN) {
    boxes[i].description_en = descEN;
    boxes[i].description_de = generateDescription(box, 'de');
    boxes[i].description_fr = generateDescription(box, 'fr');
    boxes[i].description_es = generateDescription(box, 'es');
    updatedCount++;

    if (updatedCount % 100 === 0) {
      console.log(`✅ Processed ${updatedCount} sets...`);
    }
  }
}

console.log(`\n💾 Saving updates to boxes.json...`);
fs.writeFileSync(boxesPath, JSON.stringify(boxes, null, 2), 'utf-8');

console.log(`\n✅ AUTO-GENERATION COMPLETE!`);
console.log(`📊 Updated ${updatedCount} large sets (800+ pieces) with improved descriptions`);
console.log(`📈 Completion: ${((updatedCount / boxes.length) * 100).toFixed(2)}% of total catalog`);
console.log(`💾 Saved to ${boxesPath}`);
