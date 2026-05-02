/**
 * Donation helper functions
 */

/**
 * Calculate the current donation season (quarterly)
 * Format: "YYYY-QN" (e.g., "2026-Q2")
 */
export function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const quarter = Math.ceil(month / 3); // 1-4
  return `${year}-Q${quarter}`;
}

/**
 * Validate display name for leaderboard
 * Rules: 3-30 characters, letters, numbers, spaces, underscores, hyphens only
 */
export function validateDisplayName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Display name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Display name must be at least 3 characters' };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Display name must be 30 characters or less' };
  }

  // Only allow letters, numbers, spaces, underscores, and hyphens
  const validPattern = /^[a-zA-Z0-9\s_-]+$/;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: 'Display name can only contain letters, numbers, spaces, underscores, and hyphens' };
  }

  return { valid: true };
}

/**
 * Get start and end dates for the current quarter
 * Returns { start: Date, end: Date } for filtering date_added fields
 */
export function getCurrentSeasonDateRange(): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const quarter = Math.floor(month / 3); // 0-3

  // Calculate start of quarter
  const startMonth = quarter * 3;
  const start = new Date(year, startMonth, 1, 0, 0, 0, 0);

  // Calculate end of quarter (last millisecond of last day)
  const endMonth = startMonth + 3;
  const end = new Date(year, endMonth, 0, 23, 59, 59, 999);

  return { start, end };
}

/**
 * Format date range for display
 * Example: "Apr 1 - Jun 30, 2026"
 */
export function formatSeasonDateRange(): string {
  const { start, end } = getCurrentSeasonDateRange();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const startMonth = monthNames[start.getMonth()];
  const startDay = start.getDate();

  const endMonth = monthNames[end.getMonth()];
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
}

/**
 * Format currency amount for display
 */
export function formatDonationAmount(amount: number, currency: string = 'USD'): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}
