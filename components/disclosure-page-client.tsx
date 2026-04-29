'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

export default function DisclosurePageClient({ lastUpdated }: { lastUpdated: string }) {
  const { t } = useTranslation();

  return (
    <article className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-2)'
      }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--space-2)'
        }}>
          {t('disclosure.title')}
        </h1>

        <div style={{
          fontSize: 'var(--text-sm)',
          color: '#525252',
          marginBottom: 'var(--space-4)'
        }}>
          {t('disclosure.lastUpdated')}: {lastUpdated}
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: 'var(--space-4)',
          lineHeight: '1.7',
          color: '#404040'
        }}>
          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {t('disclosure.affiliatePrograms.title')}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {t('disclosure.affiliatePrograms.paragraph1')}
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {t('disclosure.affiliatePrograms.paragraph2')}
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {t('disclosure.trademark.title')}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {t('disclosure.trademark.text')}
            </p>
          </section>

          <section>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {t('disclosure.questions.title')}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {t('disclosure.questions.text')}{' '}
              <Link href="/about" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                {t('disclosure.questions.aboutPage')}
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
