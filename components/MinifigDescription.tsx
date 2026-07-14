'use client';

import { useState } from 'react';
import { useTranslation } from '@/components/TranslationProvider';

interface MinifigDescriptionProps {
  description: string;
  minifigName: string;
}

export default function MinifigDescription({
  description,
  minifigName
}: MinifigDescriptionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  // Split into sentences for 2-line preview
  const sentences = description.split('. ').filter(s => s.length > 0);
  const preview = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '.');

  return (
    <div style={{
      marginTop: '16px',
      marginBottom: '16px',
    }}>
      <div style={{
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#525252',
        overflow: 'hidden',
        display: expanded ? 'block' : '-webkit-box',
        WebkitLineClamp: expanded ? 'unset' : 2,
        WebkitBoxOrient: 'vertical',
        marginBottom: expanded || sentences.length <= 2 ? '0' : '8px',
      }}>
        {expanded ? description : preview}
      </div>

      {sentences.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={
            expanded
              ? (t('common.showLessDescriptionAria') || 'Show less description')
              : (t('common.showMoreDescriptionAria') || 'Show more description')
          }
          style={{
            marginTop: '4px',
            padding: '0',
            fontSize: '13px',
            fontWeight: '500',
            color: '#737373',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {expanded
            ? (t('common.showLessDescription') || 'Show less')
            : (t('common.showMoreDescription') || 'Show more')}
        </button>
      )}
    </div>
  );
}
