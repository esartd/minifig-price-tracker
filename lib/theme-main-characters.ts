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

  // Collectible Minifigures
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
  'Fallen Kingdom': 'Owen',
  'Dominion': 'Owen',

  // Misc Movies
  'The LEGO Batman Movie': 'Batman',
  'The LEGO Ninjago Movie': 'Lloyd',
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
  'Town / City / Farm': 'cty1761',
  'Town / City / Fire': 'cty1949',
  'Town / City / Recreation': 'cty1807',
  'Town / Classic Town / Launch Command': 'splc005',
  'Town / Paradisa': 'par031b',
  'Town / Res-Q': 'rsq010',
  'Town / Space Exploration': 'twn401',
  'Town / Town Jr. / Cargo': 'car003',
  'Town / World City / Coast Guard': 'wc017',

  // Nike
  'Nike': 'nike003',

  // Adventurers subseries
  'Adventurers / Desert': 'adv039',

  // Alpha Team subseries
  'Alpha Team / Mission Deep Sea': 'alp034',

  // Avatar subseries
  'Avatar / The Way of Water': 'avt014',

  // BIONICLE subseries
  'BIONICLE / Toa Mahri': 'bio019',

  // Cars subseries
  'Cars / Cars 2': 'crs079',

  // Games subseries
  'Games / Heroica': '85863pb068',

  // Hero Factory subseries
  'Hero Factory / Heroes': 'hf019',

  // Indiana Jones subseries
  'Indiana Jones / Kingdom of the Crystal Skull': 'iaj044',

  // Pirates subseries
  'Pirates / Pirates I / Imperial Guards': 'pi062',

  // Racers subseries
  'Racers / Drome Racers': 'rac103',
  'Racers / Xalax': '30598pb08',

  // Spider-Man subseries
  'Spider-Man / Spider-Man 2': 'spd017',

  // Sports subseries
  'Sports / Gravity Games': 'gg005',
  'Sports / Hockey': 'hky012s',
  'Sports / Soccer': 'soc158',

  // The Incredibles subseries
  'The Incredibles / Incredibles 2': 'incr006',

  // Toy Story subseries
  'Toy Story / Toy Story 3': 'toy014',

  // Western subseries
  'Western / Cowboys': 'ww012',
  'Western / Indians': 'ww014',

  // NINJAGO subseries (locked permanent images)
  'NINJAGO / (Other)': 'njo0108',
  'NINJAGO / Core': 'njo0715',
  'NINJAGO / Crystalized': 'njo0766',
  'NINJAGO / Day of the Departed': 'njo0220',
  'NINJAGO / Dragons Rising Season 1': 'njo0811',
  'NINJAGO / Dragons Rising Season 2': 'njo0833',
  'NINJAGO / Dragons Rising Season 3': 'njo0940',
  'NINJAGO / Dragons Rising Season 4': 'njo1024',
  'NINJAGO / Hunted': 'njo0456',
  'NINJAGO / Hunted / Dragon Masters': 'njo0452',
  'NINJAGO / Legacy': 'njo0489',
  'NINJAGO / Legacy / Core': 'njo0807',
  'NINJAGO / Legacy / Day of the Departed': 'njo1026',
  'NINJAGO / March of the Oni': 'njo0510',
  'NINJAGO / Master of the Mountain': 'njo0599',
  'NINJAGO / NINJAGO Legends': 'njo0984',
  'NINJAGO / Possession': 'njo0140',
  'NINJAGO / Prime Empire': 'njo0558',
  'NINJAGO / Rebooted': 'njo0083',

  // Castle subseries
  'Castle / Black Falcons': 'cas098',
  'Castle / Classic Castle': 'cas075',
  'Castle / Crusaders': 'cas109',
  'Castle / Forestmen': 'cas124',
  'Castle / Kingdoms': 'cas435',
  'Castle / Knights Kingdom II': 'cas256',
  'Castle / Lion Knights': 'cas170',
  'Castle / Royal Knights': 'cas059',

  // Pirates subseries
  'Pirates / Pirates I': 'pi005',
  'Pirates / Pirates I / Imperial Armada': 'pi010',
  'Pirates / Pirates I / Imperial Soldiers': 'pi004',
  'Pirates / Pirates I / Islanders': 'pi066',
  'Pirates / Pirates II': 'pi081',
  'Pirates / Pirates II / Imperial Guards': 'pi085',
  'Pirates / Pirates III': 'pi148',
  'Pirates / Pirates III / Imperial Soldiers': 'pi149a',
  'Pirates / Pirates IV': 'pi185',
  'Pirates / Pirates IV / Imperial Soldiers': 'pi188',

  // Town / City subseries (continued)
  'Town / Arctic': 'arc001',
  'Town / City': 'chef009',
  'Town / City / Airport': 'air022',
  'Town / City / Arctic': 'cty0490',
  'Town / City / Building': 'twn233',
  'Town / City / Cargo': 'cty0798',
  'Town / City / Coast Guard': 'cty0071',
  'Town / City / Construction': 'cty0009',
  'Town / City / Deep Sea Explorers': 'cty0558',
  'Town / City / Food & Drink': 'twn495',
  'Town / City / Gas Station': 'oct049',
  'Town / City / Harbor': 'boat009',
  'Town / City / Hospital': 'cty0017',
  'Town / City / Jungle': 'cty0788',
  'Town / City / Off-Road': 'oct066',
  'Town / City / Police': 'cop045',
  'Town / City / Post Office': 'post006',

  // Disney subseries
  'Disney / Disney 100': 'dis088',
  'Disney / Disney 100 / Up': 'dis091',
  'Disney / Disney Princess': 'dp094',
  'Disney / Disney Princess / Aladdin': 'dp012',
  'Disney / Disney Princess / Ariel': 'dp193',
  'Disney / Disney Princess / Beauty and the Beast': 'dp029',
  'Disney / Disney Princess / Brave': 'dp002',
  'Disney / Disney Princess / Frozen': 'dp017',
  'Disney / Disney Princess / Frozen / Frozen II': 'dp069',
  'Disney / Disney Princess / Moana': 'moa001',
  'Disney / Disney Princess / Moana 2': 'moa006',
  'Disney / Disney Princess / Mulan': 'dp044',
  'Disney / Disney Princess / Snow White': 'dp043',
  'Disney / Disney Princess / Tangled / Tangled The Series': 'dp055',
  'Disney / Disney Princess / The Little Mermaid': 'dp001',
  'Disney / Disney Princess / The Princess and the Frog': 'dp065',

  // Adventurers subseries (continued)
  'Adventurers / Dino Island': 'adv002',
  'Adventurers / Jungle': 'adv001',
  'Adventurers / Orient Expedition': 'adv024',

  // BIONICLE subseries (continued)
  'BIONICLE / Barraki': 'bio013',
  'BIONICLE / Piraka': 'bio001',
  'BIONICLE / Toa Hordika': '51637',
  'BIONICLE / Toa Inika': 'bio005',
  'BIONICLE / Visorak': '51991a',

  // Cars subseries (continued)
  'Cars / Cars 3': 'crs001',

  // Games subseries (continued)
  'Games / Harry Potter': '85863pb034',
  'Games / LEGENDS OF CHIMA': '85863pb098',
  'Games / NINJAGO / The Golden Weapons': '85863pb050',
  'Games / Star Wars / Star Wars Episode 4/5/6': '85863pb075',
  'Games / Super Heroes / Batman II': '85863pb101',
  'Games / The Hobbit and The Lord of the Rings / The Hobbit': '85863pb094',
  'Games / The Hobbit and The Lord of the Rings / The Lord of the Rings': '85863pb109',
  'Games / Town / City / Police': '85863pb073',

  // Racers subseries (continued)
  'Racers / Factory': 'rac038',
  'Racers / Ferrari': 'rac022s',
  'Racers / Williams F1': 'rac018s',

  // Spider-Man subseries (continued)
  'Spider-Man / Spider-Man 1': 'spd001',

  // Sports subseries (continued)
  'Sports / Basketball': 'nba004',
  'Sports / Promotional': 'gen156s',

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
  'Harry Potter': 'hp300',
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
  'Toy Story': 'toy025',
  'Train': 'trn254',
  'Trolls World Tour': 'twt022',
  'Ultra Agents': 'uagt005',
  'Unikitty!': 'uni07',
  'Universe': 'gen030',
  'Vikings': 'vik040',
  'Western': 'ww018',
  'Building Event': 'hol298', // Use generic LEGO brand promotional minifig

  // Additional themes - manually verified representative minifigs
  '4 Juniors': 'cre001',
  'Animal Crossing': 'ani027',
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
