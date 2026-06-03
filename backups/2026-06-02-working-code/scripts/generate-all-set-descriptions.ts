import fs from 'fs';
import path from 'path';

interface LegoBox {
  box_no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released: string;
  weight: string;
  size: string | null;
  image_url: string;
  thumbnail_url: string;
  updated_at: string;
  // NEW FIELDS
  description_en?: string;
  description_de?: string;
  description_fr?: string;
  description_es?: string;
}

function generateEnglishDescription(box: LegoBox): string {
  const year = box.year_released || 'unknown year';
  const category = box.category_name;
  const name = box.name;

  return `This LEGO ${name} set (${box.box_no}) from the ${category} theme was released in ${year}. This collectible LEGO set features detailed building instructions, authentic minifigures, and high-quality LEGO bricks that make it valuable for collectors and builders. The set represents LEGO's commitment to quality construction and creative design within the ${category} universe. Perfect for collectors building themed displays, completing set collections, or recreating scenes from their favorite ${category} sets, this LEGO set brings creativity and building possibilities to any LEGO collection.`;
}

function generateGermanDescription(box: LegoBox): string {
  const year = box.year_released || 'unbekanntes Jahr';
  const category = box.category_name;
  const name = box.name;

  return `Dieses LEGO ${name} Set (${box.box_no}) aus dem ${category} Thema wurde ${year} veröffentlicht. Dieses sammelbare LEGO Set verfügt über detaillierte Bauanleitungen, authentische Minifiguren und hochwertige LEGO Steine, die es für Sammler und Baumeister wertvoll machen. Das Set repräsentiert LEGOs Engagement für hochwertige Konstruktion und kreatives Design innerhalb des ${category} Universums. Perfekt für Sammler, die thematische Displays erstellen, Set-Sammlungen vervollständigen oder Szenen aus ihren Lieblings-${category}-Sets nachstellen möchten, bringt dieses LEGO Set Kreativität und Baumöglichkeiten in jede LEGO-Sammlung.`;
}

function generateFrenchDescription(box: LegoBox): string {
  const year = box.year_released || 'année inconnue';
  const category = box.category_name;
  const name = box.name;

  return `Cet ensemble LEGO ${name} (${box.box_no}) du thème ${category} a été publié en ${year}. Cet ensemble LEGO de collection présente des instructions de construction détaillées, des minifigurines authentiques et des briques LEGO de haute qualité qui le rendent précieux pour les collectionneurs et les constructeurs. L'ensemble représente l'engagement de LEGO envers une construction de qualité et un design créatif au sein de l'univers ${category}. Parfait pour les collectionneurs qui construisent des présentoirs thématiques, complètent des collections d'ensembles ou recréent des scènes de leurs ensembles ${category} préférés, cet ensemble LEGO apporte créativité et possibilités de construction à toute collection LEGO.`;
}

function generateSpanishDescription(box: LegoBox): string {
  const year = box.year_released || 'año desconocido';
  const category = box.category_name;
  const name = box.name;

  return `Este set LEGO ${name} (${box.box_no}) del tema ${category} fue lanzado en ${year}. Este set LEGO coleccionable presenta instrucciones de construcción detalladas, minifiguras auténticas y ladrillos LEGO de alta calidad que lo hacen valioso para coleccionistas y constructores. El set representa el compromiso de LEGO con la construcción de calidad y el diseño creativo dentro del universo ${category}. Perfecto para coleccionistas que construyen exhibiciones temáticas, completan colecciones de sets o recrean escenas de sus sets ${category} favoritos, este set LEGO aporta creatividad y posibilidades de construcción a cualquier colección LEGO.`;
}

async function generateAllDescriptions() {
  console.log('🚀 Starting LEGO set description generation...\n');

  const boxesPath = path.join(process.cwd(), 'public/catalog/boxes.json');

  // Read existing boxes
  const fileContent = fs.readFileSync(boxesPath, 'utf-8');
  const boxes: LegoBox[] = JSON.parse(fileContent);

  console.log(`📦 Found ${boxes.length} LEGO sets\n`);

  // Generate descriptions for all boxes
  let processed = 0;
  for (const box of boxes) {
    box.description_en = generateEnglishDescription(box);
    box.description_de = generateGermanDescription(box);
    box.description_fr = generateFrenchDescription(box);
    box.description_es = generateSpanishDescription(box);

    processed++;
    if (processed % 1000 === 0) {
      console.log(`✅ ${processed}/${boxes.length} (${((processed/boxes.length)*100).toFixed(1)}%)`);
    }
  }

  console.log(`✅ ${processed}/${boxes.length} (100.0%)\n`);

  // Write back to file
  console.log('💾 Writing updated boxes.json...');
  fs.writeFileSync(boxesPath, JSON.stringify(boxes, null, 2), 'utf-8');

  console.log(`\n🎉 Complete! Generated ${processed * 4} descriptions (${processed} sets × 4 languages)`);
  console.log(`📄 File updated: public/catalog/boxes.json`);
}

generateAllDescriptions().catch(console.error);
