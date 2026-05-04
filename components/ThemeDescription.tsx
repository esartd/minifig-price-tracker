'use client';

import { useState } from 'react';
import { useTranslation } from './TranslationProvider';

interface ThemeDescriptionProps {
  themeName: string;
  description?: string;
}

export default function ThemeDescription({ themeName, description }: ThemeDescriptionProps) {
  const { t, translations } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Try to get translated description from translations
  const translatedDescription = translations.themeDescriptions?.[themeName] || description;

  if (!translatedDescription) return null;

  // Show first ~180 characters when collapsed
  const previewLength = 180;
  const shouldTruncate = translatedDescription.length > previewLength;
  const displayText = isExpanded || !shouldTruncate
    ? translatedDescription
    : translatedDescription.substring(0, previewLength) + '...';

  return (
    <div style={{
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e5e5e5'
    }}>
      <p style={{
        fontSize: '15px',
        lineHeight: '1.7',
        color: '#525252',
        margin: 0,
        maxWidth: '65ch'
      }}>
        {displayText}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            marginTop: '12px',
            padding: '0',
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
          {isExpanded ? t('themes.showLess') : t('themes.readMore')}
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
