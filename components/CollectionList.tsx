'use client';

import { CollectionItem } from '@/types';
import { useState } from 'react';

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
  const [editCondition, setEditCondition] = useState<'new' | 'used'>('new');

  const handleEdit = (item: CollectionItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity);
    setEditCondition(item.condition);
  };

  const handleSaveEdit = (id: string) => {
    onItemUpdate(id, {
      quantity: editQuantity,
      condition: editCondition,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const formatPrice = (price: number) => {
    return showDecimals ? price.toFixed(2) : Math.round(price).toString();
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-600 text-base font-medium">No minifigures in your collection yet</p>
        <p className="text-gray-500 text-sm mt-1">
          Search for minifigures above to get started
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => (
        <div key={item.id}>
          <div
            onClick={() => onItemSelect(selectedItemId === item.id ? null : item)}
            className={`bg-white cursor-pointer transition-all overflow-hidden flex ${
              selectedItemId === item.id
                ? 'shadow-lg'
                : 'shadow-sm hover:shadow-md'
            }`}
            style={selectedItemId === item.id ? {
              borderLeft: '4px solid #0071e3',
              backgroundColor: '#f0f9ff',
              borderRadius: '20px'
            } : { borderRadius: '20px' }}
          >
          {/* Image Section - Small thumbnail on left */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: selectedItemId === item.id ? '84px' : '80px',
              minHeight: '120px',
              alignSelf: 'stretch',
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              position: 'relative',
              marginLeft: selectedItemId === item.id ? '-4px' : '0'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ffffff',
              zIndex: 0
            }} />
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.minifigure_name}
                style={{ height: '120px', width: 'auto', maxWidth: 'none', position: 'relative', zIndex: 1 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ position: 'relative', zIndex: 1 }}>
                <span className="text-2xl">🧱</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 flex items-center justify-between" style={{ paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '12px', minWidth: 0, gap: '24px' }}>
            {editingId === item.id ? (
              /* Edit Mode */
              <div className="flex-1 flex items-center" onClick={(e) => e.stopPropagation()} style={{ minWidth: 0, gap: '24px' }}>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <h3 className="font-semibold text-sm text-gray-900 tracking-tight" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '12px'
                  }}>
                    {item.minifigure_name}
                  </h3>
                  <div className="flex" style={{ gap: '8px' }}>
                    <div style={{ position: 'relative', width: '130px' }}>
                      <input
                        type="text"
                        value={editQuantity}
                        readOnly
                        className="border border-gray-200"
                        style={{
                          width: '130px',
                          padding: '14px 48px 14px 16px',
                          height: '52px',
                          minHeight: '52px',
                          fontSize: '16px',
                          borderRadius: '26px',
                          boxSizing: 'border-box',
                          textAlign: 'left',
                          cursor: 'default',
                          backgroundColor: 'white'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        right: '4px',
                        top: '4px',
                        bottom: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        width: '40px'
                      }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditQuantity(editQuantity + 1);
                          }}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 247, 0.9) 100%)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '20px 20px 4px 4px',
                            cursor: 'pointer',
                            color: '#374151'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 242, 1) 100%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 247, 0.9) 100%)';
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '16px', height: '16px', transform: 'rotate(180deg)' }}>
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
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 247, 0.9) 100%)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px 4px 20px 20px',
                            cursor: editQuantity > 1 ? 'pointer' : 'not-allowed',
                            color: editQuantity > 1 ? '#374151' : '#9ca3af',
                            opacity: editQuantity > 1 ? 1 : 0.5
                          }}
                          onMouseEnter={(e) => {
                            if (editQuantity > 1) {
                              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 242, 1) 100%)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (editQuantity > 1) {
                              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 247, 0.9) 100%)';
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '16px', height: '16px' }}>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <select
                      value={editCondition}
                      onChange={(e) => setEditCondition(e.target.value as 'new' | 'used')}
                      className="border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3] appearance-none cursor-pointer"
                      style={{
                        width: '130px',
                        padding: '14px 16px',
                        height: '52px',
                        minHeight: '52px',
                        fontSize: '16px',
                        borderRadius: '26px',
                        boxSizing: 'border-box',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '3rem'
                      }}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                </div>
                <div className="flex" style={{ gap: '8px' }}>
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="font-medium transition-all"
                    style={{
                      padding: '14px 28px',
                      minHeight: '52px',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '26px',
                      color: '#ffffff',
                      fontSize: '16px',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(22, 163, 74, 1) 100%)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="font-medium transition-all"
                    style={{
                      padding: '14px 28px',
                      minHeight: '52px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '26px',
                      color: '#374151',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <h3 className="font-semibold text-sm text-gray-900 tracking-tight" style={{
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.minifigure_name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono" style={{ marginBottom: '8px' }}>{item.minifigure_no}</p>

                  <div className="flex items-center text-xs text-gray-600">
                    <span>Qty: {item.quantity}</span>
                    <span className="capitalize" style={{ marginLeft: '16px' }}>{item.condition}</span>
                  </div>
                </div>

                {/* Price */}
                {item.pricing && (
                  <div className="text-base font-semibold text-green-600" style={{ marginRight: '24px' }}>
                    ${showDecimals ? item.pricing.suggestedPrice.toFixed(2) : Math.round(item.pricing.suggestedPrice)}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex" style={{ gap: '12px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="font-medium transition-all"
                    style={{
                      padding: '14px 28px',
                      minHeight: '52px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 113, 227, 0.3)',
                      borderRadius: '26px',
                      color: '#0071e3',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0, 113, 227, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(240, 249, 255, 0.7)';
                      e.currentTarget.style.border = '1px solid rgba(0, 113, 227, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.border = '1px solid rgba(0, 113, 227, 0.3)';
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
                    className="font-medium transition-all"
                    style={{
                      padding: '14px 28px',
                      minHeight: '52px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '26px',
                      color: '#dc2626',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(254, 242, 242, 0.7)';
                      e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.3)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
          </div>

          {/* Pricing Drawer */}
          {selectedItemId === item.id && item.pricing && (
            <div className="bg-white shadow-lg overflow-hidden" style={{ marginTop: '8px', borderRadius: '20px' }}>
              <div style={{ padding: '24px' }}>
                <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '8px' }}>
                  {/* Last 6 Months Sales */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50" style={{ borderRadius: '16px' }}>
                    <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide mb-2">
                      Last 6 Months Sales
                    </p>
                    <p className="text-2xl font-semibold text-blue-900 tracking-tight">
                      ${formatPrice(item.pricing.sixMonthAverage)}
                    </p>
                  </div>

                  {/* Current Items for Sale - Average */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50" style={{ borderRadius: '16px' }}>
                    <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wide mb-2">
                      Current Avg Price
                    </p>
                    <p className="text-2xl font-semibold text-purple-900 tracking-tight">
                      ${formatPrice(item.pricing.currentAverage)}
                    </p>
                  </div>

                  {/* Current Items for Sale - Min Price */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50" style={{ borderRadius: '16px' }}>
                    <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wide mb-2">
                      Current Min Price
                    </p>
                    <p className="text-2xl font-semibold text-orange-900 tracking-tight">
                      ${formatPrice(item.pricing.currentLowest)}
                    </p>
                  </div>

                  {/* Suggested Price */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50" style={{ borderRadius: '16px' }}>
                    <p className="text-[10px] font-medium text-green-600 uppercase tracking-wide mb-2">
                      Suggested Selling Price
                    </p>
                    <p className="text-2xl font-semibold text-green-900 tracking-tight">
                      ${formatPrice(item.pricing.suggestedPrice)}
                    </p>
                  </div>
                </div>

                {/* View on Bricklink Button */}
                <div className="flex justify-start" style={{ marginTop: '8px' }}>
                  <a
                    href={`https://www.bricklink.com/catalogPG.asp?M=${item.minifigure_no}&ColorID=0&v=D&cID=N`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(0, 113, 227, 0.95) 100%)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: '24px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 1) 0%, rgba(0, 119, 237, 1) 100%)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 113, 227, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(0, 113, 227, 0.95) 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    View on Bricklink
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
