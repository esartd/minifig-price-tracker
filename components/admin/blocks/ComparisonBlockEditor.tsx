'use client';

import { ComparisonBlock } from '@/types/article';

interface ComparisonBlockEditorProps {
  block: ComparisonBlock;
  onChange: (updates: Partial<ComparisonBlock>) => void;
}

export function ComparisonBlockEditor({ block, onChange }: ComparisonBlockEditorProps) {
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...block.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ items: newItems });
  };

  const addItem = () => {
    onChange({
      items: [...block.items, { title: '', pros: [''], cons: [''] }]
    });
  };

  const removeItem = (index: number) => {
    onChange({ items: block.items.filter((_, i) => i !== index) });
  };

  const addPro = (itemIndex: number) => {
    const newItems = [...block.items];
    newItems[itemIndex].pros.push('');
    onChange({ items: newItems });
  };

  const addCon = (itemIndex: number) => {
    const newItems = [...block.items];
    newItems[itemIndex].cons.push('');
    onChange({ items: newItems });
  };

  const updatePro = (itemIndex: number, proIndex: number, value: string) => {
    const newItems = [...block.items];
    newItems[itemIndex].pros[proIndex] = value;
    onChange({ items: newItems });
  };

  const updateCon = (itemIndex: number, conIndex: number, value: string) => {
    const newItems = [...block.items];
    newItems[itemIndex].cons[conIndex] = value;
    onChange({ items: newItems });
  };

  const removePro = (itemIndex: number, proIndex: number) => {
    const newItems = [...block.items];
    newItems[itemIndex].pros = newItems[itemIndex].pros.filter((_, i) => i !== proIndex);
    onChange({ items: newItems });
  };

  const removeCon = (itemIndex: number, conIndex: number) => {
    const newItems = [...block.items];
    newItems[itemIndex].cons = newItems[itemIndex].cons.filter((_, i) => i !== conIndex);
    onChange({ items: newItems });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {block.items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          style={{
            padding: '16px',
            background: '#fafafa',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(itemIndex, 'title', e.target.value)}
              placeholder="Option title..."
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: '600',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                outline: 'none',
                background: '#ffffff',
              }}
            />
            <button
              onClick={() => removeItem(itemIndex)}
              style={{
                marginLeft: '8px',
                padding: '8px 12px',
                background: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Pros */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
                ✓ Pros
              </div>
              {item.pros.map((pro, proIndex) => (
                <div key={proIndex} style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => updatePro(itemIndex, proIndex, e.target.value)}
                    placeholder="Add a pro..."
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      outline: 'none',
                      background: '#ffffff',
                    }}
                  />
                  {item.pros.length > 1 && (
                    <button
                      onClick={() => removePro(itemIndex, proIndex)}
                      style={{
                        padding: '4px 8px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addPro(itemIndex)}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: '#ffffff',
                  border: '1px dashed #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#737373',
                  cursor: 'pointer',
                }}
              >
                + Add Pro
              </button>
            </div>

            {/* Cons */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444', marginBottom: '8px' }}>
                ✗ Cons
              </div>
              {item.cons.map((con, conIndex) => (
                <div key={conIndex} style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => updateCon(itemIndex, conIndex, e.target.value)}
                    placeholder="Add a con..."
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      outline: 'none',
                      background: '#ffffff',
                    }}
                  />
                  {item.cons.length > 1 && (
                    <button
                      onClick={() => removeCon(itemIndex, conIndex)}
                      style={{
                        padding: '4px 8px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addCon(itemIndex)}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: '#ffffff',
                  border: '1px dashed #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#737373',
                  cursor: 'pointer',
                }}
              >
                + Add Con
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addItem}
        style={{
          padding: '10px 16px',
          background: '#f3f4f6',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          cursor: 'pointer',
        }}
      >
        + Add Comparison Item
      </button>
    </div>
  );
}
