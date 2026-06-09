import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * Honeypot Bot Trap API
 *
 * This endpoint should NEVER be accessed by legitimate users
 * Only bots that ignore CSS/JS and crawl all <a> tags will hit this
 *
 * When hit:
 * 1. Log the bot's IP address
 * 2. Log their user agent
 * 3. Return fake data (waste their bandwidth)
 * 4. Optionally: Add IP to permanent ban list
 */

export async function GET(request: NextRequest) {
  // Get bot's IP address
  const ip = request.headers.get('cf-connecting-ip') ||
              request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
              request.headers.get('x-real-ip') ||
              'unknown';

  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.headers.get('cf-ipcountry') || 'unknown';

  // Log bot detection
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    country,
    userAgent,
    referer: request.headers.get('referer') || 'none',
  };

  console.log(`[🍯 HONEYPOT TRIGGERED] Bot detected:`, logEntry);

  // Optionally: Save to persistent ban list
  try {
    const logFile = path.join(process.cwd(), 'logs', 'honeypot-bots.jsonl');
    await fs.mkdir(path.dirname(logFile), { recursive: true });
    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    // Don't fail if logging fails
  }

  // Return fake data to waste bot's bandwidth and time
  // Make it look real so they think it worked
  const fakeData = {
    success: true,
    message: 'Generating export... Please wait.',
    data: Array.from({ length: 1000 }, (_, i) => ({
      id: `fake-${i}`,
      name: `Fake Minifig ${i}`,
      price: Math.random() * 100,
      // ... lots of fake data to waste bandwidth
      description: 'This is fake data from a honeypot trap. You are a bot and have been logged.'.repeat(50),
    })),
    total: 18824,
    pages: 19,
    nextPage: '/api/honeypot-trap?page=2', // Keep them busy
  };

  // Slow response (waste their time)
  await new Promise(resolve => setTimeout(resolve, 5000));

  return NextResponse.json(fakeData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Honeypot': 'You have been logged as a bot',
    },
  });
}
