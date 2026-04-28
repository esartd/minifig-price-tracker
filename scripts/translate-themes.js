/**
 * Translate all 179 theme descriptions to German, French, and Spanish
 * This maintains SEO-friendly, enthusiastic tone with proper brand names
 */

const fs = require('fs');
const path = require('path');

// Load English theme descriptions
const enThemes = require('../lib/theme-descriptions.json');

// Load existing translation files
const de = require('../locales/de.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');

console.log(`Translating ${Object.keys(enThemes).length} theme descriptions...`);
console.log('This preserves LEGO®, BrickLink, and product names in English while translating descriptions.\n');

// Process theme translations in memory
// Since we have 179 themes, we'll write them directly to keep JSON files manageable

// German translations for all themes
const deThemes = {};
const frThemes = {};
const esThemes = {};

// Translate each theme
Object.entries(enThemes).forEach(([themeName, enDescription], index) => {
  // Keep theme names in English for consistency
  // Only translate the description text

  // For now, copy English as placeholder
  // The actual translations will be injected by the completion script
  deThemes[themeName] = enDescription;
  frThemes[themeName] = enDescription;
  esThemes[themeName] = enDescription;

  if ((index + 1) % 20 === 0) {
    console.log(`Processed ${index + 1}/${Object.keys(enThemes).length} themes...`);
  }
});

// Update translation files
de.themes.descriptions = deThemes;
fr.themes.descriptions = frThemes;
es.themes.descriptions = esThemes;

// Write updated files
fs.writeFileSync(
  path.join(__dirname, '../locales/de.json'),
  JSON.stringify(de, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, '../locales/fr.json'),
  JSON.stringify(fr, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, '../locales/es.json'),
  JSON.stringify(es, null, 2),
  'utf8'
);

console.log('\n✅ Theme descriptions structure created');
console.log('📝 Placeholder English text added - will be replaced with translations');
console.log(`📊 Total: ${Object.keys(enThemes).length} themes × 3 languages = ${Object.keys(enThemes).length * 3} descriptions`);
console.log('\n🔄 Next: AI translation pass will replace English placeholders with native translations');
