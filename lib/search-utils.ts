/**
 * Shared search utilities for FigTracker
 * Used across minifigs and sets search
 */

export interface SearchableItem {
  id: string;
  name: string;
  category_name: string;
  year_released?: string | null;
}

/**
 * Detect search intent (ID vs name)
 */
export function detectSearchIntent(query: string): {
  type: 'minifig_id' | 'set_id' | 'name';
  normalized: string;
} {
  const trimmed = query.trim();

  // Minifig ID: sw1219, hp001, etc.
  if (/^[a-z]{2,4}\d{3,4}[a-z]?$/i.test(trimmed)) {
    return { type: 'minifig_id', normalized: trimmed.toLowerCase() };
  }

  // Set ID: 75192-1, 10188, etc.
  if (/^\d{4,5}(-\d+)?$/i.test(trimmed)) {
    return { type: 'set_id', normalized: trimmed };
  }

  return { type: 'name', normalized: trimmed.toLowerCase() };
}

/**
 * Tokenize text into searchable words
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\-\/]/g, ' ')
    .split(/[\s\/\-]+/)
    .filter(word => word.length >= 2);
}

/**
 * Normalize text for comparison (removes hyphens, apostrophes)
 */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/[\-']/g, '');
}

/**
 * Calculate search score with enhanced logic
 */
export function calculateSearchScore(
  item: SearchableItem,
  query: string,
  options: {
    allowPartialPrefix?: boolean;
    multiWordBoost?: boolean;
    categoryMatching?: boolean;
  } = {}
): { score: number; matchType: string } {
  const queryL = query.toLowerCase();
  const nameL = item.name.toLowerCase();
  const idL = item.id.toLowerCase();
  const categoryL = item.category_name.toLowerCase();

  // Normalize for comparison
  const nameNorm = normalize(nameL);
  const queryNorm = normalize(queryL);

  const nameWords = tokenize(item.name);
  const queryWords = tokenize(query);
  const categoryWords = tokenize(item.category_name);

  // Exact matches
  if (nameL === queryL || nameNorm === queryNorm) {
    return { score: 1000, matchType: 'exact_name' };
  }
  if (idL === queryL) {
    return { score: 1000, matchType: 'exact_id' };
  }

  // Name starts with
  if (nameL.startsWith(queryL) || nameNorm.startsWith(queryNorm)) {
    return { score: 500, matchType: 'prefix' };
  }

  // Word boundary exact
  if (nameWords.includes(queryL)) {
    return { score: 400, matchType: 'word_boundary' };
  }

  // Word prefix (with length check)
  for (const word of nameWords) {
    if (word.startsWith(queryL)) {
      const lengthRatio = queryL.length / word.length;
      if (lengthRatio >= 0.6 || word.length <= queryL.length + 2) {
        return { score: 300, matchType: 'prefix' };
      }
    }
  }

  // ID matching
  if (idL.startsWith(queryL)) return { score: 250, matchType: 'id' };
  if (idL.includes(queryL)) return { score: 200, matchType: 'id' };

  // Multi-word query (e.g., "captain rex", "n1 starfighter")
  if (queryWords.length >= 2 && options.multiWordBoost) {
    // Normalized matching (handles "n1" → "n-1")
    const queryWordsNorm = queryWords.map(normalize);
    const nameWordsNorm = nameWords.map(normalize);

    const allMatchNorm = queryWordsNorm.every(qWord =>
      nameWordsNorm.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))
    );
    if (allMatchNorm) return { score: 180, matchType: 'multi_word' };

    // All words present in order
    let lastIndex = -1;
    const allInOrder = queryWords.every(qWord => {
      const idx = nameWords.findIndex((nWord, i) =>
        i > lastIndex && nWord.startsWith(qWord)
      );
      if (idx !== -1) lastIndex = idx;
      return idx !== -1;
    });
    if (allInOrder) return { score: 170, matchType: 'multi_word' };

    // All words present (any order)
    const allPresent = queryWords.every(qWord =>
      nameWords.some(nWord => nWord.startsWith(qWord))
    );
    if (allPresent) return { score: 160, matchType: 'multi_word' };
  }

  // Partial prefix (e.g., "millen" → "millennium")
  if (options.allowPartialPrefix && queryL.length >= 4) {
    if (nameWords.some(w => w.length >= 6 && w.startsWith(queryL))) {
      return { score: 75, matchType: 'prefix' };
    }
  }

  // Category matching (very low priority, only if >6 chars)
  if (options.categoryMatching && queryL.length > 6) {
    if (categoryWords.some(w => w === queryL)) {
      return { score: 30, matchType: 'category' };
    }
    if (categoryWords.some(w => w.startsWith(queryL) && w.length >= 8)) {
      return { score: 15, matchType: 'category' };
    }
  }

  return { score: 0, matchType: 'none' };
}

/**
 * Sort results by relevance
 */
export function sortSearchResults<T extends SearchableItem & { score: number }>(
  items: T[]
): T[] {
  return items.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

    const aYear = a.year_released ? parseInt(a.year_released) : 0;
    const bYear = b.year_released ? parseInt(b.year_released) : 0;
    if (bYear !== aYear) return bYear - aYear;

    return b.id.localeCompare(a.id);
  });
}
