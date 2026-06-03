import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Load minifigs catalog
const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));

// Theme name mappings for better descriptions
const themeNames: Record<string, string> = {
  'sw': 'Star Wars',
  'sh': 'Super Heroes',
  'hp': 'Harry Potter',
  'dis': 'Disney',
  'dp': 'Disney Princess',
  'mar': 'Super Mario',
  'min': 'Minecraft',
  'njo': 'NINJAGO',
  'cty': 'City',
  'frnd': 'Friends',
  'tlm': 'The LEGO Movie',
  'col': 'Collectible Minifigures',
  'cas': 'Castle',
  'pi': 'Pirates',
  'vik': 'Vikings',
  'spa': 'Space',
  'rac': 'Racers',
  'aqu': 'Aquazone',
  'atl': 'Atlantis',
  'loc': 'Castle',
  'nex': 'NEXO KNIGHTS',
  'elf': 'Elves',
  'scooby': 'Scooby-Doo',
  'simpsons': 'The Simpsons',
  'dim': 'LEGO Dimensions',
  'tlbm': 'The LEGO Batman Movie',
  'tlnm': 'The LEGO NINJAGO Movie',
  'jw': 'Jurassic World',
  'hs': 'Hidden Side',
  'vidiyo': 'VIDIYO',
  'coltlbm': 'The LEGO Batman Movie Series',
  'coltlnm': 'The LEGO NINJAGO Movie Series',
};

// Extract theme from minifigure number
function getTheme(minifigNo: string): string {
  for (const [prefix, theme] of Object.entries(themeNames)) {
    if (minifigNo.toLowerCase().startsWith(prefix)) {
      return theme;
    }
  }
  return 'LEGO';
}

// Generate description templates based on minifig data
function generateDescriptions(minifig: any) {
  const name = minifig.name;
  const theme = getTheme(minifig.minifigure_no);

  // Parse name for key details (outfit colors, accessories, variants)
  const hasColor = /\b(red|blue|green|yellow|black|white|orange|purple|pink|brown|gray|grey)\b/i.test(name);
  const hasOutfit = /\b(suit|armor|uniform|robe|cape|dress|shirt|jacket|vest)\b/i.test(name);
  const hasAccessory = /\b(sword|shield|helmet|weapon|gun|staff|wand|bow|axe)\b/i.test(name);

  // Generate English description
  let description_en = `${name} from the ${theme} theme`;

  if (hasColor && hasOutfit) {
    description_en += ` features distinctive outfit details`;
  } else if (hasAccessory) {
    description_en += ` comes with characteristic accessories`;
  }

  description_en += `. This minifigure represents a unique variant within the ${theme} collection`;

  if (theme === 'Star Wars') {
    description_en += `, capturing iconic characters and moments from the galaxy far, far away`;
  } else if (theme === 'Super Heroes') {
    description_en += `, bringing comic book heroes and villains to life`;
  } else if (theme === 'Harry Potter') {
    description_en += `, recreating magical moments from the wizarding world`;
  } else if (theme === 'NINJAGO') {
    description_en += `, embodying ninja warriors and their adventures`;
  } else if (theme === 'City') {
    description_en += `, depicting everyday heroes and community members`;
  } else if (theme === 'Castle') {
    description_en += `, bringing medieval knights and fantasy to life`;
  }

  description_en += `.`;

  // Generate German description
  let description_de = `${name} aus dem ${theme}-Thema`;

  if (hasColor && hasOutfit) {
    description_de += ` zeigt charakteristische Outfit-Details`;
  } else if (hasAccessory) {
    description_de += ` kommt mit charakteristischem Zubehör`;
  }

  description_de += `. Diese Minifigur repräsentiert eine einzigartige Variante innerhalb der ${theme}-Kollektion`;

  if (theme === 'Star Wars') {
    description_de += `, die ikonische Charaktere und Momente aus der weit, weit entfernten Galaxie einfängt`;
  } else if (theme === 'Super Heroes') {
    description_de += `, die Comic-Helden und Schurken zum Leben erweckt`;
  } else if (theme === 'Harry Potter') {
    description_de += `, die magische Momente aus der Zaubererwelt nachstellt`;
  } else if (theme === 'NINJAGO') {
    description_de += `, die Ninja-Krieger und ihre Abenteuer verkörpert`;
  } else if (theme === 'City') {
    description_de += `, die alltägliche Helden und Gemeindemitglieder darstellt`;
  } else if (theme === 'Castle') {
    description_de += `, die mittelalterliche Ritter und Fantasie zum Leben erweckt`;
  }

  description_de += `.`;

  // Generate French description
  let description_fr = `${name} du thème ${theme}`;

  if (hasColor && hasOutfit) {
    description_fr += ` présente des détails de tenue distinctifs`;
  } else if (hasAccessory) {
    description_fr += ` vient avec des accessoires caractéristiques`;
  }

  description_fr += `. Cette minifigurine représente une variante unique au sein de la collection ${theme}`;

  if (theme === 'Star Wars') {
    description_fr += `, capturant des personnages et moments emblématiques de la galaxie lointaine, très lointaine`;
  } else if (theme === 'Super Heroes') {
    description_fr += `, donnant vie aux héros et méchants de bandes dessinées`;
  } else if (theme === 'Harry Potter') {
    description_fr += `, recréant des moments magiques du monde des sorciers`;
  } else if (theme === 'NINJAGO') {
    description_fr += `, incarnant les guerriers ninjas et leurs aventures`;
  } else if (theme === 'City') {
    description_fr += `, dépeignant les héros du quotidien et les membres de la communauté`;
  } else if (theme === 'Castle') {
    description_fr += `, donnant vie aux chevaliers médiévaux et à la fantasy`;
  }

  description_fr += `.`;

  // Generate Spanish description
  let description_es = `${name} del tema ${theme}`;

  if (hasColor && hasOutfit) {
    description_es += ` presenta detalles distintivos de atuendo`;
  } else if (hasAccessory) {
    description_es += ` viene con accesorios característicos`;
  }

  description_es += `. Esta minifigura representa una variante única dentro de la colección ${theme}`;

  if (theme === 'Star Wars') {
    description_es += `, capturando personajes y momentos icónicos de la galaxia muy, muy lejana`;
  } else if (theme === 'Super Heroes') {
    description_es += `, dando vida a héroes y villanos de cómics`;
  } else if (theme === 'Harry Potter') {
    description_es += `, recreando momentos mágicos del mundo mágico`;
  } else if (theme === 'NINJAGO') {
    description_es += `, encarnando guerreros ninja y sus aventuras`;
  } else if (theme === 'City') {
    description_es += `, representando héroes cotidianos y miembros de la comunidad`;
  } else if (theme === 'Castle') {
    description_es += `, dando vida a caballeros medievales y fantasía`;
  }

  description_es += `.`;

  return {
    description_en,
    description_de,
    description_fr,
    description_es,
  };
}

async function dryRun() {
  console.log(`🧪 DRY RUN - Testing automated description generation...`);
  console.log(`📊 Total minifigures in catalog: ${minifigs.length}\n`);

  // Test on first 20 minifigs
  const testSample = minifigs.slice(0, 20);

  console.log(`Testing generation for ${testSample.length} sample minifigs:\n`);

  for (const minifig of testSample) {
    const descriptions = generateDescriptions(minifig);

    console.log(`\n📝 ${minifig.minifigure_no} - ${minifig.name}`);
    console.log(`   Theme: ${getTheme(minifig.minifigure_no)}`);
    console.log(`   EN: ${descriptions.description_en.substring(0, 100)}...`);
    console.log(`   DE: ${descriptions.description_de.substring(0, 100)}...`);
    console.log(`   FR: ${descriptions.description_fr.substring(0, 100)}...`);
    console.log(`   ES: ${descriptions.description_es.substring(0, 100)}...`);
  }

  console.log(`\n\n✅ Dry run complete! Descriptions generated successfully for ${testSample.length} samples.`);
  console.log(`   Ready to run full script on all ${minifigs.length} minifigs.`);

  await prisma.$disconnect();
}

dryRun().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
