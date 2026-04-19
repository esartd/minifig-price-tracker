/**
 * Convert BrickLink Sets.txt to JSON for Hostinger CDN
 */

import fs from 'fs';
import path from 'path';

async function convertSetsToJson() {
  console.log('📦 Converting Sets.txt to JSON...');

  const txtPath = path.join(process.cwd(), 'Sets.txt');
  const catalogDir = path.join(process.cwd(), 'public', 'catalog');

  // Read sets file
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');

  // Skip header lines (first 2 lines)
  const dataLines = lines.slice(2).filter(line => line.trim());

  console.log(`Found ${dataLines.length} sets`);

  // Parse TSV format
  const sets = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      set_no: parts[2]?.trim() || '',
      name: parts[3]?.trim() || '',
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      year_released: parts[4]?.trim() || null,
      weight: parts[5]?.trim() || null,
      dimensions: parts[6]?.trim() || null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/SN/0/${parts[2].trim()}.png` : null,
      thumbnail_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/TN/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(s => s.set_no); // Remove invalid rows

  console.log(`Parsed ${sets.length} valid sets`);

  // Create catalog directory if needed
  if (!fs.existsSync(catalogDir)) {
    fs.mkdirSync(catalogDir, { recursive: true });
  }

  // Write JSON file
  const jsonPath = path.join(catalogDir, 'sets.json');
  fs.writeFileSync(jsonPath, JSON.stringify(sets, null, 2));

  console.log(`✅ Exported to ${jsonPath}`);
  console.log(`📊 File size: ${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB`);

  // Update metadata
  const metadataPath = path.join(catalogDir, 'sets-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify({
    totalSets: sets.length,
    lastUpdated: new Date().toISOString(),
    version: 1,
    source: 'Sets.txt'
  }, null, 2));

  console.log('✅ Done! Upload to Hostinger:');
  console.log('   public/catalog/sets.json');
  console.log('   public/catalog/sets-metadata.json');
}

convertSetsToJson().catch(console.error);
