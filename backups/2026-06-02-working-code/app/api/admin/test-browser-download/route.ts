import { NextRequest, NextResponse } from 'next/server';
import { getCatalogType } from '@/lib/bricklink-download-manager';
import { setupBrowser, navigateToDownloadPage, selectCatalogType, enableAllCheckboxes } from '@/lib/bricklink-automation';

/**
 * Test endpoint for debugging browser automation
 * GET /api/admin/test-browser-download?type=minifigures
 *
 * Features:
 * - Test browser automation without saving
 * - Return page screenshots for debugging
 * - Show form HTML for troubleshooting
 * - Verify dropdown interaction works
 *
 * Requires ADMIN_SECRET for authorization
 */

export async function GET(request: NextRequest) {
  try {
    // Authorization check
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!adminSecret || !authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'minifigures';

    // Get catalog type
    const catalogType = getCatalogType(type);
    if (!catalogType) {
      return NextResponse.json(
        { error: `Unknown catalog type: ${type}` },
        { status: 400 }
      );
    }

    console.log(`Testing browser automation for ${catalogType.displayName}...`);

    let browser = null;
    let page = null;

    try {
      // Setup browser
      browser = await setupBrowser({ timeout: 30000 });
      page = await browser.newPage();

      console.log('Browser launched successfully');

      // Navigate to download page
      await navigateToDownloadPage(page, 30000);
      console.log('Navigated to BrickLink download page');

      // Get initial page HTML (before selection)
      const initialHTML = await page.content();

      // Check if dropdown exists
      const dropdownExists = await page.$('select[name="itemType"]');
      console.log(`Dropdown exists: ${dropdownExists ? 'Yes' : 'No'}`);

      // Get dropdown options
      const dropdownOptions = await page.evaluate(() => {
        const select = document.querySelector('select[name="itemType"]') as HTMLSelectElement;
        if (!select) return null;

        return Array.from(select.options).map(option => ({
          value: option.value,
          text: option.text,
        }));
      });

      // Select catalog type
      await selectCatalogType(page, catalogType.code);
      console.log(`Selected catalog type: ${catalogType.code}`);

      // Check checkboxes
      const checkboxes = await page.evaluate(() => {
        const year = document.querySelector('input[name="inclYear"]') as HTMLInputElement;
        const weight = document.querySelector('input[name="inclWeight"]') as HTMLInputElement;
        const dim = document.querySelector('input[name="inclDim"]') as HTMLInputElement;

        return {
          yearExists: !!year,
          weightExists: !!weight,
          dimExists: !!dim,
          yearChecked: year?.checked,
          weightChecked: weight?.checked,
          dimChecked: dim?.checked,
        };
      });

      // Enable checkboxes
      await enableAllCheckboxes(page, {
        itemType: catalogType.code,
        includeYear: true,
        includeWeight: true,
        includeDimensions: true,
      });

      console.log('Enabled all checkboxes');

      // Get updated checkbox state
      const checkboxesAfter = await page.evaluate(() => {
        const year = document.querySelector('input[name="inclYear"]') as HTMLInputElement;
        const weight = document.querySelector('input[name="inclWeight"]') as HTMLInputElement;
        const dim = document.querySelector('input[name="inclDim"]') as HTMLInputElement;

        return {
          yearChecked: year?.checked,
          weightChecked: weight?.checked,
          dimChecked: dim?.checked,
        };
      });

      // Check for download button
      const downloadButton = await page.$('input[type="submit"][value="Download"]');
      const downloadButtonExists = !!downloadButton;

      // Get form HTML (for debugging)
      const formHTML = await page.evaluate(() => {
        const form = document.querySelector('form');
        return form ? form.innerHTML : 'Form not found';
      });

      // Take a screenshot (return as base64)
      const screenshot = await page.screenshot({ encoding: 'base64' });

      return NextResponse.json({
        success: true,
        catalog: catalogType.displayName,
        catalogCode: catalogType.code,
        browser: {
          launched: true,
          navigated: true,
        },
        dropdown: {
          exists: !!dropdownExists,
          options: dropdownOptions,
          selected: catalogType.code,
        },
        checkboxes: {
          before: checkboxes,
          after: checkboxesAfter,
        },
        downloadButton: {
          exists: downloadButtonExists,
        },
        formHTML: formHTML.substring(0, 1000), // First 1000 chars
        screenshot: `data:image/png;base64,${screenshot}`,
      });

    } finally {
      // Cleanup
      if (page) await page.close();
      if (browser) await browser.close();
    }

  } catch (error) {
    console.error('Test browser download error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Export runtime config for Vercel
export const maxDuration = 60;
export const dynamic = 'force-dynamic';
