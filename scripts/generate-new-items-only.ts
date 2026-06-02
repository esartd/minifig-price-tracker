#!/usr/bin/env ts-node
/**
 * SMART SCRIPT: Only generate descriptions for items not in database
 * Uses batch queries instead of one-by-one checks
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || process.env.HOSTINGER_DATABASE_URL
});

// Load catalogs
const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const setsPath = path.join(process.cwd(), 'public/catalog/boxes.json');

const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));
const sets = JSON.parse(fs.readFileSync(setsPath, 'utf-8'));

// Theme context (same as batch script)
const themeContext: Record<string, { setting: string; style: string; keywords: string[] }> = {
  'Star Wars': {
    setting: 'galaxy far, far away',
    style: 'iconic',
    keywords: ['Force', 'Empire', 'Rebellion', 'Jedi', 'Sith', 'clone', 'droid', 'lightsaber']
  },
  'Harry Potter': {
    setting: 'wizarding world',
    style: 'magical',
    keywords: ['Hogwarts', 'spell', 'wand', 'house', 'Gryffindor', 'Slytherin', 'potion', 'wizard']
  },
  'Marvel': {
    setting: 'Marvel Universe',
    style: 'heroic',
    keywords: ['superhero', 'Avengers', 'power', 'villain', 'battle', 'hero', 'Marvel']
  }
};

function getThemeContext(categoryName: string) {
  for (const [theme, context] of Object.entries(themeContext)) {
    if (categoryName.toLowerCase().includes(theme.toLowerCase())) {
      return context;
    }
  }
  return {
    setting: 'LEGO universe',
    style: 'detailed',
    keywords: ['build', 'play', 'collect', 'display']
  };
}

function extractFeatures(name: string): string[] {
  const features: string[] = [];
  const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple'];
  colors.forEach(color => {
    if (new RegExp(`\\b${color}\\b`, 'i').test(name)) {
      features.push(`${color} coloring`);
    }
  });
  return features;
}

function generateMinifigDescription(minifig: any) {
  const name = minifig.name;
  const category = minifig.category_name || 'LEGO';
  const year = minifig.year_released;
  const context = getThemeContext(category);
  const features = extractFeatures(name);

  let en = `${name} minifigure from the ${category} theme`;
  if (features.length > 0) {
    en += ` features ${features.slice(0, 3).join(', ')}`;
  }
  en += `. This ${context.style} minifigure represents a character from ${context.setting}`;
  if (year) {
    en += `. Released in ${year}`;
  }
  en += `, this minifigure is perfect for collectors and fans of ${category.split('/')[0].trim()}.`;

  let de = `${name} Minifigur aus dem ${category}-Thema`;
  if (year) {
    de += ` wurde ${year} veröffentlicht und`;
  }
  de += ` ist perfekt für Sammler und Fans.`;

  let fr = `Figurine ${name} du thème ${category}`;
  if (year) {
    fr += ` sortie en ${year}`;
  }
  fr += ` est parfaite pour les collectionneurs et les fans.`;

  let es = `Minifigura de ${name} del tema ${category}`;
  if (year) {
    es += ` lanzada en ${year}`;
  }
  es += ` es perfecta para coleccionistas y fanáticos.`;

  return { en, de, fr, es };
}

function generateSetDescription(set: any) {
  const name = set.name;
  const category = set.category_name || 'LEGO';
  const boxNo = set.box_no;
  const year = set.year_released;
  const context = getThemeContext(category);

  let en = `${name} (Set ${boxNo}) from the ${category} collection brings ${context.setting} to life`;
  if (year) {
    en += `. Released in ${year}`;
  }
  en += `, perfect for building, display, and play.`;

  let de = `${name} (Set ${boxNo}) aus der ${category}-Kollektion`;
  if (year) {
    de += `. Veröffentlicht ${year}`;
  }
  de += `, perfekt zum Bauen, Ausstellen und Spielen.`;

  let fr = `${name} (Ensemble ${boxNo}) de la collection ${category}`;
  if (year) {
    fr += `. Sorti en ${year}`;
  }
  fr += `, parfait pour construire, exposer et jouer.`;

  let es = `${name} (Set ${boxNo}) de la colección ${category}`;
  if (year) {
    es += `. Lanzado en ${year}`;
  }
  es += `, perfecto para construir, exhibir y jugar.`;

  return { en, de, fr, es };
}

async function main() {
  console.log('🚀 SMART NEW ITEMS GENERATOR');
  console.log('============================\n');

  // Step 1: Get all existing item numbers from database in ONE query
  console.log('📊 Fetching existing items from database...');
  const existingMinifigs = await prisma.minifigCatalog.findMany({
    select: { minifigure_no: true }
  });
  const existingSets = await prisma.setsCatalog.findMany({
    select: { box_no: true }
  });

  const existingMinifigNos = new Set(existingMinifigs.map(m => m.minifigure_no));
  const existingSetNos = new Set(existingSets.map(s => s.box_no));

  console.log(`   Existing minifigs: ${existingMinifigNos.size}`);
  console.log(`   Existing sets: ${existingSetNos.size}\n`);

  // Step 2: Find NEW items (in JSON but not in database)
  const newMinifigs = minifigs.filter((m: any) => !existingMinifigNos.has(m.minifigure_no));
  const newSets = sets.filter((s: any) => !existingSetNos.has(s.box_no));

  console.log('📦 New items found:');
  console.log(`   Minifigs: ${newMinifigs.length}`);
  console.log(`   Sets: ${newSets.length}`);
  console.log(`   Total: ${newMinifigs.length + newSets.length}\n`);

  if (newMinifigs.length === 0 && newSets.length === 0) {
    console.log('✅ No new items to process!\n');
    await prisma.$disconnect();
    return;
  }

  // Step 3: Generate and insert new minifigs
  if (newMinifigs.length > 0) {
    console.log('🔨 Generating minifig descriptions...');
    const minifigData = newMinifigs.map((m: any) => {
      const descriptions = generateMinifigDescription(m);
      return {
        minifigure_no: m.minifigure_no,
        name: m.name,
        category_id: m.category_id,
        category_name: m.category_name,
        year_released: m.year_released,
        weight_grams: m.weight ? parseFloat(m.weight) : null,
        search_name: m.name.toLowerCase(),
        description_en: descriptions.en,
        description_de: descriptions.de,
        description_fr: descriptions.fr,
        description_es: descriptions.es
      };
    });

    await prisma.minifigCatalog.createMany({
      data: minifigData,
      skipDuplicates: true
    });
    console.log(`   ✅ Added ${newMinifigs.length} minifigs\n`);
  }

  // Step 4: Generate and insert new sets
  if (newSets.length > 0) {
    console.log('🔨 Generating set descriptions...');
    const setData = newSets.map((s: any) => {
      const descriptions = generateSetDescription(s);
      return {
        box_no: s.box_no,
        name: s.name,
        category_id: s.category_id,
        category_name: s.category_name,
        year_released: s.year_released,
        weight: s.weight,
        search_name: s.name.toLowerCase(),
        description_en: descriptions.en,
        description_de: descriptions.de,
        description_fr: descriptions.fr,
        description_es: descriptions.es,
        description_status: 'generated'
      };
    });

    await prisma.setsCatalog.createMany({
      data: setData,
      skipDuplicates: true
    });
    console.log(`   ✅ Added ${newSets.length} sets\n`);
  }

  console.log('🎉 COMPLETE!');
  console.log(`   Total new items: ${newMinifigs.length + newSets.length}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
