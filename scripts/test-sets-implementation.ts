/**
 * Test script for LEGO Sets implementation
 * Run: npx tsx scripts/test-sets-implementation.ts
 */

import { loadAllBoxes, getRecentBoxes, searchBoxes, getBoxByNumber, getPopularThemes, getAllThemes } from '../lib/boxes-data';

console.log('🧱 Testing LEGO Sets Implementation\n');
console.log('='.repeat(60));

// Test 1: Load all boxes
console.log('\n📦 Test 1: Loading all boxes from boxes.json');
const allBoxes = loadAllBoxes();
console.log(`✅ Total boxes loaded: ${allBoxes.length.toLocaleString()}`);
console.log(`   First box: ${allBoxes[0]?.box_no} - ${allBoxes[0]?.name}`);
console.log(`   Last box: ${allBoxes[allBoxes.length - 1]?.box_no} - ${allBoxes[allBoxes.length - 1]?.name}`);

// Test 2: Get recent boxes
console.log('\n📅 Test 2: Getting recent boxes (last 3 years)');
const recentBoxes = getRecentBoxes({ limit: 10 });
console.log(`✅ Recent boxes found: ${recentBoxes.length}`);
recentBoxes.slice(0, 5).forEach(box => {
  console.log(`   ${box.box_no} - ${box.name} (${box.year_released})`);
});

// Test 3: Search for Star Wars sets
console.log('\n⭐ Test 3: Searching for Star Wars sets');
const starWarsResults = searchBoxes('star wars', 10);
console.log(`✅ Star Wars sets found: ${starWarsResults.length}`);
starWarsResults.slice(0, 5).forEach(box => {
  console.log(`   ${box.box_no} - ${box.name}`);
  console.log(`      Theme: ${box.category_name}`);
});

// Test 4: Search by box number
console.log('\n🔍 Test 4: Looking up specific set by box number');
const millenniumFalcon = getBoxByNumber('75192-1');
if (millenniumFalcon) {
  console.log(`✅ Found: ${millenniumFalcon.name}`);
  console.log(`   Box No: ${millenniumFalcon.box_no}`);
  console.log(`   Theme: ${millenniumFalcon.category_name}`);
  console.log(`   Year: ${millenniumFalcon.year_released}`);
  console.log(`   Weight: ${millenniumFalcon.weight}g`);
  console.log(`   Image: ${millenniumFalcon.image_url}`);
} else {
  console.log('❌ Set not found');
}

// Test 5: Get popular themes
console.log('\n🏆 Test 5: Getting popular themes (recent sets)');
const popularThemes = getPopularThemes(10);
console.log(`✅ Popular themes:`);
popularThemes.forEach((theme, index) => {
  console.log(`   ${index + 1}. ${theme.theme}: ${theme.count} sets`);
});

// Test 6: Get all themes
console.log('\n🎨 Test 6: Getting all unique themes');
const allThemes = getAllThemes();
console.log(`✅ Total unique themes: ${allThemes.length}`);
console.log('   Sample themes:');
allThemes.slice(0, 15).forEach(theme => {
  console.log(`   - ${theme}`);
});

// Test 7: Filter by specific theme
console.log('\n🎯 Test 7: Getting Friends sets');
const friendsSets = getRecentBoxes({ theme: 'Friends', limit: 5 });
console.log(`✅ Recent Friends sets: ${friendsSets.length}`);
friendsSets.forEach(box => {
  console.log(`   ${box.box_no} - ${box.name} (${box.year_released})`);
});

// Test 8: Search by partial name
console.log('\n🔎 Test 8: Searching for "Hogwarts" sets');
const hogwartsResults = searchBoxes('hogwarts', 10);
console.log(`✅ Hogwarts sets found: ${hogwartsResults.length}`);
hogwartsResults.forEach(box => {
  console.log(`   ${box.box_no} - ${box.name}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed successfully!\n');

// Summary
console.log('📊 Summary:');
console.log(`   Total boxes in catalog: ${allBoxes.length.toLocaleString()}`);
console.log(`   Recent boxes (last 3 years): ${getRecentBoxes().length.toLocaleString()}`);
console.log(`   Unique themes: ${allThemes.length}`);
console.log(`   Top theme: ${popularThemes[0].theme} (${popularThemes[0].count} sets)`);
console.log('\n🚀 Ready to build the API routes and UI!');
