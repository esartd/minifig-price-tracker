import { createHash } from 'crypto';

/**
 * Group near-duplicate feedback without an LLM.
 *
 * `ANTHROPIC_API_KEY` is empty, so there is no model to ask "are these the same
 * complaint?". This does it with tokens instead: strip the message down to its
 * distinctive words, sort them, hash the result. Two people reporting the same
 * thing in roughly the same words collide; two unrelated reports do not.
 *
 * There are two layers, and the second is the one that does the work:
 *
 *  - `clusterIdFor` hashes the tokens and is stored on the row at write time.
 *    Exact matches only. Kept because it is a stable, persisted grouping that
 *    costs one column.
 *  - `similar()` compares two messages by token OVERLAP at read time. This is
 *    what actually catches duplicates. Hashing alone proved too brittle in
 *    testing: "The price on sw0528 looks wrong, it shows way too high" and
 *    "sw0528 price is wrong, shows too high on the page" differ by a single
 *    token and hashed apart, which is exactly the case the feature exists for.
 *
 * It will still never catch a genuine paraphrase -- "this figure is valued too
 * high" shares no tokens and is a different cluster. That is the right way to
 * fail: a false merge hides someone's report behind another, while a missed
 * merge only means reading two items instead of one.
 *
 * Honest about what it earns: at roughly one submission a week this does
 * nothing visible for months. It exists so the data is grouped from day one
 * rather than needing a backfill later.
 */

/**
 * Words that carry no signal about WHAT is being reported. Feedback-specific
 * ones matter as much as the grammatical ones: almost every message contains
 * "site", "page" or "please", so leaving them in would pull unrelated reports
 * into the same cluster.
 */
const STOPWORDS = new Set([
  'a', 'about', 'add', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'any',
  'are', 'as', 'at', 'back', 'be', 'because', 'been', 'being', 'but', 'by',
  'can', 'cannot', 'cant', 'could', 'did', 'do', 'does', 'doesnt', 'doing',
  'dont', 'down', 'each', 'even', 'ever', 'every', 'feature', 'few', 'for',
  'from', 'get', 'go', 'got', 'had', 'has', 'have', 'having', 'he', 'her',
  'here', 'hi', 'hello', 'him', 'his', 'how', 'i', 'if', 'im', 'in', 'into',
  'is', 'isnt', 'it', 'its', 'ive', 'just', 'know', 'like', 'make', 'many',
  'may', 'maybe', 'me', 'more', 'most', 'much', 'must', 'my', 'need', 'no',
  'not', 'now', 'of', 'on', 'one', 'only', 'or', 'other', 'our', 'out', 'over',
  'page', 'please', 'really', 'said', 'same', 'see', 'she', 'should', 'site',
  'so', 'some', 'something', 'still', 'such', 'than', 'thanks', 'that', 'the',
  'their', 'them', 'then', 'there', 'these', 'they', 'thing', 'things', 'this',
  'those', 'through', 'to', 'too', 'under', 'up', 'us', 'use', 'used', 'using',
  'very', 'want', 'was', 'way', 'we', 'well', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
]);

/** How many tokens make up a cluster key. */
const KEY_TOKENS = 6;

/** Below this, the message is too short to cluster on with any confidence. */
const MIN_TOKENS = 2;

/**
 * Reduce a message to its distinctive tokens.
 *
 * Exported so the admin page can show WHY two items were grouped -- an opaque
 * hash is impossible to argue with when the grouping looks wrong.
 */
export function clusterTokens(message: string): string[] {
  const words = message
    .toLowerCase()
    // Keep digits: item numbers like sw0528 and set numbers like 75192-1 are
    // the single most identifying thing a report can contain.
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^-+|-+$/g, ''))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  // De-duplicate, then take the longest words: length is a decent proxy for
  // specificity once the stopwords are gone, and it is stable across two
  // people writing the same complaint at different lengths.
  const unique = Array.from(new Set(words));
  unique.sort((a, b) => b.length - a.length || a.localeCompare(b));

  // Sorted alphabetically so word ORDER does not change the key.
  return unique.slice(0, KEY_TOKENS).sort();
}

/**
 * The cluster key for a message, or null when there is not enough to go on.
 *
 * Null means "do not group this" -- the admin page treats a null clusterId as
 * a cluster of one, which is the safe behaviour. Never fall back to hashing
 * the raw message: that would put every short message in its own cluster
 * anyway, at the cost of pretending the grouping was meaningful.
 */
export function clusterIdFor(message: string): string | null {
  const tokens = clusterTokens(message);
  if (tokens.length < MIN_TOKENS) return null;
  return createHash('sha1').update(tokens.join(' ')).digest('hex').slice(0, 16);
}

/**
 * How much of two messages' distinctive vocabulary must coincide before they
 * are treated as the same report. Jaccard overlap: 0.5 means "half the words
 * either one uses are words they share".
 *
 * Paired with MIN_SHARED below, and that pairing is the point. A ratio alone
 * is unreliable at these lengths, because stopword-stripping leaves short
 * messages with very few tokens: "Please add a dark mode to the site" reduces
 * to {dark, mode}, where a single coincidental word is already half the
 * message. The ratio decides how much of the wording matches; the floor
 * decides whether there is enough evidence to judge.
 */
const SIMILARITY_THRESHOLD = 0.5;

/**
 * Never merge on one word, however dominant it is in a short message.
 *
 * {search, slow} against {search, broken} scores 0.33 and fails the ratio
 * anyway -- but {dark} against {dark, mode} would score 0.5 and pass it. Two
 * separate reports agreeing on a single token is a coincidence, not a
 * duplicate.
 */
const MIN_SHARED = 2;

/**
 * Anything that looks like a BrickLink item number -- sw0528, sh0045, 75192-1.
 *
 * These are handled specially because they are the single most discriminating
 * thing a report can contain, and plain token overlap gets them backwards:
 * "price wrong on sw0528" and "price wrong on 75192-1" share two tokens out of
 * four, clear the threshold, and merge -- two different items, filed as one.
 */
const ITEM_CODE = /^(?:[a-z]{2,4}\d{3,5}|\d{4,7}-\d{1,2})$/;

export function itemCodes(tokens: string[]): string[] {
  return tokens.filter((t) => ITEM_CODE.test(t));
}

/**
 * True when two messages are reporting the same thing.
 *
 * The item-code rule overrides the overlap score in both directions: two
 * reports that each name an item and name DIFFERENT items never merge, however
 * similar the rest of their wording.
 */
export function similar(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return false;

  const codesA = itemCodes(a);
  const codesB = itemCodes(b);
  if (codesA.length > 0 && codesB.length > 0) {
    const shared = codesA.some((c) => codesB.includes(c));
    if (!shared) return false;
  }

  const setB = new Set(b);
  const intersection = a.filter((t) => setB.has(t)).length;
  if (intersection < MIN_SHARED) return false;

  const union = new Set([...a, ...b]).size;
  return union > 0 && intersection / union >= SIMILARITY_THRESHOLD;
}
