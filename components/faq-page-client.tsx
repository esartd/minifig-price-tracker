'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';
import FAQList from '@/components/faq-list';

export default function FAQPageClient({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const { t } = useTranslation();

  return (
    <article className="min-h-screen bg-[#fafafa]">
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
            }}>{t('faq.badge')}</span>
          </div>
          <h1>{t('faq.title')}</h1>
          <p>{t('faq.subtitle')}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* FAQ Content */}
      <section className="about-section bg-white">
        <div className="about-page-container">
          <div className="max-w-[800px] mx-auto">
            <FAQList faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="about-section about-personas-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('faq.stillHaveQuestions')}</h2>
            <p style={{ marginBottom: '32px' }}>{t('faq.cantFindAnswer')}</p>

            <div style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '8px'
              }}>
                {t('faq.contactSupport')}
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: '#737373',
                marginBottom: '20px'
              }}>
                {t('faq.emailUs')}
              </p>
              <a
                href="mailto:hello@ericksu.com"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                hello@ericksu.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section about-cta-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('faq.cta.title')}</h2>
            <p>{t('faq.cta.subtitle')}</p>
            <Link href="/search" className="cta-button">
              {t('faq.cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
