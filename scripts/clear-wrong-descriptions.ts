import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function clearDescriptions() {
  console.log('Clearing incorrectly applied flagship descriptions...\n');

  // All the minifigure_no values we updated (but they're wrong minifigs in the database)
  const wrongIds = [
    // Disney
    'dis012', 'dis011', 'dis010', 'dis009', 'dis001', 'dis003', 'dis019', 'dis020',
    'dp001', 'dp002', 'dp003', 'dp006', 'dp011', 'dp012', 'dp015', 'dp016', 'dp004', 'dp008',
    // Harry Potter
    'hp005', 'hp019', 'hp001', 'hp006', 'hp008', 'hp012', 'hp009', 'hp020',
    // Marvel (all 32)
    'spd001', 'sh0015', 'sh0014', 'sh0018', 'sh0013', 'sh0035', 'sh0034', 'sh0038',
    'sh0078', 'sh0167', 'sh0195', 'sh0204', 'sh0205', 'sh0234', 'sh0246', 'sh0248',
    'sh0536', 'sh0611', 'sh0541', 'sh0270', 'sh0269', 'sh0271', 'sh0272', 'sh0273',
    'sh0201', 'sh0516', 'sh0344', 'sh0459', 'sh0458', 'sh0460', 'sh0309', 'sh0528',
    // Batman/DC
    'sh0016', 'sh0068', 'sh0251', 'sh0017', 'sh0093', 'sh0127', 'sh0044', 'sh0237',
    'sh0020', 'sh0021', 'sh0022', 'sh0023', 'sh0024', 'sh0279', 'sh0257', 'sh0256',
    // Minecraft
    'min001', 'min002', 'min004', 'min005', 'min006', 'min007', 'min008',
    // Super Mario
    'mar0001', 'mar0002', 'mar0003', 'mar0004', 'mar0005', 'mar0013', 'mar0015', 'mar0016',
  ];

  let cleared = 0;

  for (const id of wrongIds) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: id },
        data: {
          description_en: null,
          description_de: null,
          description_fr: null,
          description_es: null,
        },
      });
      cleared++;
      if (cleared % 10 === 0) {
        console.log(`Cleared ${cleared}/${wrongIds.length}...`);
      }
    } catch (error) {
      // Skip if doesn't exist
    }
  }

  console.log(`\n✅ Cleared ${cleared} wrong descriptions from database`);
  await prisma.$disconnect();
}

clearDescriptions().catch(console.error);
