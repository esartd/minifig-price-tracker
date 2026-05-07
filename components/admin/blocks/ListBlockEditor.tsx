'use client';

import { ListBlock } from '@/types/article';

interface ListBlockEditorProps {
  block: ListBlock;
  onChange: (updates: Partial<ListBlock>) => void;
}

export function ListBlockEditor({ block, onChange }: ListBlockEditorProps) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  const addItem = () => {
    onChange({ items: [...block.items, ''] });
  };

  const removeItem = (index: number) => {
    if (block.items.length === 1) return;
    onChange({ items: block.items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => onChange({ ordered: false })}
          style={{
            padding: '6px 12px',
            background: !block.ordered ? '#3b82f6' : '#f3f4f6',
            color: !block.ordered ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          • Bulleted
        </button>
        <button
          onClick={() => onChange({ ordered: true })}
          style={{
            padding: '6px 12px',
            background: block.ordered ? '#3b82f6' : '#f3f4f6',
            color: block.ordered ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          1. Numbered
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {block.items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#737373', minWidth: '24px' }}>
              {block.ordered ? `${index + 1}.` : '•'}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="List item..."
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '15px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
            {block.items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                style={{
                  padding: '6px 10px',
                  background: '#fee2e2',
                  color: '#b91c1c',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        style={{
          marginTop: '8px',
          padding: '6px 12px',
          background: '#f3f4f6',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500',
          color: '#374151',
          cursor: 'pointer',
        }}
      >
        + Add Item
      </button>
    </div>
  );
}
