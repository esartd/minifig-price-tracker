/**
 * The themes worth putting in front of someone who has not typed anything.
 *
 * Lifted out of app/api/community-stats/route.ts, which had this list inline
 * and is now the second consumer. The names are the exact top-level
 * category_name values as stored in MinifigCatalog -- "NINJAGO" and
 * "SPEED CHAMPIONS" really are capitalised that way, and "Town" is what
 * BrickLink calls City. Matching is done on these strings, so do not
 * "tidy" the casing.
 *
 * Order is editorial, most recognisable first.
 *
 * Typed readonly string[] rather than `as const`: callers do
 * POPULAR_THEMES.includes(someTheme) with an arbitrary string, which a tuple
 * of literal types rejects.
 */
export const POPULAR_THEMES: readonly string[] = [
  'Star Wars', 'Harry Potter', 'Super Heroes', 'NINJAGO', 'Town', 'Technic',
  'Disney', 'Jurassic World', 'SPEED CHAMPIONS', 'Minecraft', 'Indiana Jones',
  'Pirates', 'Castle', 'Space', 'Collectible Minifigures', 'Friends',
  'The Hobbit and The Lord of the Rings', 'Avatar', 'Batman I',
];
