'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

interface Guide {
  icon: any;
  title: string;
  description: string;
  slug: string | null;
  status: 'published' | 'coming-soon';
  topics: string[];
}

export default function GuidesPageClient({ guides }: { guides: Guide[] }) {
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
            }}>{t('guides.badge')}</span>
          </div>
          <h1>{t('guides.hero.title')}</h1>
          <p>{t('guides.hero.subtitle')}</p>
        </div>
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
      </header>

      {/* Guides Grid */}
      <section className="about-section bg-white">
        <div className="about-page-container">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex flex-col" style={{ gap: '64px' }}>
              {guides.map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <article
                    key={index}
                    className="border-b border-[#e5e5e5] last:border-b-0"
                    style={{ paddingBottom: '64px' }}
                  >
                    <h2 className="text-[length:var(--text-2xl)] font-bold text-[#171717] mb-3">
                      {guide.title}
                    </h2>
                    <p className="text-[length:var(--text-base)] text-[#525252] leading-[1.7]" style={{ marginBottom: '32px' }}>
                      {guide.description}
                    </p>

                    <div style={{ marginBottom: '32px' }}>
                      <h3 className="text-[length:var(--text-base)] font-semibold text-[#171717]" style={{ marginBottom: '16px' }}>
                        {t('guides.whatYoullLearn')}
                      </h3>
                      <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: '12px', paddingLeft: '24px' }}>
                        {guide.topics.map((topic, topicIndex) => (
                          <li
                            key={topicIndex}
                            className="text-[length:var(--text-base)] text-[#525252] relative"
                            style={{ paddingLeft: '16px' }}
                          >
                            <span className="absolute text-[#3b82f6]" style={{ left: '0' }}>•</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {guide.status === 'published' ? (
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="cta-button"
                      >
                        {t('guides.readGuide')}
                      </Link>
                    ) : (
                      <div className="inline-block px-4 py-2 bg-[#fafafa] border border-[#e5e5e5] rounded-lg text-[length:var(--text-sm)] text-[#737373] font-medium">
                        {t('guides.comingSoon')}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="about-section about-personas-section">
        <div className="about-page-container">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-[length:var(--text-2xl)] font-bold text-[#171717]" style={{ marginBottom: '48px' }}>
              {t('guides.quickTips.title')}
            </h2>

            <div className="flex flex-col" style={{ gap: '48px' }}>
              <div>
                <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717]" style={{ marginBottom: '8px' }}>
                  {t('guides.quickTips.tip1.title')}
                </h3>
                <p className="text-[length:var(--text-base)] text-[#525252] leading-[1.7]">
                  {t('guides.quickTips.tip1.description')}
                </p>
              </div>

              <div>
                <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717]" style={{ marginBottom: '8px' }}>
                  {t('guides.quickTips.tip2.title')}
                </h3>
                <p className="text-[length:var(--text-base)] text-[#525252] leading-[1.7]">
                  {t('guides.quickTips.tip2.description')}
                </p>
              </div>

              <div>
                <h3 className="text-[length:var(--text-lg)] font-semibold text-[#171717]" style={{ marginBottom: '8px' }}>
                  {t('guides.quickTips.tip3.title')}
                </h3>
                <p className="text-[length:var(--text-base)] text-[#525252] leading-[1.7]">
                  {t('guides.quickTips.tip3.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section about-cta-section">
        <div className="about-page-container">
          <div className="section-content-narrow">
            <h2>{t('guides.cta.title')}</h2>
            <p>{t('guides.cta.subtitle')}</p>
            <Link href="/search" className="cta-button">
              {t('guides.cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
