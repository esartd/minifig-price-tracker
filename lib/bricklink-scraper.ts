import puppeteer from 'puppeteer';

interface ScrapedPriceData {
  lastSixMonthsAvg: number;
  currentItemsAvg: number;
  currentItemsMin: number;
}

export class BricklinkScraper {
  private browser: any = null;

  async scrapePriceGuide(itemNo: string, condition: 'N' | 'U'): Promise<ScrapedPriceData | null> {
    try {
      // Launch browser if not already running
      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        });
      }

      const page = await this.browser.newPage();

      // Stealth: Remove webdriver property
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
      });

      // Set realistic viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

      // Set extra headers to look more like a real browser
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      });

      // Navigate to price guide page with "Group by Currency" view
      // v=D enables currency grouping, cID=N shows detailed currency view
      const url = `https://www.bricklink.com/catalogPG.asp?M=${itemNo}&ColorID=0&v=D&cID=N`;
      console.log(`Scraping ${url} for condition ${condition}...`);

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      // Wait a bit for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if we got blocked
      const bodyText = await page.evaluate(() => document.body.textContent);
      if (bodyText?.includes('Oops') || bodyText?.includes('Sorry')) {
        console.error('Bricklink blocked the request');
        await page.close();
        return null;
      }

      // Try to wait for the price guide table
      try {
        await page.waitForSelector('table.fv', { timeout: 10000 });
      } catch (e) {
        console.error(`Could not find price guide table for ${itemNo}`);
        // Save screenshot for debugging
        if (process.env.NODE_ENV === 'development') {
          await page.screenshot({ path: `/tmp/bricklink_${itemNo}_${condition}_failed.png` });
          console.log(`Saved debug screenshot to /tmp/bricklink_${itemNo}_${condition}_failed.png`);
        }
        await page.close();
        return null;
      }

      // Extract pricing data using page.evaluate
      const conditionLabel = condition === 'N' ? 'New' : 'Used';
      const lastSixMonthsCol = condition === 'N' ? 0 : 1;
      const currentItemsCol = condition === 'N' ? 2 : 3;

      const priceData = await page.evaluate((lastSixMonthsCol: number, currentItemsCol: number) => {
        let lastSixMonthsAvg = 0;
        let currentItemsAvg = 0;
        let currentItemsMin = 0;

        // Find the main price guide table
        const tables = document.querySelectorAll('table.fv');

        for (const table of tables) {
          const tableText = table.textContent || '';

          if (tableText.includes('Last 6 Months Sales') && tableText.includes('Current Items for Sale')) {
            // Find rows with 4 TD columns
            const rows = table.querySelectorAll('tr');

            for (const row of rows) {
              const cells = row.querySelectorAll(':scope > td');

              if (cells.length === 4) {
                // Extract Last 6 Months data
                const last6MonthsText = cells[lastSixMonthsCol].textContent || '';
                const avgMatch = last6MonthsText.match(/Avg Price:\s*US\s*\$\s*([\d,]+\.?\d*)/i);
                if (avgMatch && !lastSixMonthsAvg) {
                  lastSixMonthsAvg = parseFloat(avgMatch[1].replace(/,/g, ''));
                }

                // Extract Current Items data
                const currentText = cells[currentItemsCol].textContent || '';
                const minMatch = currentText.match(/Min Price:\s*US\s*\$\s*([\d,]+\.?\d*)/i);
                const currentAvgMatch = currentText.match(/Avg Price:\s*US\s*\$\s*([\d,]+\.?\d*)/i);

                if (minMatch && !currentItemsMin) {
                  currentItemsMin = parseFloat(minMatch[1].replace(/,/g, ''));
                }
                if (currentAvgMatch && !currentItemsAvg) {
                  currentItemsAvg = parseFloat(currentAvgMatch[1].replace(/,/g, ''));
                }
              }
            }
          }
        }

        return { lastSixMonthsAvg, currentItemsAvg, currentItemsMin };
      }, lastSixMonthsCol, currentItemsCol);

      await page.close();

      console.log(`Scraped ${itemNo} (${condition}):`, priceData);

      return priceData;
    } catch (error) {
      console.error('Error scraping price guide:', error);
      return null;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const bricklinkScraper = new BricklinkScraper();
