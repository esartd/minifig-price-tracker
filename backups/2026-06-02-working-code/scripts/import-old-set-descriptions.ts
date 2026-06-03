#!/usr/bin/env ts-node
/**
 * Import set descriptions from old boxes.json (before May 16 catalog update)
 * Recovers ~21,000 set descriptions that were lost during catalog update
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
  console.log('📦 IMPORTING OLD SET DESCRIPTIONS');
  console.log('==================================\n');

  // Load old boxes.json with descriptions
  const oldSets: OldSet[] = JSON.parse(fs.readFileSync('/tmp/boxes-with-descriptions.json', 'utf-8'));

  console.log(`📊 Total sets in old file: ${oldSets.length}`);

  const setsWithDescriptions = oldSets.filter(s => s.description_en);
  console.log(`📝 Sets with descriptions: ${setsWithDescriptions.length}\n`);

  let imported = 0;
  let skipped = 0;

  for (const set of setsWithDescriptions) {
    try {
      await prisma.setsCatalog.upsert({
        where: { box_no: set.box_no },
        create: {
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
        },
        update: {
          description_en: set.description_en || null,
          description_de: set.description_de || null,
          description_fr: set.description_fr || null,
          description_es: set.description_es || null,
          description_status: 'imported'
        }
      });

      imported++;

      if (imported % 500 === 0) {
        console.log(`  ✓ Imported ${imported} set descriptions...`);
      }

    } catch (error: any) {
      console.error(`  ✗ Error with ${set.box_no}: ${error.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ IMPORT COMPLETE!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped: ${skipped}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
