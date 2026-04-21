/**
 * SINGLE SOURCE OF TRUTH for theme and series representative images
 *
 * Both theme list pages AND series detail pages use this via /api/subcategories
 *
 * Format: "Sub-theme name": "minifig ID" (e.g., "sw1507") or "Character name"
 *
 * - Direct minifig ID (e.g., "cas417"): Use this exact image
 * - Character name (e.g., "Boba Fett"): Search for best match
 *
 * When you update this file, both pages automatically sync.
 * DO NOT create separate cover image configs elsewhere.
 *
 * Updated: 2024
 */

export const THEME_MAIN_CHARACTERS: { [subTheme: string]: string } = {
  // ====================
  // SERIES (Sub-themes)
  // ====================

  // Castle
  'Castle / Black Knights': 'cas417',
  'Castle / Dark Forest': 'cas009',
  'Castle / Dragon Knights': 'cas017',
  'Castle / Fantasy Era': 'cas430',
  'Castle / Fright Knights': 'cas215',
  'Castle / Knights Kingdom I': 'cas309',
  'Castle / Wolfpack': 'cas585',
  'Castle': 'cas592', // Uncategorized Castle minifigs

  // Collectible Minifigures
  'Collectible Minifigures': 'col271', // Uncategorized
  'Collectible Minifigures / Promotional': 'gen098',
  'Collectible Minifigures / Series 21 Minifigures': 'col385',

  // Despicable Me and Minions
  'Despicable Me and Minions / Minions The Rise Of Gru': 'mnn007',

  // Disney
  'Disney / Disney Princess / Cinderella': 'dp162',
  'Disney / Disney Princess / Sleeping Beauty': '47394pb172',
  'Disney / Disney Princess / Tangled': 'dp225',
  'Disney / Mickey Mouse': 'mck001',

  // DUPLO
  'DUPLO / Action Wheelers': '4555pb140',

  // LEGO Brand
  'LEGO Brand / LEGO Brand Store / Build-A-Minifigure / Holiday & Event / Easter': 'hol201',
  'DUPLO / Lightyear': '47394pb336',
  'DUPLO / Little Forest Friends': '31231pb03',
  'DUPLO / Little Robots': '44323',
  'DUPLO / Peppa Pig': '47205pb116',
  'DUPLO / Pirates': '47394pb050',
  'DUPLO / Princess Castle': '47394pb085a',
  'DUPLO / Super Heroes / Avengers': '47394pb281',
  'DUPLO / Super Heroes / Batman II': '47394pb187',
  'DUPLO / Super Heroes / Spider-Man': '47394pb193',
  'DUPLO / Super Heroes / Spidey and his Amazing Friends': '47394pb311',
  'DUPLO / Super Heroes / Superman': '47394pb175',
  'DUPLO / The LEGO Movie 2': '47205pb064',
  'DUPLO / Toy Story': '47394pb274',
  'DUPLO / Toy Story / Toy Story 3': '47205pb022',
  'DUPLO / Western': '31181pb03',
  'DUPLO / Winnie The Pooh': '47205pb023',

  // Star Wars Movies & Shows
  'Star Wars Episode 1': 'sw1334a',
  'Star Wars Episode 2': 'sw1220',
  'Star Wars Episode 3': 'sw1095',
  'Star Wars Episode 4/5/6': 'sw1507', // Direct minifig ID override
  'Star Wars Episode 7': 'sw0676',
  'Star Wars Episode 8': 'sw0868',
  'Star Wars Episode 9': 'sw1054',
  'Star Wars The Clone Wars': 'sw1315',
  'Star Wars The Mandalorian': 'sw1258',
  'Star Wars Rebels': 'sw0574',
  'Star Wars Resistance': 'sw1012',
  'Star Wars Rogue One': 'sw0791',
  'Star Wars Solo': 'sw0921',
  'Star Wars The Bad Batch': 'sw1148',
  'Star Wars Obi-Wan Kenobi': 'Obi-Wan Kenobi',
  'Star Wars Ahsoka': 'sw1354',
  'Star Wars Andor': 'sw1410',
  'Star Wars The Book of Boba Fett': 'sw1245',
  'Star Wars Jedi: Fallen Order': 'sw1377',
  'Star Wars Young Jedi Adventures': 'sw1268',
  'Star Wars Yoda Chronicles': 'sw0570',
  'Star Wars Legends': 'sw1031',
  'Star Wars Legends / Star Wars The Old Republic': 'sw0413',
  'Star Wars Other': 'sw1121',
  'Star Wars Other / Star Wars Rebuild the Galaxy': 'sw1437',
  'Star Wars Other / Star Wars The Freemaker Adventures': 'sw0851',

  // Marvel Movies & Shows (Super Heroes theme)
  'Iron Man': 'Iron Man',
  'Iron Man 3': 'Iron Man',
  'Avengers': 'Iron Man',
  'Avengers Age of Ultron': 'Iron Man',
  'Avengers Infinity War': 'Iron Man',
  'Avengers Endgame': 'Iron Man',
  'Spider-Man': 'sh0708',
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
  'Sorcerer\'s Stone': 'hp480',
  'Chamber of Secrets': 'hp372',
  'Prisoner of Azkaban': 'hp603',
  'Goblet of Fire': 'hp507',
  'Order of the Phoenix': 'hp337',
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
  'The Hobbit and The Lord of the Rings / The Hobbit / The Battle of the Five Armies': 'lor103',

  // Jurassic Park / World
  'Jurassic Park': 'Dr. Alan Grant',
  'Jurassic World': 'Owen',
  'Fallen Kingdom': 'Owen',
  'Dominion': 'Owen',

  // Misc Movies
  'The LEGO Batman Movie': 'Batman',
  'The LEGO Ninjago Movie': 'Lloyd',
  'Toy Story': 'Woody',
  'Frozen': 'Elsa',
  'Moana': 'Moana',

  // DC Shows
  'Super Heroes / Legends of Tomorrow': 'sh0434',

  // Space subseries (locked permanent images)
  'Space / Alien Conquest': 'ac001',
  'Space / Blacktron I': 'sp001',
  'Space / Blacktron II': 'sp002',
  'Space / Classic Space': 'sp003',
  'Space / Exploriens': 'sp008',
  'Space / Factory': 'sp085',
  'Space / Futuron': 'sp013',
  'Space / Galaxy Squad': 'gs001',
  'Space / Ice Planet 2002': 'sp017',
  'Space / M:Tron': 'sp033',
  'Space / Mars Mission': 'mm001',
  'Space / RoboForce': 'sp035',
  'Space / Space Police I': 'sp036',
  'Space / Space Police II': 'sp037',
  'Space / Space Police III': 'sp091',
  'Space / Spyrius': 'sp039',
  'Space / UFO': 'sp044',
  'Space / Unitron': 'sp048',

  // Super Mario subseries
  'Super Mario / Super Mario Series 2': 'mar0055',
  'Super Mario / Super Mario Series 4': 'mar0093',

  // Town / City subseries
  'Town / City / Fire': 'cty1949',
  'Town / City / Recreation': 'cty1807',

  // Nike
  'Nike': 'nike003',

  // Add more as needed...
};

/**
 * ========================
 * PARENT THEMES
 * ========================
 */
export const THEME_OVERRIDES: { [theme: string]: string } = {
  // Current themes
  'Collectible Minifigures': 'col161',
  'Despicable Me and Minions': 'mnn005',
  'Fortnite': 'fort002',
  'DREAMZzz': 'drm103',
  'Dune': 'dun001',
  'DUPLO': '47394pb342',
  'Friends': 'frnd0896',
  'Gabby\'s Dollhouse': 'gdh010',
  'Harry Potter': 'hp605',
  'Holiday & Event': 'hol381',
  'Horizon': 'hrz001',
  'Jurassic World': 'jw100',
  'Minecraft': 'min009',
  'Minecraft / Minecraft Dungeons': 'min100',
  'Monkie Kid': 'mk152',
  'NINJAGO': 'njo0974',
  'NINJAGO / The Final Battle': 'njo0073',
  'One Piece': 'op016',
  'Pirates of the Caribbean': 'poc044',
  'Star Trek': 'trek006',
  'Star Wars': 'sw1398',
  'Stranger Things': 'st011',
  'Super Heroes': 'sh0115',
  'Super Mario': 'mar0213',
  'The Hobbit and The Lord of the Rings': 'lor112',
  'The Legend of Zelda': 'loz002',
  'The Simpsons': 'sim043',
  'Wednesday': 'wed006',
  'Wicked': 'wck024',

  // Non-current themes
  'Adventurers': 'adv032',
  'Agents': 'agt030',
  'Alpha Team': 'alp034',
  'Aquazone': 'aqu021',
  'Atlantis': 'atl017',
  'Avatar': 'avt022',
  'Avatar The Last Airbender': 'ava002',
  'Back to the Future': 'btf001',
  'Basic': 'fab13b',
  'Batman I': 'bat024',
  'Belville': 'belvfemale78',
  'BIONICLE': 'bio026',
  'Cars': 'crs018',
  'Castle': 'cas417',
  'DC Super Hero Girls': 'shg014',
  'Dimensions': 'dim043',
  'Dino': 'dino005',
  'Elves': 'elf050',
  'Exo-Force': 'exf019',
  'Fabuland': 'fab7g',
  'FreeStyle': 'fre002',
  'Friends TV Series': 'ftv007',
  'Ghostbusters': 'gb005',
  'Hidden Side': 'hs067',
  'Indiana Jones': 'iaj056',
  'Island Xtreme Stunts': 'ixs011',
  'LEGO Brand': 'hol298',
  'LEGO Brand / LEGO Employee Gift': 'gen184',
  'LEGO Brand / Promotional': 'gen163',
  'LEGO Ideas (CUUSOO)': 'idea001',
  'LEGO Ideas (CUUSOO) / Castle / Black Falcons': 'idea085',
  'LEGO Ideas (CUUSOO) / Doctor Who': 'idea024',
  'LEGOLAND': 'old033',
  'LEGOLAND Parks': 'LLP011',
  'LEGENDS OF CHIMA': 'loc155',
  'Lightyear': 'dis070',
  'Monster Fighters': 'mof007',
  'NEXO KNIGHTS': 'nex147',
  'Nike': 'nike003',
  'Overwatch': 'ow001',
  'Pharaoh\'s Quest': 'pha012',
  'Pirates': 'pi015',
  'Power Miners': 'pm030',
  'Prince of Persia': 'pop017',
  'Project Hail Mary': 'phm001',
  'Queer Eye': 'que005',
  'Racers': 'rac047',
  'Scala': '23049',
  'School Supplies': 'pln169',
  'Scooby-Doo': 'scd013',
  'Sonic the Hedgehog': 'son004',
  'Space': 'sp061',
  'Space / Insectoids': 'sp029',
  'Space / Life on Mars': 'lom018',
  'SPEED CHAMPIONS': 'sc122',
  'Speed Racer': 'sr001',
  'Spider-Man': 'spd028',
  'SpongeBob SquarePants': 'bob028',
  'Sports': 'soc158',
  'Teenage Mutant Ninja Turtles': 'tnt049',
  'The Angry Birds Movie': 'ang012',
  'The Incredibles': 'incr006',
  'The LEGO Movie': 'tlm096',
  'The LEGO Movie 2': 'tlm209',
  'The LEGO NINJAGO Movie': 'njo0432',
  'The Lone Ranger': 'tlr010',
  'The Powerpuff Girls': 'ppg005',
  'Town': 'cty1210',
  'Town / City / Farm': 'cty1761',
  'Toy Story': 'toy025',
  'Train': 'trn254',
  'Trolls World Tour': 'twt022',
  'Ultra Agents': 'uagt005',
  'Unikitty!': 'uni07',
  'Universe': 'gen030',
  'Vikings': 'vik040',
  'Western': 'ww018',

  // Additional themes - manually verified representative minifigs
  '4 Juniors': 'cre001',
  'Animal Crossing': 'ani007',
  'Architecture': 'gen192',
  'Bluey': 'blu007',
  'BrickLink Designer Program': 'bdp309',
  'Building Bigger Thinking': 'edu031',
  'City': 'cty1210',
  'Clikits': 'clik003',
  'Creator': 'idea001',
  'Dino Attack': 'din010',
  'Discovery': 'dis001',
  'Disney': 'dis070',
  'Editions': 'edi001',
  'Education': 'edu033',
  'Educational & Dacta': 'edu007',
  'FIRST LEGO League': 'fst055',
  'Fusion': 'fus001',
  'Games': '85863pb075',
  'Hero Factory': 'hf020',
  'Homemaker': 'fab7g',
  'Master Builder Academy': 'mba001',
  'Ninja': 'cas050new',
  'Primo': 'baby006',
  'Promotional': 'hol298',
  'Quatro': 'qtr001',
  'Rock Raiders': 'rck001',
  'Studios': 'stu001',
  'Technic': 'tech039',
  'Time Cruisers': 'tim006',
  'Vidiyo': 'vid004',
  'World Racers': 'wc001',
};

/**
 * Get main character name for a sub-theme (if manually defined)
 */
export function getMainCharacter(subTheme: string): string | null {
  return THEME_MAIN_CHARACTERS[subTheme] || null;
}
