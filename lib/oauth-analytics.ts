/**
 * OAuth Analytics & Monitoring
 * Tracks Google OAuth events for debugging and metrics
 */

export type OAuthEvent =
  | 'google_signup'
  | 'google_signin'
  | 'account_linked'
  | 'oauth_failure'

interface OAuthEventData {
  event: OAuthEvent
  email?: string
  error?: string
  timestamp: string
}

/**
 * Log OAuth events to console (and optionally to analytics service)
 */
export function logOAuthEvent(event: OAuthEvent, data?: {
  email?: string
  error?: string
}) {
  const eventData: OAuthEventData = {
    event,
    email: data?.email,
    error: data?.error,
    timestamp: new Date().toISOString()
  }

  // Console logging for development/debugging
  const emoji = {
    google_signup: '🆕',
    google_signin: '🔐',
    account_linked: '🔗',
    oauth_failure: '❌'
  }[event]

  console.log(`${emoji} [OAuth] ${event}`, {
    ...eventData,
    email: data?.email ? `${data.email.substring(0, 3)}***` : undefined // Redact email for privacy
  })

  // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event, {
  //     event_category: 'oauth',
  //     event_label: data?.email,
  //   })
  // }
}
