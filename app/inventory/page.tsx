'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CollectionItem } from '@/types';
import CollectionList from '@/components/CollectionList';
import CollectionSwitcher from '@/components/CollectionSwitcher';
import Link from 'next/link';

export default function CollectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-high' | 'price-low' | 'id'>('price-high');
  const [showDecimals, setShowDecimals] = useState(false);

  // Load saved sort order on mount
  useEffect(() => {
    const savedSortOrder = localStorage.getItem('inventorySortOrder');
    if (savedSortOrder) {
      setSortOrder(savedSortOrder as 'default' | 'price-high' | 'price-low' | 'id');
    }
  }, []);

  // Save sort order when it changes
  const handleSortOrderChange = (newSortOrder: 'default' | 'price-high' | 'price-low' | 'id') => {
    setSortOrder(newSortOrder);
    localStorage.setItem('inventorySortOrder', newSortOrder);
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadCollection();
    }
  }, [status, router]);

  const loadCollection = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      if (data.success) {
        setCollection(data.data);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemDeleted = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCollection(collection.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemUpdated = async (id: string, updates: Partial<CollectionItem>) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setCollection(
          collection.map((item) => (item.id === id ? data.data : item))
        );
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleItemMoved = async (id: string, quantity: number) => {
    try {
      const response = await fetch(`/api/inventory/${id}/move-to-collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (data.success) {
        // Reload collection after move
        await loadCollection();
      }
    } catch (error) {
      console.error('Error moving item:', error);
      throw error;
    }
  };

  const getSortedCollection = () => {
    const sorted = [...collection];

    if (sortOrder === 'price-high') {
      return sorted.sort((a, b) => {
        const priceA = a.pricing?.suggestedPrice || 0;
        const priceB = b.pricing?.suggestedPrice || 0;
        return priceB - priceA;
      });
    } else if (sortOrder === 'price-low') {
      return sorted.sort((a, b) => {
        const priceA = a.pricing?.suggestedPrice || 0;
        const priceB = b.pricing?.suggestedPrice || 0;
        return priceA - priceB;
      });
    } else if (sortOrder === 'id') {
      return sorted.sort((a, b) => {
        return a.minifigure_no.localeCompare(b.minifigure_no);
      });
    }

    return sorted;
  };

  const totalValue = collection.reduce((sum, item) => sum + ((item.pricing?.suggestedPrice || 0) * item.quantity), 0);
  const totalItems = collection.reduce((sum, item) => sum + item.quantity, 0);
  const avgValue = collection.length > 0 ? (collection.reduce((sum, item) => sum + (item.pricing?.suggestedPrice || 0), 0) / collection.length) : 0;

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', overflowX: 'hidden' }}>
      <div className="collection-page-wrapper" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 16px 80px',
        boxSizing: 'border-box'
      }}>
        {/* Compact Header with Stats and Action */}
        {collection.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            {/* Title + Add Button Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '16px'
            }}>
              <CollectionSwitcher currentPage="inventory" />
              <Link
                href="/search"
                className="collection-add-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 20px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: 'white',
                  background: '#3b82f6',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                + Add
              </Link>
            </div>

            {/* Compact Stats Row */}
            <div style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              marginLeft: '-16px',
              marginRight: '-16px',
              paddingLeft: '16px',
              paddingRight: '16px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            className="hide-scrollbar">
              <div className="collection-stats" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))',
                gap: '12px',
                minWidth: 'max-content'
              }}>
                <div className="collection-stat-card" style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  minWidth: '140px'
                }}>
                  <div className="collection-stat-label" style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: '500',
                    color: '#737373',
                    marginBottom: '4px',
                    letterSpacing: '0.01em'
                  }}>
                    Total Value
                  </div>
                  <div className="collection-stat-value" style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    color: '#171717',
                    lineHeight: '1'
                  }}>
                    ${totalValue.toFixed(2)}
                  </div>
                </div>
                <div className="collection-stat-card" style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  minWidth: '140px'
                }}>
                  <div className="collection-stat-label" style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: '500',
                    color: '#737373',
                    marginBottom: '4px',
                    letterSpacing: '0.01em'
                  }}>
                    Total Items
                  </div>
                  <div className="collection-stat-value" style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    color: '#171717',
                    lineHeight: '1'
                  }}>
                    {totalItems}
                  </div>
                </div>
                <div className="collection-stat-card" style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  minWidth: '140px'
                }}>
                  <div className="collection-stat-label" style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: '500',
                    color: '#737373',
                    marginBottom: '4px',
                    letterSpacing: '0.01em'
                  }}>
                    Avg Value
                  </div>
                  <div className="collection-stat-value" style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    color: '#171717',
                    lineHeight: '1'
                  }}>
                    ${avgValue.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Header (only when no items) */}
        {collection.length === 0 && (
          <div className="collection-header-wrapper" style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h1 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '700',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                color: '#171717',
                marginBottom: '8px'
              }}>
                Your Inventory
              </h1>
              <p className="collection-subtitle" style={{
                fontSize: 'var(--text-base)',
                color: '#525252',
                lineHeight: '1.6'
              }}>
                Track your LEGO minifig inventory with real-time pricing
              </p>
            </div>
            <Link
              href="/search"
              className="collection-add-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 32px',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: 'white',
                background: '#3b82f6',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                border: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              + Add Minifigs
            </Link>
          </div>
        )}

        {/* Collection List */}
        <div className="collection-list-container" style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 16px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <div className="collection-list-header" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em'
            }}>
              Items <span style={{ color: '#a3a3a3', fontWeight: '400' }}>({collection.length})</span>
            </h2>
            {collection.length > 0 && (
              <div className="collection-controls" style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={sortOrder}
                  onChange={(e) => handleSortOrderChange(e.target.value as any)}
                  style={{
                    flex: '0 0 auto',
                    minWidth: '200px',
                    padding: '8px 16px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    color: '#171717',
                    background: '#f5f5f5',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23525252' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em 1.25em',
                    paddingRight: '3rem',
                    boxSizing: 'border-box',
                    height: '44px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                >
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="id">Bricklink ID</option>
                </select>
                <button
                  onClick={() => setShowDecimals(!showDecimals)}
                  style={{
                    padding: '8px 20px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '700',
                    color: showDecimals ? '#ffffff' : '#525252',
                    background: showDecimals ? '#3b82f6' : '#f5f5f5',
                    border: showDecimals ? '1px solid #3b82f6' : '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box',
                    whiteSpace: 'nowrap',
                    minWidth: '70px',
                    flex: '0 0 auto',
                    height: '44px'
                  }}
                  onMouseEnter={(e) => {
                    if (!showDecimals) {
                      e.currentTarget.style.background = '#e5e5e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showDecimals) {
                      e.currentTarget.style.background = '#f5f5f5';
                    }
                  }}
                >
                  {showDecimals ? '.00' : '.0'}
                </button>
              </div>
            )}
          </div>

          {collection.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <svg style={{ width: '64px', height: '64px', color: '#a3a3a3', margin: '0 auto 24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '12px'
              }}>
                No minifigs yet
              </h3>
              <p style={{
                fontSize: 'var(--text-base)',
                color: '#737373',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Start adding to your inventory by searching for minifigs
              </p>
              <Link
                href="/search"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  color: 'white',
                  background: '#3b82f6',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                Search Minifigs
              </Link>
            </div>
          ) : (
            <CollectionList
              items={getSortedCollection()}
              onItemDelete={handleItemDeleted}
              onItemUpdate={handleItemUpdated}
              showDecimals={showDecimals}
              onItemMove={handleItemMoved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
