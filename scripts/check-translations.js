#!/usr/bin/env node
/**
 * Translation health check.
 *
 * Exists because two failures got all the way to production unnoticed:
 *
 *  1. A word-level find-and-replace was run across already-English text,
 *     producing 439 strings that were neither English nor the target language
 *     ("something that's net in the database", "you've probably enantalered
 *     Bricklink", "If you're serious O nas buying").
 *
 *  2. guides.cta was rewritten in English and no translation followed. Three
 *     locales kept a translation of the old copy and six kept the old English
 *     verbatim. Nothing surfaced it, because the keys were all present and
 *     none of them looked obviously wrong.
 *
 * The second is the one worth guarding against long-term, and it needs state:
 * you cannot tell "translated, then English changed" from "translated fine"
 * by looking at the current files alone. So en-baseline.json records a hash of
 * every English value as of the last review. When an English string changes,
 * its hash stops matching and every locale is flagged as needing a revisit.
 *
 * The baseline also records which strings were reviewed and deliberately left
 * identical to English — "Star Wars", "Premium", "Name A-Z". Without that the
 * check reports 255 non-problems on a clean tree, and a check that cries wolf
 * is a check nobody runs. Recording the accepted set means a clean tree
 * reports zero and only genuine regressions surface.
 *
 * Run `node scripts/check-translations.js --accept` after reviewing
 * translations to re-baseline. That step is what makes this meaningful — skip
 * it and everything stays flagged forever.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIR = path.join(__dirname, '..', 'translations-backup');
const BASELINE = path.join(DIR, 'en-baseline.json');
const SOURCE = 'en';

/**
 * Values that are legitimately identical across languages, so "same as
 * English" is not evidence of anything. Mostly proper nouns.
 */
const SAME_IS_FINE = [
  /^(FigTracker|LEGO|eBay|Whatnot|BrickLink|Bricklink|Amazon|Google|Discord|Instagram|YouTube|Reddit)$/i,
  /^(Star Wars|Harry Potter|Ninjago|Marvel|DC|Minecraft|Disney|Friends|City|Super Heroes|Technic|Duplo|Creator)$/i,
  /^(Amazon Associates|Google Analytics|Bricklink API|Premium|Prime|Avatar|Beta|OK|Email|E-Mail|API|CSV|XML|JSON|HTTPS|USD|EUR|GBP|SEO|FAQ|ID|URL)$/i,
  /^[\s\d\W]*$/,              // numbers, punctuation, placeholders only
  /^.{0,3}$/,                 // too short to carry meaning
];

/**
 * English function words that are not words in any of the nine target
 * languages. Two or more inside one string means English leaked in.
 *
 * Deliberately excludes words that ARE valid elsewhere and caused false
 * positives when this was first written: "Explore" (Portuguese),
 * "Information" (Swedish/German), "Download" (Dutch), "Data" (Polish for
 * "date"), "total", "Guide", "Collection", "Filter".
 */
const ENGLISH_ONLY = /\b(the|your|you|with|when|which|these|their|through|about|would|should|could|knew|includes)\b/gi;

/** Official names that contain English articles and must not trip the check. */
const PROPER_NOUNS = /(May the 4th|Star Wars|The Lord of the Rings|The Hobbit|The LEGO Movie|The Simpsons|The Batman|The Lone Ranger|Back to the Future|Pirates of the Caribbean|The Mandalorian|Sonic the Hedgehog|The Next Generation|The Last Airbender|The Way of Water|and the Wasp|The Rise Of Gru|The Legend of Zelda|Winnie the Pooh|Toy Story|Day of the|March of the|Master of the|Rise of the|Secrets of the|The Battle of|Top Supporters|My Store|Upload Inventory)/gi;

/** Sections whose keys are not rendered anywhere; noise if reported. */
const IGNORED_SECTIONS = /^(themeDescriptions|themes\.descriptions|guideArticles)\./;

function flatten(value, prefix = '') {
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    const dotted = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      Object.assign(out, flatten(child, dotted));
    } else if (Array.isArray(child)) {
      // Arrays of objects (faq.items, guides.items) must not collapse to
      // "[object Object]" — every locale would then look identical.
      out[dotted] = child
        .map((item) => (item && typeof item === 'object' ? JSON.stringify(item) : String(item)))
        .join(' | ');
    } else {
      out[dotted] = child;
    }
  }
  return out;
}

function hash(value) {
  return crypto.createHash('sha1').update(String(value)).digest('hex').slice(0, 12);
}

function load(locale) {
  return flatten(JSON.parse(fs.readFileSync(path.join(DIR, `${locale}.json`), 'utf8')));
}

function looksEnglish(text) {
  if (typeof text !== 'string' || text.length < 12) return false;
  return (text.replace(PROPER_NOUNS, '').match(ENGLISH_ONLY) || []).length >= 2;
}

function sameIsFine(text) {
  return typeof text !== 'string' || SAME_IS_FINE.some((re) => re.test(text.trim()));
}

function main() {
  const accept = process.argv.includes('--accept');

  const locales = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.json') && f !== 'en-baseline.json')
    .map((f) => f.replace(/\.json$/, ''));

  const english = load(SOURCE);
  const targets = locales.filter((l) => l !== SOURCE);

  if (accept) {
    const sourceHashes = {};
    for (const [key, value] of Object.entries(english)) sourceHashes[key] = hash(value);

    // Everything currently identical to English is taken as reviewed. Anything
    // that becomes identical later is new, and gets reported.
    const acceptedIdentical = [];
    for (const locale of targets) {
      const strings = load(locale);
      for (const [key, source] of Object.entries(english)) {
        if (IGNORED_SECTIONS.test(key)) continue;
        if (strings[key] === source) acceptedIdentical.push(`${locale}:${key}`);
      }
    }

    fs.writeFileSync(
      BASELINE,
      JSON.stringify({ sourceHashes, acceptedIdentical: acceptedIdentical.sort() }, null, 2) + '\n',
      'utf8'
    );
    console.log(`Baseline updated: ${Object.keys(sourceHashes).length} English strings,`);
    console.log(`${acceptedIdentical.length} locale strings accepted as intentionally identical.`);
    return;
  }

  let baseline = null;
  if (fs.existsSync(BASELINE)) baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const sourceHashes = baseline ? baseline.sourceHashes || {} : {};
  const accepted = new Set(baseline ? baseline.acceptedIdentical || [] : []);

  const problems = { missing: [], english: [], mangled: [], drifted: [] };

  // English changed since the last review — every locale needs a revisit.
  if (baseline) {
    for (const [key, value] of Object.entries(english)) {
      if (IGNORED_SECTIONS.test(key)) continue;
      if (sourceHashes[key] && sourceHashes[key] !== hash(value)) problems.drifted.push(key);
    }
  }

  for (const locale of targets) {
    const strings = load(locale);
    for (const [key, source] of Object.entries(english)) {
      if (IGNORED_SECTIONS.test(key)) continue;
      const value = strings[key];

      if (value === undefined) {
        problems.missing.push(`${locale}  ${key}`);
      } else if (value === source && !sameIsFine(source) && !accepted.has(`${locale}:${key}`)) {
        problems.english.push(`${locale}  ${key}`);
      } else if (value !== source && looksEnglish(value)) {
        problems.mangled.push(`${locale}  ${key}`);
      }
    }
  }

  const report = (label, items, explain) => {
    if (items.length === 0) return;
    console.log(`\n${label}: ${items.length}`);
    console.log(`  ${explain}`);
    for (const item of items.slice(0, 15)) console.log(`    ${item}`);
    if (items.length > 15) console.log(`    ... and ${items.length - 15} more`);
  };

  console.log(`Checked ${targets.length} locales against ${SOURCE}.json (${Object.keys(english).length} keys).`);

  report('MISSING KEYS', problems.missing, 'Present in English, absent here. Falls back to the key or the inline default.');
  report('NEWLY ENGLISH', problems.english, 'Now identical to the English source and not previously accepted as such.');
  report('PARTLY ENGLISH', problems.mangled, 'Target language with English words left inside it.');
  report('ENGLISH CHANGED', problems.drifted, 'Source text edited since the last review; translations may now be stale.');

  if (!baseline) {
    console.log('\nNo baseline found, so drift was not checked.');
    console.log('Run `node scripts/check-translations.js --accept` to record one.');
  }

  const total = Object.values(problems).reduce((sum, list) => sum + list.length, 0);
  if (total === 0) {
    console.log('\nNo problems found.');
    return;
  }

  console.log(`\n${total} issue(s). After fixing, re-baseline with --accept.`);
  process.exitCode = 1;
}

main();
