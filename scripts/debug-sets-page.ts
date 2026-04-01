/**
 * Debug script to see the actual HTML structure of the "Appears In" page
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import puppeteer from 'puppeteer';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function debugSetsPage() {
  const minifigNo = process.argv[2] || 'sim001';

  console.log(`🔍 Loading page for: ${minifigNo}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const url = `https://www.bricklink.com/catalogItemIn.asp?M=${minifigNo}&in=S`;
  console.log(`URL: ${url}\n`);

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Get page title
  const title = await page.title();
  console.log(`Page title: ${title}\n`);

  // Extract all links that might be sets
  const links = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    return allLinks
      .filter(a => a.href.includes('catalogItem.asp') || a.href.includes('S='))
      .map(a => ({
        href: a.href,
        text: a.textContent?.trim().substring(0, 100),
      }))
      .slice(0, 20); // First 20 links
  });

  console.log('Links found:');
  links.forEach((link, i) => {
    console.log(`${i + 1}. ${link.text}`);
    console.log(`   ${link.href}\n`);
  });

  await browser.close();
}

debugSetsPage().catch(console.error);
