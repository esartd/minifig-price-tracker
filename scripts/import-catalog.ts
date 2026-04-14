/**
 * BrickLink Catalog Import Script
 *
 * IMPORTANT TERMINOLOGY:
 * - BrickLink data files use "Category" (e.g., "Star Wars", "Harry Potter")
 * - Database columns: category_id, category_name (matches BrickLink)
 * - App UI displays these as "Themes" for better user experience
 *
 * When importing new BrickLink catalog files:
 * - Column names in files: "Category ID", "Category Name"
 * - Maps to DB fields: category_id, category_name
 * - Displayed in UI as: "Themes" (/themes, not /categories)
 *
 * This mapping is intentional - don't change "category" to "theme" in the database!
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const prisma = new PrismaClient();

interface MinifigRow {
  categoryId: number;        // BrickLink: "Category ID" → DB: category_id → UI: "Theme"
  categoryName: string;       // BrickLink: "Category Name" → DB: category_name → UI: "Theme name"
  number: string;
  name: string;
  yearReleased: string | null;
  weightGrams: number | null;
}

async function importCatalog() {
  const filePath = path.join(process.cwd(), 'Minifigures.txt');

  console.log(`📖 Reading catalog from: ${filePath}`);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  const batchSize = 100;
  let batch: MinifigRow[] = [];

  for await (const line of rl) {
    lineNumber++;

    // Skip first line (header) and empty lines
    if (lineNumber === 1 || line.trim() === '') {
      continue;
    }

    try {
      // Split by tabs
      const columns = line.split('\t');

      if (columns.length < 5) {
        console.warn(`⚠️  Line ${lineNumber}: Not enough columns`);
        skipped++;
        continue;
      }

      const categoryId = parseInt(columns[0]);
      const categoryName = columns[1];
      const number = columns[2];
      const name = columns[3];
      const yearReleased = columns[4] === '?' ? null : columns[4];
      const weightGrams = columns[5] ? parseFloat(columns[5]) : null;

      if (!number || !name) {
        console.warn(`⚠️  Line ${lineNumber}: Missing required fields`);
        skipped++;
        continue;
      }

      batch.push({
        categoryId,
        categoryName,
        number,
        name,
        yearReleased,
        weightGrams,
      });

      // When batch is full, insert into database
      if (batch.length >= batchSize) {
        await insertBatch(batch);
        imported += batch.length;
        console.log(`✅ Imported ${imported} minifigures...`);
        batch = [];
      }
    } catch (error) {
      console.error(`❌ Error on line ${lineNumber}:`, error);
      errors++;
    }
  }

  // Insert remaining items
  if (batch.length > 0) {
    await insertBatch(batch);
    imported += batch.length;
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⚠️  Skipped:  ${skipped}`);
  console.log(`   ❌ Errors:   ${errors}`);
}

async function insertBatch(batch: MinifigRow[]) {
  // Use upsert to handle duplicates
  const promises = batch.map((item) =>
    prisma.minifigCatalog.upsert({
      where: { minifigure_no: item.number },
      update: {
        name: item.name,
        category_id: item.categoryId,
        category_name: item.categoryName,
        year_released: item.yearReleased,
        weight_grams: item.weightGrams,
        search_name: item.name.toLowerCase(),
      },
      create: {
        minifigure_no: item.number,
        name: item.name,
        category_id: item.categoryId,
        category_name: item.categoryName,
        year_released: item.yearReleased,
        weight_grams: item.weightGrams,
        search_name: item.name.toLowerCase(),
      },
    })
  );

  await Promise.all(promises);
}

// Run the import
importCatalog()
  .then(() => {
    console.log('\n✨ Import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
