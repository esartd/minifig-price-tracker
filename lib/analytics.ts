/**
 * Analytics utilities for tracking affiliate clicks and user engagement
 */

export async function trackAffiliateClick(
  provider: 'amazon' | 'bricklink' | 'lego' | 'rakuten' | 'ebay',
  itemNo: string,
  source: string,
  userId?: string
): Promise<void> {
  try {
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        itemNo,
        source,
        userId,
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    // Fail silently - don't block user experience if analytics fails
    console.error('[Analytics] Failed to track click:', err);
  }
}

/**
 * Track page views for analytics
 */
export async function trackPageView(
  page: string,
  userId?: string
): Promise<void> {
  try {
    await fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        userId,
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error('[Analytics] Failed to track page view:', err);
  }
}
