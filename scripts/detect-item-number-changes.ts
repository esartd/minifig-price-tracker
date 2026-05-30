#!/usr/bin/env ts-node
/**
 * Detect item number changes that could orphan user data
 * Compares old catalog (with descriptions) to new catalog (May 16)
 */

import * as fs from 'fs';
import * as path from 'path';

interface MinifigOld {
  minifigure_no: string;
  name: string;
}

interface MinifigNew {
  minifigure_no: string;
  name: string;
}

async function main() {
  console.log('🔍 DETECTING ITEM NUMBER CHANGES');
  console.log('=================================\n');

  // Load current catalog
  const currentPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
  const current: MinifigNew[] = JSON.parse(fs.readFileSync(currentPath, 'utf-8'));

  // Check for sets too
  const currentSetsPath = path.join(process.cwd(), 'public/catalog/boxes.json');
  const currentSets = JSON.parse(fs.readFileSync(currentSetsPath, 'utf-8'));

  // Load old catalog with descriptions
  const oldSets = JSON.parse(fs.readFileSync('/tmp/boxes-with-descriptions.json', 'utf-8'));

  console.log('📊 Catalog Comparison:');
  console.log(`  Current minifigs: ${current.length}`);
  console.log(`  Current sets: ${currentSets.length}`);
  console.log(`  Old sets (with descriptions): ${oldSets.length}\n`);

  // Find sets that are in old but not in new (possible renumbering candidates)
  const currentSetNos = new Set(currentSets.map((s: any) => s.box_no));
  const oldSetNos = new Set(oldSets.map((s: any) => s.box_no));

  const removedSets = oldSets.filter((s: any) => !currentSetNos.has(s.box_no));
  const addedSets = currentSets.filter((s: any) => !oldSetNos.has(s.box_no));

  console.log('🔄 Set Changes:');
  console.log(`  Removed from catalog: ${removedSets.length}`);
  console.log(`  Added to catalog: ${addedSets.length}\n`);

  if (removedSets.length > 0) {
    console.log('⚠️  REMOVED SETS (could orphan user data):');
    removedSets.slice(0, 20).forEach((s: any) => {
      console.log(`  - ${s.box_no}: ${s.name}`);
    });
    if (removedSets.length > 20) {
      console.log(`  ... and ${removedSets.length - 20} more\n`);
    }
  }

  // Look for potential renumberings by matching names
  console.log('\n🔍 Checking for potential renumberings (same name, different number):\n');

  let potentialRenumberings = 0;
  for (const removed of removedSets.slice(0, 10)) {
    const match = addedSets.find((s: any) =>
      s.name.toLowerCase() === removed.name.toLowerCase()
    );
    if (match) {
      console.log(`  📝 Possible renumbering:`);
      console.log(`     Old: ${removed.box_no} → New: ${match.box_no}`);
      console.log(`     Name: ${removed.name}\n`);
      potentialRenumberings++;
    }
  }

  if (potentialRenumberings === 0) {
    console.log('  ✅ No obvious renumberings detected in sample\n');
  }

  console.log('\n💡 Recommendation:');
  if (removedSets.length > 0) {
    console.log('  - Need item number migration system');
    console.log('  - Create ItemNumberMapping table (old_no → new_no)');
    console.log('  - Run migration to update user collection data');
  } else {
    console.log('  - No removed items detected, catalog is additive only');
  }
}

main().catch(console.error);
