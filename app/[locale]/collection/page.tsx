'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PersonalCollectionItem } from '@/types';
import PersonalCollectionList from '@/components/PersonalCollectionList';
import CollectionSwitcher from '@/components/CollectionSwitcher';
import ShareCollectionButton from '@/components/ShareCollectionButton';
import DatabaseLimitError from '@/components/DatabaseLimitError';
import CollectionPagination from '@/components/CollectionPagination';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/format-price';
import { calculateCollectionStats } from '@/lib/collection-stats';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function PersonalCollectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collection, setCollection] = useState<PersonalCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-high' | 'price-low' | 'id'>('default');
  const [showDecimals, setShowDecimals] = useState(false);
  const [conditionFilter, setConditionFilter] = useState<'all' | 'new' | 'used'>('all');
  const [dbError, setDbError] = useState<Date | null>(null);
  const [pricesUpdating, setPricesUpdating] = useState(0);

  // Pagination state for display only (all items loaded client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState(50); // For mobile "load more"
  const itemsPerPage = 50;

  // Load saved preferences on mount
  useEffect(() => {
    const savedSortOrder = localStorage.getItem('personalCollectionSortOrder');
    if (savedSortOrder) {
      setSortOrder(savedSortOrder as 'default' | 'price-high' | 'price-low' | 'id');
    }

    const savedShowDecimals = localStorage.getItem('showDecimals');
    if (savedShowDecimals !== null) {
      setShowDecimals(savedShowDecimals === 'true');
    }
  }, []);

  // Save sort order when it changes
  const handleSortOrderChange = (newSortOrder: 'default' | 'price-high' | 'price-low' | 'id') => {
    setSortOrder(newSortOrder);
    localStorage.setItem('personalCollectionSortOrder', newSortOrder);
  };

  // Save decimal preference when it changes
  const handleToggleDecimals = () => {
    const newValue = !showDecimals;
    setShowDecimals(newValue);
    localStorage.setItem('showDecimals', newValue.toString());
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
      // Fetch ALL items at once
      const response = await fetch(`/api/personal-collection?all=true`);
      const data = await response.json();

      // Check for database connection limit error
      if (!data.success && data.error && data.error.includes('max_connections_per_hour')) {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);

        setDbError(nextHour);
        setLoading(false);
        return;
      }

      if (data.success) {
        setCollection(data.data);
        setLoading(false); // Show items immediately

        // Check if any items are missing pricing or have wrong currency
        const userCurrency = session?.user?.preferredCurrency || 'USD';
        const itemsNeedingRefresh = data.data.filter((item: PersonalCollectionItem) =>
          !item.pricing ||
          !item.pricing.suggestedPrice ||
          item.pricing.currencyCode !== userCurrency
        );

        console.log(`Found ${itemsNeedingRefresh.length} items needing pricing refresh (current currency: ${userCurrency})`);

        if (itemsNeedingRefresh.length > 0) {
          console.log(`🔄 Fetching prices for ${itemsNeedingRefresh.length} items progressively...`);
          setPricesUpdating(itemsNeedingRefresh.length);

          // Client-side progressive fetch: fetch items one by one to avoid serverless timeout
          let currentIndex = 0;

          const fetchNextItem = async () => {
            if (currentIndex >= itemsNeedingRefresh.length) {
              console.log(`✅ Completed fetching all ${itemsNeedingRefresh.length} items`);
              setPricesUpdating(0);
              return;
            }

            const item = itemsNeedingRefresh[currentIndex];
            currentIndex++;

            try {
              console.log(`[${currentIndex}/${itemsNeedingRefresh.length}] Fetching price for ${item.minifigure_no}...`);

              // Call the refresh endpoint for this specific item
              const response = await fetch(`/api/personal-collection/${item.id}/refresh-pricing`, {
                method: 'POST'
              });
              const result = await response.json();

              if (result.success && result.data) {
                // Update the collection with new pricing
                setCollection(prev => prev.map(i =>
                  i.id === item.id ? result.data : i
                ));
                console.log(`  ✅ Updated ${item.minifigure_no}: $${result.data.pricing?.suggestedPrice || 0}`);
              } else {
                console.log(`  ⚠️ No price for ${item.minifigure_no}`);
              }
            } catch (err) {
              console.error(`  ❌ Error fetching ${item.minifigure_no}:`, err);
            }

            // Decrement updating count
            setPricesUpdating(prev => Math.max(0, prev - 1));

            // Fetch next item after delay (BrickLink API requires 3-second minimum)
            setTimeout(fetchNextItem, 3000);
          };

          // Start fetching
          fetchNextItem();
        }
      }
    } catch (error) {
      console.error('Error loading personal collection:', error);
      setLoading(false);
    }
  };

  const handleItemDeleted = async (id: string) => {
    try {
      const response = await fetch(`/api/personal-collection/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCollection(collection.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemUpdated = async (id: string, updates: Partial<PersonalCollectionItem>) => {
    try {
      const response = await fetch(`/api/personal-collection/${id}`, {
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
      const response = await fetch(`/api/personal-collection/${id}/move-to-inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (data.success) {
        // Reload collection after move, staying on current page
        await loadCollection();
      }
    } catch (error) {
      console.error('Error moving item:', error);
      throw error;
    }
  };

  const getSortedAndFilteredCollection = () => {
    // Filter by condition first
    let filtered = [...collection];
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(item => item.condition === conditionFilter);
    }

    // Sort
    if (sortOrder === 'price-high') {
      filtered.sort((a, b) => {
        const priceA = a.pricing?.suggestedPrice || 0;
        const priceB = b.pricing?.suggestedPrice || 0;
        return priceB - priceA;
      });
    } else if (sortOrder === 'price-low') {
      filtered.sort((a, b) => {
        const priceA = a.pricing?.suggestedPrice || 0;
        const priceB = b.pricing?.suggestedPrice || 0;
        return priceA - priceB;
      });
    } else if (sortOrder === 'id') {
      filtered.sort((a, b) => {
        return a.minifigure_no.localeCompare(b.minifigure_no);
      });
    }

    return filtered;
  };

  // Get filtered/sorted items, then paginate for display
  const sortedAndFiltered = getSortedAndFilteredCollection();
  const totalFiltered = sortedAndFiltered.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  // Mobile: show accumulated items, Desktop: show paginated items
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const paginatedItems = isMobile
    ? sortedAndFiltered.slice(0, itemsToShow) // Mobile: accumulate items
    : sortedAndFiltered.slice( // Desktop: paginate
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const { totalValue, totalItems, avgValue } = calculateCollectionStats(collection);


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
          width: 'var(--icon-2xl)',
          height: 'var(--icon-2xl)',
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
        {/* Database Error Message */}
        {dbError && <DatabaseLimitError resetTime={dbError} />}

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
              <CollectionSwitcher currentPage="collection" />
              <Link
                href="/search?mode=collection"
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div className="collection-stat-label" style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: '500',
                      color: '#737373',
                      letterSpacing: '0.01em'
                    }}>
                      Total Value
                    </div>
                    {pricesUpdating > 0 && (
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          border: '2px solid #3b82f6',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        Updating
                      </div>
                    )}
                  </div>
                  <div className="collection-stat-value" style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    color: '#171717',
                    lineHeight: '1'
                  }}>
                    <AnimatedCounter
                      value={totalValue}
                      formatFn={(val) => formatPrice(val, session?.user?.preferredCurrency || 'USD', true)}
                      isUpdating={pricesUpdating > 0}
                    />
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div className="collection-stat-label" style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: '500',
                      color: '#737373',
                      letterSpacing: '0.01em'
                    }}>
                      Avg Value
                    </div>
                    {pricesUpdating > 0 && (
                      <div style={{
                        width: '4px',
                        height: '4px',
                        background: '#3b82f6',
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                  <div className="collection-stat-value" style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    color: '#171717',
                    lineHeight: '1'
                  }}>
                    <AnimatedCounter
                      value={avgValue}
                      formatFn={(val) => formatPrice(val, session?.user?.preferredCurrency || 'USD', true)}
                      isUpdating={pricesUpdating > 0}
                    />
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
                Your Collection
              </h1>
              <p className="collection-subtitle" style={{
                fontSize: 'var(--text-base)',
                color: '#525252',
                lineHeight: '1.6'
              }}>
                Your personal collection — minifigs you're keeping, not selling
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/search?mode=collection"
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
              <ShareCollectionButton />
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
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em'
            }}>
              Items
            </h2>
            {collection.length > 0 && (
              <>
                {/* Condition Filter Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  width: 'fit-content'
                }}>
                  <button
                    onClick={() => setConditionFilter('all')}
                    style={{
                      padding: '8px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: conditionFilter === 'all' ? '#171717' : '#737373',
                      background: conditionFilter === 'all' ? '#f5f5f5' : '#ffffff',
                      border: conditionFilter === 'all' ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setConditionFilter('new')}
                    style={{
                      padding: '8px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: conditionFilter === 'new' ? '#171717' : '#737373',
                      background: conditionFilter === 'new' ? '#f5f5f5' : '#ffffff',
                      border: conditionFilter === 'new' ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setConditionFilter('used')}
                    style={{
                      padding: '8px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: conditionFilter === 'used' ? '#171717' : '#737373',
                      background: conditionFilter === 'used' ? '#f5f5f5' : '#ffffff',
                      border: conditionFilter === 'used' ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Used
                  </button>
                </div>

              <div className="collection-controls" style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'stretch', fontSize: 'var(--text-sm)' }}>
                <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}>
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortOrderChange(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      paddingRight: '36px',
                      fontSize: 'inherit',
                      fontWeight: '600',
                      color: '#171717',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s',
                      appearance: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                  >
                    <option value="default">Recently Added</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="id">Bricklink ID</option>
                  </select>
                  <ChevronDownIcon style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'var(--icon-sm)',
                    height: 'var(--icon-sm)',
                    color: '#737373',
                    pointerEvents: 'none'
                  }} />
                </div>
                <button
                  onClick={handleToggleDecimals}
                  style={{
                    padding: '8px 12px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    color: showDecimals ? '#ffffff' : '#737373',
                    background: showDecimals ? '#3b82f6' : '#ffffff',
                    border: showDecimals ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box',
                    whiteSpace: 'nowrap',
                    flex: '0 0 auto'
                  }}
                  onMouseEnter={(e) => {
                    if (!showDecimals) {
                      e.currentTarget.style.background = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showDecimals) {
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  {showDecimals ? '.00' : '.0'}
                </button>
              </div>
              </>
            )}
          </div>

          {sortedAndFiltered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              {conditionFilter === 'all' ? (
                <>
                  <div style={{ fontSize: 'var(--text-3xl)', marginBottom: '24px' }}>🏠</div>
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
                    Start adding to your personal collection
                  </p>
                  <Link
                    href="/search?mode=collection"
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
                </>
              ) : (
                <>
                  <div style={{ fontSize: 'var(--text-3xl)', marginBottom: '24px' }}>🔍</div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '12px'
                  }}>
                    No {conditionFilter} condition minifigs
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: '#737373',
                    lineHeight: '1.6'
                  }}>
                    You have {totalItems} item{totalItems !== 1 ? 's' : ''} in other conditions
                  </p>
                </>
              )}
            </div>
          ) : (
            <PersonalCollectionList
              items={paginatedItems}
              onItemDelete={handleItemDeleted}
              onItemUpdate={handleItemUpdated}
              showDecimals={showDecimals}
              onItemMove={handleItemMoved}
              onRefresh={loadCollection}
            />
          )}
        </div>

        {sortedAndFiltered.length > 0 && (isMobile ? itemsToShow < totalFiltered : totalPages > 1) && (
          <CollectionPagination
            currentPage={isMobile ? Math.ceil(itemsToShow / itemsPerPage) : currentPage}
            totalPages={totalPages}
            currentCount={paginatedItems.length}
            totalCount={totalFiltered}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoadMore={() => {
              setItemsToShow(prev => Math.min(prev + itemsPerPage, totalFiltered));
            }}
          />
        )}
      </div>
    </div>
  );
}
