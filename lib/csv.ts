/**
 * RFC 4180 CSV writing.
 *
 * Marketplace-agnostic: knows nothing about Whatnot, eBay, or LEGO. Each
 * marketplace adapter supplies its own column list and row mapper.
 */

/**
 * True if a value would be treated as a formula when the user opens the CSV
 * in Sheets or Excel to eyeball it before uploading.
 *
 * A leading "-" only counts when it isn't just a negative number, so ordinary
 * values like "-5" stay untouched.
 */
function looksLikeFormula(value: string): boolean {
  if (!value) return false;
  const first = value[0];
  if (first === '=' || first === '+' || first === '@') return true;
  if (first === '-' && !/^-\d/.test(value)) return true;
  // Tab / CR at the start is another known spreadsheet-injection vector.
  return first === '\t' || first === '\r';
}

/**
 * Encode one field per RFC 4180.
 *
 * Listing descriptions are multi-line, so the embedded-newline case is the
 * common one here, not an edge case: any field containing a comma, quote, or
 * newline gets wrapped in quotes with inner quotes doubled.
 *
 * The formula guard is deliberately narrow. Prefixing an apostrophe changes the
 * value the marketplace receives, so it only fires on genuinely dangerous input
 * — which a LEGO catalog name realistically never is — rather than every field.
 */
export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';

  let str = String(value);
  if (str === '') return '';

  if (looksLikeFormula(str)) {
    str = `'${str}`;
  }

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/** Join one row of raw values into a CSV line. */
export function buildCsvLine(values: ReadonlyArray<string | number | null | undefined>): string {
  return values.map(escapeCsvField).join(',');
}

/**
 * Serialise a header plus rows into a complete CSV document.
 *
 * CRLF line endings per RFC 4180. Plain UTF-8 with no BOM — a BOM helps Excel
 * guess the encoding but risks confusing a marketplace's parser, and the file's
 * real destination is the marketplace, not Excel.
 */
export function buildCsv(
  columns: ReadonlyArray<string>,
  rows: ReadonlyArray<ReadonlyArray<string | number | null | undefined>>
): string {
  const lines = [buildCsvLine(columns)];
  for (const row of rows) {
    lines.push(buildCsvLine(row));
  }
  return lines.join('\r\n') + '\r\n';
}
