import { NextRequest, NextResponse } from 'next/server';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS, LOGGED_OUT_TTL_HOURS } from '@/lib/pricing-orchestrator';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const boxNo = searchParams.get('boxNo');
    const condition = searchParams.get('condition') || 'new';
    const countryCode = searchParams.get('countryCode') || 'US';
    const region = searchParams.get('region') || 'north_america';

    console.log(`[Set Pricing API] boxNo=${boxNo}, condition=${condition}, countryCode=${countryCode}, region=${region}`);

    if (!boxNo) {
      return NextResponse.json(
        { success: false, error: 'Missing boxNo parameter' },
        { status: 400 }
      );
    }

    const session = await auth();
    const cacheTtlHours = session?.user?.id ? LOGGED_IN_TTL_HOURS : LOGGED_OUT_TTL_HOURS;

    const pricing = await pricingOrchestrator.getSetPrice(
      boxNo,
      condition as 'new' | 'used',
      countryCode,
      region,
      session?.user?.id,
      false,
      undefined,
      cacheTtlHours,
    );

    console.log(`[Set Pricing API] Result for ${boxNo}: suggested=$${pricing?.suggestedPrice ?? 0}`);

    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    console.error('Error fetching set pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
