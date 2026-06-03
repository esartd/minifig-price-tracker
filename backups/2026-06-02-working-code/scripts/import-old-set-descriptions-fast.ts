#!/usr/bin/env ts-node
/**
 * FAST import - uses batch inserts instead of one-by-one
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || process.env.HOSTINGER_DATABASE_URL
});

interface OldSet {
  box_no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released?: string;
  weight?: string;
  description_en?: string;
  description_de?: string;
  description_fr?: string;
  description_es?: string;
}

async function main() {
  console.log('📦 FAST IMPORT - OLD SET DESCRIPTIONS');
  console.log('====================================\n');

  const oldSets: OldSet[] = JSON.parse(fs.readFileSync('/tmp/boxes-with-descriptions.json', 'utf-8'));
  const setsWithDescriptions = oldSets.filter(s => s.description_en);

  console.log(`📊 Total sets to import: ${setsWithDescriptions.length}\n`);

  // Batch insert in chunks of 1000
  const BATCH_SIZE = 1000;
  let imported = 0;

  for (let i = 0; i < setsWithDescriptions.length; i += BATCH_SIZE) {
    const batch = setsWithDescriptions.slice(i, i + BATCH_SIZE);

    const data = batch.map(set => ({
      box_no: set.box_no,
      name: set.name,
      category_id: set.category_id,
      category_name: set.category_name,
      year_released: set.year_released || null,
      weight: set.weight || null,
      search_name: set.name.toLowerCase(),
      description_en: set.description_en || null,
      description_de: set.description_de || null,
      description_fr: set.description_fr || null,
      description_es: set.description_es || null,
      description_status: 'imported'
    }));

    await prisma.setsCatalog.createMany({
      data,
      skipDuplicates: true
    });

    imported += batch.length;
    const percent = ((imported / setsWithDescriptions.length) * 100).toFixed(1);
    console.log(`  ✓ ${percent}% - Imported ${imported} / ${setsWithDescriptions.length}`);
  }

  console.log(`\n✅ IMPORT COMPLETE! Total: ${imported}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
