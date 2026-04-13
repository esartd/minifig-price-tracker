'use client';

import { CollectionItem } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CollectionListProps {
  items: CollectionItem[];
  onItemDelete: (id: string) => void;
  onItemUpdate: (id: string, updates: Partial<CollectionItem>) => void;
  showDecimals: boolean;
}

export default function CollectionList({
  items,
  onItemDelete,
  onItemUpdate,
  showDecimals,
}: CollectionListProps) {
  const router = useRouter();
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');

  // Clean up minifig name for display
  const getDisplayName = (fullName: string): string => {
    const decodeHTML = (html: string) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    };

    let cleaned = decodeHTML(fullName);
    cleaned = cleaned.replace(/^[^-]+-\s*/, '');
    const parts = cleaned.split(',');
    if (parts.length > 1) {
      return parts[0].trim();
    }
    return cleaned.trim();
  };

  const handleQuantityClick = (item: CollectionItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingQuantityId(item.id);
    setTempQuantity(item.quantity.toString());
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setTempQuantity(value);
    }
  };

  const handleQuantityBlur = (item: CollectionItem) => {
    const num = parseInt(tempQuantity, 10);
    if (!isNaN(num) && num >= 1 && num <= 9999 && num !== item.quantity) {
      onItemUpdate(item.id, { quantity: num });
    }
    setEditingQuantityId(null);
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, item: CollectionItem) => {
    if (e.key === 'Enter') {
      handleQuantityBlur(item);
    } else if (e.key === 'Escape') {
      setEditingQuantityId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 32px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
        <p style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#171717',
          marginBottom: '8px'
        }}>
          No minifigures in your inventory yet
        </p>
        <p style={{
          fontSize: '16px',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          Search for minifigures to get started
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="collection-item-card"
          onClick={() => router.push(`/minifig/${item.minifigure_no}`)}
          style={{
            display: 'flex',
            padding: '20px',
            gap: '16px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = '#d4d4d4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = '#e5e5e5';
          }}
        >
          {/* Image */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '100px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.minifigure_name}
                style={{ height: '100px', width: 'auto', maxWidth: 'none' }}
              />
            ) : (
              <span style={{ fontSize: '28px' }}>🧱</span>
            )}
          </div>

          {/* Info */}
          <div style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{
              fontSize: '17px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '6px',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.minifigure_name}
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#737373',
              fontFamily: 'monospace',
              marginBottom: '10px'
            }}>
              {item.minifigure_no}
            </p>
            {item.pricing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {item.quantity > 1 ? (
                  <>
                    <div style={{
                      fontSize: '13px',
                      color: '#737373',
                      fontWeight: '500'
                    }}>
                      ${showDecimals ? item.pricing.suggestedPrice.toFixed(2) : Math.round(item.pricing.suggestedPrice)} ea
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      letterSpacing: '-0.01em'
                    }}>
                      ${showDecimals ? (item.pricing.suggestedPrice * item.quantity).toFixed(2) : Math.round(item.pricing.suggestedPrice * item.quantity)} <span style={{ fontSize: '13px', fontWeight: '500', color: '#737373' }}>total</span>
                    </div>
                  </>
                ) : (
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    letterSpacing: '-0.01em'
                  }}>
                    ${showDecimals ? item.pricing.suggestedPrice.toFixed(2) : Math.round(item.pricing.suggestedPrice)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0
          }}>
            {/* Quantity Stepper */}
            <div onClick={(e) => e.stopPropagation()} style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#ffffff'
            }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.quantity > 1) {
                    onItemUpdate(item.id, { quantity: item.quantity - 1 });
                  }
                }}
                disabled={item.quantity <= 1}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: item.quantity > 1 ? '#ffffff' : '#f5f5f5',
                  border: 'none',
                  borderRight: '1px solid #e5e5e5',
                  cursor: item.quantity > 1 ? 'pointer' : 'not-allowed',
                  color: item.quantity > 1 ? '#171717' : '#a3a3a3',
                  fontSize: '18px',
                  fontWeight: '600',
                  padding: 0
                }}
              >
                −
              </button>

              {editingQuantityId === item.id ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={tempQuantity}
                  onChange={handleQuantityChange}
                  onBlur={() => handleQuantityBlur(item)}
                  onKeyDown={(e) => handleQuantityKeyDown(e, item)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  style={{
                    width: '44px',
                    height: '32px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#171717',
                    background: '#ffffff',
                    border: 'none',
                    textAlign: 'center',
                    outline: 'none',
                    padding: 0
                  }}
                />
              ) : (
                <div
                  onClick={(e) => handleQuantityClick(item, e)}
                  style={{
                    width: '44px',
                    height: '32px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#171717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'text',
                    userSelect: 'none'
                  }}
                >
                  {item.quantity}
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.quantity < 9999) {
                    onItemUpdate(item.id, { quantity: item.quantity + 1 });
                  }
                }}
                disabled={item.quantity >= 9999}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: item.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                  border: 'none',
                  borderLeft: '1px solid #e5e5e5',
                  cursor: item.quantity < 9999 ? 'pointer' : 'not-allowed',
                  color: item.quantity < 9999 ? '#171717' : '#a3a3a3',
                  fontSize: '18px',
                  fontWeight: '600',
                  padding: 0
                }}
              >
                +
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this item from your inventory?')) {
                  onItemDelete(item.id);
                }
              }}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#737373',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.borderColor = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#737373';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
