import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSubscriptionDetails } from '@/lib/premium';

/**
 * GET /api/user/subscription
 * Returns the logged-in user's premium subscription status, used by the
 * account page's billing section and any component that needs to know
 * whether to show premium-only UI (e.g. the listing-generator bypass).
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await getSubscriptionDetails(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[User Subscription API] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch subscription status' }, { status: 500 });
  }
}
