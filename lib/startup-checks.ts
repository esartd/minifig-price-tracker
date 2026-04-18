/**
 * Startup checks that run when the application initializes
 * These protect against catastrophic failures
 */

import { setupProductionSafeguards, verifyProductionDataExists } from './database-safeguards';

let safeguardsInitialized = false;

export async function initializeAppSafeguards() {
  if (safeguardsInitialized) {
    return;
  }

  console.log('🚀 Initializing application safeguards...');

  try {
    // 1. Set up database protection
    setupProductionSafeguards();

    // 2. Verify production database has data
    await verifyProductionDataExists();

    // 3. Check environment configuration
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured');
    }

    safeguardsInitialized = true;
    console.log('✅ All safeguards initialized successfully\n');

  } catch (error) {
    console.error('❌ Safeguard initialization failed:', error);
    // Don't throw - allow app to start but log the error
  }
}

// Auto-initialize on import (will run once per server start)
if (typeof window === 'undefined') {
  // Server-side only
  initializeAppSafeguards().catch(console.error);
}
