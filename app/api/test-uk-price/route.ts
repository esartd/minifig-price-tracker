import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { auth } from '@/auth';

// GET - Test UK pricing for a specific item
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const itemNo = searchParams.get('item') || 'sw1321';
    const condition = (searchParams.get('condition') || 'used') as 'new' | 'used';

    console.log(`\n========== TEST UK PRICING ==========`);
    console.log(`Testing: ${itemNo} (${condition})`);
    console.log(`User currency: ${session.user.preferredCurrency}`);
    console.log(`User country: ${session.user.preferredCountryCode}`);
    console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}`);
    console.log(`VERCEL_ENV=${process.env.VERCEL_ENV}`);
    console.log(`NEXTAUTH_URL=${process.env.NEXTAUTH_URL}`);

    const pricing = await bricklinkAPI.calculatePricingData(
      itemNo,
      condition,
      'GB',
      'europe'
    );

    console.log(`Pricing result:`, pricing);
    console.log(`====================================\n`);

    return NextResponse.json({
      success: true,
      itemNo,
      condition,
      countryCode: 'GB',
      pricing,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL
      }
    });
  } catch (error) {
    console.error('Test pricing error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
