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

  // Only used to decide whether the "Show more" button is worth rendering --
  // never to decide what goes in the DOM. See the note on the text node below.
  const sentences = description.split('. ').filter(s => s.length > 0);

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
        {/*
          Always the full description, never a truncated preview.

          The collapsed state is produced entirely by WebkitLineClamp above, so
          the complete text stays in the server-rendered HTML and only the
          visible height changes. Swapping in a 2-sentence `preview` string here
          -- which is what this did -- meant crawlers only ever received the
          first two sentences of every minifig description, since they do not
          click "Show more". SetDescription has always done it this way; this
          matches it.
        */}
        {description}
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
