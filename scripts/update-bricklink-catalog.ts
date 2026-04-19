/**
 * AUTOMATED BRICKLINK CATALOG UPDATE
 *
 * This script automates the entire catalog update process:
 * 1. Converts BrickLink TXT files to JSON
 * 2. Uploads JSON files to Hostinger CDN
 *
 * Run this script twice a month when BrickLink releases new catalog data.
 *
 * Prerequisites:
 * - Download latest TXT files from BrickLink to: Bricklink Catalog txt/2026/4/
 * - Set HOSTINGER_FTP_PASSWORD environment variable
 */

import fs from 'fs';
import path from 'path';
import { Client } from 'basic-ftp';

const CATALOG_SOURCE_DIR = '/Users/erickkosysu/Code Projects/FigTracker/Bricklink Catalog txt/2026/4';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'catalog');

// Hostinger FTP credentials
const FTP_HOST = 'srv1777.hstgr.io';
const FTP_USER = 'u493602047';
const FTP_REMOTE_PATH = '/domains/figtracker.ericksu.com/public_html/catalog';

interface ConversionResult {
  filename: string;
  count: number;
  size: number;
}

/**
 * Convert Minifigures.txt to JSON
 */
async function convertMinifigures(): Promise<ConversionResult> {
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

  const size = fs.statSync(outputPath).size;
  console.log(`   ✅ ${minifigs.length} minifigs (${(size / 1024 / 1024).toFixed(2)} MB)`);

  return { filename: 'minifigs.json', count: minifigs.length, size };
}

/**
 * Convert Categories.txt to JSON
 */
async function convertCategories(): Promise<ConversionResult> {
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

  const size = fs.statSync(outputPath).size;
  console.log(`   ✅ ${categories.length} categories (${(size / 1024).toFixed(0)} KB)`);

  return { filename: 'categories.json', count: categories.length, size };
}

/**
 * Convert Parts.txt to JSON
 */
async function convertParts(): Promise<ConversionResult> {
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

  const size = fs.statSync(outputPath).size;
  console.log(`   ✅ ${parts.length} parts (${(size / 1024 / 1024).toFixed(2)} MB)`);

  return { filename: 'parts.json', count: parts.length, size };
}

/**
 * Convert Catalogs.txt (sets) to JSON
 */
async function convertCatalogs(): Promise<ConversionResult> {
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

  const size = fs.statSync(outputPath).size;
  console.log(`   ✅ ${sets.length} sets (${(size / 1024 / 1024).toFixed(2)} MB)`);

  return { filename: 'sets.json', count: sets.length, size };
}

/**
 * Convert Original Boxes.txt to JSON
 */
async function convertOriginalBoxes(): Promise<ConversionResult> {
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

  const size = fs.statSync(outputPath).size;
  console.log(`   ✅ ${boxes.length} boxes (${(size / 1024 / 1024).toFixed(2)} MB)`);

  return { filename: 'boxes.json', count: boxes.length, size };
}

/**
 * Upload JSON files to Hostinger via FTP
 */
async function uploadToHostinger(results: ConversionResult[]): Promise<void> {
  console.log('\n📤 Uploading to Hostinger CDN...');

  const password = process.env.HOSTINGER_FTP_PASSWORD;
  if (!password) {
    throw new Error('HOSTINGER_FTP_PASSWORD environment variable not set');
  }

  const client = new Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: password,
      secure: false
    });

    console.log(`   Connected to ${FTP_HOST}`);

    // Change to catalog directory
    await client.ensureDir(FTP_REMOTE_PATH);
    console.log(`   Changed to ${FTP_REMOTE_PATH}`);

    // Upload each JSON file
    for (const result of results) {
      const localPath = path.join(OUTPUT_DIR, result.filename);
      console.log(`   Uploading ${result.filename}...`);
      await client.uploadFrom(localPath, result.filename);
      console.log(`   ✅ ${result.filename} uploaded`);
    }

    // Upload metadata file
    const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
    console.log(`   Uploading metadata.json...`);
    await client.uploadFrom(metadataPath, 'metadata.json');
    console.log(`   ✅ metadata.json uploaded`);

    console.log('\n✅ All files uploaded successfully!');

  } catch (error) {
    console.error('❌ FTP upload failed:', error);
    throw error;
  } finally {
    client.close();
  }
}

/**
 * Main update function
 */
async function updateCatalog() {
  console.log('🚀 BRICKLINK CATALOG UPDATE SCRIPT');
  console.log('===================================\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Step 1: Convert all TXT files to JSON
    console.log('Step 1: Converting TXT files to JSON\n');

    const results = [
      await convertMinifigures(),
      await convertCategories(),
      await convertParts(),
      await convertCatalogs(),
      await convertOriginalBoxes()
    ];

    // Create metadata
    const metadata = {
      totalMinifigs: results[0].count,
      totalCategories: results[1].count,
      totalParts: results[2].count,
      totalSets: results[3].count,
      totalBoxes: results[4].count,
      lastUpdated: new Date().toISOString(),
      version: 1,
      source: 'BrickLink Catalog Download'
    };

    const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    results.push({ filename: 'metadata.json', count: 0, size: fs.statSync(metadataPath).size });

    // Step 2: Upload to Hostinger
    console.log('\nStep 2: Uploading to Hostinger CDN\n');
    await uploadToHostinger(results);

    // Summary
    console.log('\n📊 UPDATE SUMMARY');
    console.log('==================');
    console.log(`✅ Minifigures: ${metadata.totalMinifigures.toLocaleString()}`);
    console.log(`✅ Categories: ${metadata.totalCategories.toLocaleString()}`);
    console.log(`✅ Parts: ${metadata.totalParts.toLocaleString()}`);
    console.log(`✅ Sets: ${metadata.totalSets.toLocaleString()}`);
    console.log(`✅ Original Boxes: ${metadata.totalBoxes.toLocaleString()}`);
    console.log(`\n🌐 CDN URL: https://figtracker.ericksu.com/catalog/`);
    console.log(`📅 Updated: ${new Date().toLocaleString()}`);

  } catch (error) {
    console.error('\n❌ Update failed:', error);
    process.exit(1);
  }
}

// Run the update
updateCatalog().catch(console.error);
