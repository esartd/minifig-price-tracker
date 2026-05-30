/**
 * Convert all BrickLink TXT catalog files to JSON
 */

import fs from 'fs';
import path from 'path';

const CATALOG_SOURCE_DIR = '/Users/erickkosysu/Code Projects/FigTracker/Bricklink Catalog txt/2026/4';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'catalog');

interface CatalogItem {
  [key: string]: any;
}

/**
 * Convert Minifigures.txt to JSON
 */
async function convertMinifigures() {
  console.log('📦 Converting Minifigures.txt...');

  const txtPath = path.join(CATALOG_SOURCE_DIR, 'Minifigures.txt');
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
      size: null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/MN/0/${parts[2].trim()}.png` : null,
      thumbnail_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/TN/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(m => m.minifigure_no);

  const outputPath = path.join(OUTPUT_DIR, 'minifigs.json');
  fs.writeFileSync(outputPath, JSON.stringify(minifigs, null, 2));

  console.log(`✅ Minifigures: ${minifigs.length} items → ${outputPath}`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  return minifigs.length;
}

/**
 * Convert Categories.txt to JSON
 */
async function convertCategories() {
  console.log('📦 Converting categories.txt...');

  const txtPath = path.join(CATALOG_SOURCE_DIR, 'categories.txt');
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

  console.log(`✅ Categories: ${categories.length} items → ${outputPath}`);

  return categories.length;
}

/**
 * Convert Parts.txt to JSON
 */
async function convertParts() {
  console.log('📦 Converting Parts.txt...');

  const txtPath = path.join(CATALOG_SOURCE_DIR, 'Parts.txt');
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const parts = dataLines.map(line => {
    const cols = line.split('\t');
    return {
      category_id: parseInt(cols[0]?.trim() || '0'),
      category_name: cols[1]?.trim() || '',
      part_no: cols[2]?.trim() || '',
      name: cols[3]?.trim() || '',
      weight: cols[4]?.trim() || null,
      image_url: cols[2]?.trim() ? `https://img.bricklink.com/ItemImage/PN/0/${cols[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(p => p.part_no);

  const outputPath = path.join(OUTPUT_DIR, 'parts.json');
  fs.writeFileSync(outputPath, JSON.stringify(parts, null, 2));

  console.log(`✅ Parts: ${parts.length} items → ${outputPath}`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  return parts.length;
}

/**
 * Convert Catalogs.txt (sets) to JSON
 */
async function convertCatalogs() {
  console.log('📦 Converting Catalogs.txt (sets)...');

  const txtPath = path.join(CATALOG_SOURCE_DIR, 'Catalogs.txt');
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const sets = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      set_no: parts[2]?.trim() || '',
      name: parts[3]?.trim() || '',
      year_released: parts[4]?.trim() || null,
      weight: parts[5]?.trim() || null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/SN/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(s => s.set_no);

  const outputPath = path.join(OUTPUT_DIR, 'sets.json');
  fs.writeFileSync(outputPath, JSON.stringify(sets, null, 2));

  console.log(`✅ Sets: ${sets.length} items → ${outputPath}`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  return sets.length;
}

/**
 * Convert Original Boxes.txt to JSON
 */
async function convertOriginalBoxes() {
  console.log('📦 Converting Original Boxes.txt...');

  const txtPath = path.join(CATALOG_SOURCE_DIR, 'Original Boxes.txt');
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const boxes = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      box_no: parts[2]?.trim() || '',
      name: parts[3]?.trim() || '',
      year_released: parts[4]?.trim() || null,
      weight: parts[5]?.trim() || null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/ON/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(b => b.box_no);

  const outputPath = path.join(OUTPUT_DIR, 'boxes.json');
  fs.writeFileSync(outputPath, JSON.stringify(boxes, null, 2));

  console.log(`✅ Original Boxes: ${boxes.length} items → ${outputPath}`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  return boxes.length;
}

/**
 * Main conversion function
 */
async function convertAllCatalogs() {
  console.log('🚀 Converting BrickLink Catalog TXT files to JSON...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    const counts = {
      minifigs: await convertMinifigures(),
      categories: await convertCategories(),
      parts: await convertParts(),
      sets: await convertCatalogs(),
      boxes: await convertOriginalBoxes()
    };

    // Create master metadata file
    const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify({
      totalMinifigs: counts.minifigs,
      totalCategories: counts.categories,
      totalParts: counts.parts,
      totalSets: counts.sets,
      totalBoxes: counts.boxes,
      lastUpdated: new Date().toISOString(),
      version: 1,
      source: 'BrickLink Catalog Download April 2026'
    }, null, 2));

    console.log('\n✅ All catalogs converted successfully!');
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Minifigures: ${counts.minifigs.toLocaleString()}`);
    console.log(`   - Categories: ${counts.categories.toLocaleString()}`);
    console.log(`   - Parts: ${counts.parts.toLocaleString()}`);
    console.log(`   - Sets: ${counts.sets.toLocaleString()}`);
    console.log(`   - Original Boxes: ${counts.boxes.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error converting catalogs:', error);
    throw error;
  }
}

convertAllCatalogs().catch(console.error);
