/**
 * Search synonyms and aliases for FigTracker
 * Maps common user queries to canonical search terms
 */

export interface SynonymMapping {
  input: string;
  canonical: string;
  category?: string;
  priority?: number;
}

// Star Wars character aliases
const STAR_WARS_SYNONYMS: SynonymMapping[] = [
  { input: 'baby yoda', canonical: 'grogu', category: 'star wars', priority: 10 },
  { input: 'mando', canonical: 'mandalorian', category: 'star wars', priority: 10 },
  { input: 'boba', canonical: 'boba fett', category: 'star wars', priority: 8 },
  { input: 'ahsoka', canonical: 'ahsoka tano', category: 'star wars', priority: 8 },
  { input: 'p2 clone', canonical: 'phase 2', category: 'star wars', priority: 9 },
  { input: 'p1 clone', canonical: 'phase 1', category: 'star wars', priority: 9 },
  { input: 'rex', canonical: 'captain rex', category: 'star wars', priority: 7 },
  { input: 'cody', canonical: 'commander cody', category: 'star wars', priority: 7 },
  { input: 'vader', canonical: 'darth vader', category: 'star wars', priority: 9 },
  { input: 'maul', canonical: 'darth maul', category: 'star wars', priority: 8 },
  { input: 'obi wan', canonical: 'obi-wan kenobi', category: 'star wars', priority: 9 },
  { input: 'qui gon', canonical: 'qui-gon jinn', category: 'star wars', priority: 8 },
];

// Harry Potter character aliases
const HARRY_POTTER_SYNONYMS: SynonymMapping[] = [
  { input: 'dumbledore', canonical: 'albus dumbledore', category: 'harry potter', priority: 8 },
  { input: 'voldemort', canonical: 'lord voldemort', category: 'harry potter', priority: 8 },
  { input: 'snape', canonical: 'severus snape', category: 'harry potter', priority: 7 },
];

// Other themes
const OTHER_SYNONYMS: SynonymMapping[] = [
  { input: 'lloyd', canonical: 'lloyd garmadon', category: 'ninjago', priority: 8 },
];

// Abbreviations
const ABBREVIATION_SYNONYMS: SynonymMapping[] = [
  { input: 'sw', canonical: 'star wars', priority: 10 },
  { input: 'hp', canonical: 'harry potter', priority: 10 },
  { input: 'lotr', canonical: 'lord of the rings', priority: 10 },
  { input: 'cmf', canonical: 'collectible minifigures', priority: 10 },
];

export const ALL_SYNONYMS = [
  ...STAR_WARS_SYNONYMS,
  ...HARRY_POTTER_SYNONYMS,
  ...OTHER_SYNONYMS,
  ...ABBREVIATION_SYNONYMS,
];

/**
 * Expand query using synonyms
 * Returns the original query if no synonyms match
 */
export function expandSynonyms(query: string): {
  expanded: string;
  matched: boolean;
  synonym?: SynonymMapping;
} {
  const queryL = query.toLowerCase().trim();

  // Exact match first
  const exactMatch = ALL_SYNONYMS.find(s => s.input === queryL);
  if (exactMatch) {
    return { expanded: exactMatch.canonical, matched: true, synonym: exactMatch };
  }

  // Partial match (query contains synonym)
  const partialMatch = ALL_SYNONYMS
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .find(s => queryL.includes(s.input));

  if (partialMatch) {
    const expanded = queryL.replace(partialMatch.input, partialMatch.canonical);
    return { expanded, matched: true, synonym: partialMatch };
  }

  return { expanded: query, matched: false };
}

/**
 * Get autocomplete suggestions based on partial input
 */
export function getAutocompleteSuggestions(partial: string, limit = 5): SynonymMapping[] {
  const partialL = partial.toLowerCase().trim();

  if (partialL.length < 2) return [];

  return ALL_SYNONYMS
    .filter(s => s.input.startsWith(partialL) || s.canonical.includes(partialL))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, limit);
}

/**
 * Get all synonyms for a specific category
 */
export function getSynonymsByCategory(category: string): SynonymMapping[] {
  return ALL_SYNONYMS.filter(s => s.category?.toLowerCase() === category.toLowerCase());
}
