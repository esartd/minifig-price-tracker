import { PrismaClient } from '@prisma/client-hostinger';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));

async function checkThemes() {
  const themes = {
    'Super Heroes': minifigs.filter((m: any) => m.category_name.includes('Super Heroes')),
    'Ninjago': minifigs.filter((m: any) => m.category_name.includes('NINJAGO') || m.category_name.includes('Ninjago')),
    'Harry Potter': minifigs.filter((m: any) => m.category_name.includes('Harry Potter')),
  };

  for (const [themeName, themeFigs] of Object.entries(themes)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${themeName}: ${themeFigs.length} total minifigs`);
    console.log(`${'='.repeat(60)}\n`);

    // Sample 10 random from this theme and check their descriptions
    const samples = [];
    for (let i = 0; i < 10 && i < themeFigs.length; i++) {
      const random = themeFigs[Math.floor(Math.random() * themeFigs.length)];
      samples.push(random);
    }

    for (const sample of samples) {
      const dbMinifig = await prisma.minifigCatalog.findUnique({
        where: { minifigure_no: sample.minifigure_no },
        select: {
          minifigure_no: true,
          name: true,
          description_en: true,
        }
      });

      if (!dbMinifig) {
        console.log(`❌ ${sample.minifigure_no} - NOT IN DATABASE`);
        continue;
      }

      const desc = dbMinifig.description_en || '';

      // Check if it's generic automated description
      const isGeneric = desc.includes('This LEGO') &&
                       desc.includes('This collectible LEGO minifigure features detailed printing') &&
                       desc.includes('Perfect for collectors building themed displays');

      // Check if it's flagship (mentions specific character details, no generic phrases)
      const isFlagship = !isGeneric && desc.length > 200;

      let status = '❓ UNKNOWN';
      if (isGeneric) status = '🤖 GENERIC (needs improvement)';
      if (isFlagship) status = '✨ FLAGSHIP (good)';

      console.log(`\n${sample.minifigure_no} - ${sample.name}`);
      console.log(`Status: ${status}`);
      console.log(`Description preview: ${desc.substring(0, 150)}...`);
    }
  }

  // Now check ALL and give counts
  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`SUMMARY: Checking all minifigs in these themes...`);
  console.log(`${'='.repeat(60)}\n`);

  for (const [themeName, themeFigs] of Object.entries(themes)) {
    const ids = themeFigs.map((f: any) => f.minifigure_no);

    const all = await prisma.minifigCatalog.findMany({
      where: { minifigure_no: { in: ids } },
      select: {
        minifigure_no: true,
        description_en: true,
      }
    });

    const generic = all.filter(m => {
      const desc = m.description_en || '';
      return desc.includes('This LEGO') &&
             desc.includes('This collectible LEGO minifigure features detailed printing') &&
             desc.includes('Perfect for collectors building themed displays');
    });

    const flagship = all.filter(m => {
      const desc = m.description_en || '';
      const isGen = desc.includes('This LEGO') &&
                   desc.includes('This collectible LEGO minifigure features detailed printing');
      return !isGen && desc.length > 200;
    });

    const noDesc = all.filter(m => !m.description_en || m.description_en.length === 0);

    console.log(`${themeName}:`);
    console.log(`  Total: ${all.length}`);
    console.log(`  ✨ Flagship quality: ${flagship.length}`);
    console.log(`  🤖 Generic (needs improvement): ${generic.length}`);
    console.log(`  ❌ No description: ${noDesc.length}`);
    console.log(`  📊 Needs work: ${generic.length + noDesc.length}\n`);
  }

  await prisma.$disconnect();
}

checkThemes().catch(console.error);
