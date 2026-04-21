/**
 * Character Mapping System
 *
 * Maps minifig IDs to canonical character names for finding variations.
 * When a minifig's name doesn't match (e.g., "Princess Leia (Boushh)"),
 * this helps identify all versions of the same character.
 */

export const CHARACTER_MAP: { [minifigId: string]: string } = {
  // Princess Leia variations
  'sw0026': 'Princess Leia',
  'sw0070': 'Princess Leia',
  'sw0085': 'Princess Leia',
  'sw0085a': 'Princess Leia',
  'sw0104': 'Princess Leia',
  'sw0113': 'Princess Leia',
  'sw0175': 'Princess Leia',
  'sw0175a': 'Princess Leia',
  'sw0175b': 'Princess Leia',
  'sw0235': 'Princess Leia',
  'sw0337': 'Princess Leia',
  'sw0371': 'Princess Leia',
  'sw0407': 'Princess Leia',
  'sw0485': 'Princess Leia',
  'sw0504': 'Princess Leia',
  'sw0643': 'Princess Leia',
  'sw0718': 'Princess Leia',
  'sw0779': 'Princess Leia',
  'sw0878': 'Princess Leia',
  'sw0958': 'Princess Leia',
  'sw0972': 'Princess Leia',
  'sw0994': 'Princess Leia',
  'sw1011': 'Princess Leia',
  'sw1022': 'Princess Leia',
  'sw1036': 'Princess Leia',
  'sw1264': 'Princess Leia',
  'sw1282': 'Princess Leia',
  'sw1296': 'Princess Leia',
  'sw1348': 'Princess Leia',
  'sw1381': 'Princess Leia',
  'sw1504': 'Princess Leia',

  // Luke Skywalker variations

  // Boba Fett variations

  // Darth Vader variations

  // Han Solo variations

  // Add more as needed...
};

/**
 * Get canonical character name for a minifig ID
 */
export function getCharacterName(minifigId: string): string | null {
  return CHARACTER_MAP[minifigId] || null;
}

/**
 * Find all minifig IDs that represent the same character
 */
export function getCharacterVariations(minifigId: string): string[] {
  const characterName = CHARACTER_MAP[minifigId];
  if (!characterName) return [];

  return Object.entries(CHARACTER_MAP)
    .filter(([_, name]) => name === characterName)
    .map(([id]) => id);
}
