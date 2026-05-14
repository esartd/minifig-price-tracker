'use client';

import { useState } from 'react';

interface SetDescriptionProps {
  description: string;
  setName: string;
}

export default function SetDescription({
  description,
  setName
}: SetDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  // Show "Show more" button if description is long enough to be truncated
  // Approximate: 2 lines at 14px font with line-height 1.7 ≈ 150 characters on mobile
  const isLongDescription = description.length > 150;

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
        marginBottom: expanded || !isLongDescription ? '0' : '8px',
      }}>
        {description}
      </div>

      {isLongDescription && (
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Show less description' : 'Show more description'}
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
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
