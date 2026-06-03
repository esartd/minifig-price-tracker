'use client';

import { HeadingBlock } from '@/types/article';

interface HeadingBlockEditorProps {
  block: HeadingBlock;
  onChange: (updates: Partial<HeadingBlock>) => void;
}

export function HeadingBlockEditor({ block, onChange }: HeadingBlockEditorProps) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {([1, 2, 3] as const).map(level => (
          <button
            key={level}
            onClick={() => onChange({ level })}
            style={{
              padding: '4px 12px',
              background: block.level === level ? '#3b82f6' : '#f3f4f6',
              color: block.level === level ? '#ffffff' : '#374151',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            H{level}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={block.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Enter heading..."
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: block.level === 1 ? '32px' : block.level === 2 ? '28px' : '22px',
          fontWeight: '700',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: '#171717',
        }}
      />
    </div>
  );
}
