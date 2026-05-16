#!/usr/bin/env ts-node
/**
 * SIMPLE CATALOG UPDATER
 *
 * Just place your BrickLink .txt files in a folder and provide the path.
 * This script handles everything:
 * 1. Reads the .txt files
 * 2. Converts to JSON
 * 3. Saves to public/catalog/
 * 4. Ready to commit!
 *
 * Usage:
 *   npx ts-node scripts/update-catalogs-simple.ts /path/to/txt/files
 *
 * Or just run it and it will ask you for the path:
 *   npx ts-node scripts/update-catalogs-simple.ts
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'catalog');

async function askForPath(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('📁 Enter the path to your BrickLink .txt files: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function convertMinifigures(sourceDir: string) {
  console.log('\n📦 Converting Minifigures.txt...');

  const txtPath = path.join(sourceDir, 'Minifigures.txt');
  if (!fs.existsSync(txtPath)) {
    console.log('⚠️  Minifigures.txt not found, skipping...');
    return 0;
  }

  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const minifigs = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      minifigure_no: parts[2]?.trim() || '',
      name: parts[3]?.trim() || '',
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      year_released: parts[4]?.trim() || null,
      weight: parts[5]?.trim() || null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/MN/0/${parts[2].trim()}.png` : null,
      thumbnail_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/TN/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(m => m.minifigure_no);

  const outputPath = path.join(OUTPUT_DIR, 'minifigs.json');
  fs.writeFileSync(outputPath, JSON.stringify(minifigs, null, 2));

  console.log(`✅ Minifigures: ${minifigs.length} items → minifigs.json`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  return minifigs.length;
}

function convertSets(sourceDir: string) {
  console.log('\n📦 Converting Catalogs.txt (Sets)...');

  const txtPath = path.join(sourceDir, 'Catalogs.txt');
  if (!fs.existsSync(txtPath)) {
    console.log('⚠️  Catalogs.txt not found, skipping...');
    return 0;
  }

  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const sets = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      box_no: parts[2]?.trim() || '',
      name: parts[3]?.trim() || '',
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      year_released: parts[4]?.trim() || null,
      weight: parts[5]?.trim() || null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/ON/0/${parts[2].trim()}.png` : null,
      thumbnail_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/TN/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(s => s.box_no);

  const outputPath = path.join(OUTPUT_DIR, 'boxes.json');
  fs.writeFileSync(outputPath, JSON.stringify(sets, null, 2));

  console.log(`✅ Sets: ${sets.length} items → boxes.json`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  return sets.length;
}

function convertCategories(sourceDir: string) {
  console.log('\n📦 Converting categories.txt...');

  const txtPath = path.join(sourceDir, 'categories.txt');
  if (!fs.existsSync(txtPath)) {
    console.log('⚠️  categories.txt not found, skipping...');
    return 0;
  }

  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const categories = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      updated_at: new Date().toISOString()
    };
  }).filter(c => c.category_id);

  const outputPath = path.join(OUTPUT_DIR, 'categories.json');
  fs.writeFileSync(outputPath, JSON.stringify(categories, null, 2));

  console.log(`✅ Categories: ${categories.length} items → categories.json`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

  return categories.length;
}

async function main() {
  console.log('🚀 SIMPLE BRICKLINK CATALOG UPDATER');
  console.log('===================================\n');

  // Get source directory
  let sourceDir = process.argv[2];

  if (!sourceDir) {
    sourceDir = await askForPath();
  }

  // Validate directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Error: Directory not found: ${sourceDir}`);
    process.exit(1);
  }

  console.log(`\n📂 Source: ${sourceDir}`);
  console.log(`📂 Output: ${OUTPUT_DIR}\n`);

  // List available files
  const files = fs.readdirSync(sourceDir);
  console.log('📄 Found files:');
  files.forEach(f => console.log(`   - ${f}`));

  // Create output directory if needed
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Convert each catalog
  const minifigCount = convertMinifigures(sourceDir);
  const setCount = convertSets(sourceDir);
  const categoryCount = convertCategories(sourceDir);

  console.log('\n✨ CONVERSION COMPLETE!');
  console.log('======================');
  console.log(`✓ Minifigures: ${minifigCount}`);
  console.log(`✓ Sets: ${setCount}`);
  console.log(`✓ Categories: ${categoryCount}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Review the files in public/catalog/');
  console.log('   2. git add public/catalog/');
  console.log('   3. git commit -m "Update BrickLink catalogs"');
  console.log('   4. git push origin main');
  console.log('\n🎉 Done!\n');
}

main().catch(console.error);
