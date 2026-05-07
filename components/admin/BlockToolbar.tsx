'use client';

import { useState } from 'react';
import { ArticleBlockType } from '@/types/article';

interface BlockToolbarProps {
  onAddBlock: (type: ArticleBlockType) => void;
}

export function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const blockTypes: { type: ArticleBlockType; icon: string; label: string }[] = [
    { type: 'heading', icon: 'H', label: 'Heading' },
    { type: 'paragraph', icon: '¶', label: 'Paragraph' },
    { type: 'image', icon: '🖼', label: 'Image (1-3)' },
    { type: 'amazon-products', icon: '🛒', label: 'Amazon Products (1-3)' },
    { type: 'list', icon: '•', label: 'List' },
    { type: 'code', icon: '💻', label: 'Code' },
    { type: 'video', icon: '🎥', label: 'Video' },
    { type: 'callout', icon: '💡', label: 'Callout' },
    { type: 'comparison', icon: '⚖️', label: 'Comparison' },
    { type: 'divider', icon: '—', label: 'Divider' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: '#f3f4f6',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
      >
        <span style={{ fontSize: '16px' }}>+</span>
        Add Block
      </button>

      {showMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
            onClick={() => setShowMenu(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '8px',
              minWidth: '200px',
              zIndex: 20,
            }}
          >
            {blockTypes.map((blockType) => (
              <button
                key={blockType.type}
                onClick={() => {
                  onAddBlock(blockType.type);
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                  {blockType.icon}
                </span>
                <span style={{ fontWeight: '500' }}>{blockType.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
