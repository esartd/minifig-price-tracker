'use client';

import { CalloutBlock } from '@/types/article';

interface CalloutBlockEditorProps {
  block: CalloutBlock;
  onChange: (updates: Partial<CalloutBlock>) => void;
}

export function CalloutBlockEditor({ block, onChange }: CalloutBlockEditorProps) {
  const types: Array<{ value: CalloutBlock['calloutType']; label: string; color: string }> = [
    { value: 'info', label: 'Info', color: '#3b82f6' },
    { value: 'tip', label: 'Tip', color: '#10b981' },
    { value: 'warning', label: 'Warning', color: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {types.map(type => (
          <button
            key={type.value}
            onClick={() => onChange({ calloutType: type.value })}
            style={{
              padding: '6px 12px',
              background: block.calloutType === type.value ? type.color : '#f3f4f6',
              color: block.calloutType === type.value ? '#ffffff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Enter callout content..."
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '12px',
          fontSize: '15px',
          lineHeight: '1.6',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
