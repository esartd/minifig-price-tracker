/**
 * Format large numbers into compact notation (e.g., 1.2K, 3.5M)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatCompactNumber(num: number, decimals: number = 2): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    // Format as K (thousands)
    const thousands = num / 1000;
    return `${thousands.toFixed(decimals)}K`;
  }

  if (num < 1000000000) {
    // Format as M (millions)
    const millions = num / 1000000;
    return `${millions.toFixed(decimals)}M`;
  }

  // Format as B (billions)
  const billions = num / 1000000000;
  return `${billions.toFixed(decimals)}B`;
}

/**
 * Format large numbers with smart decimal places (removes unnecessary .00)
 * @param num - The number to format
 * @returns Formatted string
 */
export function formatCompactNumberSmart(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    const thousands = num / 1000;
    // Remove .00 if whole number, otherwise show up to 1 decimal
    return thousands % 1 === 0
      ? `${thousands.toFixed(0)}K`
      : `${thousands.toFixed(1)}K`;
  }

  if (num < 1000000000) {
    const millions = num / 1000000;
    return millions % 1 === 0
      ? `${millions.toFixed(0)}M`
      : `${millions.toFixed(1)}M`;
  }

  const billions = num / 1000000000;
  return billions % 1 === 0
    ? `${billions.toFixed(0)}B`
    : `${billions.toFixed(1)}B`;
}
