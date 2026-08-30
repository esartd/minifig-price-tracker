/**
 * Minimal XML writing.
 *
 * Only what a flat record-per-item document needs — no namespaces, no
 * attributes, no nesting beyond one level.
 */

/**
 * Escape text for an XML element body.
 *
 * `&` must go first or it would double-escape the entities added after it.
 * Also strips control characters, which are illegal in XML 1.0 even escaped —
 * a stray one makes the whole document unparseable, and marketplace importers
 * typically reject the entire file rather than the offending row.
 */
export function escapeXmlText(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';

  return String(value)
    // Illegal in XML 1.0 even when escaped. Tab, LF and CR are kept.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** One `<TAG>value</TAG>` line, or '' when the value is empty. */
export function xmlElement(
  tag: string,
  value: string | number | null | undefined,
  indent = '    '
): string {
  if (value === null || value === undefined || value === '') return '';
  return `${indent}<${tag}>${escapeXmlText(value)}</${tag}>`;
}

/** Build `<ROOT>` wrapping repeated `<ITEM>` blocks. */
export function buildXmlDocument(
  rootTag: string,
  itemTag: string,
  items: ReadonlyArray<ReadonlyArray<[string, string | number | null | undefined]>>
): string {
  const lines: string[] = [`<${rootTag}>`];

  for (const fields of items) {
    lines.push(`  <${itemTag}>`);
    for (const [tag, value] of fields) {
      const line = xmlElement(tag, value);
      if (line) lines.push(line);
    }
    lines.push(`  </${itemTag}>`);
  }

  lines.push(`</${rootTag}>`);
  return lines.join('\n') + '\n';
}
