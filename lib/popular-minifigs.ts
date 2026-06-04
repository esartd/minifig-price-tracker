/**
 * Top 100 most popular LEGO minifigures for ISR pre-generation
 *
 * These minifigs are pre-rendered at build time and revalidated every 6 hours.
 * Selection criteria:
 * - High search volume characters (Darth Vader, Boba Fett, etc.)
 * - Recent popular sets
 * - Collector favorites
 * - High-value minifigs
 *
 * Update this list quarterly based on:
 * - Google Analytics page views
 * - Google Search Console impressions
 * - BrickLink marketplace trends
 */

export const POPULAR_MINIFIGS = [
  // Star Wars - Original Trilogy Icons
  'sw0001', // Boba Fett (Cloud City)
  'sw0002', // Stormtrooper
  'sw0003', // Luke Skywalker
  'sw0004', // Princess Leia
  'sw0005', // Han Solo
  'sw0006', // Chewbacca
  'sw0007', // C-3PO
  'sw0008', // R2-D2
  'sw0010', // Darth Vader (original)

  // Star Wars - Prequel Era
  'sw0145', // Darth Maul
  'sw0209', // Anakin Skywalker
  'sw0215', // Obi-Wan Kenobi
  'sw0243', // Padmé Amidala
  'sw0244', // Yoda

  // Star Wars - Clone Wars
  'sw0442', // Captain Rex
  'sw0445', // Commander Cody
  'sw0527', // Ahsoka Tano
  'sw1319', // Clone Trooper Phase 2

  // Star Wars - Sequel Trilogy
  'sw0675', // Kylo Ren
  'sw0676', // Rey
  'sw0677', // Finn
  'sw0678', // BB-8
  'sw0810', // Poe Dameron

  // Star Wars - Mandalorian
  'sw1046', // The Mandalorian
  'sw1047', // The Child (Baby Yoda / Grogu)
  'sw1104', // Boba Fett (Mandalorian)
  'sw1128', // Bo-Katan Kryze
  'sw1135', // Ahsoka Tano (Mandalorian)

  // Harry Potter - Main Characters
  'hp001', // Harry Potter
  'hp002', // Ron Weasley
  'hp003', // Hermione Granger
  'hp004', // Draco Malfoy
  'hp005', // Professor Dumbledore
  'hp006', // Hagrid
  'hp010', // Voldemort
  'hp011', // Snape

  // Marvel - Avengers
  'sh001', // Spider-Man
  'sh002', // Iron Man
  'sh006', // Captain America
  'sh012', // Thor
  'sh015', // Hulk
  'sh018', // Black Widow
  'sh023', // Hawkeye
  'sh028', // Loki
  'sh159', // Thanos

  // Marvel - Guardians & Others
  'sh201', // Star-Lord
  'sh202', // Gamora
  'sh203', // Drax
  'sh204', // Rocket Raccoon
  'sh205', // Groot
  'sh220', // Doctor Strange
  'sh261', // Black Panther
  'sh305', // Captain Marvel

  // DC Comics - Justice League
  'sh016', // Batman
  'sh017', // Superman
  'sh019', // Wonder Woman
  'sh033', // The Joker
  'sh034', // Harley Quinn
  'sh038', // The Flash
  'sh080', // Green Lantern
  'sh090', // Aquaman

  // Lord of the Rings
  'lor001', // Frodo Baggins
  'lor002', // Samwise Gamgee
  'lor003', // Gandalf
  'lor004', // Aragorn
  'lor005', // Legolas
  'lor006', // Gimli
  'lor007', // Gollum
  'lor028', // Saruman

  // Collectible Minifigures Series (High Value)
  'col001', // Zombie (Series 1)
  'col015', // Mr. Gold (Series 10)
  'col032', // Hotdog Guy (Series 13)
  'col071', // Chicken Suit Guy (Series 9)
  'col089', // Bumblebee Girl (Series 10)

  // LEGO Movie
  'tlm001', // Emmet
  'tlm002', // Wyldstyle
  'tlm003', // Batman
  'tlm004', // Benny
  'tlm005', // Unikitty

  // Ninjago (Popular Characters)
  'njo001', // Kai
  'njo002', // Jay
  'njo003', // Cole
  'njo004', // Zane
  'njo005', // Lloyd
  'njo006', // Nya
  'njo010', // Lord Garmadon

  // City (Classic Characters)
  'cty001', // Police Officer
  'cty002', // Firefighter
  'cty003', // Astronaut

  // Additional Star Wars (High Demand)
  'sw0011', // TIE Fighter Pilot
  'sw0020', // Sandtrooper
  'sw0105', // Imperial Officer
  'sw0150', // Battle Droid
  'sw0194', // General Grievous
];

/**
 * ISR configuration
 */
export const ISR_CONFIG = {
  // Revalidate every 6 hours (matches BrickLink cache duration)
  revalidate: 21600, // 6 hours in seconds

  // Total pages to pre-generate
  totalPages: POPULAR_MINIFIGS.length,
};
