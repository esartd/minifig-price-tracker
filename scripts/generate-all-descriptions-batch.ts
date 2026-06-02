#!/usr/bin/env ts-node
/**
 * INTELLIGENT DESCRIPTION GENERATOR
 *
 * Generates high-quality descriptions for ALL minifigs and sets
 * Uses context-aware generation based on theme, character, and features
 *
 * Usage:
 *   npx ts-node scripts/generate-all-descriptions-batch.ts
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

// Theme-specific context for better descriptions
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
  },
  'DC': {
    setting: 'DC Universe',
    style: 'heroic',
    keywords: ['superhero', 'Justice League', 'Gotham', 'villain', 'Batman', 'Superman']
  },
  'Friends': {
    setting: 'Heartlake City',
    style: 'friendship-focused',
    keywords: ['friends', 'adventure', 'creativity', 'fun', 'activities', 'hobbies']
  },
  'City': {
    setting: 'LEGO City',
    style: 'realistic',
    keywords: ['community', 'heroes', 'everyday', 'service', 'vehicles', 'buildings']
  },
  'Ninjago': {
    setting: 'Ninjago realm',
    style: 'action-packed',
    keywords: ['ninja', 'Spinjitzu', 'master', 'warrior', 'dragon', 'elemental']
  },
  'Minecraft': {
    setting: 'blocky Minecraft world',
    style: 'creative',
    keywords: ['craft', 'build', 'mine', 'survive', 'adventure', 'block']
  },
  'Disney': {
    setting: 'Disney universe',
    style: 'magical',
    keywords: ['character', 'story', 'magic', 'adventure', 'beloved']
  },
  'Creator': {
    setting: 'creative building',
    style: 'versatile',
    keywords: ['build', '3-in-1', 'rebuild', 'creative', 'imaginative']
  },
  'Technic': {
    setting: 'engineering world',
    style: 'technical',
    keywords: ['mechanical', 'function', 'authentic', 'engineering', 'realistic']
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

  // Colors
  const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'brown', 'gray', 'grey', 'gold', 'silver'];
  colors.forEach(color => {
    if (new RegExp(`\\b${color}\\b`, 'i').test(name)) {
      features.push(`${color} coloring`);
    }
  });

  // Clothing/armor
  const clothing = {
    'suit': 'suit', 'armor': 'armor', 'robe': 'robes', 'cape': 'cape',
    'uniform': 'uniform', 'dress': 'dress', 'jacket': 'jacket',
    'helmet': 'helmet', 'hood': 'hood', 'mask': 'mask'
  };
  Object.entries(clothing).forEach(([key, desc]) => {
    if (new RegExp(`\\b${key}\\b`, 'i').test(name)) {
      features.push(desc);
    }
  });

  // Accessories
  const accessories = {
    'sword': 'sword', 'shield': 'shield', 'weapon': 'weapons',
    'staff': 'staff', 'wand': 'wand', 'gun': 'blaster',
    'lightsaber': 'lightsaber', 'bow': 'bow', 'axe': 'axe'
  };
  Object.entries(accessories).forEach(([key, desc]) => {
    if (new RegExp(`\\b${key}\\b`, 'i').test(name)) {
      features.push(desc);
    }
  });

  return features;
}

function generateMinifigDescription(minifig: any): { en: string; de: string; fr: string; es: string } {
  const name = minifig.name;
  const category = minifig.category_name || 'LEGO';
  const year = minifig.year_released;
  const context = getThemeContext(category);
  const features = extractFeatures(name);

  // English description
  let en = `${name} minifigure from the ${category} theme`;

  if (features.length > 0) {
    en += ` features ${features.slice(0, 3).join(', ')}`;
  }

  en += `. This ${context.style} minifigure represents`;

  // Character-specific context
  if (name.toLowerCase().includes('darth') || name.toLowerCase().includes('vader')) {
    en += ` the dark lord of the Sith in detailed form`;
  } else if (name.toLowerCase().includes('luke') || name.toLowerCase().includes('skywalker')) {
    en += ` the legendary Jedi hero`;
  } else if (name.toLowerCase().includes('harry') || name.toLowerCase().includes('potter')) {
    en += ` the boy wizard with his distinctive lightning bolt scar`;
  } else if (name.toLowerCase().includes('spider') || name.toLowerCase().includes('man')) {
    en += ` the web-slinging superhero`;
  } else if (name.toLowerCase().includes('iron') || name.toLowerCase().includes('man')) {
    en += ` Tony Stark's armored alter ego`;
  } else if (name.toLowerCase().includes('batman')) {
    en += ` Gotham's Dark Knight`;
  } else {
    en += ` a character from ${context.setting}`;
  }

  if (year) {
    en += `. Released in ${year}`;
  }

  en += `, this minifigure is perfect for collectors and fans of ${category.split('/')[0].trim()}.`;

  // German description (simplified for batch generation)
  let de = `${name} Minifigur aus dem ${category}-Thema`;
  if (features.length > 0) {
    de += ` mit ${features.slice(0, 2).join(' und ')}`;
  }
  de += `. Diese detaillierte Minifigur`;
  if (year) {
    de += ` wurde ${year} veröffentlicht und`;
  }
  de += ` ist perfekt für Sammler und Fans.`;

  // French description
  let fr = `Figurine ${name} du thème ${category}`;
  if (features.length > 0) {
    fr += ` avec ${features.slice(0, 2).join(' et ')}`;
  }
  fr += `. Cette figurine ${context.style}`;
  if (year) {
    fr += ` sortie en ${year}`;
  }
  fr += ` est parfaite pour les collectionneurs et les fans.`;

  // Spanish description
  let es = `Minifigura de ${name} del tema ${category}`;
  if (features.length > 0) {
    es += ` con ${features.slice(0, 2).join(' y ')}`;
  }
  es += `. Esta minifigura ${context.style}`;
  if (year) {
    es += ` lanzada en ${year}`;
  }
  es += ` es perfecta para coleccionistas y fanáticos.`;

  return { en, de, fr, es };
}

function generateSetDescription(set: any): { en: string; de: string; fr: string; es: string } {
  const name = set.name;
  const category = set.category_name || 'LEGO';
  const boxNo = set.box_no;
  const year = set.year_released;
  const context = getThemeContext(category);

  // English description
  let en = `${name} (Set ${boxNo}) from the ${category} collection`;

  // Try to extract piece count from name if present
  const pieceMatch = name.match(/(\d+)\s*pieces?/i);
  if (pieceMatch) {
    en += ` features ${pieceMatch[1]} pieces`;
  }

  // Set-specific features based on name
  if (name.toLowerCase().includes('castle') || name.toLowerCase().includes('fortress')) {
    en += ` with detailed architecture, towers, and defensive features`;
  } else if (name.toLowerCase().includes('vehicle') || name.toLowerCase().includes('ship') || name.toLowerCase().includes('fighter')) {
    en += ` with authentic details and play features`;
  } else if (name.toLowerCase().includes('house') || name.toLowerCase().includes('building')) {
    en += ` with multiple rooms and interior details`;
  } else if (name.toLowerCase().includes('battle') || name.toLowerCase().includes('attack')) {
    en += ` with action features and play functions`;
  }

  en += `. This ${context.style} set brings ${context.setting} to life`;

  if (year) {
    en += `. Released in ${year}`;
  }

  en += `, perfect for building, display, and play.`;

  // German
  let de = `${name} (Set ${boxNo}) aus der ${category}-Kollektion`;
  if (year) {
    de += `. Veröffentlicht ${year}`;
  }
  de += `, perfekt zum Bauen, Ausstellen und Spielen.`;

  // French
  let fr = `${name} (Ensemble ${boxNo}) de la collection ${category}`;
  if (year) {
    fr += `. Sorti en ${year}`;
  }
  fr += `, parfait pour construire, exposer et jouer.`;

  // Spanish
  let es = `${name} (Set ${boxNo}) de la colección ${category}`;
  if (year) {
    es += `. Lanzado en ${year}`;
  }
  es += `, perfecto para construir, exhibir y jugar.`;

  return { en, de, fr, es };
}

async function main() {
  console.log('🚀 INTELLIGENT DESCRIPTION GENERATOR');
  console.log('=====================================\n');
  console.log(`📊 Total minifigs: ${minifigs.length}`);
  console.log(`📊 Total sets: ${sets.length}`);
  console.log(`📊 Total items: ${minifigs.length + sets.length}\n`);

  console.log('This will generate descriptions for ALL items.');
  console.log('Note: Items with existing descriptions will be skipped.\n');

  let minifigCount = 0;
  let minifigSkipped = 0;
  let setCount = 0;
  let setSkipped = 0;

  // Process minifigs
  console.log('📦 Processing minifigures...\n');
  for (const minifig of minifigs) {
    try {
      // Check if already exists
      const existing = await prisma.minifigCatalog.findUnique({
        where: { minifigure_no: minifig.minifigure_no },
        select: { minifigure_no: true, description_en: true }
      });

      if (existing?.description_en) {
        minifigSkipped++;
        continue;
      }

      const descriptions = generateMinifigDescription(minifig);

      // Upsert to database
      await prisma.minifigCatalog.upsert({
        where: { minifigure_no: minifig.minifigure_no },
        create: {
          minifigure_no: minifig.minifigure_no,
          name: minifig.name,
          category_id: minifig.category_id,
          category_name: minifig.category_name,
          year_released: minifig.year_released,
          weight_grams: minifig.weight ? parseFloat(minifig.weight) : null,
          search_name: minifig.name.toLowerCase(),
          description_en: descriptions.en,
          description_de: descriptions.de,
          description_fr: descriptions.fr,
          description_es: descriptions.es
        },
        update: {
          description_en: descriptions.en,
          description_de: descriptions.de,
          description_fr: descriptions.fr,
          description_es: descriptions.es
        }
      });

      minifigCount++;

      if (minifigCount % 100 === 0) {
        console.log(`  ✓ Generated ${minifigCount} minifig descriptions (${minifigSkipped} skipped)`);
      }

    } catch (error: any) {
      console.error(`  ✗ Error with ${minifig.minifigure_no}: ${error.message}`);
    }
  }

  console.log(`\n✅ Minifigs complete: ${minifigCount} generated, ${minifigSkipped} skipped\n`);

  // Process sets
  console.log('📦 Processing sets...\n');
  for (const set of sets) {
    try {
      // Check if already exists
      const existing = await prisma.setsCatalog.findUnique({
        where: { box_no: set.box_no },
        select: { box_no: true, description_en: true }
      });

      if (existing?.description_en) {
        setSkipped++;
        continue;
      }

      const descriptions = generateSetDescription(set);

      // Upsert to database
      await prisma.setsCatalog.upsert({
        where: { box_no: set.box_no },
        create: {
          box_no: set.box_no,
          name: set.name,
          category_id: set.category_id,
          category_name: set.category_name,
          year_released: set.year_released,
          weight: set.weight,
          search_name: set.name.toLowerCase(),
          description_en: descriptions.en,
          description_de: descriptions.de,
          description_fr: descriptions.fr,
          description_es: descriptions.es
        },
        update: {
          description_en: descriptions.en,
          description_de: descriptions.de,
          description_fr: descriptions.fr,
          description_es: descriptions.es
        }
      });

      setCount++;

      if (setCount % 50 === 0) {
        console.log(`  ✓ Generated ${setCount} set descriptions (${setSkipped} skipped)`);
      }

    } catch (error: any) {
      console.error(`  ✗ Error with ${set.box_no}: ${error.message}`);
    }
  }

  console.log(`\n✅ Sets complete: ${setCount} generated, ${setSkipped} skipped\n`);

  console.log('🎉 GENERATION COMPLETE!');
  console.log('========================');
  console.log(`✓ Total minifig descriptions: ${minifigCount}`);
  console.log(`✓ Total set descriptions: ${setCount}`);
  console.log(`✓ Total generated: ${minifigCount + setCount}`);
  console.log(`- Skipped (already had descriptions): ${minifigSkipped + setSkipped}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
