import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call the price history recording endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
    const response = await fetch(`${baseUrl}/api/price-history/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Price history cron job executed',
      result: data,
    });
  } catch (error) {
    console.error('Price history cron error:', error);
    return NextResponse.json(
      { success: false, error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
