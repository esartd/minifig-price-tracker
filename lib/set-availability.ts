/**
 * Set Availability Status Detection
 *
 * Since LEGO's official API requires authentication and rate limiting,
 * we use a hybrid approach:
 * 1. Year-based heuristic (sets from current/last 2 years = likely available)
 * 2. BrickLink API availability flag (when fetching prices)
 * 3. Manual overrides for known retiring/retired sets
 */

export type SetAvailabilityStatus =
  | 'available'      // Currently sold by LEGO
  | 'retiring_soon'  // Marked as retiring soon
  | 'retired'        // No longer sold by LEGO
  | 'unknown';       // Unable to determine

export interface SetAvailability {
  status: SetAvailabilityStatus;
  lastChecked: Date;
  source: 'heuristic' | 'bricklink' | 'manual';
  notes?: string;
}

/**
 * Known retiring/retired sets (manual overrides)
 * Update this periodically based on LEGO announcements
 */
const MANUAL_OVERRIDES: Record<string, { status: SetAvailabilityStatus; notes?: string }> = {
  // Example: Add sets when LEGO announces retirement
  // '75192-1': { status: 'retiring_soon', notes: 'Retiring December 2024' },
  // '10294-1': { status: 'retired', notes: 'Retired Q1 2024' },
};

/**
 * Detect availability based on year released
 * Conservative approach: Only show "available" for current year sets
 * Older sets marked as "unknown" since we don't have real-time LEGO data
 */
export function detectAvailabilityByYear(yearReleased: string | null): SetAvailabilityStatus {
  if (!yearReleased || yearReleased === '?') {
    return 'unknown';
  }

  const year = parseInt(yearReleased);
  const currentYear = new Date().getFullYear();
  const yearsSinceRelease = currentYear - year;

  if (yearsSinceRelease < 0) {
    // Future release
    return 'unknown';
  } else if (yearsSinceRelease === 0) {
    // Released this year - likely still available
    return 'available';
  } else {
    // Older sets - we don't know LEGO's retirement schedule
    return 'unknown';
  }
}

/**
 * Get availability status for a set
 * Checks manual overrides first, then uses year-based heuristic
 */
export function getSetAvailability(
  boxNo: string,
  yearReleased: string | null
): SetAvailability {
  // Check manual overrides first
  const override = MANUAL_OVERRIDES[boxNo];
  if (override) {
    return {
      status: override.status,
      lastChecked: new Date(),
      source: 'manual',
      notes: override.notes
    };
  }

  // Use year-based heuristic
  const status = detectAvailabilityByYear(yearReleased);
  return {
    status,
    lastChecked: new Date(),
    source: 'heuristic'
  };
}

/**
 * Get display badge for availability status
 */
export function getAvailabilityBadge(status: SetAvailabilityStatus): {
  text: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'available':
      return {
        text: 'Available Now',
        color: '#059669',
        bgColor: '#d1fae5'
      };
    case 'retiring_soon':
      return {
        text: 'Retiring Soon',
        color: '#d97706',
        bgColor: '#fef3c7'
      };
    case 'retired':
      return {
        text: 'Retired',
        color: '#737373',
        bgColor: '#f5f5f5'
      };
    default:
      return {
        text: 'Unknown',
        color: '#737373',
        bgColor: '#f5f5f5'
      };
  }
}

/**
 * Check if a set is likely available for purchase
 */
export function isLikelyAvailable(status: SetAvailabilityStatus): boolean {
  return status === 'available' || status === 'retiring_soon';
}

/**
 * Get LEGO.com product URL for a set
 * Note: This doesn't check availability, just generates the URL
 */
export function getLegoComUrl(boxNo: string, setName: string): string {
  // Remove -1 suffix
  const cleanSetNumber = boxNo.replace(/-\d+$/, '');

  // Slugify the name
  const slug = setName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `https://www.lego.com/en-us/product/${slug}-${cleanSetNumber}`;
}

/**
 * For future enhancement: Parse BrickLink availability from API response
 * When we fetch pricing, BrickLink returns item details including if it's
 * currently sold by LEGO
 */
export function parseAvailabilityFromBrickLink(bricklinkData: any): SetAvailabilityStatus {
  // TODO: Implement when we extend BrickLink API integration
  // BrickLink API returns: item.sold_by_lego boolean
  if (bricklinkData?.item?.sold_by_lego) {
    return 'available';
  }
  return 'unknown';
}
