'use client';

import Image from 'next/image';
import { PersonalCollectionItem } from '@/types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MoveDialog from './MoveDialog';
import { MinusIcon, PlusIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/format-price';

interface PersonalCollectionListProps {
  items: PersonalCollectionItem[];
  onItemDelete: (id: string) => void;
  onItemUpdate: (id: string, updates: Partial<PersonalCollectionItem>) => void;
  showDecimals: boolean;
  onItemMove?: (id: string, quantity: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

export default function PersonalCollectionList({
  items,
  onItemDelete,
  onItemUpdate,
  showDecimals,
  onItemMove,
  onRefresh,
}: PersonalCollectionListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');
  const [moveDialogItem, setMoveDialogItem] = useState<PersonalCollectionItem | null>(null);
  const [moveSuccess, setMoveSuccess] = useState(false);
  const [lastMovedItem, setLastMovedItem] = useState<{ id: string; minifigNo: string; condition: string } | null>(null);

  const currency = session?.user?.preferredCurrency || 'USD';

  // Dismiss notification on click
  useEffect(() => {
    if (!moveSuccess) return;

    const handleClick = () => {
      setMoveSuccess(false);
      setLastMovedItem(null);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [moveSuccess]);

  // Display full minifig name from BrickLink (no modifications)
  const getDisplayName = (fullName: string): string => {
    const decodeHTML = (html: string) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    };

    let cleaned = decodeHTML(fullName);
    const parts = cleaned.split(',');
    if (parts.length > 1) {
      return parts[0].trim();
    }
    return cleaned.trim();
  };

  const handleQuantityClick = (item: PersonalCollectionItem, e: React.MouseEvent) => {
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

  const handleQuantityBlur = (item: PersonalCollectionItem) => {
    const num = parseInt(tempQuantity, 10);
    if (!isNaN(num) && num >= 1 && num <= 9999 && num !== item.quantity) {
      onItemUpdate(item.id, { quantity: num });
    }
    setEditingQuantityId(null);
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, item: PersonalCollectionItem) => {
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
        <div style={{ fontSize: 'var(--text-3xl)', marginBottom: '24px' }}>🏠</div>
        <p style={{
          
          
          color: '#171717',
          marginBottom: '8px'
        }}>
          No minifigures in your personal collection yet
        </p>
        <p style={{
          
          color: '#737373',
          lineHeight: '1.6'
        }}>
          Track your personal LEGO minifigures separately from items for sale
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
          onClick={() => router.push(`/minifigs/${item.minifigure_no}?condition=${item.condition}`)}
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto',
            gridTemplateRows: 'auto',
            padding: '16px',
            gap: '12px',
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
              <Image
                src={item.image_url}
                alt={item.minifigure_name}
                width={80}
                height={100}
                style={{ height: '100px', width: 'auto', maxWidth: 'none', objectFit: 'contain' }}
                loading="lazy"
                unoptimized
              />
            ) : (
              <span style={{ fontSize: 'var(--text-xl)' }}>🧱</span>
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
              
              
              color: '#171717',
              marginBottom: '6px',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.minifigure_name}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: '#737373',
                fontFamily: 'inherit'
              }}>
                {item.minifigure_no}
              </p>
              <select
                className={`custom-dropdown condition-${item.condition}`}
                value={item.condition}
                onChange={async (e) => {
                  e.stopPropagation();
                  const newCondition = e.target.value as 'new' | 'used';
                  try {
                    const response = await fetch(`/api/personal-collection/${item.id}/change-condition`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ newCondition })
                    });
                    if (response.ok) {
                      if (onRefresh) {
                        await onRefresh();
                      }
                    } else {
                      const data = await response.json();
                      alert(data.error || 'Failed to change condition');
                    }
                  } catch (err) {
                    alert('Failed to change condition');
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  color: item.condition === 'new' ? '#2563eb' : '#525252',
                  background: item.condition === 'new' ? '#d1fae5' : '#f5f5f5',
                  padding: '3px 8px',
                  paddingRight: '20px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  marginRight: '12px'
                }}
              >
                <option value="new">NEW</option>
                <option value="used">USED</option>
              </select>
            </div>
            {item.pricing && item.pricing.suggestedPrice > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {item.quantity > 1 ? (
                  <>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: '#737373',
                      fontWeight: '500'
                    }}>
                      {formatPrice(item.pricing.suggestedPrice, currency, showDecimals)} ea
                    </div>
                    <div style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '700',
                      color: '#3b82f6',
                      letterSpacing: '-0.01em'
                    }}>
                      {formatPrice(item.pricing.suggestedPrice * item.quantity, currency, showDecimals)} <span style={{ fontSize: 'var(--text-xs)', fontWeight: '500', color: '#737373' }}>total</span>
                    </div>
                  </>
                ) : (
                  <div style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '700',
                    color: '#3b82f6',
                    letterSpacing: '-0.01em'
                  }}>
                    {formatPrice(item.pricing.suggestedPrice, currency, showDecimals)}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                fontSize: 'var(--text-xs)',
                color: '#a3a3a3',
                fontStyle: 'italic'
              }}>
                No sellers available
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '8px',
            flexShrink: 0,
            gridColumn: '3'
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
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: item.quantity > 1 ? '#ffffff' : '#f5f5f5',
                  border: 'none',
                  borderRight: '1px solid #e5e5e5',
                  cursor: item.quantity > 1 ? 'pointer' : 'not-allowed',
                  color: item.quantity > 1 ? '#737373' : '#a3a3a3',
                  padding: 0
                }}
              >
                <MinusIcon style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
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
                    width: '60px',
                    height: '44px',
                    fontSize: 'var(--text-sm)',
                    
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
                    width: '60px',
                    height: '44px',
                    fontSize: 'var(--text-sm)',
                    
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
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: item.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                  border: 'none',
                  borderLeft: '1px solid #e5e5e5',
                  cursor: item.quantity < 9999 ? 'pointer' : 'not-allowed',
                  color: item.quantity < 9999 ? '#737373' : '#a3a3a3',
                  padding: 0
                }}
              >
                <PlusIcon style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
              </button>
            </div>

            {/* Move to Inventory Button */}
            {onItemMove && (
              <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (item.quantity === 1) {
                      setLastMovedItem({ id: item.id, minifigNo: item.minifigure_no, condition: item.condition });
                      await onItemMove(item.id, 1);
                      setMoveSuccess(true);
                      setTimeout(() => {
                        setMoveSuccess(false);
                        setLastMovedItem(null);
                      }, 10000);
                    } else {
                      setMoveDialogItem(item);
                    }
                  }}
                  style={{
                    width: '44px',
                    height: '44px',
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
                  title="Move to Inventory"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0fdf4';
                    e.currentTarget.style.color = '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#737373';
                  }}
                >
                  <ArrowRightIcon style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
                </button>
              )}

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this item from your personal collection?')) {
                  onItemDelete(item.id);
                }
              }}
              style={{
                width: '44px',
                height: '44px',
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
              <TrashIcon style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
            </button>
          </div>
        </div>
      ))}

      {/* Move Dialog */}
      {moveDialogItem && onItemMove && (
        <MoveDialog
          isOpen={true}
          onClose={() => setMoveDialogItem(null)}
          itemName={moveDialogItem.minifigure_name}
          maxQuantity={moveDialogItem.quantity}
          direction="to-inventory"
          onConfirm={async (quantity) => {
            await onItemMove(moveDialogItem.id, quantity);
            setMoveDialogItem(null);
          }}
        />
      )}

      {/* Success Notification */}
      {moveSuccess && lastMovedItem && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: '#3b82f6',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          zIndex: 1000,
          animation: 'slideIn 0.2s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span>Moved 1 minifigure to Inventory</span>
          <button
            onClick={async () => {
              setMoveSuccess(false);
              try {
                // Fetch inventory to find the item that was just moved
                const inventoryResponse = await fetch('/api/inventory');
                const inventoryData = await inventoryResponse.json();

                if (inventoryData.success) {
                  const movedItem = inventoryData.data.find((item: any) =>
                    item.minifigure_no === lastMovedItem.minifigNo &&
                    item.condition === lastMovedItem.condition
                  );

                  if (movedItem) {
                    const response = await fetch(`/api/inventory/${movedItem.id}/move-to-collection`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ quantity: 1 })
                    });

                    if (response.ok && onRefresh) {
                      await onRefresh();
                    }
                  }
                }
              } catch (err) {
                console.error('Failed to undo move:', err);
              }
              setLastMovedItem(null);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
