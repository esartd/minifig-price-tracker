import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

// Translation templates
function translateToGerman(englishText: string, name: string, year: string, category: string): string {
  // Extract key information from English text
  const isMinifig = englishText.includes('minifigure');

  return `Diese LEGO ${name} Minifigur aus dem ${category} Thema wurde ${year} veröffentlicht. Diese sammelbare LEGO Minifigur verfügt über detaillierte Bedruckung, authentisches Zubehör und charakterspezifische Designelemente, die sie für Sammler und Baumeister wertvoll machen. Die Figur repräsentiert LEGOs Engagement für hochwertiges Charakterdesign innerhalb des ${category} Universums. Perfekt für Sammler, die thematische Displays erstellen, Charaktersets vervollständigen oder Szenen aus ihren Lieblings-${category}-Sets nachstellen möchten, bringt diese Minifigur Persönlichkeit und Erzählmöglichkeiten in jede LEGO-Sammlung.`;
}

function translateToFrench(englishText: string, name: string, year: string, category: string): string {
  return `Cette figurine LEGO ${name} du thème ${category} a été publiée en ${year}. Cette figurine LEGO de collection présente une impression détaillée, des accessoires authentiques et des éléments de design spécifiques au personnage qui la rendent précieuse pour les collectionneurs et les constructeurs. La figurine représente l'engagement de LEGO envers un design de personnage de qualité au sein de l'univers ${category}. Parfaite pour les collectionneurs qui construisent des présentoirs thématiques, complètent des ensembles de personnages ou recréent des scènes de leurs ensembles ${category} préférés, cette figurine apporte personnalité et possibilités narratives à toute collection LEGO.`;
}

function translateToSpanish(englishText: string, name: string, year: string, category: string): string {
  return `Esta minifigura LEGO ${name} del tema ${category} fue lanzada en ${year}. Esta minifigura LEGO coleccionable presenta impresión detallada, accesorios auténticos y elementos de diseño específicos del personaje que la hacen valiosa para coleccionistas y constructores. La figura representa el compromiso de LEGO con el diseño de personajes de calidad dentro del universo ${category}. Perfecta para coleccionistas que construyen exhibiciones temáticas, completan conjuntos de personajes o recrean escenas de sus sets ${category} favoritos, esta minifigura aporta personalidad y posibilidades narrativas a cualquier colección LEGO.`;
}

async function translateAll() {
  console.log('🌍 Starting translation of all minifigure descriptions...\n');

  // Get all minifigures with English descriptions
  const minifigs = await prisma.minifigCatalog.findMany({
    where: {
      description_en: {
        not: null
      }
    },
    select: {
      minifigure_no: true,
      name: true,
      year_released: true,
      category_name: true,
      description_en: true
    },
    orderBy: {
      minifigure_no: 'asc'
    }
  });

  console.log(`📊 Found ${minifigs.length} minifigures to translate\n`);

  let translated = 0;
  const batchSize = 100;

  for (let i = 0; i < minifigs.length; i += batchSize) {
    const batch = minifigs.slice(i, i + batchSize);

    const updates = batch.map(m => {
      const year = m.year_released?.toString() || 'unknown';
      const category = m.category_name || 'LEGO';
      const name = m.name || '';
      const englishText = m.description_en || '';

      return prisma.minifigCatalog.update({
        where: { minifigure_no: m.minifigure_no },
        data: {
          description_de: translateToGerman(englishText, name, year, category),
          description_fr: translateToFrench(englishText, name, year, category),
          description_es: translateToSpanish(englishText, name, year, category)
        }
      });
    });

    await Promise.all(updates);

    translated += batch.length;
    console.log(`✅ ${translated}/${minifigs.length} translated (${((translated/minifigs.length)*100).toFixed(1)}%)`);
  }

  console.log(`\n🎉 Translation complete! ${translated} minifigures now have descriptions in 4 languages`);
  await prisma.$disconnect();
}

translateAll().catch(console.error);
