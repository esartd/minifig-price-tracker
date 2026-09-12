'use client';

import { BoltIcon, CameraIcon, TagIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/components/TranslationProvider';
import type { PremiumPrice } from '@/lib/premium-price';

export default function PremiumPageClient({ price }: { price?: PremiumPrice }) {
  const { t } = useTranslation();

  return (
    <article className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '32px',
            marginBottom: '40px',
            lineHeight: '1',
            height: '44px',
            minHeight: '44px',
            maxHeight: '44px',
            boxSizing: 'border-box'
          }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              color: '#ffffff',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              lineHeight: '1',
              whiteSpace: 'nowrap'
            }}>{t('premium.page.badge') || 'Premium'}</span>
          </div>
          <h1>{t('premium.page.hero.title') || 'One subscription. Every upgrade.'}</h1>
          <p>{t('premium.page.hero.subtitle') || 'Catch the deals, list in one step, and identify any minifigure from a photo.'}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* Simple pricing card: price + the two things it includes + CTA */}
      <section className="about-section">
        <div className="about-page-container">
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              padding: '32px 28px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '40px', fontWeight: '800', color: '#171717', letterSpacing: '-0.02em' }}>
                {price?.display || t('premium.page.price') || '$4.99'}
                <span style={{ fontSize: 'var(--text-base)', fontWeight: '500', color: '#737373' }}>
                  {t('premium.page.priceSuffix') || '/month'}
                </span>
              </p>

              {/* The converted figure is an estimate, so say so -- but do not
                  claim which currency the card is charged in. Adaptive Pricing
                  is enabled on the Stripe account, which can present and charge
                  in the customer's own currency; the earlier wording asserted
                  US dollars and would have been wrong whenever it did. What is
                  always true is the price: $4.99, whatever currency that
                  settles as. Stripe pays out in USD either way, at 0% cost to
                  us -- the conversion fee is the customer's. */}
              {price?.isConverted && (
                <p style={{ margin: '0 0 8px', fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
                  {(t('premium.page.priceApproximate') || 'Approximate. Priced at {amount} — the exact amount is shown at checkout.').replace(
                    '{amount}',
                    price.billedDisplay
                  )}
                </p>
              )}
              <p style={{ margin: '0 0 28px', fontSize: 'var(--text-sm)', color: '#737373' }}>
                {t('premium.page.cancelAnytime') || 'Cancel anytime'}
              </p>

              {/* ORDER IS DELIBERATE, strongest reason to pay first.
                  1. Deal alerts  - the only one that pays for itself. One 64%-off
                     catch is ~$89 saved, about eighteen months of subscription.
                     Money beats convenience on a pricing page.
                  2. Instant listings - the daily workflow for anyone selling.
                  3. AI identifier - useful, but a narrower job.
                  4. Badge - status, not utility. It closes; it does not open.
                  Do not reorder by what was built most recently. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                {/* The deals are free and public on /deals, so this has to sell
                    the ALERT, not the discount -- otherwise it reads as charging
                    for what the site already gives away. */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <TagIcon style={{ width: '22px', height: '22px', color: '#171717', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717' }}>
                      {t('premium.page.features.dealAlerts.title') || 'Never miss a deal on a set you want'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: '#737373' }}>
                      {t('premium.page.features.dealAlerts.description') || 'Name your price on any set and we email you the day Walmart drops below it. One good catch pays for a year of this.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <BoltIcon style={{ width: '22px', height: '22px', color: '#171717', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717' }}>
                      {t('premium.page.features.skipStep.title') || 'Instant listings, no collection step'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: '#737373' }}>
                      {t('premium.page.features.skipStep.description') || 'Generate an eBay, BrickLink, Facebook, or Vinted listing for any minifig or set the moment you find it.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CameraIcon style={{ width: '22px', height: '22px', color: '#171717', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717' }}>
                      {t('premium.page.features.identify.title') || 'Unlimited AI minifigure identifier'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: '#737373' }}>
                      {t('premium.page.features.identify.description') || "Snap or drag in a photo — AI finds the BrickLink ID and current value. No scan limit."}
                    </p>
                  </div>
                </div>

                {/* "Subscriber", never "Verified". We do not check anyone's
                    identity, and collectors trade off the back of these
                    profiles -- see components/SubscriberBadge.tsx. */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckBadgeIcon style={{ width: '22px', height: '22px', color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717' }}>
                      {t('premium.page.features.badge.title') || 'A blue badge on your profile'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: '#737373' }}>
                      {t('premium.page.features.badge.description') || 'Shows next to your name on your profile, the collector directory and the leaderboards.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* display: flex, not block -- the class already centres its label with
                  inline-flex, and overriding the display is what broke it. */}
              <a href="/account#premium" className="cta-button" style={{ display: 'flex', width: '100%', marginTop: '28px' }}>
                {t('premium.page.cta.button') || 'Upgrade to Premium'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
