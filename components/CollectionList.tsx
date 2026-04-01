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
            onClick={() => onItemSelect(selectedItemId === item.id ? null : item)}
            style={{
              display: 'flex',
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
          {/* Image Section - Small thumbnail on left */}
          <div
            className="collection-item-image"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              minHeight: '140px',
              backgroundColor: '#fafafa',
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              overflow: 'hidden'
            }}
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.minifigure_name}
                onClick={(e) => openLightbox(item.image_url!, item.minifigure_name, e)}
                style={{ height: '140px', width: 'auto', maxWidth: 'none', cursor: 'zoom-in' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '32px' }}>🧱</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="collection-item-content" style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px',
            minWidth: 0,
            gap: '32px'
          }}>
            {editingId === item.id ? (
              <div className="collection-edit-container" style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                gap: '24px'
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                  <h3 className="collection-edit-title" style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#171717',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '8px',
                    letterSpacing: '-0.01em'
                  }}>
                    {item.minifigure_name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#737373',
                    marginBottom: '20px'
                  }}>
                    Update quantity
                  </p>
                  <div className="collection-edit-controls" style={{ width: '100%' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type="text"
                        value={editQuantity}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '16px 48px 16px 20px',
                          fontSize: '16px',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          color: '#171717',
                          background: '#ffffff',
                          boxSizing: 'border-box',
                          textAlign: 'center',
                          cursor: 'default',
                          outline: 'none',
                          fontWeight: '600'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        width: '32px'
                      }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditQuantity(editQuantity + 1);
                          }}
                          style={{
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#525252'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '12px', height: '12px', transform: 'rotate(180deg)' }}>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (editQuantity > 1) setEditQuantity(editQuantity - 1);
                          }}
                          style={{
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: editQuantity > 1 ? '#f5f5f5' : '#e5e5e5',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: editQuantity > 1 ? 'pointer' : 'not-allowed',
                            color: editQuantity > 1 ? '#525252' : '#a3a3a3',
                            opacity: editQuantity > 1 ? 1 : 0.5
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '12px', height: '12px' }}>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-edit-buttons flex" style={{ gap: '12px' }}>
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    style={{
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
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
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="collection-item-info" style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="collection-item-title" style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em'
                  }}>
                    {item.minifigure_name}
                  </h3>
                  <p className="collection-item-id" style={{
                    fontSize: '14px',
                    color: '#737373',
                    fontFamily: 'monospace',
                    marginBottom: '12px'
                  }}>
                    {item.minifigure_no}
                  </p>

                  <div className="collection-item-meta" style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#525252',
                    gap: '16px'
                  }}>
                    <span>Quantity: {item.quantity}</span>
                  </div>
                </div>

                {/* Bottom Row: Price + Expand (mobile) / Action Buttons (desktop) */}
                <div className="collection-item-bottom-row" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  width: 'auto'
                }}>
                  {/* Price */}
                  {item.pricing && (
                    <div className="collection-item-price" style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#171717',
                      marginRight: '16px'
                    }}>
                      ${showDecimals ? item.pricing.suggestedPrice.toFixed(2) : Math.round(item.pricing.suggestedPrice)}
                    </div>
                  )}

                  {/* Action Buttons (Desktop only) */}
                  <div className="collection-item-actions flex" style={{ gap: '12px', alignItems: 'center' }}>
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

                    {/* Expand/Collapse Indicator */}
                    <div className="collection-expand-indicator" style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '12px'
                    }}>
                      <svg
                        style={{
                          width: '20px',
                          height: '20px',
                          color: '#3b82f6',
                          transform: selectedItemId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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
