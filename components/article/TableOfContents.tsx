'use client';

import { useEffect, useState } from 'react';
import { TOCItem } from '@/lib/article-utils';

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav style={{
      position: 'sticky',
      top: '100px',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      padding: '24px',
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#171717',
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Table of Contents
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '8px' }}>
            <a
              href={`#${item.id}`}
              style={{
                display: 'block',
                fontSize: '14px',
                color: activeId === item.id ? '#3b82f6' : '#737373',
                textDecoration: 'none',
                paddingLeft: item.level === 3 ? '16px' : '0',
                fontWeight: activeId === item.id ? '600' : '400',
                transition: 'color 0.2s',
                lineHeight: '1.5',
              }}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
