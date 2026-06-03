/**
 * Production-safe logging utility
 *
 * Prevents excessive Vercel observability events in production by:
 * - Suppressing debug logs in production
 * - Keeping errors and warnings always visible
 * - Zero cost logging in development
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Debug logs - only in development
   * Use for: verbose progress tracking, iteration logs, detailed state
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Info logs - always shown but use sparingly
   * Use for: important state changes, user actions, key milestones
   */
  info: (...args: any[]) => {
    console.log('[INFO]', ...args);
  },

  /**
   * Warning logs - always shown
   * Use for: recoverable errors, fallback behavior, deprecated usage
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error logs - always shown
   * Use for: exceptions, failed operations, unrecoverable errors
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
