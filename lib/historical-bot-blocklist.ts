/**
 * Historical Bot Blocklist
 *
 * Pre-identified bot IPs from past activity (CAPTCHA failures, suspicious patterns)
 * These IPs are permanently blocked to prevent repeat attacks
 *
 * Generated: 2026-06-09
 * Source: Server logs analysis (CAPTCHA REQUIRED + SUSPICIOUS markers)
 * Total IPs: Will be loaded from file
 */

import fs from 'fs';
import path from 'path';

let historicalBotIPs: Set<string> | null = null;

/**
 * Load historical bot IPs from file (lazy load, only once)
 */
function loadHistoricalBots(): Set<string> {
  if (historicalBotIPs) {
    return historicalBotIPs;
  }

  try {
    const blocklistPath = path.join(process.cwd(), 'data', 'bot-blocklist.txt');

    if (fs.existsSync(blocklistPath)) {
      const content = fs.readFileSync(blocklistPath, 'utf-8');
      const ips = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#')); // Skip empty lines and comments

      historicalBotIPs = new Set(ips);
      console.log(`[BLOCKLIST] Loaded ${historicalBotIPs.size} historical bot IPs`);
    } else {
      // File doesn't exist yet - return empty set
      historicalBotIPs = new Set();
      console.log(`[BLOCKLIST] No historical blocklist found at ${blocklistPath}`);
    }
  } catch (error) {
    console.error('[BLOCKLIST] Error loading historical bots:', error);
    historicalBotIPs = new Set();
  }

  return historicalBotIPs;
}

/**
 * Check if IP is in historical bot blocklist
 */
export function isHistoricalBot(ip: string): boolean {
  const blocklist = loadHistoricalBots();
  return blocklist.has(ip);
}

/**
 * Add IP to historical blocklist (runtime + persist to file)
 */
export function addToHistoricalBlocklist(ip: string, reason: string) {
  const blocklist = loadHistoricalBots();

  if (blocklist.has(ip)) {
    return; // Already blocked
  }

  blocklist.add(ip);

  // Persist to file
  try {
    const blocklistPath = path.join(process.cwd(), 'data', 'bot-blocklist.txt');
    const dir = path.dirname(blocklistPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const entry = `${ip} # ${reason} (${new Date().toISOString()})\n`;
    fs.appendFileSync(blocklistPath, entry);

    console.log(`[BLOCKLIST] Added ${ip} - Reason: ${reason}`);
  } catch (error) {
    console.error('[BLOCKLIST] Error persisting bot IP:', error);
  }
}

/**
 * Get blocklist stats (for admin dashboard)
 */
export function getBlocklistStats() {
  const blocklist = loadHistoricalBots();
  return {
    total: blocklist.size,
    loaded: historicalBotIPs !== null,
  };
}
