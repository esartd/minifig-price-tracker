'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SetInventoryItem } from '@/types';
import SetInventoryList from '@/components/SetInventoryList';
import SetCollectionSwitcher from '@/components/SetCollectionSwitcher';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/format-price';
import { calculateCollectionStats } from '@/lib/collection-stats';
import CollectionPagination from '@/components/CollectionPagination';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useTranslation } from '@/components/TranslationProvider';

export default function SetsInventoryPage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inventory, setInventory] = useState<SetInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-high' | 'price-low' | 'name'>('price-high');
  const [showDecimals, setShowDecimals] = useState(false);
  const [conditionFilter, setConditionFilter] = useState<'all' | 'new' | 'used'>('all');
  const [pricesUpdating, setPricesUpdating] = useState(0);

  // Pagination state for display only (all items loaded client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState(50); // For mobile "load more"
  const itemsPerPage = 50;


  // Load saved preferences on mount
  useEffect(() => {
    const savedSortOrder = localStorage.getItem('setInventorySortOrder');
    if (savedSortOrder) {
      setSortOrder(savedSortOrder as 'default' | 'price-high' | 'price-low' | 'name');
    }

    const savedShowDecimals = localStorage.getItem('showDecimals');
    if (savedShowDecimals !== null) {
      setShowDecimals(savedShowDecimals === 'true');
    }
  }, []);

  // Save sort order when it changes
  const handleSortOrderChange = (newSortOrder: 'default' | 'price-high' | 'price-low' | 'name') => {
    setSortOrder(newSortOrder);
    localStorage.setItem('setInventorySortOrder', newSortOrder);
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
      loadInventory();
    }
  }, [status, router, session?.user?.preferredCountryCode, session?.user?.preferredRegion]);

  const loadInventory = async () => {
    try {
      // Include user's currency preferences
      const params = new URLSearchParams({ all: 'true' });
      if (session?.user?.preferredCountryCode) {
        params.set('countryCode', session.user.preferredCountryCode);
      }
      if (session?.user?.preferredRegion) {
        params.set('region', session.user.preferredRegion);
      }

      const response = await fetch(`/api/set-inventory?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setInventory(data.data);
        setLoading(false);

        // Client-side progressive pricing refresh for items without prices or wrong currency
        const userCurrency = session?.user?.preferredCurrency || 'USD';
        const itemsNeedingRefresh = data.data.filter((item: SetInventoryItem) =>
          !item.pricing ||
          item.pricing.suggestedPrice === 0 ||
          item.pricing.currencyCode !== userCurrency
        );

        console.log(`Found ${itemsNeedingRefresh.length} set items needing pricing refresh (current currency: ${userCurrency})`);

        if (itemsNeedingRefresh.length > 0) {
          console.log(`🔄 Fetching prices for ${itemsNeedingRefresh.length} set items progressively...`);
          setPricesUpdating(itemsNeedingRefresh.length);

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
              console.log(`[${currentIndex}/${itemsNeedingRefresh.length}] Fetching price for ${item.box_no}...`);

              const response = await fetch(`/api/set-inventory/${item.id}/refresh-pricing`, {
                method: 'POST'
              });
              const result = await response.json();

              if (result.success && result.data) {
                setInventory(prev => prev.map(i =>
                  i.id === item.id ? result.data : i
                ));
                console.log(`  ✅ Updated ${item.box_no}: ${result.data.pricing?.suggestedPrice || 0}`);
              } else {
                console.log(`  ⚠️ No price for ${item.box_no}`);
              }
            } catch (err) {
              console.error(`  ❌ Error fetching ${item.box_no}:`, err);
            }

            setPricesUpdating(prev => Math.max(0, prev - 1));
            setTimeout(fetchNextItem, 3000); // BrickLink API requires 3-second minimum
          };

          fetchNextItem();
        }
      }
    } catch (error) {
      console.error('Error loading set inventory:', error);
      setLoading(false);
    }
  };

  const handleItemDeleted = async (id: string) => {
    try {
      const response = await fetch(`/api/set-inventory/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadInventory();
      }
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  const handleItemUpdated = async (id: string, updates: Partial<SetInventoryItem>) => {
    try {
      const response = await fetch(`/api/set-inventory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setInventory(
          inventory.map((item) => (item.id === id ? data.data : item))
        );
      }
    } catch (error) {
      console.error('Error updating set:', error);
    }
  };

  const handleItemMoved = async (id: string, quantity: number) => {
    try {
      const response = await fetch(`/api/set-inventory/${id}/move-to-collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (data.success) {
        await loadInventory();
      }
    } catch (error) {
      console.error('Error moving set:', error);
      throw error;
    }
  };

  const getSortedAndFilteredInventory = () => {
    let filtered = [...inventory];
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
    } else if (sortOrder === 'name') {
      filtered.sort((a, b) => {
        return a.set_name.localeCompare(b.set_name);
      });
    }

    return filtered;
  };

  // Get filtered/sorted items, then paginate for display
  const sortedAndFiltered = getSortedAndFilteredInventory();
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

  const { totalValue, totalItems, avgValue } = calculateCollectionStats(inventory);

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
        {/* Compact Header with Stats and Action */}
        {inventory.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            {/* Title + Add Button Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '16px'
            }}>
              <SetCollectionSwitcher currentPage="sets-inventory" />
              <Link
                href="/sets/browse"
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
                      {t('collection.totalValue')}
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
                        {t('collection.updating')}
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
                    {t('collection.totalItems')}
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
                      {t('collection.avgValue')}
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
        {inventory.length === 0 && (
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
                {t('collection.setsInventoryTitle')}
              </h1>
              <p className="collection-subtitle" style={{
                fontSize: 'var(--text-base)',
                color: '#525252',
                lineHeight: '1.6'
              }}>
                {t('collection.setsInventorySubtitle')}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/sets/browse"
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
                + {t('collection.addSets')}
              </Link>
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
            {inventory.length > 0 && (
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
                    {t('collection.filters.all')}
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
                    {t('collection.filters.new')}
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
                    {t('collection.filters.used')}
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
                    <option value="price-high">{t('collection.sort.priceHigh')}</option>
                    <option value="price-low">{t('collection.sort.priceLow')}</option>
                    <option value="name">{t('collection.sort.nameAZ')}</option>
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
                  <svg style={{ width: 'var(--icon-3xl)', height: 'var(--icon-3xl)', color: '#a3a3a3', margin: '0 auto 24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '12px'
                  }}>
                    {t('collection.noSetsYet')}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: '#737373',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                  }}>
                    {t('collection.startAddingSetsInventory')}
                  </p>
                  <Link
                    href="/sets/browse"
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
                    {t('collection.browseSets')}
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
                    {t('collection.noConditionSets', { condition: conditionFilter })}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: '#737373',
                    lineHeight: '1.6'
                  }}>
                    {t('collection.otherConditions', { count: totalItems })}
                  </p>
                </>
              )}
            </div>
          ) : (
            <SetInventoryList
              items={paginatedItems}
              onItemDelete={handleItemDeleted}
              onItemUpdate={handleItemUpdated}
              showDecimals={showDecimals}
              onItemMove={handleItemMoved}
              onRefresh={loadInventory}
            />
          )}

          {/* Pagination */}
          {!loading && sortedAndFiltered.length > 0 && (isMobile ? itemsToShow < totalFiltered : totalPages > 1) && (
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
    </div>
  );
}
