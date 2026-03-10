import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const itemNo = 'sw1219';
    const condition: 'N' | 'U' = 'U';
    const url = `https://www.bricklink.com/catalogPG.asp?M=${itemNo}&ColorID=0&v=D&cID=N`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.bricklink.com/',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    let lastSixMonthsAvg = 0;
    let currentItemsAvg = 0;
    let currentItemsMin = 0;

    const debugInfo: any = {
      url,
      condition,
      matches: [],
      finalValues: {},
    };

    // Find all rows with 4 columns
    $('table.fv > tbody > tr').each((rowIdx, row) => {
      const $row = $(row);
      const topCells = $row.find('> td');

      if (topCells.length === 4) {
        const lastSixMonthsCol = condition === 'N' ? 0 : 1;
        const currentItemsCol = condition === 'N' ? 2 : 3;

        const last6MonthsText = $(topCells[lastSixMonthsCol]).text();
        const currentText = $(topCells[currentItemsCol]).text();

        // Extract data from Last 6 Months column
        const avgMatch = last6MonthsText.match(/Avg Price:[^$]*\$\s*([\d,]+\.?\d*)/i);
        if (avgMatch && !lastSixMonthsAvg) {
          lastSixMonthsAvg = parseFloat(avgMatch[1].replace(/,/g, ''));
          debugInfo.matches.push({
            rowIndex: rowIdx,
            type: 'lastSixMonthsAvg',
            matched: avgMatch[0],
            value: lastSixMonthsAvg,
            fullText: last6MonthsText.substring(0, 300),
          });
        }

        // Extract data from Current Items column
        const currentAvgMatch = currentText.match(/Avg Price:[^$]*\$\s*([\d,]+\.?\d*)/i);
        const currentMinMatch = currentText.match(/Min Price:[^$]*\$\s*([\d,]+\.?\d*)/i);

        if (currentAvgMatch && !currentItemsAvg) {
          currentItemsAvg = parseFloat(currentAvgMatch[1].replace(/,/g, ''));
          debugInfo.matches.push({
            rowIndex: rowIdx,
            type: 'currentItemsAvg',
            matched: currentAvgMatch[0],
            value: currentItemsAvg,
          });
        }
        if (currentMinMatch && !currentItemsMin) {
          currentItemsMin = parseFloat(currentMinMatch[1].replace(/,/g, ''));
          debugInfo.matches.push({
            rowIndex: rowIdx,
            type: 'currentItemsMin',
            matched: currentMinMatch[0],
            value: currentItemsMin,
          });
        }
      }
    });

    debugInfo.finalValues = {
      lastSixMonthsAvg,
      currentItemsAvg,
      currentItemsMin,
    };

    return NextResponse.json(debugInfo);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
