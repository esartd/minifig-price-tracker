import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

// Corrupted batches: 043-053 (sw0354-sw0463) and batch 056 (sw0485-sw0493)
const corruptedMinifigs = [
  // Batch 043: sw0354-sw0363
  'sw0354', 'sw0355', 'sw0356', 'sw0357', 'sw0358', 'sw0359', 'sw0360', 'sw0361', 'sw0362', 'sw0363',
  // Batch 044: sw0364-sw0373
  'sw0364', 'sw0365', 'sw0366', 'sw0367', 'sw0368', 'sw0369', 'sw0370', 'sw0371', 'sw0372', 'sw0373',
  // Batch 045: sw0374-sw0383
  'sw0374', 'sw0375', 'sw0376', 'sw0377', 'sw0378', 'sw0379', 'sw0380', 'sw0381', 'sw0382', 'sw0383',
  // Batch 046: sw0384-sw0393
  'sw0384', 'sw0385', 'sw0386', 'sw0387', 'sw0388', 'sw0389', 'sw0390', 'sw0391', 'sw0392', 'sw0393',
  // Batch 047: sw0394-sw0403
  'sw0394', 'sw0395', 'sw0396', 'sw0397', 'sw0398', 'sw0399', 'sw0400', 'sw0401', 'sw0402', 'sw0403',
  // Batch 048: sw0404-sw0413
  'sw0404', 'sw0405', 'sw0406', 'sw0407', 'sw0408', 'sw0409', 'sw0410', 'sw0411', 'sw0412', 'sw0413',
  // Batch 049: sw0414-sw0423
  'sw0414', 'sw0415', 'sw0416', 'sw0417', 'sw0418', 'sw0419', 'sw0420', 'sw0421', 'sw0422', 'sw0423',
  // Batch 050: sw0424-sw0433
  'sw0424', 'sw0425', 'sw0426', 'sw0427', 'sw0428', 'sw0429', 'sw0430', 'sw0431', 'sw0432', 'sw0433',
  // Batch 051: sw0434-sw0443
  'sw0434', 'sw0435', 'sw0436', 'sw0437', 'sw0438', 'sw0439', 'sw0440', 'sw0441', 'sw0442', 'sw0443',
  // Batch 052: sw0444-sw0453
  'sw0444', 'sw0445', 'sw0446', 'sw0447', 'sw0448', 'sw0449', 'sw0450', 'sw0451', 'sw0452', 'sw0453',
  // Batch 053: sw0454-sw0463
  'sw0454', 'sw0455', 'sw0456', 'sw0457', 'sw0458', 'sw0459', 'sw0460', 'sw0461', 'sw0462', 'sw0463',
  // Batch 056: sw0485-sw0493
  'sw0485', 'sw0486', 'sw0487', 'sw0488', 'sw0489', 'sw0490', 'sw0491', 'sw0492', 'sw0493',
];

async function cleanupCorruptedDescriptions() {
  console.log('🧹 Cleaning up corrupted descriptions...\n');
  console.log(`Total minifigs to clean: ${corruptedMinifigs.length}\n`);

  let cleaned = 0;
  let notFound = 0;

  for (const minifigNo of corruptedMinifigs) {
    try {
      const result = await prisma.minifigCatalog.updateMany({
        where: { minifigure_no: minifigNo },
        data: {
          description_en: null,
          description_de: null,
          description_fr: null,
          description_es: null,
          description_generated_at: null,
          description_status: 'pending'
        }
      });

      if (result.count > 0) {
        console.log(`  ✅ Cleaned ${minifigNo}`);
        cleaned++;
      } else {
        console.log(`  ⚠️  ${minifigNo} not found in database`);
        notFound++;
      }
    } catch (error: any) {
      console.error(`  ❌ Error cleaning ${minifigNo}: ${error.message}`);
    }
  }

  console.log(`\n✨ Cleanup complete!`);
  console.log(`   Cleaned: ${cleaned}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`   Total descriptions removed: ${cleaned * 4}\n`);

  await prisma.$disconnect();
}

cleanupCorruptedDescriptions().catch(console.error);
