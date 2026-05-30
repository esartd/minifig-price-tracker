/**
 * Export catalog from Supabase to static JSON file
 * Run this once to migrate, then it'll run automatically after each BrickLink download
 */

import { prismaPublic } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function exportCatalog() {
  console.log('📦 Exporting catalog from database in batches...');

  try {
    const batchSize = 1000;
    let offset = 0;
    let allMinifigs: any[] = [];

    while (true) {
      console.log(`Fetching batch starting at ${offset}...`);

      const batch = await prismaPublic.minifigCatalog.findMany({
        orderBy: { minifigure_no: 'asc' },
        skip: offset,
        take: batchSize
      });

      if (batch.length === 0) break;

      allMinifigs = allMinifigs.concat(batch);
      offset += batchSize;

      // Wait a bit between batches to avoid overwhelming Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const minifigs = allMinifigs;
    console.log(`✅ Found ${minifigs.length} minifigs`);

    // Create catalog directory if it doesn't exist
    const catalogDir = path.join(process.cwd(), 'public', 'catalog');
    if (!fs.existsSync(catalogDir)) {
      fs.mkdirSync(catalogDir, { recursive: true });
    }

    // Write to JSON file
    const filePath = path.join(catalogDir, 'minifigs.json');
    fs.writeFileSync(filePath, JSON.stringify(minifigs, null, 2));

    console.log(`✅ Exported to ${filePath}`);
    console.log(`📊 File size: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB`);

    // Create metadata file
    const metadataPath = path.join(catalogDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify({
      totalMinifigs: minifigs.length,
      lastUpdated: new Date().toISOString(),
      version: 1
    }, null, 2));

    console.log('✅ Export complete!');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prismaPublic.$disconnect();
  }
}

exportCatalog();
