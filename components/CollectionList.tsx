'use client';

import { CollectionItem } from '@/types';
import { useState, useEffect } from 'react';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);

  const handleEdit = (item: CollectionItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity);
    onItemSelect(null); // Close the drawer when entering edit mode
  };

  const handleSaveEdit = (id: string) => {
    onItemUpdate(id, {
      quantity: editQuantity,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for editing
    if (value === '') {
      setEditQuantity(1);
      return;
    }
    // Parse and validate
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 9999) {
      setEditQuantity(num);
    }
  };

  const handleQuantityBlur = () => {
    // Ensure valid number on blur
    if (editQuantity < 1) {
      setEditQuantity(1);
    }
  };

  const openLightbox = (imageUrl: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item selection when clicking image
    setLightboxImage({ url: imageUrl, name });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [lightboxImage]);

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
          No minifigures in your collection yet
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
            className={`collection-item-card ${editingId === item.id ? 'editing' : ''}`}
            onClick={() => editingId !== item.id && onItemSelect(selectedItemId === item.id ? null : item)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '12px',
              border: selectedItemId === item.id ? '2px solid #3b82f6' : '1px solid #e5e5e5',
              cursor: editingId === item.id ? 'default' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedItemId === item.id ? '0 4px 12px rgba(59, 130, 246, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}
          >
          {/* Main Content Row */}
          <div style={{ display: 'flex', padding: '16px' }}>
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
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                overflow: 'hidden',
                marginRight: '16px'
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.minifigure_name}
                  onClick={(e) => openLightbox(item.image_url!, item.minifigure_name, e)}
                  style={{ height: '100px', width: 'auto', maxWidth: 'none', cursor: 'zoom-in' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '28px' }}>🧱</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              {editingId === item.id ? (
                <>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '4px',
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
                    marginBottom: '8px'
                  }}>
                    {item.minifigure_no}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#525252',
                    marginBottom: '12px'
                  }}>
                    Update quantity
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '4px',
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
                    marginBottom: '8px'
                  }}>
                    {item.minifigure_no}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '13px',
                    color: '#525252'
                  }}>
                    <span>Qty: {item.quantity}</span>
                    {item.pricing && (
                      <span style={{ fontWeight: '600', color: '#171717', fontSize: '18px' }}>
                        ${showDecimals ? item.pricing.suggestedPrice.toFixed(2) : Math.round(item.pricing.suggestedPrice)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Edit Mode Controls */}
          {editingId === item.id && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
              {/* Horizontal Quantity Stepper */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                overflow: 'hidden',
                width: 'fit-content'
              }}>
                {/* Minus Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editQuantity > 1) setEditQuantity(editQuantity - 1);
                  }}
                  disabled={editQuantity <= 1}
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: editQuantity > 1 ? '#ffffff' : '#f5f5f5',
                    border: 'none',
                    borderRight: '1px solid #e5e5e5',
                    cursor: editQuantity > 1 ? 'pointer' : 'not-allowed',
                    color: editQuantity > 1 ? '#171717' : '#a3a3a3',
                    transition: 'all 0.2s',
                    fontSize: '20px',
                    fontWeight: '600',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (editQuantity > 1) e.currentTarget.style.background = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    if (editQuantity > 1) e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  −
                </button>

                {/* Quantity Input */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={editQuantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    minWidth: '60px',
                    height: '44px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#171717',
                    background: '#ffffff',
                    border: 'none',
                    textAlign: 'center',
                    outline: 'none',
                    padding: '0'
                  }}
                />

                {/* Plus Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditQuantity(editQuantity + 1);
                  }}
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    border: 'none',
                    borderLeft: '1px solid #e5e5e5',
                    cursor: 'pointer',
                    color: '#171717',
                    transition: 'all 0.2s',
                    fontSize: '20px',
                    fontWeight: '600',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  +
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#525252',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons - Always visible when not editing */}
          {editingId !== item.id && (
            <div style={{
              padding: '0 16px 16px',
              display: 'flex',
              gap: '12px',
              borderTop: '1px solid #f5f5f5',
              paddingTop: '16px',
              marginTop: '0'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#525252',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this item?')) {
                    onItemDelete(item.id);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#dc2626',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                Delete
              </button>
            </div>
          )}
          </div>

          {/* Pricing Drawer */}
          {selectedItemId === item.id && (
            <div style={{
              marginTop: '16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <div className="pricing-drawer" style={{ padding: '40px' }}>
                {item.pricing ? (
                  <div className="pricing-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                  }}>
                  {/* 6 Month Average */}
                  <div className="pricing-card" style={{
                    padding: '24px',
                    background: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      6 Month Average
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.sixMonthAverage)}
                    </p>
                  </div>

                  {/* Current Average */}
                  <div className="pricing-card" style={{
                    padding: '24px',
                    background: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      Current Average
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.currentAverage)}
                    </p>
                  </div>

                  {/* Current Lowest */}
                  <div className="pricing-card" style={{
                    padding: '24px',
                    background: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      Current Lowest
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      ${formatPrice(item.pricing.currentLowest)}
                    </p>
                  </div>

                  {/* Suggested Price */}
                  <div className="pricing-card" style={{
                    padding: '24px',
                    background: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <p className="pricing-card-label" style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      Suggested Price
                    </p>
                    <p className="pricing-card-value" style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#171717',
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
                    marginBottom: '32px'
                  }}>
                    <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '500' }}>No pricing data available</p>
                    <p style={{ fontSize: '14px' }}>Pricing will be fetched automatically</p>
                  </div>
                )}

                {/* View on Bricklink Button */}
                <a
                  href={`https://www.bricklink.com/catalogPG.asp?M=${item.minifigure_no}&ColorID=0&v=D&cID=N`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  View on Bricklink
                </a>

                {/* Mobile Action Buttons (Edit/Delete) */}
                <div className="drawer-actions" style={{ display: 'none' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    style={{
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#525252',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this item?')) {
                        onItemDelete(item.id);
                      }
                    }}
                    style={{
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#dc2626',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '40px'
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 60px)',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            />
            <div
              style={{
                marginTop: '20px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 500,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              {lightboxImage.name}
            </div>
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
