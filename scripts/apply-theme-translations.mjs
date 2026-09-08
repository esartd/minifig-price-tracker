/**
 * Apply a batch of theme-description translations.
 *
 *   node scripts/apply-theme-translations.mjs <batch.json>
 *
 * The batch file is { "<locale>": { "<Theme name>": "<translation>", ... } }.
 * Writing them through a JSON file rather than inline in a shell heredoc is
 * deliberate: a heredoc reaches python without an encoding declaration and
 * silently mangles anything non-ASCII, which is a poor way to fix a bug about
 * mangled non-ASCII text.
 *
 * Refuses to write a value identical to the English source, so a batch that
 * accidentally carries the original through is caught here rather than in a
 * deploy log.
 */

import fs from 'node:fs';
import path from 'node:path';

const DIR = 'translations-backup';
const batchPath = process.argv[2];

if (!batchPath) {
  console.error('usage: node scripts/apply-theme-translations.mjs <batch.json>');
  process.exit(1);
}

const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
const english = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8')).themeDescriptions;

let applied = 0;
let refused = 0;
let unknown = 0;

for (const [locale, entries] of Object.entries(batch)) {
  const file = path.join(DIR, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.themeDescriptions ??= {};

  let n = 0;
  for (const [theme, text] of Object.entries(entries)) {
    if (!(theme in english)) {
      console.warn(`  ${locale}: "${theme}" is not a theme in en.json -- skipped`);
      unknown++;
      continue;
    }
    if (text.trim() === english[theme].trim()) {
      console.warn(`  ${locale}: "${theme}" is identical to English -- refused`);
      refused++;
      continue;
    }
    data.themeDescriptions[theme] = text;
    n++;
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  ${locale}: ${n} applied`);
  applied += n;
}

const remaining = {};
for (const locale of ['it', 'ja', 'nl', 'pl', 'pt', 'sv']) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, `${locale}.json`), 'utf8'));
  remaining[locale] = Object.entries(data.themeDescriptions ?? {}).filter(
    ([k, v]) => v === english[k]
  ).length;
}

console.log(`\n${applied} applied, ${refused} refused as English, ${unknown} unknown themes.`);
console.log('Still English:', JSON.stringify(remaining));
console.log(`Remaining total: ${Object.values(remaining).reduce((a, b) => a + b, 0)}`);
