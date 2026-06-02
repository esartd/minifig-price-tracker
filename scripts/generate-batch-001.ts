import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

// Load actual minifigs from JSON
const jsonPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const allMinifigs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const starWarsMinifigs = allMinifigs.filter((m: any) =>
  m.category_name && m.category_name.includes('Star Wars')
);

// First 10 minifigs
const batch = starWarsMinifigs.slice(0, 10).map((m: any) => ({
  no: m.minifigure_no,
  name: m.name,
  category: m.category_name,
  year: m.year_released
}));

console.log('Batch 001 - First 10 Star Wars minifigs:\n');
batch.forEach(m => console.log(`  ${m.no}: ${m.name}`));
console.log('\n⚠️  Ready to generate. Add descriptions manually based on these actual minifigs.');

prisma.$disconnect();
