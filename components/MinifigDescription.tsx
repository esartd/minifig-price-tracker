'use client';

import { useState } from 'react';

interface MinifigDescriptionProps {
  description: string;
  minifigName: string;
}

export default function MinifigDescription({
  description,
  minifigName
}: MinifigDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  // Split into sentences for 2-line preview
  const sentences = description.split('. ').filter(s => s.length > 0);
  const preview = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '.');

  return (
    <div style={{
      marginTop: '16px',
      marginBottom: '16px',
      padding: '14px 16px',
      background: '#f9fafb',
      borderRadius: '8px',
      borderLeft: '3px solid #3b82f6',
    }}>
      <div style={{
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#374151',
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
          aria-label={expanded ? 'Show less description' : 'Show more description'}
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#3b82f6',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.background = '#eff6ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = 'white';
          }}
        >
          {expanded ? '↑ Show Less' : '↓ Show More'}
        </button>
      )}
    </div>
  );
}
