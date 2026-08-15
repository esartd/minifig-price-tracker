import { prisma } from '@/lib/prisma';

// Subscription statuses (mirroring Stripe's Subscription.status verbatim)
// that grant access to premium features. 'trialing' counts as premium so a
// future free-trial can be added without touching every call site.
const ACCESS_GRANTING_STATUSES = new Set(['active', 'trialing']);

/**
 * The one function every premium-gated feature should call. Always reads
 * fresh from the DB rather than a cached session/JWT field -- see
 * subscription webhook handling in app/api/stripe/webhook/route.ts for why:
 * a webhook-driven cancellation has no way to invalidate a user's existing
 * JWT, so baking this into the session risks serving stale "premium" access.
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true },
  });
  return !!user?.subscriptionStatus && ACCESS_GRANTING_STATUSES.has(user.subscriptionStatus);
}

export interface SubscriptionDetails {
  isPremium: boolean;
  status: string | null;
  plan: string | null;
  renewsAt: string | null;
  cancelsAt: string | null;
  hasBillingAccount: boolean;
}

/** Richer subscription status for account-page UI. */
export async function getSubscriptionDetails(userId: string): Promise<SubscriptionDetails> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPlan: true,
      subscriptionEndsAt: true,
      subscriptionCancelAtPeriodEnd: true,
      stripeCustomerId: true,
    },
  });

  const isPremium = !!user?.subscriptionStatus && ACCESS_GRANTING_STATUSES.has(user.subscriptionStatus);
  const endsAt = user?.subscriptionEndsAt ? user.subscriptionEndsAt.toISOString() : null;

  return {
    isPremium,
    status: user?.subscriptionStatus ?? null,
    plan: user?.subscriptionPlan ?? null,
    renewsAt: user?.subscriptionCancelAtPeriodEnd ? null : endsAt,
    cancelsAt: user?.subscriptionCancelAtPeriodEnd ? endsAt : null,
    hasBillingAccount: !!user?.stripeCustomerId,
  };
}
