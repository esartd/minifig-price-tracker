/**
 * Restore good batch descriptions and apply them to boxes.json
 * This restores the hand-written quality descriptions from batch files
 */

const fs = require('fs');
const path = require('path');

// Load all description batches (original batches)
const starWarsUCS = require('./descriptions-star-wars-ucs');
const starWarsPopular = require('./descriptions-star-wars-popular');
const starWarsRecent = require('./descriptions-star-wars-recent');
const starWarsVehicles = require('./descriptions-star-wars-vehicles');
const harryPotter = require('./descriptions-harry-potter');
const marvelDC = require('./descriptions-marvel-dc');
const architectureIcons = require('./descriptions-architecture-icons');
const creatorExpert = require('./descriptions-creator-expert');
const technic = require('./descriptions-technic');
const cityModular = require('./descriptions-city-modular');
const ninjagoCity = require('./descriptions-ninjago-city');
const friends = require('./descriptions-friends');
const disney = require('./descriptions-disney');
const lordOfTheRings = require('./descriptions-lord-of-the-rings');
const jurassicWorld = require('./descriptions-jurassic-world');
const minecraft = require('./descriptions-minecraft');
const speedChampions = require('./descriptions-speed-champions');
const superMario = require('./descriptions-super-mario');
const monkieKid = require('./descriptions-monkie-kid');
const batman = require('./descriptions-batman');
const megaFlagship = require('./descriptions-mega-flagship-1');

// Load expanded batches (new quality descriptions)
const starWarsUCSExpanded = require('./descriptions-star-wars-ucs-expanded');
const harryPotterExpanded = require('./descriptions-harry-potter-expanded');
const marvelDCExpanded = require('./descriptions-marvel-dc-expanded');
const architectureCreatorExpanded = require('./descriptions-architecture-creator-expanded');
const recentFlagships = require('./descriptions-recent-flagships');
const culturallySignificant = require('./descriptions-culturally-significant');

// Combine all quality descriptions
const qualityDescriptions = {
  ...starWarsUCS,
  ...starWarsPopular,
  ...starWarsRecent,
  ...starWarsVehicles,
  ...harryPotter,
  ...marvelDC,
  ...architectureIcons,
  ...creatorExpert,
  ...technic,
  ...cityModular,
  ...ninjagoCity,
  ...friends,
  ...disney,
  ...lordOfTheRings,
  ...jurassicWorld,
  ...minecraft,
  ...speedChampions,
  ...superMario,
  ...monkieKid,
  ...batman,
  ...megaFlagship,
  // New expanded batches
  ...starWarsUCSExpanded,
  ...harryPotterExpanded,
  ...marvelDCExpanded,
  ...architectureCreatorExpanded,
  ...recentFlagships,
  ...culturallySignificant
};

const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
console.log('📦 Loading boxes.json...');
const boxes = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));

console.log(`Total sets in catalog: ${boxes.length}`);
console.log(`Quality descriptions available: ${Object.keys(qualityDescriptions).length}\n`);

let updatedCount = 0;

console.log('✨ Restoring quality descriptions...\n');

for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];
  const qualityDesc = qualityDescriptions[box.box_no];

  if (qualityDesc) {
    boxes[i].description_en = qualityDesc.en;
    boxes[i].description_de = qualityDesc.de;
    boxes[i].description_fr = qualityDesc.fr;
    boxes[i].description_es = qualityDesc.es;
    updatedCount++;
    console.log(`✅ ${updatedCount}. ${box.box_no} - ${box.name}`);
  }
}

console.log(`\n💾 Saving updates to boxes.json...`);
fs.writeFileSync(boxesPath, JSON.stringify(boxes, null, 2), 'utf-8');

console.log(`\n✅ RESTORE COMPLETE!`);
console.log(`📊 Restored ${updatedCount} quality descriptions`);
console.log(`📈 ${(boxes.length - updatedCount).toLocaleString()} sets still have generic descriptions`);
console.log(`💾 Saved to ${boxesPath}`);
