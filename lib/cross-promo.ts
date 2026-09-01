/**
 * The seller's cross-promotion line, e.g. "Check out my other LEGO listings!".
 *
 * Shared by the per-item listing generator and the bulk marketplace export so
 * the sanitising rules live in exactly one place.
 *
 * The rules exist because marketplaces are strict about this text:
 *
 *  - eBay prohibits links to other sites in a description, and has been
 *    tightening even on links to a seller's own eBay items.
 *  - Vinted bans references or links to external sites outright.
 *  - Whatnot requires a description to "refer only to the item for sale",
 *    which is why the bulk export leaves this off for Whatnot by default.
 *
 * So this is deliberately plain text: any URL a seller types is stripped
 * rather than passed through, because a link is the thing most likely to get
 * their listing pulled — and they would never find out from us.
 */

export const DEFAULT_CROSS_PROMO_TEXT = 'Check out my other LEGO listings!';

/** Marketplaces reject or truncate long descriptions; this is ample for a line. */
export const CROSS_PROMO_MAX_LENGTH = 200;

/**
 * Anything URL-shaped: a scheme, a bare www., or a domain-looking token.
 * Deliberately broad — a false positive costs the seller a few characters,
 * a false negative can cost them the listing.
 */
const URL_LIKE =
  /\b(?:[a-z][a-z0-9+.-]*:\/\/\S+|www\.\S+|\S+\.(?:com|net|org|co|uk|shop|store|io|me|biz|info|us|ca|de|fr|es|it|nl)\b\S*)/gi;

/**
 * Schemes that carry no "//" and so slip past URL_LIKE.
 *
 * Listed explicitly rather than matching `word:` generally, which would eat
 * ordinary punctuation — "Note: check my shop" must survive intact.
 *
 * mailto:/tel: are stripped for the same reason as links: marketplaces treat
 * moving a buyer to off-platform contact the same as sending them off-site.
 */
const BARE_SCHEME = /\b(?:javascript|data|vbscript|file|mailto|tel):\S*/gi;

/**
 * Clean a seller-supplied cross-promo line.
 *
 * Strips URLs, collapses whitespace to a single line (a stray newline breaks
 * a CSV row in the Whatnot and eBay exports), and caps the length.
 *
 * Returns '' when nothing usable is left, so callers can treat empty as
 * "don't emit anything".
 */
export function sanitizeCrossPromo(
  text: string | null | undefined,
  maxLength: number = CROSS_PROMO_MAX_LENGTH
): string {
  if (!text) return '';

  return String(text)
    .replace(URL_LIKE, '')
    .replace(BARE_SCHEME, '')
    // Any newline, tab or carriage return becomes a space: this text is
    // written into single-cell CSV fields and one-line XML/HTML elements.
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
    .trim();
}

/**
 * True when the seller has both switched this on and left something to say.
 */
export function shouldEmitCrossPromo(
  enabled: boolean | undefined,
  text: string | null | undefined
): boolean {
  return enabled === true && sanitizeCrossPromo(text).length > 0;
}

/**
 * The line to append, or '' if there's nothing to add.
 *
 * Callers append this themselves because every generator and adapter joins
 * its sections differently — plain "\n\n", HTML paragraphs, or CSV cells.
 */
export function crossPromoLine(
  enabled: boolean | undefined,
  text: string | null | undefined,
  maxLength: number = CROSS_PROMO_MAX_LENGTH
): string {
  if (enabled !== true) return '';
  return sanitizeCrossPromo(text, maxLength);
}

/**
 * Normalise a client-supplied `preferences` object before it reaches the
 * templates.
 *
 * The generate-listing routes pass `preferences` straight through with no
 * validation. That was harmless while every field was a boolean, but the
 * cross-promo text is free-form and client-controlled, so it gets sanitised
 * and capped here rather than trusting the browser to have done it.
 */
export function sanitizePreferences<T extends Record<string, any>>(preferences: T | undefined | null): T {
  const prefs = (preferences ?? {}) as T;

  if (typeof prefs.crossPromoText !== 'string' && prefs.crossPromoText !== undefined) {
    return { ...prefs, crossPromoText: '' };
  }

  return {
    ...prefs,
    crossPromoText: sanitizeCrossPromo(prefs.crossPromoText),
  };
}
