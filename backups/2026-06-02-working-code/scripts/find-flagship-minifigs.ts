import * as fs from 'fs';
import * as path from 'path';

const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));

// Search for flagship characters in the actual catalog
const searches = [
  // Marvel
  { search: 'Spider-Man', theme: 'Marvel' },
  { search: 'Iron Man', theme: 'Marvel' },
  { search: 'Captain America', theme: 'Marvel' },
  { search: 'Thor', theme: 'Marvel' },
  { search: 'Hulk', theme: 'Marvel' },
  { search: 'Black Widow', theme: 'Marvel' },
  { search: 'Hawkeye', theme: 'Marvel' },
  { search: 'Thanos', theme: 'Marvel' },
  { search: 'Star-Lord', theme: 'Marvel' },
  { search: 'Gamora', theme: 'Marvel' },

  // DC
  { search: 'Batman', theme: 'DC' },
  { search: 'Superman', theme: 'DC' },
  { search: 'Wonder Woman', theme: 'DC' },
  { search: 'Joker', theme: 'DC' },
  { search: 'Flash', theme: 'DC' },

  // Disney
  { search: 'Mickey Mouse', theme: 'Disney' },
  { search: 'Minnie Mouse', theme: 'Disney' },
  { search: 'Donald Duck', theme: 'Disney' },
  { search: 'Elsa', theme: 'Disney' },
  { search: 'Anna', theme: 'Disney' },

  // Harry Potter
  { search: 'Harry Potter', theme: 'Harry Potter' },
  { search: 'Hermione', theme: 'Harry Potter' },
  { search: 'Ron Weasley', theme: 'Harry Potter' },
  { search: 'Dumbledore', theme: 'Harry Potter' },

  // Minecraft
  { search: 'Steve', theme: 'Minecraft' },
  { search: 'Creeper', theme: 'Minecraft' },
  { search: 'Enderman', theme: 'Minecraft' },

  // Super Mario
  { search: 'Mario', theme: 'Mario' },
  { search: 'Luigi', theme: 'Mario' },
  { search: 'Bowser', theme: 'Mario' },
  { search: 'Peach', theme: 'Mario' },
  { search: 'Yoshi', theme: 'Mario' },
];

console.log('Searching BrickLink catalog for flagship characters...\n');

for (const { search, theme } of searches) {
  const matches = minifigs
    .filter((m: any) => m.name.includes(search))
    .slice(0, 3); // Show top 3 matches

  if (matches.length > 0) {
    console.log(`\n${theme} - ${search}:`);
    matches.forEach((m: any) => {
      console.log(`  ${m.minifigure_no} - ${m.name}`);
    });
  } else {
    console.log(`\n${theme} - ${search}: NO MATCHES FOUND`);
  }
}

console.log('\n\nDone!');
