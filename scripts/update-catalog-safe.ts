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
  exhaustedThemes: {
    [themePrefix: string]: {
      lastFullScan: string;  // ISO date when we finished checking 1 to max with 0 new finds
      nextCheckDate: string;  // ISO date when to check again (30 days later)
    }
  };
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
  { prefix: 'idea', name: 'Ideas', max: 300, padding: 4 },
  { prefix: 'jw', name: 'Jurassic World', max: 150, padding: 3 },
  { prefix: 'mk', name: 'Monkie Kid', max: 150, padding: 3 },
  { prefix: 'dp', name: 'Disney Princess', max: 300, padding: 2 },
  { prefix: 'trn', name: 'Trains', max: 300, padding: 3 },
  { prefix: 'drm', name: 'DREAMZzz', max: 100, padding: 3 },
  { prefix: 'fort', name: 'Fortnite', max: 50, padding: 3 },
  { prefix: 'son', name: 'Sonic', max: 50, padding: 3 },
  { prefix: 'pi', name: 'Pirates', max: 200, padding: 3 },
  { prefix: 'lor', name: 'Lord of the Rings', max: 200, padding: 3 },
  { prefix: 'loz', name: 'Zelda', max: 50, padding: 3 },
  { prefix: 'op', name: 'One Piece', max: 50, padding: 2 },
  { prefix: 'blu', name: 'Bluey', max: 50, padding: 3 },
  { prefix: 'gdh', name: "Gabby's Dollhouse", max: 50, padding: 3 },
  { prefix: 'wed', name: 'Wednesday', max: 50, padding: 3 },
  { prefix: 'wck', name: 'Wicked', max: 50, padding: 3 },
  { prefix: 'nike', name: 'Nike', max: 50, padding: 4 },
  { prefix: 'ani', name: 'Animal Crossing', max: 50, padding: 3 },
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
    lastRun: '',
    exhaustedThemes: {}
  };

  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    // Ensure exhaustedThemes exists (for backwards compatibility)
    if (!progress.exhaustedThemes) {
      progress.exhaustedThemes = {};
    }
    console.log(`📍 Resuming from: ${progress.lastCheckedId || 'start'}`);
    console.log(`   Last run: ${progress.lastRun}`);
    console.log(`   Total added historically: ${progress.totalAdded}`);

    const exhaustedCount = Object.keys(progress.exhaustedThemes).length;
    if (exhaustedCount > 0) {
      console.log(`   Exhausted themes: ${exhaustedCount} (skipping for 30 days)`);
    }
    console.log('');
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

    // Skip themes that are exhausted and within 30-day wait period
    if (progress.exhaustedThemes[theme.prefix]) {
      const nextCheck = new Date(progress.exhaustedThemes[theme.prefix].nextCheckDate);
      if (new Date() < nextCheck) {
        console.log(`⏭️  Skipping ${theme.name} (exhausted, next check: ${nextCheck.toLocaleDateString()})`);
        continue;
      } else {
        // 30 days passed, remove from exhausted list and check again
        console.log(`🔄 Re-checking ${theme.name} (30 days since last full scan)`);
        delete progress.exhaustedThemes[theme.prefix];
      }
    }

    console.log(`🔍 Checking ${theme.name} (${theme.prefix})...`);
    let foundInThisTheme = 0;

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
          foundInThisTheme++;
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

    // Mark theme as exhausted if we completed full scan (1 to max) with 0 new finds
    if (startNum === 1 && foundInThisTheme === 0 && checked < DAILY_LIMIT) {
      const now = new Date();
      const nextCheck = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      progress.exhaustedThemes[theme.prefix] = {
        lastFullScan: now.toISOString(),
        nextCheckDate: nextCheck.toISOString()
      };
      console.log(`\n✅ ${theme.name} section complete (exhausted - no new minifigs, will re-check ${nextCheck.toLocaleDateString()})`);
    } else {
      console.log(`\n✅ ${theme.name} section complete (found ${foundInThisTheme} new)`);
    }
  }

  console.log(`\n\n📊 Session complete:`);
  console.log(`   New minifigs found: ${found}`);
  console.log(`   IDs checked: ${checked}/${DAILY_LIMIT}`);
  console.log(`   Total catalog size: ${existingIds.size}`);
  console.log(`   Exhausted themes: ${Object.keys(progress.exhaustedThemes).length} (skipping for 30 days)\n`);

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
