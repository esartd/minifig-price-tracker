/**
 * Main character mapping for TV shows and movies
 * Format: "Sub-theme name": "Main character name to search for"
 *
 * Use this for cases where the main character is known but might not
 * have the most variants (e.g., supporting characters are more popular)
 */

export const THEME_MAIN_CHARACTERS: { [subTheme: string]: string } = {
  // Star Wars Movies & Shows
  'Star Wars Episode 1': 'Qui-Gon Jinn',
  'Star Wars Episode 2': 'Anakin Skywalker',
  'Star Wars Episode 3': 'Anakin Skywalker',
  'Star Wars Episode 4/5/6': 'sw1507', // Direct minifig ID override
  'Star Wars Episode 7': 'Rey',
  'Star Wars Episode 8': 'Rey',
  'Star Wars Episode 9': 'Rey',
  'Star Wars The Clone Wars': 'Anakin Skywalker',
  'Star Wars The Mandalorian': 'The Mandalorian',
  'Star Wars Rebels': 'Ezra Bridger',
  'Star Wars Resistance': 'sw1012',
  'Star Wars Rogue One': 'Jyn Erso',
  'Star Wars Solo': 'Han Solo',
  'Star Wars The Bad Batch': 'Hunter',
  'Star Wars Obi-Wan Kenobi': 'Obi-Wan Kenobi',
  'Star Wars Ahsoka': 'Ahsoka',
  'Star Wars Andor': 'Cassian Andor',
  'Star Wars The Book of Boba Fett': 'Boba Fett',
  'Star Wars Jedi: Fallen Order': 'sw1377',
  'Star Wars Young Jedi Adventures': 'sw1268',
  'Star Wars Other / Star Wars Rebuild the Galaxy': 'sw1437',

  // Marvel Movies & Shows (Super Heroes theme)
  'Iron Man': 'Iron Man',
  'Iron Man 3': 'Iron Man',
  'Avengers': 'Iron Man',
  'Avengers Age of Ultron': 'Iron Man',
  'Avengers Infinity War': 'Iron Man',
  'Avengers Endgame': 'Iron Man',
  'Spider-Man': 'Spider-Man',
  'Spider-Man No Way Home': 'Spider-Man',
  'Black Panther': 'Black Panther',
  'Black Panther Wakanda Forever': 'Black Panther',
  'Captain America': 'Captain America',
  'Captain America Civil War': 'Captain America',
  'Captain America Brave New World': 'Captain America',
  'Thor': 'Thor',
  'Thor Love and Thunder': 'Thor',
  'Guardians of the Galaxy': 'Star-Lord',
  'Guardians of the Galaxy Vol. 2': 'Star-Lord',
  'Guardians of the Galaxy Vol. 3': 'Star-Lord',
  'Doctor Strange': 'Doctor Strange',
  'Doctor Strange in the Multiverse of Madness': 'Doctor Strange',
  'Ant-Man': 'Ant-Man',
  'Ant-Man and the Wasp': 'Ant-Man',
  'Captain Marvel': 'Captain Marvel',
  'Black Widow': 'Black Widow',
  'Shang-Chi and the Legend of the Ten Rings': 'Shang-Chi',
  'Eternals': 'Sersi',
  'Hawkeye': 'Hawkeye',
  'Moon Knight': 'Moon Knight',
  'Ms. Marvel': 'Ms. Marvel',
  'She-Hulk': 'She-Hulk',

  // DC Movies & Shows
  'The Batman': 'Batman',
  'The Dark Knight': 'Batman',
  'Batman': 'Batman',
  'Batman v Superman': 'Batman',
  'Batman & Robin': 'Batman',
  'Batman Forever': 'Batman',
  'Justice League': 'Batman',
  'Dawn of Justice': 'Batman',
  'Wonder Woman': 'Wonder Woman',
  'Aquaman': 'Aquaman',
  'Shazam!': 'Shazam',
  'The Flash': 'The Flash',
  'The Suicide Squad': 'Harley Quinn',

  // Harry Potter
  'Philosopher\'s Stone': 'Harry Potter',
  'Chamber of Secrets': 'Harry Potter',
  'Prisoner of Azkaban': 'Harry Potter',
  'Goblet of Fire': 'Harry Potter',
  'Order of the Phoenix': 'Harry Potter',
  'Half-Blood Prince': 'Harry Potter',
  'Deathly Hallows': 'Harry Potter',
  'Fantastic Beasts': 'Newt Scamander',

  // Indiana Jones
  'Raiders of the Lost Ark': 'Indiana Jones',
  'Temple of Doom': 'Indiana Jones',
  'Last Crusade': 'Indiana Jones',
  'Kingdom of the Crystal Skull': 'Indiana Jones',

  // Pirates of the Caribbean
  'Pirates of the Caribbean': 'Jack Sparrow',
  'Dead Man\'s Chest': 'Jack Sparrow',
  'At World\'s End': 'Jack Sparrow',
  'On Stranger Tides': 'Jack Sparrow',

  // Lord of the Rings / Hobbit
  'The Fellowship of the Ring': 'Frodo',
  'The Two Towers': 'Frodo',
  'The Return of the King': 'Frodo',
  'The Hobbit': 'Bilbo Baggins',
  'An Unexpected Journey': 'Bilbo Baggins',
  'The Desolation of Smaug': 'Bilbo Baggins',
  'The Battle of the Five Armies': 'Bilbo Baggins',

  // Jurassic Park / World
  'Jurassic Park': 'Dr. Alan Grant',
  'Jurassic World': 'Owen',
  'Fallen Kingdom': 'Owen',
  'Dominion': 'Owen',

  // Misc Movies
  'The LEGO Movie': 'Emmet',
  'The LEGO Batman Movie': 'Batman',
  'The LEGO Ninjago Movie': 'Lloyd',
  'Toy Story': 'Woody',
  'Frozen': 'Elsa',
  'Moana': 'Moana',

  // Add more as needed...
};

/**
 * Main theme overrides (for parent themes)
 */
export const THEME_OVERRIDES: { [theme: string]: string } = {
  'Scala': 'sw1360', // Use non-blurry minifig
  'Despicable Me and Minions': 'mnn005',
  'Dune': 'dun001',
  'DREAMZzz': 'drm103',
  'Gabby\'s Dollhouse': 'gdh010',
  'Harry Potter': 'hp605',
  'Horizon': 'hrz001',
  'Jurassic World': 'jw117',
  'Minecraft': 'min200',
  'NINJAGO': 'njo0974',
  'One Piece': 'op016',
  'Star Wars': 'sw1398',
  'Super Heroes': 'sh0115',
};

/**
 * Get main character name for a sub-theme (if manually defined)
 */
export function getMainCharacter(subTheme: string): string | null {
  return THEME_MAIN_CHARACTERS[subTheme] || null;
}
