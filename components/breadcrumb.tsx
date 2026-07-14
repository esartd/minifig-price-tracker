'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('breadcrumb.ariaLabel') || 'Breadcrumb'} style={{
      padding: '12px 0',
      fontSize: '14px',
      color: '#6b7280',
    }}>
      <ol style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {item.href && !isLast ? (
                <>
                  <Link
                    href={item.href}
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#2563eb';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#3b82f6';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {item.name}
                  </Link>
                  <span style={{ color: '#d1d5db' }}>›</span>
                </>
              ) : (
                <span style={{
                  color: isLast ? '#111827' : '#6b7280',
                  fontWeight: isLast ? 500 : 400,
                }}>
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
