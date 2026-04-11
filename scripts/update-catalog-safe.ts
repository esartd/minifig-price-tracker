/**
 * SAFE Incremental Catalog Update
 *
 * Adds 400 NEW minifigs per day to stay well under Bricklink's 5,000 call/day limit.
 * Reserves 4,600 calls/day for user activity (pricing lookups, search).
 *
 * Progress is saved after each successful addition.
 * Resumes from where it left off on next run.
 *
 * Run: npm run update-catalog-safe
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

interface CatalogEntry {
  no: string;
  name: string;
  keywords: string[];
}

interface Progress {
  lastCheckedId: string;
  lastCheckedTheme: string;
  totalAdded: number;
  lastRun: string;
}

const DAILY_LIMIT = 400; // Accelerated mode: 400 calls/day for catalog updates (still safe at <20% of total limit)

// All themes to check (ordered by popularity)
const THEMES = [
  { prefix: 'sw', name: 'Star Wars', max: 2500, padding: 4 },
  { prefix: 'sh', name: 'Super Heroes', max: 1500, padding: 4 },
  { prefix: 'cty', name: 'City', max: 1500, padding: 4 },
  { prefix: 'njo', name: 'Ninjago', max: 1000, padding: 4 },
  { prefix: 'frnd', name: 'Friends', max: 1000, padding: 4 },
  { prefix: 'mar', name: 'Super Mario', max: 500, padding: 4 },
  { prefix: 'min', name: 'Minecraft', max: 500, padding: 3 },
  { prefix: 'dis', name: 'Disney', max: 500, padding: 3 },
  { prefix: 'hp', name: 'Harry Potter', max: 500, padding: 3 },
  { prefix: 'col', name: 'Collectible Minifigures', max: 500, padding: 3 },
  { prefix: 'cas', name: 'Castle', max: 500, padding: 3 },
  { prefix: 'jw', name: 'Jurassic World', max: 400, padding: 3 },
  { prefix: 'mk', name: 'Monkie Kid', max: 400, padding: 3 },
  { prefix: 'dp', name: 'Disney Princess', max: 300, padding: 2 },
  { prefix: 'trn', name: 'Trains', max: 300, padding: 3 },
  { prefix: 'drz', name: 'DREAMZzz', max: 300, padding: 3 },
  { prefix: 'ide', name: 'Ideas', max: 300, padding: 3 },
  { prefix: 'ico', name: 'Icons', max: 300, padding: 3 },
  { prefix: 'for', name: 'Fortnite', max: 200, padding: 3 },
  { prefix: 'pok', name: 'Pokemon', max: 200, padding: 3 },
  { prefix: 'son', name: 'Sonic', max: 200, padding: 3 },
  { prefix: 'pi', name: 'Pirates', max: 200, padding: 3 },
  { prefix: 'lor', name: 'Lord of the Rings', max: 200, padding: 3 },
  { prefix: 'zel', name: 'Zelda', max: 150, padding: 3 },
  { prefix: 'onp', name: 'One Piece', max: 150, padding: 3 },
  { prefix: 'blu', name: 'Bluey', max: 100, padding: 3 },
  { prefix: 'pep', name: 'Peppa Pig', max: 100, padding: 3 },
  { prefix: 'gab', name: "Gabby's Dollhouse", max: 100, padding: 3 },
  { prefix: 'wed', name: 'Wednesday', max: 100, padding: 3 },
  { prefix: 'wic', name: 'Wicked', max: 100, padding: 3 },
  { prefix: 'nik', name: 'Nike', max: 100, padding: 3 },
  { prefix: 'anc', name: 'Animal Crossing', max: 100, padding: 3 },
];

async function updateCatalogSafe() {
  console.log('🔒 SAFE Incremental Catalog Update');
  console.log(`   Daily limit: ${DAILY_LIMIT} new IDs checked`);
  console.log(`   Reserves 4,900 calls/day for user activity\n`);

  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Load existing catalog
  const catalogPath = path.join(__dirname, '../lib/minifig-catalog.ts');
  const catalogContent = fs.readFileSync(catalogPath, 'utf-8');
  const existingIds = new Set(
    Array.from(catalogContent.matchAll(/no: '([^']+)'/g)).map(m => m[1])
  );

  console.log(`📦 Existing catalog: ${existingIds.size} minifigs\n`);

  // Load progress
  const progressPath = path.join(__dirname, 'catalog-progress-safe.json');
  let progress: Progress = {
    lastCheckedId: '',
    lastCheckedTheme: '',
    totalAdded: 0,
    lastRun: ''
  };

  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    console.log(`📍 Resuming from: ${progress.lastCheckedId || 'start'}`);
    console.log(`   Last run: ${progress.lastRun}`);
    console.log(`   Total added historically: ${progress.totalAdded}\n`);
  }

  const newEntries: CatalogEntry[] = [];
  let checked = 0;
  let found = 0;

  // Find starting theme and ID
  let startThemeIndex = 0;
  let startId = 1;

  if (progress.lastCheckedTheme) {
    startThemeIndex = THEMES.findIndex(t => t.prefix === progress.lastCheckedTheme);
    if (startThemeIndex === -1) startThemeIndex = 0;

    const match = progress.lastCheckedId.match(/\d+/);
    if (match) startId = parseInt(match[0]) + 1;
  }

  // Check IDs until we hit daily limit
  outerLoop: for (let themeIdx = startThemeIndex; themeIdx < THEMES.length; themeIdx++) {
    const theme = THEMES[themeIdx];
    const startNum = themeIdx === startThemeIndex ? startId : 1;

    console.log(`🔍 Checking ${theme.name} (${theme.prefix})...`);

    for (let i = startNum; i <= theme.max; i++) {
      if (checked >= DAILY_LIMIT) {
        console.log(`\n⏸️  Daily limit reached (${DAILY_LIMIT} calls)`);
        break outerLoop;
      }

      const itemNo = `${theme.prefix}${i.toString().padStart(theme.padding, '0')}`;

      // Skip if already in catalog
      if (existingIds.has(itemNo)) {
        progress.lastCheckedId = itemNo;
        progress.lastCheckedTheme = theme.prefix;
        continue;
      }

      process.stdout.write(`\r   Checking: ${itemNo} | New found: ${found} | Checked: ${checked}/${DAILY_LIMIT}`);

      try {
        const minifig = await bricklinkAPI.getMinifigureByNumber(itemNo);
        checked++;

        if (minifig) {
          const keywords = extractKeywords(minifig.name);
          newEntries.push({
            no: minifig.no,
            name: minifig.name,
            keywords: keywords
          });
          found++;
          existingIds.add(minifig.no);
        }

        // Update progress after each check
        progress.lastCheckedId = itemNo;
        progress.lastCheckedTheme = theme.prefix;
        progress.totalAdded += found;
        progress.lastRun = new Date().toISOString();
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

      } catch (error) {
        checked++;
      }

      // 3 second delay (Bricklink requirement)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log(`\n✅ ${theme.name} section complete`);
  }

  console.log(`\n\n📊 Session complete:`);
  console.log(`   New minifigs found: ${found}`);
  console.log(`   IDs checked: ${checked}/${DAILY_LIMIT}`);
  console.log(`   Total catalog size: ${existingIds.size}\n`);

  if (newEntries.length > 0) {
    // Load current catalog and merge
    const catalogModule = await import('../lib/minifig-catalog.js');
    const allEntries = [...catalogModule.minifigCatalog, ...newEntries];

    // Sort by ID
    allEntries.sort((a, b) => a.no.localeCompare(b.no));

    // Write updated catalog
    const content = generateCatalogFile(allEntries);
    fs.writeFileSync(catalogPath, content, 'utf-8');

    console.log(`💾 Catalog updated: +${found} minifigs`);
    console.log(`📦 New total: ${allEntries.length} minifigs\n`);
  } else {
    console.log(`ℹ️  No new minifigs found in this session\n`);
  }

  console.log(`🎉 Safe update complete!`);
  console.log(`   Will resume from ${progress.lastCheckedId} on next run\n`);
}

function extractKeywords(name: string): string[] {
  const keywords: string[] = [];
  keywords.push(name.toLowerCase());

  const characterName = name.split(',')[0].trim();
  if (characterName) {
    keywords.push(characterName.toLowerCase());
  }

  const words = name.split(/[\s,\-()]+/).filter(w => w.length > 2);
  words.forEach(word => keywords.push(word.toLowerCase()));

  return [...new Set(keywords)];
}

function generateCatalogFile(entries: CatalogEntry[]): string {
  const timestamp = new Date().toISOString();

  let content = `/**
 * LEGO Minifigure Catalog
 *
 * Incrementally built from BrickLink API with safe daily limits.
 * Last updated: ${timestamp}
 * Total entries: ${entries.length}
 *
 * DO NOT EDIT MANUALLY - Run 'npm run update-catalog-safe' to add more
 */

export const minifigCatalog = [\n`;

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    content += `  {\n`;
    content += `    no: '${entry.no}',\n`;
    content += `    name: '${entry.name.replace(/'/g, "\\'")}',\n`;
    content += `    keywords: [${entry.keywords.map(k => `'${k.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
    content += `  }${isLast ? '' : ','}\n`;
  });

  content += `];\n`;

  return content;
}

updateCatalogSafe();
