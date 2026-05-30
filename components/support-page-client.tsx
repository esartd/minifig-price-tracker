'use client';

import { useTranslation } from './TranslationProvider';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function SupportPageClient() {
  const { t } = useTranslation();

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
          {t('supportPage.title')}
        </h1>
        <p style={{
          fontSize: 'clamp(18px, 3vw, 22px)',
          color: 'rgba(255, 255, 255, 0.95)',
          lineHeight: '1.6',
          marginBottom: '0'
        }}>
          {t('supportPage.subtitle')}
        </p>
      </div>

      {/* Content Card */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto 80px',
        padding: '0 24px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          {/* Intro */}
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#525252',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            {t('supportPage.intro')}
          </p>

          {/* Primary CTA - Shop Links */}
          <div style={{
            background: 'linear-gradient(135deg, #1488cc15 0%, #2b32b215 100%)',
            border: '2px solid #1488cc',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <HeartIcon style={{ width: '28px', height: '28px', color: '#1488cc' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#171717',
                margin: 0
              }}>
                {t('supportPage.shopLinksTitle')}
              </h3>
            </div>
            <p style={{
              fontSize: '17px',
              lineHeight: '1.7',
              color: '#525252',
              marginBottom: '12px'
            }}>
              {t('supportPage.shopLinksDescription')}
            </p>
            <p style={{
              fontSize: '17px',
              lineHeight: '1.7',
              color: '#171717',
              marginBottom: '0',
              fontWeight: '600'
            }}>
              {t('supportPage.shopLinksNote')}
            </p>
          </div>

          {/* Secondary CTA - Donation */}
          <div style={{
            textAlign: 'center',
            paddingTop: '16px',
            paddingBottom: '16px'
          }}>
            <p style={{
              fontSize: '15px',
              color: '#737373',
              marginBottom: '8px'
            }}>
              {t('supportPage.donateLabel')}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#737373',
              marginBottom: '16px',
              fontStyle: 'italic'
            }}>
              {t('supportPage.donateLeaderboard')}
            </p>
            <a
              href="https://www.paypal.com/donate/?business=W2LZ3TNF2X88C&no_recurring=0&currency_code=USD&return=https://figtracker.ericksu.com/claim-donation"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
              }}
            >
              {t('supportPage.donateButton')}
            </a>
          </div>
        </div>

        {/* Thank You */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          paddingBottom: '80px'
        }}>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '0'
          }}>
            {t('supportPage.thankYou')}
          </p>
        </div>
      </div>
    </div>
  );
}
