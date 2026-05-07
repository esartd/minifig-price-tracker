'use client';

import { useState, useEffect } from 'react';
import { ComparisonBlock } from '@/types/article';
import * as HeroiconsSolid from '@heroicons/react/24/solid';
import * as HeroiconsOutline from '@heroicons/react/24/outline';

interface ComparisonBlockEditorProps {
  block: ComparisonBlock;
  onChange: (updates: Partial<ComparisonBlock>) => void;
}

// Get all available Heroicons
const getAllHeroicons = () => {
  const solidIcons = Object.keys(HeroiconsSolid).filter(name => name.endsWith('Icon'));
  const outlineIcons = Object.keys(HeroiconsOutline).filter(name => name.endsWith('Icon'));

  // Use outline icons (they're cleaner for this use case)
  return outlineIcons.map(name => ({
    name: name.replace('Icon', '').replace(/([A-Z])/g, ' $1').trim(),
    componentName: name,
  }));
};

function IconSelector({ value, onChange }: { value?: string; onChange: (iconName: string) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [allIcons] = useState(() => getAllHeroicons());

  const filteredIcons = allIcons.filter(icon =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentIconName = value;
  const IconComponent = currentIconName ? (HeroiconsOutline as any)[currentIconName] : null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {IconComponent ? (
          <>
            <IconComponent style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
            <span style={{ color: '#171717', fontSize: '13px' }}>
              {currentIconName?.replace('Icon', '').replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </>
        ) : (
          <span style={{ color: '#737373' }}>Select icon...</span>
        )}
      </button>

      {showPicker && (
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
            onClick={() => setShowPicker(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '8px',
              width: '320px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 20,
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons (e.g. 'rocket', 'star', 'chart')..."
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '13px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                marginBottom: '8px',
                outline: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />

            <div style={{ fontSize: '11px', color: '#737373', marginBottom: '8px', paddingLeft: '4px' }}>
              {filteredIcons.length} icons
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '4px',
              }}
            >
              {filteredIcons.slice(0, 100).map((icon) => {
                const IconComp = (HeroiconsOutline as any)[icon.componentName];
                return (
                  <button
                    key={icon.componentName}
                    type="button"
                    onClick={() => {
                      onChange(icon.componentName);
                      setShowPicker(false);
                      setSearch('');
                    }}
                    title={icon.name}
                    style={{
                      padding: '10px',
                      background: value === icon.componentName ? '#eff6ff' : 'transparent',
                      border: value === icon.componentName ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (value !== icon.componentName) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== icon.componentName) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <IconComp style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  </button>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#737373', fontSize: '13px' }}>
                No icons found
              </div>
            )}

            {filteredIcons.length > 100 && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#737373', fontSize: '12px', borderTop: '1px solid #e5e5e5', marginTop: '8px' }}>
                Showing first 100 of {filteredIcons.length} results. Refine your search to see more.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '4px' }}>
                Icon
              </label>
              <IconSelector
                value={item.icon}
                onChange={(iconName) => updateItem(itemIndex, 'icon', iconName)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '4px' }}>
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(itemIndex, 'title', e.target.value)}
                placeholder="Option title..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  outline: 'none',
                  background: '#ffffff',
                }}
              />
            </div>

            <button
              onClick={() => removeItem(itemIndex)}
              style={{
                alignSelf: 'flex-end',
                padding: '8px 12px',
                background: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                height: '36px',
              }}
            >
              Remove
            </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
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
