'use client';

import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

interface SupportPageClientProps {
  totalPricingViews: number | null;
}

export default function SupportPageClient({ totalPricingViews }: SupportPageClientProps) {
  const { translations } = useTranslation();
  const sp = translations.supportPage || {};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1488cc 0%, #2b32b2 100%)',
      paddingTop: '80px'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '24px',
          lineHeight: '1.2'
        }}>
          {sp.heroTitle || 'Help Keep This Free'}
        </h1>
        {totalPricingViews !== null && totalPricingViews > 0 ? (
          <p style={{
            fontSize: 'clamp(18px, 3vw, 22px)',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: '1.6',
            marginBottom: '0'
          }}
            dangerouslySetInnerHTML={{
              __html: (sp.pricingViews || "You've checked {count} prices — every check saved you time")
                .replace('{count}', `<strong>${totalPricingViews.toLocaleString()}</strong>`)
            }}
          />
        ) : (
          <p style={{
            fontSize: 'clamp(18px, 3vw, 22px)',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: '1.6',
            marginBottom: '0'
          }}>
            {sp.builtBy || 'Built by one LEGO seller in Utah. Every affiliate click and donation keeps the lights on.'}
          </p>
        )}
      </div>

      {/* Content Card */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 80px',
        padding: '0 24px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          {/* Side-by-side CTAs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Shop Through Links */}
            <div style={{
              background: 'linear-gradient(135deg, #1488cc15 0%, #2b32b215 100%)',
              border: '2px solid #1488cc',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <ShoppingCartIcon style={{
                width: '48px',
                height: '48px',
                color: '#1488cc',
                marginBottom: '16px'
              }} />
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#171717',
                marginTop: '0',
                marginBottom: '16px'
              }}>
                {sp.shopLinksTitle2 || sp.shopLinksTitle || 'Shop Through Our Links'}
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#525252',
                marginBottom: '0'
              }}>
                {sp.shopLinksDesc2 || sp.shopLinksNote || 'We earn a small commission when you buy through our eBay, Amazon, or LEGO links. No extra cost to you.'}
              </p>
            </div>

            {/* Donate Directly */}
            <div style={{
              background: 'linear-gradient(135deg, #f9731615 0%, #dc262615 100%)',
              border: '2px solid #f97316',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <HeartIcon style={{
                width: '48px',
                height: '48px',
                color: '#f97316',
                marginBottom: '16px'
              }} />
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#171717',
                marginTop: '0',
                marginBottom: '16px'
              }}>
                {sp.donateDirect || 'Donate Directly'}
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#525252',
                marginBottom: '16px'
              }}>
                {sp.donateDesc || 'Every dollar covers server costs and keeps this tool running.'}
              </p>
              <form action="https://www.paypal.com/donate" method="post" target="_blank">
                <input type="hidden" name="business" value="W2LZ3TNF2X88C" />
                <input type="hidden" name="no_recurring" value="0" />
                <input type="hidden" name="currency_code" value="USD" />
                <input type="hidden" name="return" value="https://figtracker.ericksu.com/claim-donation" />
                <button
                  type="submit"
                  style={{
                    background: '#0070ba',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0, 112, 186, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#005ea6'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#0070ba'}
                >
                  {sp.donateButton || 'Donate via PayPal'}
                </button>
              </form>
            </div>
          </div>

          {/* Footer note */}
          <p style={{
            fontSize: '14px',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '0',
            lineHeight: '1.6'
          }}>
            {sp.donateNote || 'Top donors are recognized on the homepage leaderboard (optional).'}
          </p>
        </div>
      </div>
    </div>
  );
}
