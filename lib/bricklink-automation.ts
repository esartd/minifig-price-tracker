import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/**
 * Browser automation for BrickLink catalog downloads
 * Uses Puppeteer with chromium for serverless environments
 */

const BRICKLINK_DOWNLOAD_URL = 'https://www.bricklink.com/catalogDownload.asp';
const DEFAULT_TIMEOUT = 60000; // 60 seconds

export interface BrowserConfig {
  timeout?: number;
  headless?: boolean;
}

export interface CatalogDownloadOptions {
  itemType: string; // M, S, P, B, G, C, I, O
  includeYear?: boolean;
  includeWeight?: boolean;
  includeDimensions?: boolean;
}

/**
 * Setup Puppeteer browser instance
 * Uses chrome-aws-lambda for Vercel serverless compatibility
 */
export async function setupBrowser(config: BrowserConfig = {}): Promise<Browser> {
  const {
    timeout = DEFAULT_TIMEOUT,
    headless = true,
  } = config;

  // Check if running in Vercel or local
  const isVercel = process.env.VERCEL === '1';

  let browser: Browser;

  if (isVercel) {
    // Vercel serverless - use chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Local development - use system Chrome/Chromium
    browser = await puppeteer.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  return browser;
}

/**
 * Navigate to BrickLink download page
 */
export async function navigateToDownloadPage(page: Page, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  await page.goto(BRICKLINK_DOWNLOAD_URL, {
    waitUntil: 'networkidle0',
    timeout,
  });
}

/**
 * Select catalog type from dropdown
 * Item types: M=Minifigures, S=Sets, P=Parts, B=Books, G=Gear, C=Catalogs, I=Instructions, O=Original Boxes
 */
export async function selectCatalogType(page: Page, itemType: string): Promise<void> {
  const selector = 'select[name="itemType"]';

  // Wait for dropdown to be available
  await page.waitForSelector(selector, { timeout: 10000 });

  // Select the catalog type
  await page.select(selector, itemType);

  // Wait a moment for page to update
  await page.waitForTimeout(500);
}

/**
 * Enable all checkboxes (Year, Weight, Dimensions)
 */
export async function enableAllCheckboxes(page: Page, options: CatalogDownloadOptions): Promise<void> {
  const {
    includeYear = true,
    includeWeight = true,
    includeDimensions = true,
  } = options;

  // Include Year checkbox
  if (includeYear) {
    const yearCheckbox = await page.$('input[name="inclYear"]');
    if (yearCheckbox) {
      const isChecked = await page.evaluate(el => (el as HTMLInputElement).checked, yearCheckbox);
      if (!isChecked) {
        await yearCheckbox.click();
      }
    }
  }

  // Include Weight checkbox
  if (includeWeight) {
    const weightCheckbox = await page.$('input[name="inclWeight"]');
    if (weightCheckbox) {
      const isChecked = await page.evaluate(el => (el as HTMLInputElement).checked, weightCheckbox);
      if (!isChecked) {
        await weightCheckbox.click();
      }
    }
  }

  // Include Dimensions checkbox
  if (includeDimensions) {
    const dimCheckbox = await page.$('input[name="inclDim"]');
    if (dimCheckbox) {
      const isChecked = await page.evaluate(el => (el as HTMLInputElement).checked, dimCheckbox);
      if (!isChecked) {
        await dimCheckbox.click();
      }
    }
  }

  // Wait a moment for checkboxes to update
  await page.waitForTimeout(300);
}

/**
 * Click download button and capture file content
 * Returns the downloaded file content as string
 */
export async function clickDownloadAndCapture(page: Page, timeout: number = DEFAULT_TIMEOUT): Promise<string> {
  // Set up download behavior - capture the response
  let fileContent = '';

  // Listen for the download response
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'];

    // Check if this is the catalog file download
    if (contentType && contentType.includes('text/plain')) {
      try {
        fileContent = await response.text();
      } catch (error) {
        console.error('Error capturing file content:', error);
      }
    }
  });

  // Find and click the download button
  const downloadButton = await page.$('input[type="submit"][value="Download"]');

  if (!downloadButton) {
    throw new Error('Download button not found on page');
  }

  await downloadButton.click();

  // Wait for the download to complete (check for file content)
  const startTime = Date.now();
  while (!fileContent && Date.now() - startTime < timeout) {
    await page.waitForTimeout(500);
  }

  if (!fileContent) {
    throw new Error('Failed to capture catalog file content within timeout');
  }

  return fileContent;
}

/**
 * Close browser instance
 */
export async function closeBrowser(browser: Browser): Promise<void> {
  await browser.close();
}

/**
 * Full flow: Download a catalog file with browser automation
 * Returns the file content as string
 */
export async function downloadCatalogWithBrowser(options: CatalogDownloadOptions, config: BrowserConfig = {}): Promise<string> {
  const timeout = config.timeout || parseInt(process.env.BRICKLINK_DOWNLOAD_TIMEOUT || '60000', 10);

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Setup browser
    browser = await setupBrowser({ ...config, timeout });
    page = await browser.newPage();

    // Navigate to download page
    await navigateToDownloadPage(page, timeout);

    // Select catalog type
    await selectCatalogType(page, options.itemType);

    // Enable checkboxes
    await enableAllCheckboxes(page, options);

    // Click download and capture content
    const fileContent = await clickDownloadAndCapture(page, timeout);

    return fileContent;
  } finally {
    // Cleanup
    if (page) {
      await page.close();
    }
    if (browser) {
      await closeBrowser(browser);
    }
  }
}
