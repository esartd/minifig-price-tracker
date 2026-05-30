import { PrismaClient } from '@prisma/client-hostinger';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

// Get minifigure data from JSON
const jsonPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const allMinifigs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const starWarsMinifigs = allMinifigs.filter((m: any) =>
  m.category_name && m.category_name.includes('Star Wars')
);

console.log(`📊 Total Star Wars minifigs in catalog: ${starWarsMinifigs.length}\n`);
console.log(`First 10 minifigs to generate:`);
starWarsMinifigs.slice(0, 10).forEach((m: any) => {
  console.log(`  ${m.minifigure_no}: ${m.name}`);
});

console.log(`\n✅ Script ready. The actual minifig data is available.`);
console.log(`   Next step: Generate descriptions in batches of 10.`);

prisma.$disconnect();
