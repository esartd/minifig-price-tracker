import { NextResponse } from 'next/server';
import { bricklinkScraper } from '@/lib/bricklink-scraper';

export async function GET() {
  try {
    const itemNo = 'sw1219';
    const condition = 'U';

    const scrapedData = await bricklinkScraper.scrapePriceGuide(itemNo, condition);

    return NextResponse.json({
      success: true,
      itemNo,
      condition,
      scrapedData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
