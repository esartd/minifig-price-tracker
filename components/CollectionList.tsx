'use client';

import { CollectionItem } from '@/types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CollectionListProps {
  items: CollectionItem[];
  onItemSelect: (item: CollectionItem | null) => void;
  onItemDelete: (id: string) => void;
  onItemUpdate: (id: string, updates: Partial<CollectionItem>) => void;
  selectedItemId?: string;
  showDecimals: boolean;
}

export default function CollectionList({
  items,
  onItemSelect,
  onItemDelete,
  onItemUpdate,
  selectedItemId,
  showDecimals,
}: CollectionListProps) {
  const router = useRouter();
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');

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

  const formatPrice = (price: number) => {
    return showDecimals ? price.toFixed(2) : Math.round(price).toString();
  };

  if (items.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 32px'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '24px'
        }}>🔍</div>
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
        <div key={item.id}>
          <div
            className="collection-item-card"
            onClick={() => onItemSelect(selectedItemId === item.id ? null : item)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '12px',
              border: selectedItemId === item.id ? '2px solid #3b82f6' : '1px solid #e5e5e5',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedItemId === item.id ? '0 4px 12px rgba(59, 130, 246, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}
          >
          {/* Main Content Row */}
          <div className="collection-item-main" style={{ display: 'flex', flexWrap: 'wrap', padding: '20px', gap: '16px' }}>
            {/* Image Section */}
            <div
              className="collection-item-image"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '100px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                overflow: 'hidden',
                marginRight: '16px'
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.minifigure_name}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/minifig/${item.minifigure_no}`);
                  }}
                  style={{ height: '100px', width: 'auto', maxWidth: 'none', cursor: 'pointer' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '28px' }}>🧱</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="collection-item-info" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

            {/* Action Controls - Inline (Mobile & Desktop) */}
            <div className="collection-item-actions" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginLeft: 'auto',
              paddingLeft: '12px',
              flexShrink: 0
            }}>
                {/* Quantity Stepper */}
                <div onClick={(e) => e.stopPropagation()} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0',
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
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: item.quantity > 1 ? '#ffffff' : '#f5f5f5',
                      border: 'none',
                      borderRight: '1px solid #e5e5e5',
                      cursor: item.quantity > 1 ? 'pointer' : 'not-allowed',
                      color: item.quantity > 1 ? '#171717' : '#a3a3a3',
                      transition: 'all 0.2s',
                      fontSize: '18px',
                      fontWeight: '600',
                      padding: 0,
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (item.quantity > 1) e.currentTarget.style.background = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      if (item.quantity > 1) e.currentTarget.style.background = '#ffffff';
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
                        flex: 1,
                        minWidth: '44px',
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
                        flex: 1,
                        minWidth: '44px',
                        height: '32px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#171717',
                        background: '#ffffff',
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
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: item.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                      border: 'none',
                      borderLeft: '1px solid #e5e5e5',
                      cursor: item.quantity < 9999 ? 'pointer' : 'not-allowed',
                      color: item.quantity < 9999 ? '#171717' : '#a3a3a3',
                      transition: 'all 0.2s',
                      fontSize: '18px',
                      fontWeight: '600',
                      padding: 0,
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (item.quantity < 9999) e.currentTarget.style.background = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      if (item.quantity < 9999) e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Delete Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this item from your inventory?')) {
                      onItemDelete(item.id);
                    }
                  }}
                  style={{
                    width: '32px',
                    minWidth: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#737373',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                    padding: 0,
                    flexShrink: 0
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

                {/* Expand/Collapse Caret */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemSelect(selectedItemId === item.id ? null : item);
                  }}
                  style={{
                    width: '32px',
                    minWidth: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#737373',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                    padding: 0,
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: selectedItemId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
            </div>
          </div>

          </div>

          {/* Pricing Drawer */}
          {selectedItemId === item.id && (
            <div style={{
              marginTop: '12px',
              background: '#fafafa',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              overflow: 'hidden'
            }}>
              <div className="pricing-drawer" style={{ padding: '20px 16px' }}>
                {item.pricing ? (
                  <div className="pricing-grid" style={{
                    display: 'grid',
                    gap: '10px',
                    marginBottom: '16px'
                  }}>
                  {/* 6 Month Average */}
                  <div className="pricing-card" style={{
                    padding: '14px 12px',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      marginBottom: '6px'
                    }}>
                      6 Mo Avg
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.sixMonthAverage)}
                    </p>
                  </div>

                  {/* Current Average */}
                  <div className="pricing-card" style={{
                    padding: '14px 12px',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      marginBottom: '6px'
                    }}>
                      Current Avg
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.currentAverage)}
                    </p>
                  </div>

                  {/* Current Lowest */}
                  <div className="pricing-card" style={{
                    padding: '14px 12px',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      marginBottom: '6px'
                    }}>
                      Lowest
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.currentLowest)}
                    </p>
                  </div>

                  {/* Suggested Price */}
                  <div className="pricing-card" style={{
                    padding: '14px 12px',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #3b82f6'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#3b82f6',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      marginBottom: '6px'
                    }}>
                      Suggested
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.suggestedPrice)}
                    </p>
                  </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#737373',
                    marginBottom: '16px',
                    padding: '20px 0'
                  }}>
                    <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>No pricing data</p>
                    <p style={{ fontSize: '13px' }}>Will fetch automatically</p>
                  </div>
                )}

                {/* View on Bricklink Button */}
                <a
                  href={`https://www.bricklink.com/catalogPG.asp?M=${item.minifigure_no}&ColorID=0&v=D&cID=N`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  View on Bricklink
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
