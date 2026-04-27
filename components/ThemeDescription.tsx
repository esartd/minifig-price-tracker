'use client';

import { useState } from 'react';

interface ThemeDescriptionProps {
  themeName: string;
  description?: string;
}

export default function ThemeDescription({ themeName, description }: ThemeDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  // Show first ~180 characters when collapsed
  const previewLength = 180;
  const shouldTruncate = description.length > previewLength;
  const displayText = isExpanded || !shouldTruncate
    ? description
    : description.substring(0, previewLength) + '...';

  return (
    <div style={{
      margin: '32px 0 48px 0',
      padding: '24px',
      background: '#f8f9fa',
      border: '1px solid #e5e7eb',
      borderRadius: '12px'
    }}>
      <p style={{
        fontSize: '15px',
        lineHeight: '1.7',
        color: '#374151',
        margin: 0
      }}>
        {displayText}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            marginTop: '12px',
            padding: '6px 16px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#3b82f6',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#3b82f6';
          }}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          <svg
            style={{
              width: '16px',
              height: '16px',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
