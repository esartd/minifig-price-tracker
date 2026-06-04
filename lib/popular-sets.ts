/**
 * Top 100 most popular LEGO sets for ISR pre-generation
 *
 * These sets are pre-rendered at build time and revalidated every 6 hours.
 * Selection criteria:
 * - High search volume sets (UCS Star Wars, Architecture, etc.)
 * - Recent popular releases
 * - Collector favorites
 * - High-value sets
 *
 * Update this list quarterly based on:
 * - Google Analytics page views
 * - Google Search Console impressions
 * - BrickLink marketplace trends
 */

export const POPULAR_SETS = [
  // Star Wars - UCS (Ultimate Collector Series)
  '75192-1', // Millennium Falcon UCS
  '75181-1', // Y-wing Starfighter UCS
  '75252-1', // Imperial Star Destroyer UCS
  '75159-1', // Death Star UCS
  '75144-1', // Snowspeeder UCS
  '75098-1', // Assault on Hoth
  '75222-1', // Betrayal at Cloud City
  '75290-1', // Mos Eisley Cantina
  '75313-1', // AT-AT UCS
  '75331-1', // Razor Crest UCS

  // Star Wars - Recent Popular Sets
  '75294-1', // Bespin Duel
  '75309-1', // Republic Gunship UCS
  '75308-1', // R2-D2 UCS
  '75310-1', // Duel on Mandalore
  '75327-1', // Luke Skywalker (Red Five) Helmet
  '75328-1', // The Mandalorian Helmet
  '75329-1', // Death Star Trench Run
  '75341-1', // Luke Skywalker's Landspeeder

  // Star Wars - Classic Sets
  '10030-1', // Imperial Star Destroyer (Original UCS)
  '10179-1', // Millennium Falcon (Original UCS)
  '10221-1', // Super Star Destroyer
  '10236-1', // Ewok Village
  '10188-1', // Death Star

  // Harry Potter - Popular Sets
  '71043-1', // Hogwarts Castle
  '75954-1', // Hogwarts Great Hall
  '75955-1', // Hogwarts Express
  '75948-1', // Hogwarts Clock Tower
  '75969-1', // Hogwarts Astronomy Tower
  '76389-1', // Hogwarts Chamber of Secrets
  '76391-1', // Hogwarts Icons
  '76405-1', // Hogwarts Express Collectors' Edition

  // Architecture - Iconic Buildings
  '21042-1', // Statue of Liberty
  '21046-1', // Empire State Building
  '21056-1', // Taj Mahal
  '21058-1', // Great Pyramid of Giza
  '21060-1', // Himeji Castle
  '10276-1', // Colosseum
  '10256-1', // Taj Mahal (Rerelease)

  // Creator Expert - Modular Buildings
  '10251-1', // Brick Bank
  '10255-1', // Assembly Square
  '10260-1', // Downtown Diner
  '10264-1', // Corner Garage
  '10270-1', // Bookshop
  '10278-1', // Police Station
  '10297-1', // Boutique Hotel

  // Marvel - Avengers Tower and Popular Sets
  '76178-1', // Daily Bugle
  '76125-1', // Iron Man Hall of Armor
  '76191-1', // Infinity Gauntlet
  '76210-1', // Hulkbuster
  '76215-1', // Black Panther

  // DC Comics - Batman Sets
  '76023-1', // The Tumbler
  '76161-1', // 1989 Batwing
  '76240-1', // Batmobile Tumbler
  '76181-1', // Batmobile (1989)

  // Ideas Sets (High Popularity)
  '21319-1', // Central Perk (Friends)
  '21325-1', // Medieval Blacksmith
  '21326-1', // Winnie the Pooh
  '21327-1', // Typewriter
  '21328-1', // Seinfeld
  '21330-1', // Home Alone

  // Technic - Flagship Models
  '42056-1', // Porsche 911 GT3 RS
  '42083-1', // Bugatti Chiron
  '42096-1', // Porsche 911 RSR
  '42115-1', // Lamborghini Sián
  '42143-1', // Ferrari Daytona SP3

  // City - Large Sets
  '60197-1', // Passenger Train
  '60198-1', // Cargo Train
  '60266-1', // Ocean Exploration Ship

  // Ninjago - Popular Sets
  '70620-1', // Ninjago City
  '70657-1', // Ninjago City Docks
  '71741-1', // Ninjago City Gardens

  // LEGO Movie Sets
  '70840-1', // Welcome to Apocalypseburg
  '70922-1', // The Joker Manor

  // Lord of the Rings - Classic Sets
  '10237-1', // The Tower of Orthanc
  '79008-1', // Pirate Ship Ambush
  '10316-1', // Rivendell

  // Icons - Recent Large Sets
  '10497-1', // Galaxy Explorer
  '10294-1', // Titanic
  '10280-1', // Flower Bouquet
  '10281-1', // Bonsai Tree
  '10289-1', // Bird of Paradise

  // Creator - Popular Vehicles
  '10262-1', // James Bond Aston Martin
  '10265-1', // Ford Mustang
  '10269-1', // Harley-Davidson Fat Boy
  '10271-1', // Fiat 500
  '10295-1', // Porsche 911

  // Disney - Castle and Popular Sets
  '71040-1', // Disney Castle
  '43197-1', // The Ice Castle

  // Pirates - Classic Sets
  '21322-1', // Pirates of Barracuda Bay
];

/**
 * ISR configuration for sets
 */
export const ISR_CONFIG = {
  // Revalidate every 6 hours (matches BrickLink cache duration)
  revalidate: 21600, // 6 hours in seconds

  // Total pages to pre-generate
  totalPages: POPULAR_SETS.length,
};
