import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { isPremiumUser } from '@/lib/premium';

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session (subscription mode) for the logged-in
 * user and returns the redirect URL. Body: { plan: 'monthly' | 'yearly' }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (await isPremiumUser(session.user.id)) {
    return NextResponse.json({ success: false, error: 'Already premium' }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = body?.plan === 'yearly' ? 'yearly' : 'monthly';
  const priceId = plan === 'yearly'
    ? process.env.STRIPE_YEARLY_PRICE_ID
    : process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!priceId) {
    console.error(`[Stripe Checkout] Missing price ID for plan "${plan}"`);
    return NextResponse.json({ success: false, error: 'Pricing not configured' }, { status: 500 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, stripeCustomerId: true },
    });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { metadata: { userId: user.id } },
      allow_promotion_codes: true,
      success_url: `${baseUrl}/account?upgrade=success`,
      cancel_url: `${baseUrl}/account?upgrade=cancelled`,
    });

    return NextResponse.json({ success: true, url: checkoutSession.url });
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to start checkout' }, { status: 500 });
  }
}
