/**
 * Main character mapping for TV shows and movies
 * Format: "Sub-theme name": "Main character name to search for"
 */

export const THEME_MAIN_CHARACTERS: { [subTheme: string]: string } = {
  // Star Wars Movies
  'Episode 1': 'Qui-Gon Jinn',
  'Episode 2': 'Anakin Skywalker',
  'Episode 3': 'Anakin Skywalker',
  'Episode 4': 'Luke Skywalker',
  'Episode 5': 'Luke Skywalker',
  'Episode 6': 'Luke Skywalker',
  'Episode 7': 'Rey',
  'Episode 8': 'Rey',
  'Episode 9': 'Rey',
  'The Clone Wars': 'Anakin Skywalker',
  'The Mandalorian': 'The Mandalorian',
  'Rebels': 'Ezra Bridger',
  'Rogue One': 'Jyn Erso',
  'Solo': 'Han Solo',
  'The Bad Batch': 'Hunter',
  'Obi-Wan Kenobi': 'Obi-Wan Kenobi',
  'Ahsoka': 'Ahsoka',
  'Andor': 'Cassian Andor',
  'The Book of Boba Fett': 'Boba Fett',

  // Marvel Movies & Shows
  'Iron Man': 'Iron Man',
  'The Avengers': 'Iron Man',
  'Age of Ultron': 'Iron Man',
  'Infinity War': 'Iron Man',
  'Endgame': 'Iron Man',
  'Spider-Man': 'Spider-Man',
  'Black Panther': 'Black Panther',
  'Captain America': 'Captain America',
  'Thor': 'Thor',
  'Guardians of the Galaxy': 'Star-Lord',
  'Doctor Strange': 'Doctor Strange',
  'Ant-Man': 'Ant-Man',
  'Captain Marvel': 'Captain Marvel',
  'Black Widow': 'Black Widow',
  'Shang-Chi': 'Shang-Chi',
  'Eternals': 'Sersi',
  'WandaVision': 'Wanda',
  'The Falcon and the Winter Soldier': 'Sam Wilson',
  'Loki': 'Loki',
  'What If': 'The Watcher',
  'Hawkeye': 'Hawkeye',
  'Moon Knight': 'Moon Knight',
  'Ms. Marvel': 'Ms. Marvel',
  'She-Hulk': 'She-Hulk',

  // DC Movies & Shows
  'The Batman': 'Batman',
  'The Dark Knight': 'Batman',
  'Man of Steel': 'Superman',
  'Batman v Superman': 'Batman',
  'Justice League': 'Batman',
  'Wonder Woman': 'Wonder Woman',
  'Aquaman': 'Aquaman',
  'Shazam': 'Shazam',
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

  // Ghostbusters
  'Ghostbusters': 'Peter Venkman',
  'Ghostbusters II': 'Peter Venkman',
  'Afterlife': 'Peter Venkman',

  // Back to the Future
  'Back to the Future': 'Marty McFly',

  // Misc Movies
  'The LEGO Movie': 'Emmet',
  'The LEGO Batman Movie': 'Batman',
  'The LEGO Ninjago Movie': 'Lloyd',
  'Toy Story': 'Woody',
  'Frozen': 'Elsa',
  'Moana': 'Moana',
  'The Incredibles': 'Mr. Incredible',
  'Minions': 'Kevin',

  // Add more as needed...
};

/**
 * Check if a sub-theme is a TV show or movie
 * Returns the main character name if it is, null otherwise
 */
export function getMainCharacter(subTheme: string): string | null {
  return THEME_MAIN_CHARACTERS[subTheme] || null;
}
