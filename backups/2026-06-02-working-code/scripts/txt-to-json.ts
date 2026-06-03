/**
 * Convert BrickLink TXT files directly to JSON
 * No database needed!
 */

import fs from 'fs';
import path from 'path';

interface MinifigRow {
  categoryId: number;
  categoryName: string;
  minifigureNo: string;
  name: string;
  yearReleased: string | null;
  weight: string | null;
}

async function convertTxtToJson() {
  console.log('📦 Converting Minifigures.txt to JSON...');

  const txtPath = path.join(process.cwd(), 'Minifigures.txt');
  const catalogsPath = path.join(process.cwd(), 'Catalogs.txt');

  // Read minifigures file
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');

  // Skip header line
  const dataLines = lines.slice(1).filter(line => line.trim());

  console.log(`Found ${dataLines.length} minifigs`);

  // Parse TSV format
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
  }).filter(m => m.minifigure_no); // Remove invalid rows

  console.log(`Parsed ${minifigs.length} valid minifigs`);

  // Create catalog directory
  const catalogDir = path.join(process.cwd(), 'public', 'catalog');
  if (!fs.existsSync(catalogDir)) {
    fs.mkdirSync(catalogDir, { recursive: true });
  }

  // Write JSON file
  const jsonPath = path.join(catalogDir, 'minifigs.json');
  fs.writeFileSync(jsonPath, JSON.stringify(minifigs, null, 2));

  console.log(`✅ Exported to ${jsonPath}`);
  console.log(`📊 File size: ${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB`);

  // Create metadata
  const metadataPath = path.join(catalogDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify({
    totalMinifigs: minifigs.length,
    lastUpdated: new Date().toISOString(),
    version: 1,
    source: 'Minifigures.txt'
  }, null, 2));

  console.log('✅ Done! No database needed.');
}

convertTxtToJson().catch(console.error);
