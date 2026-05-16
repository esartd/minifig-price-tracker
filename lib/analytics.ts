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
    // Determine product type based on item number format
    const productType = itemNo.includes('-') ? 'set' : 'minifig';

    // Get the actual redirect URL (would be set by calling component, but we don't need it for tracking)
    const redirectUrl = '#'; // Placeholder - actual redirect happens via Link component

    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: provider,
        productType,
        productId: itemNo,
        productName: '', // Optional field
        redirectUrl,
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
