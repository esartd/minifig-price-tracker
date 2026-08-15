import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.error('[Stripe] STRIPE_SECRET_KEY is not set -- premium billing routes will fail.');
}

// No apiVersion pinned -- let the installed SDK version use its own bundled
// default so it always matches what that SDK build actually supports.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
