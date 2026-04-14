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

  // On mobile: show only last 3 items with "..." if truncated
  // On desktop: show all items
  const shouldTruncate = items.length > 3;
  const mobileItems = shouldTruncate
    ? [{ label: '...', href: undefined }, ...items.slice(-2)]
    : items;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Desktop: full breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="breadcrumb-desktop"
        style={{
          marginBottom: '24px',
          fontSize: '14px',
          display: 'none'
        }}
      >
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          lineHeight: '1.8'
        }}>
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
                <span style={{ color: '#a3a3a3' }}>/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile: last 3 items only */}
      <nav
        aria-label="Breadcrumb"
        className="breadcrumb-mobile"
        style={{
          marginBottom: '24px',
          fontSize: '14px',
          display: 'block'
        }}
      >
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          lineHeight: '1.8'
        }}>
          {mobileItems.map((item, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
              {index < mobileItems.length - 1 && (
                <span style={{ color: '#a3a3a3' }}>/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

    </>
  );
}
