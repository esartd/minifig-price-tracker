/**
 * AUTOMATED BRICKLINK CATALOG DOWNLOAD
 *
 * This script uses browser automation to download catalog files from BrickLink.
 * Requires you to be logged into BrickLink in your default browser.
 *
 * Files downloaded:
 * - Minifigures.txt
 * - Catalogs.txt (Sets)
 * - Parts.txt
 * - Original Boxes.txt
 * - categories.txt
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

// Get catalog destination directory
const getCatalogDir = () => {
  const baseDir = '/Users/erickkosysu/Code Projects/FigTracker/Bricklink Catalog txt';

  // Use date from CLI argument or current date
  if (process.argv[2]) {
    return path.join(baseDir, process.argv[2]);
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return path.join(baseDir, `${year}/${month}`);
};

const CATALOG_DIR = getCatalogDir();
const DOWNLOAD_DIR = path.join(CATALOG_DIR);

// BrickLink download URLs (direct download links)
const DOWNLOAD_URLS = {
  'Minifigures.txt': 'https://www.bricklink.com/catalogDownload.asp?a=a&viewType=0&itemType=M',
  'Catalogs.txt': 'https://www.bricklink.com/catalogDownload.asp?a=a&viewType=0&itemType=S',
  'Parts.txt': 'https://www.bricklink.com/catalogDownload.asp?a=a&viewType=0&itemType=P',
  'Original Boxes.txt': 'https://www.bricklink.com/catalogDownload.asp?a=a&viewType=0&itemType=O',
  'categories.txt': 'https://www.bricklink.com/catalogDownload.asp?a=a&viewType=1&itemType=C'
};

async function downloadCatalogs() {
  console.log('🚀 BRICKLINK CATALOG DOWNLOADER');
  console.log('================================\n');

  // Create download directory
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    console.log(`📁 Created directory: ${DOWNLOAD_DIR}\n`);
  } else {
    console.log(`📁 Using directory: ${DOWNLOAD_DIR}\n`);
  }

  console.log('⚠️  IMPORTANT: This script downloads files directly from BrickLink.');
  console.log('   BrickLink provides free catalog downloads (no API key needed).\n');

  // Find Chrome executable
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
  ];

  let executablePath = chromePaths.find(p => fs.existsSync(p));

  if (!executablePath) {
    console.log('❌ Chrome/Chromium not found. Install Chrome or specify path.');
    process.exit(1);
  }

  console.log(`🌐 Using browser: ${path.basename(path.dirname(path.dirname(executablePath)))}`);
  console.log('📥 Starting downloads...\n');

  const browser = await puppeteer.launch({
    executablePath,
    headless: false, // Show browser so user can see downloads
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();

    // Set download behavior
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_DIR
    });

    for (const [filename, url] of Object.entries(DOWNLOAD_URLS)) {
      console.log(`📥 Downloading ${filename}...`);

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait a bit for download to start
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if file exists (might have different name from BrickLink)
        const possibleNames = [
          filename,
          filename.replace('.txt', ''),
          filename.toLowerCase()
        ];

        let downloaded = false;
        for (const name of possibleNames) {
          const filePath = path.join(DOWNLOAD_DIR, name);
          if (fs.existsSync(filePath)) {
            downloaded = true;
            console.log(`   ✅ ${filename} saved`);
            break;
          }
        }

        if (!downloaded) {
          console.log(`   ⚠️  ${filename} - check download folder manually`);
        }

      } catch (error: any) {
        console.log(`   ❌ Failed to download ${filename}: ${error.message}`);
      }

      // Wait between downloads
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n✅ Download process complete!');
    console.log(`\n📂 Files saved to: ${DOWNLOAD_DIR}`);
    console.log('\nVerify all files downloaded:');
    Object.keys(DOWNLOAD_URLS).forEach(filename => {
      console.log(`   - ${filename}`);
    });

  } catch (error) {
    console.error('\n❌ Download failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Handle errors
downloadCatalogs().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
