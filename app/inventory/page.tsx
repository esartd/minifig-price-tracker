'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CollectionItem } from '@/types';
import CollectionList from '@/components/CollectionList';
import Link from 'next/link';

export default function CollectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState({ current: 0, total: 0, itemName: '' });
  const [sortOrder, setSortOrder] = useState<'default' | 'price-high' | 'price-low' | 'id'>('price-high');
  const [showDecimals, setShowDecimals] = useState(false);

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
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
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
        if (selectedItem?.id === id) {
          setSelectedItem(data.data);
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleRefreshPricing = async () => {
    setRefreshing(true);
    const items = collection;

    setRefreshProgress({ current: 0, total: items.length, itemName: '' });

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        setRefreshProgress({
          current: i + 1,
          total: items.length,
          itemName: item.minifigure_name,
        });

        if (i > 0) {
          const delay = 8000 + Math.random() * 4000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        try {
          const response = await fetch(`/api/inventory/${item.id}/refresh-pricing`, {
            method: 'POST',
          });

          const data = await response.json();

          if (data.success) {
            setCollection((prevCollection) =>
              prevCollection.map((collectionItem) =>
                collectionItem.id === item.id ? data.data : collectionItem
              )
            );

            if (selectedItem?.id === item.id) {
              setSelectedItem(data.data);
            }
          }
        } catch (error) {
          console.error(`Error refreshing ${item.minifigure_name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error refreshing pricing:', error);
    } finally {
      setRefreshing(false);
      setRefreshProgress({ current: 0, total: 0, itemName: '' });
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
        padding: '32px 16px 80px',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div className="collection-header-wrapper" style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: '#171717',
              marginBottom: '12px'
            }}>
              My Inventory
            </h1>
            <p className="collection-subtitle" style={{
              fontSize: '16px',
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
              fontSize: '16px',
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

        {/* Collection Stats */}
        {collection.length > 0 && (
          <div style={{
            overflowX: 'auto',
            marginBottom: '40px',
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
              gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))',
              gap: '16px',
              minWidth: 'max-content',
              paddingRight: '16px'
            }}>
              <div className="collection-stat-card" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px 20px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                minWidth: '160px'
              }}>
                <div className="collection-stat-label" style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#737373',
                  marginBottom: '8px',
                  letterSpacing: '0.01em'
                }}>
                  Total Value
                </div>
                <div className="collection-stat-value" style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#171717',
                  lineHeight: '1'
                }}>
                  ${totalValue.toFixed(2)}
                </div>
              </div>
              <div className="collection-stat-card" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px 20px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                minWidth: '160px'
              }}>
                <div className="collection-stat-label" style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#737373',
                  marginBottom: '8px',
                  letterSpacing: '0.01em'
                }}>
                  Total Items
                </div>
                <div className="collection-stat-value" style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#171717',
                  lineHeight: '1'
                }}>
                  {totalItems}
                </div>
              </div>
              <div className="collection-stat-card" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px 20px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                minWidth: '160px'
              }}>
                <div className="collection-stat-label" style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#737373',
                  marginBottom: '8px',
                  letterSpacing: '0.01em'
                }}>
                  Average Value
                </div>
                <div className="collection-stat-value" style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#171717',
                  lineHeight: '1'
                }}>
                  ${avgValue.toFixed(2)}
                </div>
              </div>
            </div>
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
              fontSize: '20px',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em'
            }}>
              Items <span style={{ color: '#a3a3a3', fontWeight: '400' }}>({collection.length})</span>
            </h2>
            {collection.length > 0 && (
              <div className="collection-controls" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      fontSize: '15px',
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
                      boxSizing: 'border-box'
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
                      padding: '14px 20px',
                      fontSize: '15px',
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
                      minWidth: '70px'
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
                <button
                  onClick={handleRefreshPricing}
                  disabled={refreshing}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: refreshing ? '#a3a3a3' : '#3b82f6',
                    background: '#ffffff',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!refreshing) {
                      e.currentTarget.style.background = '#eff6ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  {refreshing ? 'Refreshing Prices...' : 'Refresh All Prices'}
                </button>
              </div>
            )}
          </div>

          {refreshing && (
            <div style={{
              marginBottom: '32px',
              padding: '20px 24px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#1e40af'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #1e40af',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontWeight: '500', fontSize: '15px' }}>
                  {refreshProgress.itemName ? (
                    <>Updating {refreshProgress.current}/{refreshProgress.total}: <strong>{refreshProgress.itemName}</strong></>
                  ) : (
                    'Updating prices from Bricklink...'
                  )}
                </span>
              </div>
            </div>
          )}

          {collection.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <svg style={{ width: '64px', height: '64px', color: '#a3a3a3', margin: '0 auto 24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '12px'
              }}>
                No minifigs yet
              </h3>
              <p style={{
                fontSize: '16px',
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
                  fontSize: '16px',
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
              onItemSelect={setSelectedItem}
              onItemDelete={handleItemDeleted}
              onItemUpdate={handleItemUpdated}
              selectedItemId={selectedItem?.id}
              showDecimals={showDecimals}
            />
          )}
        </div>
      </div>
    </div>
  );
}
