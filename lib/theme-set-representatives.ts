/**
 * Representative LEGO SETS for set theme pages
 *
 * Maps theme names to box numbers (e.g., "75192-1")
 * These are iconic/popular sets that represent each theme well
 *
 * DO NOT use minifig IDs here - this is for SET theme hero cards only
 */

export const THEME_SET_REPRESENTATIVES: { [theme: string]: string } = {
  // Popular current themes
  'Star Wars': '75192-1', // Millennium Falcon
  'Harry Potter': '71043-1', // Hogwarts Castle
  'NINJAGO': '71799-1', // NINJAGO City Markets
  'Friends': '41704-1', // Main Street Building
  'Minecraft': '21186-1', // The Ice Castle
  'Super Mario': '71411-1', // The Mighty Bowser
  'City': '60367-1', // Passenger Airplane
  'Technic': '42143-1', // Ferrari Daytona SP3
  'Super Heroes': '76178-1', // Daily Bugle
  'Creator': '10497-1', // Galaxy Explorer
  'Jurassic World': '76956-1', // T. Rex Breakout
  'Monkie Kid': '80039-1', // The Heavenly Realms
  'Disney': '43222-1', // Disney Castle
  'DREAMZzz': '71475-1', // Mr. Oz's Spacebus
  'Building Event': '5010173-1', // Happy Hummingbird
  'Pokémon': '40892-1', // Kanto Region Badge Collection
  'Brick Sketches': '40536-1', // Miles Morales

  // Add more as needed...
};

/**
 * Get representative set box number for a theme
 */
export function getRepresentativeSet(theme: string): string | null {
  return THEME_SET_REPRESENTATIVES[theme] || null;
}
