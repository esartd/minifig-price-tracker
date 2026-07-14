'use client';

import { ReactNode } from 'react';
import { useTranslation } from '@/components/TranslationProvider';

interface ComparisonItem {
  title: string;
  pros: string[];
  cons: string[];
  icon?: ReactNode;
}

interface ArticleComparisonProps {
  items: ComparisonItem[];
}

export default function ArticleComparison({ items }: ArticleComparisonProps) {
  const { t } = useTranslation();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: items.length === 2 ? '1fr 1fr' : '1fr',
      gap: '24px',
      margin: '48px 0',
    }}>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          {item.icon && (
            <div style={{ marginBottom: '16px', fontSize: '32px' }}>
              {item.icon}
            </div>
          )}
          <h3 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#171717',
            marginBottom: '24px',
          }}>
            {item.title}
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#166534',
              marginBottom: '12px',
            }}>
              {t('articles.pros') || '✓ Pros'}
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {item.pros.map((pro, i) => (
                <li key={i} style={{
                  fontSize: '15px',
                  color: '#3c4043',
                  marginBottom: '8px',
                  lineHeight: '1.5',
                }}>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#b91c1c',
              marginBottom: '12px',
            }}>
              {t('articles.cons') || '✗ Cons'}
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {item.cons.map((con, i) => (
                <li key={i} style={{
                  fontSize: '15px',
                  color: '#3c4043',
                  marginBottom: '8px',
                  lineHeight: '1.5',
                }}>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
