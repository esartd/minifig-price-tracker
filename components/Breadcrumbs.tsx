'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Schema.org BreadcrumbList for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://figtracker.ericksu.com${item.href}` })
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        style={{
          marginBottom: '24px',
          fontSize: '14px'
        }}
      >
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flexWrap: 'wrap',
          lineHeight: '1.5'
        }}>
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0'
              }}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: '#737373' }}>{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span style={{ color: '#a3a3a3', padding: '0 8px' }}>/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
