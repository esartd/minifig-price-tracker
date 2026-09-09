'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/components/TranslationProvider';
import { originFor } from '@/lib/site-domain';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /**
   * Set false on pages whose own server component already emits a
   * BreadcrumbList. Two lists on one page are a conflict, not a bonus: Google
   * picked whichever it read first, and the set and minifig detail pages were
   * shipping a correct server-side trail alongside the one below.
   */
  jsonLd?: boolean;
}

export default function Breadcrumbs({ items, jsonLd: emitJsonLd = true }: BreadcrumbsProps) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [visibleItems, setVisibleItems] = useState(items);
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Schema.org BreadcrumbList for SEO.
  //
  // Two things were wrong here and Search Console reported both.
  //
  // The origin was the hard-coded old hostname, so every locale subdomain
  // advertised a breadcrumb trail on a domain that now only answers with 301s
  // -- and one that does not match the page it was emitted on. It comes from
  // originFor(locale) now, like everything else; see lib/site-domain.ts.
  //
  // The final crumb carried no `item` at all, because the current page is
  // passed without an href (nothing to link to). Google reads `item` as the
  // node identity, and a ListItem without one is "Missing field item". The
  // last crumb is this page, so it points at this page.
  const origin = originFor(locale);
  const absolute = (href: string) => new URL(href, origin).toString();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const href = item.href ?? (index === items.length - 1 ? pathname : undefined);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(href && { item: absolute(href) }),
      };
    })
  };

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const gapWidth = 8; // 8px gap between items
      const ellipsisWidth = 30; // Approximate width of "..."
      const separatorWidth = 20; // Approximate width of "/"

      // Always show last item (current page)
      let totalWidth = 0;
      let visibleCount = 0;

      // Measure from the end (most important items)
      for (let i = items.length - 1; i >= 0; i--) {
        const estimatedWidth = items[i].label.length * 8 + separatorWidth + gapWidth;

        if (totalWidth + estimatedWidth > containerWidth - ellipsisWidth) {
          break;
        }

        totalWidth += estimatedWidth;
        visibleCount++;
      }

      // Always show at least the last item
      if (visibleCount === 0) visibleCount = 1;

      // If we can't show all items, add ellipsis at the start
      if (visibleCount < items.length) {
        const truncatedItems = [
          { label: '...', href: undefined },
          ...items.slice(-visibleCount)
        ];
        setVisibleItems(truncatedItems);
      } else {
        setVisibleItems(items);
      }
    };

    calculateVisibleItems();

    window.addEventListener('resize', calculateVisibleItems);
    return () => window.removeEventListener('resize', calculateVisibleItems);
  }, [items]);

  return (
    <>
      {emitJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <nav
        ref={containerRef}
        aria-label={t('breadcrumb.ariaLabel') || 'Breadcrumb'}
        style={{
          marginBottom: '24px',
          fontSize: 'var(--text-sm)',
          overflow: 'hidden'
        }}
      >
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          lineHeight: '1.5'
        }}>
          {visibleItems.map((item, index) => (
            <li
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
              }}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center'
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
                <span style={{
                  color: '#737373',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>{item.label}</span>
              )}
              {index < visibleItems.length - 1 && (
                <span style={{
                  color: '#a3a3a3',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
