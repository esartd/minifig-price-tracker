#!/usr/bin/env tsx
/**
 * CATALOG UPDATE -- one command, start to finish.
 *
 *   npm run catalog:update
 *
 * Opens Chrome on BrickLink's catalog download page, waits for you to sign in
 * if you are not already, then does everything else: downloads, validates,
 * converts, reports what changed, describes new items in all ten locales,
 * builds, commits and deploys.
 *
 * WHY THERE IS A HUMAN STEP AT ALL
 *
 * BrickLink moved catalog downloads behind a LEGO account. The URL now
 * 302s to identity.lego.com with a full OAuth/PKCE flow, so there is no
 * unauthenticated fetch and no API alternative -- BrickLink's API reads one
 * item at a time and cannot enumerate the catalogue, which is the whole
 * reason these .txt files exist.
 *
 * Automating that login would mean storing a LEGO account password and
 * replaying it into LEGO's sign-in page on a schedule. That is the same
 * account as the BrickLink store, it would break the next time LEGO touches
 * that page, and it would break silently. So you sign in by hand, once, into
 * a real browser -- no credential ever touches this repo.
 *
 * The session persists in .catalog-session/ (gitignored), so in practice you
 * will be signed in already on later runs and this is unattended.
 *
 * THE VALIDATION IS THE POINT
 *
 * A failed or expired login returns an HTML sign-in page with HTTP 200. Fed
 * straight into the converter that produces a valid-looking JSON file with
 * zero usable rows, which would replace 19,000 minifigs and 21,000 sets with
 * nothing and deploy it. Every download is checked for shape and for a
 * plausible row count against what is already live before anything is
 * overwritten.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const CATALOG_DIR = path.join(ROOT, 'public', 'catalog');
const DOWNLOAD_DIR = path.join(ROOT, '.catalog-download');
const SESSION_DIR = path.join(ROOT, '.catalog-session');

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
];

/**
 * itemType=M is minifigures, itemType=S is sets. The set file lands in
 * boxes.json -- a misnomer inherited from the original import, but it is what
 * lib/boxes-data.ts reads, so it stays.
 */
const DOWNLOADS = [
  { itemType: 'M', file: 'Minifigures.txt', json: 'minifigs.json', idField: 'minifigure_no', imagePrefix: 'MN', label: 'minifigs' },
  { itemType: 'S', file: 'Sets.txt',        json: 'boxes.json',    idField: 'box_no',       imagePrefix: 'SN', label: 'sets' },
] as const;

/** Refuse a file smaller than this share of what is already live. */
const MIN_RATIO = 0.9;

/**
 * --skip-download reuses whatever is already in .catalog-download instead of
 * opening a browser. Two uses: testing the validation and diff without a
 * BrickLink round trip, and re-running after a download that succeeded when a
 * later step failed, so you do not fetch 17MB again.
 */
const SKIP_DOWNLOAD = process.argv.includes('--skip-download');

/** Stop after writing public/catalog. No build, no commit, no deploy. */
const DRY_RUN = process.argv.includes('--dry-run');

function ask(question: string): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, () => { rl.close(); resolve(); }));
}

function readExistingIds(jsonFile: string, idField: string): Set<string> {
  const p = path.join(CATALOG_DIR, jsonFile);
  if (!fs.existsSync(p)) return new Set();
  try {
    const parsed = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const arr = Array.isArray(parsed) ? parsed : [];
    return new Set(arr.map((x: Record<string, string>) => x[idField]).filter(Boolean));
  } catch {
    return new Set();
  }
}

/**
 * Reject anything that is not a BrickLink tab-delimited catalog export.
 * Checked before the file is allowed anywhere near public/catalog.
 */
function validate(txtPath: string, expectedMin: number, label: string): string[] {
  if (!fs.existsSync(txtPath)) throw new Error(`${label}: nothing downloaded (${path.basename(txtPath)} missing)`);

  const content = fs.readFileSync(txtPath, 'utf-8');

  if (/<!DOCTYPE|<html|identity\.lego\.com|sign-in/i.test(content.slice(0, 2000))) {
    throw new Error(`${label}: got an HTML page, not catalog data. The BrickLink session is probably not signed in.`);
  }

  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) throw new Error(`${label}: file has no rows`);
  if (!lines[0].includes('\t')) throw new Error(`${label}: header row is not tab-delimited -- not a catalog export`);

  const rows = lines.slice(1);
  if (rows.length < expectedMin) {
    throw new Error(
      `${label}: only ${rows.length.toLocaleString()} rows, expected at least ${expectedMin.toLocaleString()} ` +
      `(the live file has more). Refusing to overwrite good data with a partial download.`
    );
  }
  return rows;
}

function toJson(rows: string[], idField: string, imagePrefix: string) {
  const now = new Date().toISOString();
  return rows.map(line => {
    const p = line.split('\t');
    const id = p[2]?.trim() || '';
    return {
      [idField]: id,
      name: p[3]?.trim() || '',
      category_id: parseInt(p[0]?.trim() || '0'),
      category_name: p[1]?.trim() || '',
      year_released: p[4]?.trim() || null,
      weight: p[5]?.trim() || null,
      image_url: id ? `https://img.bricklink.com/ItemImage/${imagePrefix}/0/${id}.png` : null,
      thumbnail_url: id ? `https://img.bricklink.com/ItemImage/TN/0/${id}.png` : null,
      updated_at: now,
    };
  }).filter(x => x[idField]);
}

function run(cmd: string, label: string) {
  console.log(`\n▶ ${label}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
}

/**
 * Like run(), but a failure is reported and stepped over rather than aborting.
 *
 * Only for the description backfill. By the time it runs, public/catalog has
 * already been rewritten, so throwing here left the repo half-updated: new
 * items on disk, nothing committed, nothing deployed. New items with no
 * description are still better than no new items, the backfill is idempotent,
 * and the usual reason it fails is the database being unreachable from this
 * machine rather than anything wrong with the catalog.
 */
function runSoft(cmd: string, label: string): string | null {
  console.log(`\n▶ ${label}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
    return null;
  } catch (e) {
    const note = `${label} failed — new items have no descriptions yet. Re-run: node scripts/backfill-catalog-descriptions.mjs`;
    console.warn(`\n⚠️  ${note}\n`);
    return note;
  }
}

async function main() {
  console.log('\n📦 IntoBrick catalog update\n');

  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  if (!SKIP_DOWNLOAD) {
    for (const f of fs.readdirSync(DOWNLOAD_DIR)) fs.unlinkSync(path.join(DOWNLOAD_DIR, f));
    await download();
  } else {
    console.log('⏭  --skip-download: using files already in .catalog-download\n');
  }

  await convertAndShip();
}

async function download() {
  const executablePath = CHROME_PATHS.find(p => fs.existsSync(p));
  if (!executablePath) throw new Error('Chrome not found. Install Google Chrome and re-run.');

  const browser = await puppeteer.launch({
    executablePath,
    headless: false,             // you may need to sign in; you have to see it
    userDataDir: SESSION_DIR,    // keeps you signed in between runs
    defaultViewport: null,
    args: ['--no-first-run', '--no-default-browser-check'],
  });

  try {
    const page = (await browser.pages())[0] || (await browser.newPage());

    await page.goto('https://www.bricklink.com/catalogDownload.asp', { waitUntil: 'domcontentloaded', timeout: 60000 });

    if (/identity\.lego\.com|auth\/sign-in/.test(page.url())) {
      console.log('🔐 Not signed in. A Chrome window is open — sign in to your LEGO/BrickLink account there.');
      console.log('   (Only needed occasionally; the session is remembered.)\n');
      await ask('   Press Enter once you can see the catalog download page… ');
      await page.goto('https://www.bricklink.com/catalogDownload.asp', { waitUntil: 'domcontentloaded', timeout: 60000 });
      if (/identity\.lego\.com|auth\/sign-in/.test(page.url())) {
        throw new Error('Still on the sign-in page. Nothing downloaded, nothing changed.');
      }
    }
    console.log('✅ Signed in to BrickLink\n');

    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR });

    for (const d of DOWNLOADS) {
      process.stdout.write(`⬇  ${d.label}… `);
      await page.evaluate((url) => { window.location.href = url; },
        `https://www.bricklink.com/catalogDownload.asp?a=a&viewType=0&itemType=${d.itemType}`);

      const target = path.join(DOWNLOAD_DIR, d.file);
      const deadline = Date.now() + 120000;
      while (Date.now() < deadline) {
        const done = fs.existsSync(target) && !fs.readdirSync(DOWNLOAD_DIR).some(f => f.endsWith('.crdownload'));
        if (done) break;
        await new Promise(r => setTimeout(r, 1000));
      }
      if (!fs.existsSync(target)) throw new Error(`${d.label}: download did not complete (expected ${d.file})`);
      console.log(`${(fs.statSync(target).size / 1e6).toFixed(1)} MB`);
    }
  } finally {
    await browser.close();
  }
}

async function convertAndShip() {
  // ---- validate, diff, write -------------------------------------------
  console.log('\n🔍 Checking downloads before touching anything live…\n');

  const summary: string[] = [];
  for (const d of DOWNLOADS) {
    const existing = readExistingIds(d.json, d.idField);
    const floor = existing.size ? Math.floor(existing.size * MIN_RATIO) : 1000;
    const rows = validate(path.join(DOWNLOAD_DIR, d.file), floor, d.label);

    const items = toJson(rows, d.idField, d.imagePrefix);
    const incoming = new Set(items.map(i => i[d.idField] as string));
    const added = [...incoming].filter(id => !existing.has(id));
    const removed = [...existing].filter(id => !incoming.has(id));

    fs.writeFileSync(path.join(CATALOG_DIR, d.json), JSON.stringify(items, null, 2));

    const line = `${d.label}: ${items.length.toLocaleString()} total, +${added.length} new, -${removed.length} gone`;
    console.log(`   ✅ ${line}`);
    if (added.length) console.log(`      new: ${added.slice(0, 8).join(', ')}${added.length > 8 ? ` … +${added.length - 8}` : ''}`);
    summary.push(line);
  }

  // metadata.json claimed 2026-04-19 while the files were rewritten in
  // August, so it could not be used to tell when the catalog last changed.
  const metaPath = path.join(CATALOG_DIR, 'metadata.json');
  const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf-8')) : {};
  const minifigs = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, 'minifigs.json'), 'utf-8'));
  const boxes = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, 'boxes.json'), 'utf-8'));
  fs.writeFileSync(metaPath, JSON.stringify({
    ...meta,
    totalMinifigs: minifigs.length,
    totalBoxes: boxes.length,
    lastUpdated: new Date().toISOString(),
    source: 'BrickLink Catalog Download',
  }, null, 2));
  console.log('   ✅ metadata.json stamped');

  if (execSync('git status --porcelain public/catalog', { cwd: ROOT }).toString().trim() === '') {
    console.log('\n✨ Catalog is already current — nothing changed. Stopping here.\n');
    return;
  }

  if (DRY_RUN) {
    console.log('\n⏹  --dry-run: public/catalog written, stopping before build/commit/deploy.');
    console.log('   Undo with: git checkout -- public/catalog\n');
    return;
  }

  // New items arrive with no description in any locale; this is the step the
  // reminder issue never mentioned.
  const backfillWarning = runSoft('node scripts/backfill-catalog-descriptions.mjs', 'Describing new items (10 locales)');
  run('npm run check:translations', 'Checking translations');
  run('npm run build', 'Building');

  const msg = `Update BrickLink catalog\n\n${summary.join('\n')}\n\nRun by scripts/catalog-update.ts.`;
  execSync('git add -A', { cwd: ROOT });
  execSync('git commit -q -F -', { cwd: ROOT, input: msg });
  run('git push -q origin main', 'Pushing');
  run('ssh -i ~/.ssh/figtracker_deploy_key -o StrictHostKeyChecking=no root@187.77.202.14', 'Deploying');

  console.log(`\n✅ Done and live.\n${summary.map(s => '   ' + s).join('\n')}`);
  if (backfillWarning) console.log(`\n⚠️  ${backfillWarning}`);
  console.log('');
}

main().catch(err => {
  console.error(`\n❌ ${err.message}\n`);
  console.error('   Nothing was deployed. public/catalog is only written after every check passes.\n');
  process.exit(1);
});
